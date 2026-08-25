import cloudinary from '../config/cloudinary.js';

/**
 * Uploads an in-memory buffer to Cloudinary via an upload stream.
 * @param {Buffer} buffer - the file buffer (from multer memory storage)
 * @param {string} folder - Cloudinary folder to store the asset in
 * @returns {Promise<{url: string, publicId: string}>}
 */
export const uploadImage = (buffer, folder = 'ab-supermarket') => {
  return new Promise((resolve, reject) => {
    if (!buffer) {
      return reject(new Error('No file buffer provided for upload'));
    }
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image' },
      (error, result) => {
        if (error) {
          return reject(new Error(`Cloudinary upload failed: ${error.message}`));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    stream.end(buffer);
  });
};

/**
 * Deletes an asset from Cloudinary by its public id.
 * @param {string} publicId
 */
export const deleteImage = async (publicId) => {
  if (!publicId) return { result: 'skipped' };
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

export default { uploadImage, deleteImage };
