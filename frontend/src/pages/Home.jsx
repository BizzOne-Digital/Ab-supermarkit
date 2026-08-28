import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Truck, ShieldCheck, Leaf, Clock, Send, Coffee, Tag, ShoppingBasket, Handshake, ArrowRight, Flame } from 'lucide-react';

import * as categoryService from '../services/categoryService';
import * as productService from '../services/productService';
import * as dealService from '../services/dealService';
import * as testimonialService from '../services/testimonialService';
import * as faqService from '../services/faqService';
import * as deliveryLinkService from '../services/deliveryLinkService';
import * as newsletterService from '../services/newsletterService';

import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import DealCard from '../components/DealCard';
import TestimonialCard from '../components/TestimonialCard';
import FaqAccordionItem from '../components/FaqAccordionItem';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

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
  const [testimonials, setTestimonials] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [deliveryLinks, setDeliveryLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [heroVideoReady, setHeroVideoReady] = useState(false);

  useEffect(() => {
    Promise.all([
      categoryService.getCategories().catch(() => ({ categories: [] })),
      productService.getProducts({ featured: 'true', limit: 8 }).catch(() => ({ products: [] })),
      dealService.getDeals().catch(() => ({ deals: [] })),
      testimonialService.getTestimonials().catch(() => ({ testimonials: [] })),
      faqService.getFaqs().catch(() => ({ faqs: [] })),
      deliveryLinkService.getDeliveryLinks().catch(() => ({ deliveryLinks: [] })),
    ]).then(([catRes, prodRes, dealRes, testRes, faqRes, delRes]) => {
      setCategories((catRes.categories || []).filter((c) => c.isEnabled !== false));
      setFeatured(prodRes.products || []);
      setDeals((dealRes.deals || []).filter((d) => d.isActive));
      setTestimonials((testRes.testimonials || []).filter((t) => t.isEnabled !== false));
      setFaqs((faqRes.faqs || []).filter((f) => f.isEnabled !== false).slice(0, 6));
      setDeliveryLinks((delRes.deliveryLinks || []).filter((l) => l.isEnabled));
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
      {/* Hero */}
      <section className="relative bg-black text-ivory overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src="/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          onCanPlay={() => setHeroVideoReady(true)}
        />
        {!heroVideoReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <LoadingSpinner />
          </div>
        )}
        <div className="absolute inset-0 bg-black/30" />
        <div className="container-app py-24 sm:py-36 relative z-10">
          <div className="max-w-xl text-center mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="font-heading text-4xl sm:text-6xl font-bold leading-tight"
            >
              <span className="block text-gold">Best Quality,</span>
              <span className="block">Best Price,</span>
              <span className="block">Best Service</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-5 text-ivory/70 text-lg"
            >
              Your neighbourhood destination for fresh groceries, everyday essentials, international favourites and café delights.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center justify-center gap-4"
            >
              <Link to="/shop" className="btn-gold">Shop Groceries</Link>
              <Link to="/about" className="btn-outline border-ivory/40 text-ivory hover:bg-ivory hover:text-black">Explore Our Store</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <Section className="section-py container-app">
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading text-3xl sm:text-4xl text-black">Shop by Category</h2>
          <Link to="/shop" className="hidden sm:flex items-center gap-1 text-sm font-semibold text-gold-dark hover:text-gold">
            View all categories <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {categories.length === 0 ? (
          <EmptyState title="No categories yet" message="Categories will appear here once added." />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            {categories.slice(0, 12).map((c) => (
              <CategoryCard key={c._id} category={c} />
            ))}
          </div>
        )}
      </Section>

      {/* Featured Products + Weekly Deals / Delivery sidebar */}
      <Section className="section-py bg-creme">
        <div className="container-app grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <h2 className="font-heading text-3xl sm:text-4xl text-black mb-8">Featured Products</h2>
            {featured.length === 0 ? (
              <EmptyState title="No featured products" message="Check back soon for featured picks." />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5 sm:gap-6">
                {featured.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {deals.length > 0 && (
              <div className="bg-black rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-heading text-xl text-gold flex items-center gap-2">
                    <Flame className="h-5 w-5" /> Weekly Deals
                  </h3>
                  <Link to="/shop?sale=true" className="text-xs font-semibold text-ivory/60 hover:text-gold">
                    View all deals
                  </Link>
                </div>
                <div className="space-y-4">
                  {deals.slice(0, 3).map((d) => (
                    <DealCard key={d._id} deal={d} compact />
                  ))}
                </div>
              </div>
            )}

            {deliveryLinks.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-card">
                <h3 className="font-heading text-lg text-black mb-1 flex items-center gap-2">
                  <Truck className="h-5 w-5 text-gold-dark" /> We Deliver to You
                </h3>
                <p className="text-sm text-charcoal/60 mb-4">Fast, reliable. Right to your door.</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {deliveryLinks.map((link) => (
                    <a
                      key={link._id}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-semibold px-3 py-2 rounded-md border border-charcoal/15 hover:border-gold hover:text-gold-dark transition-colors"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
                <a href={deliveryLinks[0]?.url} target="_blank" rel="noreferrer" className="btn-gold w-full justify-center">
                  Order Now
                </a>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Why Shop */}
      <Section className="section-py container-app">
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
            className="aspect-video bg-black rounded-lg bg-cover bg-center"
            style={{ backgroundImage: "url('/store.png')" }}
          />
        </div>
      </Section>

      {/* Café Section */}
      <Section className="section-py bg-black text-ivory">
        <div className="container-app text-center max-w-2xl mx-auto">
          <Coffee className="h-10 w-10 text-gold mx-auto mb-4" />
          <h2 className="font-heading text-3xl sm:text-4xl mb-4">Visit Our In-Store Café</h2>
          <p className="text-ivory/70">
            Take a break while you shop — enjoy fresh coffee, pastries, and light bites at our in-store café.
          </p>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="section-py bg-creme">
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
        <Section className="section-py container-app max-w-3xl">
          <h2 className="font-heading text-3xl sm:text-4xl text-black text-center mb-8">Frequently Asked Questions</h2>
          <div>
            {faqs.map((f) => (
              <FaqAccordionItem key={f._id} faq={f} />
            ))}
          </div>
        </Section>
      )}

      {/* Newsletter */}
      <Section className="section-py bg-black">
        <div className="container-app text-center max-w-xl mx-auto">
          <h2 className="font-heading text-3xl text-ivory mb-3">Get Deals in Your Inbox</h2>
          <p className="text-ivory/60 mb-6">Subscribe for weekly offers and new arrivals.</p>
          <form onSubmit={onSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              className="flex-1 rounded-md py-3 px-4 text-sm bg-charcoal text-ivory placeholder:text-ivory/40 border border-gold/20 focus:outline-none focus:border-gold"
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
