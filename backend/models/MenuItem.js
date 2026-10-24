import mongoose from 'mongoose';

// A single item on a Partner's menu (e.g. Moga Meat's "Tandoori Soya Chaap — $9.20"), grouped by
// category for display. Image is optional — falls back to a category icon on the frontend if unset.
const menuItemSchema = new mongoose.Schema(
  {
    partner: { type: mongoose.Schema.Types.ObjectId, ref: 'Partner', required: true },
    category: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, default: '' }, // e.g. "per pc"
    image: {
      url: { type: String },
      publicId: { type: String },
    },
    isEnabled: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

menuItemSchema.index({ partner: 1, category: 1, sortOrder: 1 });

export default mongoose.model('MenuItem', menuItemSchema);
