import crypto from 'crypto';
import StoredUpload from '../models/StoredUpload.js';

// Drop-in replacement for cloudinaryService — same uploadImage/deleteImage interface, but
// stores the image bytes in MongoDB and serves them back via GET /api/uploads/:folder/:filename
// (see uploadController.serveUpload). This avoids writing to disk, which doesn't persist on
// serverless hosts like Vercel.

export const ALLOWED_FOLDERS = ['products', 'categories', 'offers', 'hero-slides', 'gallery', 'pages', 'misc'];

const MIME_EXT = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
};

const MAX_SIZE = 8 * 1024 * 1024; // 8MB

export const isValidFolder = (folder) => ALLOWED_FOLDERS.includes(folder);

// Older call sites pass folder strings like "ab-supermarket/products" (a Cloudinary-style
// path) — collapse those down to one of the real folder keys instead of rejecting them.
const normalizeFolder = (raw) => {
  const last = String(raw || 'misc').split('/').pop();
  return ALLOWED_FOLDERS.includes(last) ? last : 'misc';
};

/**
 * Stores an uploaded image's bytes in MongoDB.
 * @param {{buffer: Buffer, mimetype: string, size: number}} file - a multer file object
 * @param {string} folder
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImage = async (file, folder = 'misc') => {
  if (!file || !file.buffer) {
    throw new Error('No file buffer provided for upload');
  }
  const ext = MIME_EXT[file.mimetype];
  if (!ext) {
    throw new Error('Only image files (jpeg, jpg, png, webp, gif) are allowed');
  }
  const size = file.size ?? file.buffer.length;
  if (size > MAX_SIZE) {
    throw new Error('File too large (max 8MB)');
  }

  const safeFolder = normalizeFolder(folder);
  const filename = `${Date.now()}-${crypto.randomBytes(8).toString('hex')}.${ext}`;

  await StoredUpload.create({
    folder: safeFolder,
    filename,
    mimeType: file.mimetype,
    size,
    data: file.buffer,
  });

  return {
    url: `/api/uploads/${safeFolder}/${filename}`,
    publicId: `${safeFolder}/${filename}`,
  };
};

/**
 * Deletes a stored image by its publicId ("folder/filename") or full /api/uploads/ URL.
 */
export const deleteImage = async (publicIdOrUrl) => {
  if (!publicIdOrUrl) return { result: 'skipped' };

  let key = publicIdOrUrl;
  const match = /\/api\/uploads\/([^/?#]+)\/([^/?#]+)/.exec(publicIdOrUrl);
  if (match) key = `${match[1]}/${match[2]}`;

  const [folder, filename] = key.split('/');
  if (!folder || !filename) return { result: 'skipped' };

  const res = await StoredUpload.deleteOne({ folder, filename });
  return { result: res.deletedCount ? 'deleted' : 'not_found' };
};

export default { uploadImage, deleteImage, isValidFolder, ALLOWED_FOLDERS };
