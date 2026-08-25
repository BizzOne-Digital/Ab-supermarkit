import mongoose from 'mongoose';

const deliveryLinkSchema = new mongoose.Schema(
  {
    platform: { type: String, enum: ['UberEats', 'SkipTheDishes', 'DoorDash'], required: true },
    url: { type: String, required: true },
    isEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('DeliveryLink', deliveryLinkSchema);
