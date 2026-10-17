import mongoose from 'mongoose';

// Brand collaborations shown on the homepage (e.g. "In collaboration with Hoga Meat Bar & Grill"),
// each with its own logo and an optional link to their menu/site.
const partnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tagline: { type: String, default: '' },
    logo: {
      url: { type: String },
      publicId: { type: String },
    },
    menuLink: { type: String, default: '' },
    menuComingSoon: { type: Boolean, default: false },
    isEnabled: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Partner', partnerSchema);
