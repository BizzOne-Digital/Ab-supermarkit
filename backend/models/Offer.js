import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema(
  {
    heading: { type: String, required: true },
    image: {
      url: { type: String },
      publicId: { type: String },
    },
    discountText: { type: String },
    startDate: { type: Date, default: Date.now },
    expiryDate: { type: Date, required: true },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Offer', offerSchema);
