import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Truck, ShieldCheck, Leaf, Clock, Send, Coffee, Tag, ShoppingBasket, Handshake, Flame, Percent, Megaphone } from 'lucide-react';

import * as categoryService from '../services/categoryService';
import * as productService from '../services/productService';
import * as dealService from '../services/dealService';
import * as offerService from '../services/offerService';
import * as testimonialService from '../services/testimonialService';
import * as faqService from '../services/faqService';
import * as deliveryLinkService from '../services/deliveryLinkService';
import * as newsletterService from '../services/newsletterService';
import * as heroSlideService from '../services/heroSlideService';
import resolveImageUrl from '../utils/resolveImageUrl';
import { DELIVERY_PLATFORM_LOGOS } from '../utils/deliveryPlatforms';
import * as settingsService from '../services/settingsService';

import ProductCard from '../components/ProductCard';
import DealCard from '../components/DealCard';
import TestimonialCard from '../components/TestimonialCard';
import FaqAccordionItem from '../components/FaqAccordionItem';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import HeroCarousel from '../components/HeroCarousel';
import CategorySidebar from '../components/CategorySidebar';

const whyShop = [
  { icon: Leaf, title: 'Freshness Guaranteed', desc: 'We source the freshest products daily for your family.' },
  { icon: Tag, title: 'Great Value', desc: 'Competitive prices and weekly deals you’ll love.' },
  { icon: ShoppingBasket, title: 'Diverse Selection', desc: 'From local favorites to global essentials.' },
  { icon: Handshake, title: 'Friendly Service', desc: 'We’re here to make your shopping experience excellent.' },
];

