import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Facebook, Instagram, MapPin, Phone, Mail, Send } from 'lucide-react';
import * as deliveryLinkService from '../services/deliveryLinkService';
import * as newsletterService from '../services/newsletterService';

export default function Footer() {
  const [deliveryLinks, setDeliveryLinks] = useState([]);
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    deliveryLinkService
      .getDeliveryLinks()
      .then((res) => setDeliveryLinks((res.deliveryLinks || []).filter((l) => l.isEnabled)))
      .catch(() => setDeliveryLinks([]));
  }, []);

  const onSubscribe = async (e) => {
    e.preventDefault();
    if (!email) return;
    setSubmitting(true);
    try {
      await newsletterService.subscribeNewsletter(email);
      toast.success('Subscribed successfully!');
      setEmail('');
    } catch (err) {
      toast.error(err.message || 'Subscription failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-black text-creme">
      <div className="container-app section-py grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <img src="/logo.png" alt="AB's Supermarket" className="h-12 w-auto object-contain mb-3" />
          <p className="text-creme/70 text-sm mb-4">
            Premium groceries, fresh produce, and everyday essentials — delivered with care.
          </p>
          <div className="flex gap-3">
            <a href="#" aria-label="Facebook" className="h-9 w-9 flex items-center justify-center rounded-full border border-gold/30 hover:bg-gold hover:text-black transition-colors">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="#" aria-label="Instagram" className="h-9 w-9 flex items-center justify-center rounded-full border border-gold/30 hover:bg-gold hover:text-black transition-colors">
              <Instagram className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-heading text-lg text-ivory mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="text-creme/70 hover:text-gold transition-colors">Home</Link></li>
            <li><Link to="/shop" className="text-creme/70 hover:text-gold transition-colors">Shop</Link></li>
            <li><Link to="/about" className="text-creme/70 hover:text-gold transition-colors">About Us</Link></li>
            <li><Link to="/faq" className="text-creme/70 hover:text-gold transition-colors">FAQ</Link></li>
            <li><Link to="/contact" className="text-creme/70 hover:text-gold transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-heading text-lg text-ivory mb-4">Customer Service</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/account" className="text-creme/70 hover:text-gold transition-colors">My Account</Link></li>
            <li><Link to="/cart" className="text-creme/70 hover:text-gold transition-colors">Cart</Link></li>
            <li><Link to="/faq" className="text-creme/70 hover:text-gold transition-colors">Shipping & Returns</Link></li>
          </ul>
          {deliveryLinks.length > 0 && (
            <div className="mt-5">
              <h5 className="text-sm font-semibold text-gold mb-2">Order Delivery</h5>
              <div className="flex flex-col gap-2">
                {deliveryLinks.map((link) => (
                  <a
                    key={link._id}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-creme/70 hover:text-gold text-sm transition-colors"
                  >
                    {link.platform}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <h4 className="font-heading text-lg text-ivory mb-4">Stay Connected</h4>
          <ul className="space-y-2 text-sm mb-4">
            <li className="flex items-center gap-2 text-creme/70"><MapPin className="h-4 w-4 text-gold shrink-0" /> 123 Market Street</li>
            <li className="flex items-center gap-2 text-creme/70"><Phone className="h-4 w-4 text-gold shrink-0" /> (555) 123-4567</li>
            <li className="flex items-center gap-2 text-creme/70"><Mail className="h-4 w-4 text-gold shrink-0" /> hello@absupermarket.com</li>
          </ul>
          <form onSubmit={onSubscribe} className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email"
              className="w-full bg-charcoal text-creme placeholder:text-creme/40 rounded-md py-2.5 pl-3 pr-10 text-sm border border-gold/20 focus:outline-none focus:border-gold"
            />
            <button
              type="submit"
              disabled={submitting}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-gold hover:text-gold-dark"
              aria-label="Subscribe"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
      <div className="border-t border-gold/10 py-4 text-center text-xs text-creme/50">
        © {new Date().getFullYear()} AB&apos;s Supermarket. All rights reserved.
      </div>
    </footer>
  );
}
