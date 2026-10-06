import mongoose from 'mongoose';

// Binary image storage in MongoDB — survives redeploys on serverless hosts (Vercel) where
// writing to the local filesystem is not persistent. Served back out via a streaming route
// instead of a CDN. Replaces Cloudinary.
const storedUploadSchema = new mongoose.Schema(
  {
    folder: {
      type: String,
      required: true,
      enum: ['products', 'categories', 'offers', 'hero-slides', 'gallery', 'pages', 'misc'],
    },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    data: { type: Buffer, required: true },
  },
  { timestamps: true }
);

storedUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export default mongoose.model('StoredUpload', storedUploadSchema);
