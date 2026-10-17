import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Truck, ShieldCheck, Leaf, Send, Coffee, Percent, Megaphone, Award } from 'lucide-react';

import * as categoryService from '../services/categoryService';
import * as productService from '../services/productService';
import * as offerService from '../services/offerService';
import * as heroSlideService from '../services/heroSlideService';
import * as partnerService from '../services/partnerService';
import * as testimonialService from '../services/testimonialService';
import * as faqService from '../services/faqService';
import * as deliveryLinkService from '../services/deliveryLinkService';
import * as newsletterService from '../services/newsletterService';
import resolveImageUrl from '../utils/resolveImageUrl';
import { DELIVERY_PLATFORM_LOGOS } from '../utils/deliveryPlatforms';

import ProductCard from '../components/ProductCard';
import TestimonialCard from '../components/TestimonialCard';
import FaqAccordionItem from '../components/FaqAccordionItem';
import EmptyState from '../components/EmptyState';
import GroceryHero from '../components/GroceryHero';
import CategorySidebar from '../components/CategorySidebar';
import DealCategoryBanners from '../components/DealCategoryBanners';
import PartnerBanner from '../components/PartnerBanner';
import FeaturedCategoriesRow from '../components/FeaturedCategoriesRow';

const whyShop = [
  { icon: Truck, title: 'Fast & Reliable Delivery', desc: 'Groceries at your doorstep' },
  { icon: Percent, title: 'Great Prices', desc: 'Weekly deals & everyday savings' },
  { icon: ShieldCheck, title: 'Quality Products', desc: 'Freshness you can trust' },
  { icon: Leaf, title: 'A Healthier Tomorrow', desc: 'Good food, brighter lives' },
];