function Section({ children, className = '' }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className={className}
    >
      {children}
    </motion.section>
  );
}

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [deals, setDeals] = useState([]);
  const [offers, setOffers] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [deliveryLinks, setDeliveryLinks] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [siteSettings, setSiteSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');

  useEffect(() => {
    Promise.all([
      categoryService.getCategories().catch(() => ({ categories: [] })),
      productService.getProducts({ featured: 'true', limit: 8 }).catch(() => ({ products: [] })),
      dealService.getDeals().catch(() => ({ deals: [] })),
      offerService.getOffers().catch(() => ({ offers: [] })),
      testimonialService.getTestimonials().catch(() => ({ testimonials: [] })),
      faqService.getFaqs().catch(() => ({ faqs: [] })),
      deliveryLinkService.getDeliveryLinks().catch(() => ({ deliveryLinks: [] })),
      heroSlideService.getHeroSlides().catch(() => ({ slides: [] })),
      settingsService.getSettings().catch(() => ({ settings: null })),
    ]).then(([catRes, prodRes, dealRes, offerRes, testRes, faqRes, delRes, slideRes, settingsRes]) => {
      setCategories((catRes.categories || []).filter((c) => c.isEnabled !== false));
      setFeatured(prodRes.products || []);
      setDeals((dealRes.deals || []).filter((d) => d.isActive));
      setOffers(offerRes.offers || []);
      setTestimonials((testRes.testimonials || []).filter((t) => t.isEnabled !== false));
      setFaqs((faqRes.faqs || []).filter((f) => f.isEnabled !== false).slice(0, 6));
      setDeliveryLinks((delRes.deliveryLinks || []).filter((l) => l.isEnabled));
      setSiteSettings(settingsRes.settings || null);
      setHeroSlides(slideRes.slides || []);
      setLoading(false);
    });
  }, []);

  const onSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    try {
      await newsletterService.subscribeNewsletter(email);
      toast.success('Subscribed! Watch for deals in your inbox.');
      setEmail('');
    } catch (err) {
      toast.error(err.message || 'Subscription failed');
    }
  };

  if (loading) return <LoadingSpinner full />;

  return (
    <div>
      {/* Hero banner, full width (edge-to-edge like the navbar above it) */}
      <section className="bg-creme">
        {heroSlides.length > 0 ? (
          <HeroCarousel slides={heroSlides} />
        ) : (
          <div className="relative w-full bg-ivory text-black overflow-hidden h-[480px] sm:h-[560px] flex items-center justify-center container-app">
                <video
                  className="absolute inset-0 h-full w-full object-cover"
                  src="/hero.mp4"
                  autoPlay
                  loop
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ivory via-ivory/60 to-ivory/10" />
                <div className="relative max-w-xl text-center z-10">
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="font-heading text-3xl sm:text-5xl font-bold leading-tight text-black"
                  >
                    <span className="block text-gold-dark">Best Quality,</span>
                    <span className="block">Best Price,</span>
                    <span className="block">Best Service</span>
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="mt-4 text-charcoal/70 text-base sm:text-lg"
                  >
                    Your neighbourhood destination for fresh groceries, everyday essentials, international favourites and café delights.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="mt-6 flex flex-wrap items-center justify-center gap-4"
                  >
                    <Link to="/shop" className="btn-gold">Shop Groceries</Link>
                    <Link to="/about" className="btn-outline border-charcoal/30 text-black hover:bg-black hover:text-ivory">Explore Our Store</Link>
                  </motion.div>
                </div>
              </div>
        )}
      </section>

      <section className="bg-creme">
        <div className="container-app grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start pt-6 sm:pt-8 pb-6 sm:pb-8">
          <CategorySidebar categories={categories} />
          <div>
            {/* Promo Tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {deals.length > 0 && (() => {
                const best = deals.reduce((max, d) => {
                  const pct = d.product?.regularPrice ? ((d.product.regularPrice - d.salePrice) / d.product.regularPrice) * 100 : 0;
                  const maxPct = max?.product?.regularPrice ? ((max.product.regularPrice - max.salePrice) / max.product.regularPrice) * 100 : -1;
                  return pct > maxPct ? d : max;
                }, null);
                const pct = best?.product?.regularPrice ? Math.round(((best.product.regularPrice - best.salePrice) / best.product.regularPrice) * 100) : null;
                return (
                  <Link to="/shop?sale=true" className="group bg-creme rounded-2xl p-6 flex items-center gap-4 shadow-card hover:shadow-xl transition-shadow">
                    <div className="h-14 w-14 rounded-full bg-white flex items-center justify-center shrink-0">
                      <Percent className="h-6 w-6 text-gold-dark" />
                    </div>
                    <div>
                      <p className="text-charcoal/50 text-xs uppercase tracking-wide">Weekly Deals</p>
                      <p className="font-heading text-xl text-black">{pct ? `Up to ${pct}% Off` : 'Shop Deals'}</p>
                    </div>
                  </Link>
                );
              })()}

              {offers.length > 0 && (
                <Link to="/shop" className="group bg-white rounded-2xl p-6 flex items-center gap-4 shadow-card hover:shadow-xl transition-shadow">
                  <div className="h-14 w-14 rounded-full bg-creme flex items-center justify-center shrink-0">
                    <Megaphone className="h-6 w-6 text-gold-dark" />
                  </div>
                  <div>
                    <p className="text-charcoal/50 text-xs uppercase tracking-wide">Special Offer</p>
                    <p className="font-heading text-xl text-black line-clamp-1">{offers[0].heading}</p>
                  </div>
                </Link>
              )}

              {siteSettings?.freeDeliveryThreshold != null && (
                <Link to="/shop" className="group bg-white rounded-2xl p-6 flex items-center gap-4 shadow-card hover:shadow-xl transition-shadow">
                  <div className="h-14 w-14 rounded-full bg-creme flex items-center justify-center shrink-0">
                    <Truck className="h-6 w-6 text-gold-dark" />
                  </div>
                  <div>
                    <p className="text-charcoal/50 text-xs uppercase tracking-wide">Free Delivery</p>
                    <p className="font-heading text-xl text-black">Over ${Number(siteSettings.freeDeliveryThreshold).toFixed(0)}</p>
                  </div>
                </Link>
              )}
            </div>

            {/* Featured Products */}
            <div className="pt-4">
              <h2 className="font-heading text-3xl sm:text-4xl text-black mb-8">Featured Products</h2>
              {featured.length === 0 ? (
                <EmptyState title="No featured products" message="Check back soon for featured picks." />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                  {featured.map((p) => (
                    <ProductCard key={p._id} product={p} compact />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Deals & Offers */}
      {(deals.length > 0 || offers.length > 0) && (
        <Section className="section-py bg-gold/10 border-y border-gold/20">
          <div className="container-app grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {deals.length > 0 && (
              <div className={offers.length > 0 ? 'lg:col-span-1' : 'lg:col-span-3'}>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-heading text-2xl text-black flex items-center gap-2">
                    <Flame className="h-5 w-5 text-gold-dark" /> Weekly Deals
                  </h2>
                  <Link to="/shop?sale=true" className="text-xs font-semibold text-charcoal/50 hover:text-gold-dark">
                    View all
                  </Link>
                </div>
                <div className="bg-white rounded-2xl p-6 space-y-4 shadow-card">
                  {deals.slice(0, 4).map((d) => (
                    <DealCard key={d._id} deal={d} compact />
                  ))}
                </div>
              </div>
            )}

            {offers.length > 0 && (
              <div className={deals.length > 0 ? 'lg:col-span-2' : 'lg:col-span-3'}>
                <h2 className="font-heading text-2xl text-black mb-5">Special Offers</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {offers.slice(0, 4).map((o) => (
                    <div key={o._id} className="bg-white rounded-2xl overflow-hidden shadow-card">
                      <div className="aspect-video bg-creme">
                        {o.image?.url && <img src={resolveImageUrl(o.image.url)} alt={o.heading} className="h-full w-full object-cover" />}
                      </div>
                      <div className="p-4">
                        <p className="font-heading text-lg text-black">{o.heading}</p>
                        {o.discountText && <p className="text-sm text-gold-dark font-semibold">{o.discountText}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Featured Products + Weekly Deals / Delivery sidebar */}
      {deliveryLinks.length > 0 && (
        <Section className="section-py bg-ivory">
          <div className="container-app">
            <div className="bg-white rounded-2xl p-6 shadow-card max-w-2xl mx-auto text-center">
              <h3 className="font-heading text-lg text-black mb-1 flex items-center justify-center gap-2">
                <Truck className="h-5 w-5 text-gold-dark" /> We Deliver to You
              </h3>
              <p className="text-sm text-charcoal/60 mb-4">Fast, reliable. Right to your door.</p>
              <div className="flex flex-wrap items-center justify-center gap-3 mb-4">
                {deliveryLinks.map((link) => (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={link.platform}
                    className="flex items-center justify-center h-12 px-5 rounded-md border border-charcoal/15 bg-white hover:border-gold hover:shadow-card transition-all"
                  >
                    {DELIVERY_PLATFORM_LOGOS[link.platform] ? (
                      <img src={DELIVERY_PLATFORM_LOGOS[link.platform]} alt={link.platform} className="h-7 w-auto object-contain" />
                    ) : (
                      <span className="text-xs font-semibold">{link.platform}</span>
                    )}
                  </a>
                ))}
              </div>
              <a href={deliveryLinks[0]?.url} target="_blank" rel="noreferrer" className="btn-gold">
                Order Now
              </a>
            </div>
          </div>
        </Section>
      )}

      {/* Why Shop */}
      <Section className="section-py bg-creme">
        <div className="container-app">
          <h2 className="font-heading text-3xl sm:text-4xl text-black text-center mb-10">Why Shop at AB&apos;s</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyShop.map(({ icon: Icon, title, desc }) => (
              <motion.div
                key={title}
                whileHover={{ y: -6 }}
                className="bg-white rounded-lg shadow-card p-6 text-center"
              >
                <div className="h-12 w-12 mx-auto rounded-full bg-creme flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-gold-dark" />
                </div>
                <h3 className="font-heading text-lg text-black mb-2">{title}</h3>
                <p className="text-sm text-charcoal/70">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* About Split */}
      <Section className="section-py bg-ivory">
        <div className="container-app grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="font-heading text-3xl sm:text-4xl text-black mb-4">Our Story</h2>
            <p className="text-charcoal/70 mb-4">
              AB&apos;s Supermarket has proudly served the community with fresh, high-quality groceries and
              friendly service. From our produce aisles to your table, we focus on quality you can trust.
            </p>
            <Link to="/about" className="link-underline font-semibold text-gold-dark">Read our story</Link>
          </div>
          <div
            className="aspect-video bg-creme rounded-lg bg-cover bg-center border border-gold/10"
            style={{ backgroundImage: "url('/store.png')" }}
          />
        </div>
      </Section>

      {/* Café Section */}
      <Section className="section-py bg-creme">
        <div className="container-app text-center max-w-2xl mx-auto">
          <Coffee className="h-10 w-10 text-gold-dark mx-auto mb-4" />
          <h2 className="font-heading text-3xl sm:text-4xl text-black mb-4">Visit Our In-Store Café</h2>
          <p className="text-charcoal/70">
            Take a break while you shop — enjoy fresh coffee, pastries, and light bites at our in-store café.
          </p>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="section-py bg-ivory">
        <div className="container-app">
          <h2 className="font-heading text-3xl sm:text-4xl text-black text-center mb-10">What Our Customers Say</h2>
          {testimonials.length === 0 ? (
            <EmptyState title="No testimonials yet" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.slice(0, 6).map((t) => (
                <TestimonialCard key={t._id} testimonial={t} />
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <Section className="section-py bg-creme">
          <div className="container-app max-w-3xl mx-auto">
            <h2 className="font-heading text-3xl sm:text-4xl text-black text-center mb-8">Frequently Asked Questions</h2>
            <div>
              {faqs.map((f) => (
                <FaqAccordionItem key={f._id} faq={f} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Newsletter */}
      <Section className="section-py bg-gold/10 border-y border-gold/20">
        <div className="container-app text-center max-w-xl mx-auto">
          <h2 className="font-heading text-3xl text-black mb-3">Get Deals in Your Inbox</h2>
          <p className="text-charcoal/60 mb-6">Subscribe for weekly offers and new arrivals.</p>
          <form onSubmit={onSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 rounded-md py-3 px-4 text-sm bg-white text-black placeholder:text-charcoal/40 border border-charcoal/15 focus:outline-none focus:border-gold"
            />
            <button type="submit" className="btn-gold">
              <Send className="h-4 w-4" /> Subscribe
            </button>
          </form>
        </div>
      </Section>
    </div>
  );
}
