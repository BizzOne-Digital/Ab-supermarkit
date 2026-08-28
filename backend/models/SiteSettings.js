import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema(
  {
    storeName: { type: String, default: "AB's Supermarket" },
    contactEmail: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    address: { type: String, default: '' },
    businessHours: { type: mongoose.Schema.Types.Mixed, default: {} },
    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      twitter: { type: String, default: '' },
    },
    lowStockThreshold: { type: Number, default: 10 },
    // Delivery pricing rules used by the checkout flow.
    deliveryFee: { type: Number, default: 5 },
    freeDeliveryThreshold: { type: Number, default: 100 }, // order subtotal at/above which delivery is free
    freeDeliveryRadiusKm: { type: Number, default: 5 }, // informational only until address-distance calc is wired up
  },
  { timestamps: true }
);

// Singleton doc pattern: always returns (and lazily creates) the single settings document.
siteSettingsSchema.statics.getSettings = async function () {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

export default mongoose.model('SiteSettings', siteSettingsSchema);