function Section({ children, className = '', id }) {
  return (
    <motion.section
      id={id}
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
  const [bestSellers, setBestSellers] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [offers, setOffers] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [deliveryLinks, setDeliveryLinks] = useState([]);
  const [partners, setPartners] = useState([]);
  const [email, setEmail] = useState('');

  // Each section fetches and renders independently instead of the whole homepage waiting
  // behind one Promise.all — a single slow endpoint (or a cold serverless start) used to block
  // every section, including the hero, behind a full-screen spinner.
  useEffect(() => {
    categoryService
      .getCategories()
      .then((res) => setCategories((res.categories || []).filter((c) => c.isEnabled !== false)))
      .catch(() => setCategories([]));
    productService
      .getProducts({ featured: 'true', limit: 8 })
      .then((res) => setFeatured(res.products || []))
      .catch(() => setFeatured([]));
    productService
      .getProducts({ bestSeller: 'true', limit: 6 })
      .then((res) => setBestSellers(res.products || []))
      .catch(() => setBestSellers([]));
    heroSlideService
      .getHeroSlides()
      .then((res) => setHeroSlides((res.slides || []).filter((s) => s.isEnabled !== false).sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))))
      .catch(() => setHeroSlides([]));
    offerService
      .getOffers()
      .then((res) => setOffers(res.offers || []))
      .catch(() => setOffers([]));
    testimonialService
      .getTestimonials()
      .then((res) => setTestimonials((res.testimonials || []).filter((t) => t.isEnabled !== false && t.showOnHome)))
      .catch(() => setTestimonials([]));
    faqService
      .getFaqs()
      .then((res) => setFaqs((res.faqs || []).filter((f) => f.isEnabled !== false).slice(0, 6)))
      .catch(() => setFaqs([]));
    deliveryLinkService
      .getDeliveryLinks()
      .then((res) => setDeliveryLinks((res.deliveryLinks || []).filter((l) => l.isEnabled)))
      .catch(() => setDeliveryLinks([]));
    partnerService
      .getPartners()
      .then((res) => setPartners(res.partners || []))
      .catch(() => setPartners([]));
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

  return (
    <div>
      {/* Hero, full width (edge-to-edge like the navbar above it) */}
      <GroceryHero categories={categories} />

      <PartnerBanner partners={partners} />

      <Section className="bg-ivory">
        <div className="py-4 sm:py-6 px-3 sm:px-4">
          <DealCategoryBanners slides={heroSlides} />
        </div>
      </Section>

      <section className="bg-creme">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] items-stretch">
          <CategorySidebar categories={categories} className="lg:pb-6" />
          <div className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8 pb-6 sm:pb-8">
            {/* Featured Products */}
            <div>
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <h2 className="font-heading text-3xl sm:text-4xl text-black">Featured Products</h2>
                <div className="flex items-center gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  <button
                    onClick={() => setActiveCategory('')}
                    className={`shrink-0 text-sm px-3 py-1.5 rounded-full transition-colors ${!activeCategory ? 'bg-gold text-black font-semibold' : 'text-charcoal/60 hover:bg-gold/10'}`}
                  >
                    All
                  </button>
                  {categories.slice(0, 6).map((c) => (
                    <button
                      key={c._id}
                      onClick={() => setActiveCategory(c._id)}
                      className={`shrink-0 text-sm px-3 py-1.5 rounded-full transition-colors ${activeCategory === c._id ? 'bg-gold text-black font-semibold' : 'text-charcoal/60 hover:bg-gold/10'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
              {(() => {
                const visible = activeCategory ? featured.filter((p) => p.category?._id === activeCategory || p.category === activeCategory) : featured;
                return visible.length === 0 ? (
                  <EmptyState title="No featured products" message="Check back soon for featured picks." />
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    {visible.map((p) => (
                      <ProductCard key={p._id} product={p} compact />
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      {offers.length > 0 && (
        <Section id="special-offers" className="section-py bg-gold-dark scroll-mt-24">
          <div className="container-app">
            <h2 className="font-heading text-2xl sm:text-3xl text-black mb-5 flex items-center gap-2">
              <Megaphone className="h-6 w-6 text-black" /> Special Offers
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {offers.slice(0, 4).map((o) => (
                <Link
                  key={o._id}
                  to={`/shop?offer=${o._id}#special-offer`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-card hover:shadow-xl transition-shadow block"
                >
                  <div className="aspect-video bg-creme">
                    {o.image?.url && (
                      o.image.mimeType?.startsWith('video/') ? (
                        <video src={resolveImageUrl(o.image.url)} className="h-full w-full object-cover" autoPlay loop muted playsInline />
                      ) : (
                        <img src={resolveImageUrl(o.image.url)} alt={o.heading} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      )
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-heading text-lg text-black group-hover:text-gold-dark">{o.heading}</p>
                    {o.discountText && <p className="text-sm text-gold-dark font-semibold">{o.discountText}</p>}
                    {o.products?.length > 0 && (
                      <p className="text-xs text-charcoal/50 mt-1">{o.products.length} product{o.products.length === 1 ? '' : 's'} &rarr;</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Featured Categories */}
      <Section className="section-py bg-creme">
        <div className="container-app">
          <h2 className="font-heading text-2xl sm:text-3xl text-black mb-1">Featured Categories</h2>
          <p className="text-sm text-charcoal/60 mb-6">Everything you need, always fresh</p>
          <FeaturedCategoriesRow categories={categories} />
        </div>
      </Section>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <Section className="section-py bg-ivory">
          <div className="container-app">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="font-heading text-2xl sm:text-3xl text-black flex items-center gap-2">
                  <Award className="h-6 w-6 text-gold-dark" /> Best Sellers
                </h2>
                <p className="text-sm text-charcoal/60">Customer favorites, handpicked for you</p>
              </div>
              <Link to="/shop" className="btn-gold text-sm py-2 px-4 whitespace-nowrap">View All</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {bestSellers.map((p) => (
                <ProductCard key={p._id} product={p} compact />
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Featured Products + Weekly Deals / Delivery sidebar */}
      {deliveryLinks.length > 0 && (
        <Section className="section-py bg-gold/10 border-y border-gold/20">
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
      <Section className="section-py bg-gold-dark">
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
      <Section className="section-py bg-creme">
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
            style={{ backgroundImage: "url('/store-interior-clean-v1.jpg')" }}
          />
        </div>
      </Section>

      {/* Café Section */}
      <Section className="section-py bg-gold-dark">
        <div className="container-app text-center max-w-2xl mx-auto">
          <Coffee className="h-10 w-10 text-black mx-auto mb-4" />
          <h2 className="font-heading text-3xl sm:text-4xl text-black mb-4">Visit Our In-Store Café</h2>
          <p className="text-black/70">
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
      <Section className="section-py bg-gold-dark">
        <div className="container-app text-center max-w-xl mx-auto">
          <h2 className="font-heading text-3xl sm:text-4xl text-black mb-3">Good Food Brings People Together</h2>
          <p className="text-black/60 mb-6">Subscribe to our newsletter for exclusive deals, fresh arrivals and more.</p>
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
