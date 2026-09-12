import mongoose from 'mongoose';

const heroSlideSchema = new mongoose.Schema(
  {
    image: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },
    heading: { type: String, default: '' },
    subheading: { type: String, default: '' },
    ctaLabel: { type: String, default: '' },
    ctaLink: { type: String, default: '' },
    isEnabled: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

heroSlideSchema.index({ sortOrder: 1 });

export default mongoose.model('HeroSlide', heroSlideSchema);
