import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ShoppingCart, User, Search, Menu, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import * as categoryService from '../services/categoryService';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/shop', label: 'Shop', hasDropdown: true },
  { to: '/faq', label: 'FAQ' },
  { to: '/contact', label: 'Contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [openDropdown, setOpenDropdown] = useState(null);
  const { isAuthenticated } = useAuth();
  const { itemCount, subtotal } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    categoryService
      .getCategories()
      .then((res) => setCategories((res.categories || []).filter((c) => c.isEnabled !== false)))
      .catch(() => setCategories([]));
  }, []);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/shop?search=${encodeURIComponent(search)}`);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 shadow-sm">
      <div className="hidden sm:flex bg-gold text-black text-center text-xs py-2 px-4 items-center justify-between">
        <span className="flex-1 text-center">
          <span className="font-semibold">Fresh Groceries. Great Prices. Exceptional Service.</span>
          <span className="mx-2 opacity-50">|</span>
          Delivering quality to your doorstep.
        </span>
      </div>
      <div className="sm:hidden bg-gold text-black text-center text-xs py-2 px-4">
        Fresh Groceries • Great Prices • Exceptional Service
      </div>
      <div className="bg-black">
        <div className="container-app flex items-center justify-between h-16 sm:h-20 gap-4">
          <Link to="/" className="flex items-center shrink-0">
            <img src="/logo.png" alt="AB's Supermarket" className="h-12 sm:h-14 w-auto object-contain" />
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div
                key={link.to}
                className="relative"
                onMouseEnter={() => link.hasDropdown && setOpenDropdown(link.to)}
                onMouseLeave={() => link.hasDropdown && setOpenDropdown(null)}
              >
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) =>
                    `relative flex items-center gap-1 font-medium pb-1 transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-0.5 after:h-[2px] after:bg-gold after:transition-all ${
                      isActive ? 'text-gold after:w-full' : 'text-ivory/80 hover:text-gold after:w-0 hover:after:w-full'
                    }`
                  }
                >
                  {link.label}
                  {link.hasDropdown && <ChevronDown className="h-3.5 w-3.5" />}
                </NavLink>

                <AnimatePresence>
                  {link.hasDropdown && openDropdown === link.to && categories.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-64 z-50"
                    >
                      <div className="bg-ivory rounded-lg shadow-xl border border-gold/20 py-2 overflow-hidden">
                        {categories.map((c) => (
                          <Link
                            key={c._id}
                            to={`/shop?category=${c._id}`}
                            onClick={() => setOpenDropdown(null)}
                            className="block px-4 py-2 text-sm text-charcoal hover:bg-creme hover:text-gold-dark transition-colors"
                          >
                            {c.name}
                          </Link>
                        ))}
                        <Link
                          to="/shop"
                          onClick={() => setOpenDropdown(null)}
                          className="block px-4 py-2 text-sm font-semibold text-gold-dark hover:bg-creme border-t border-charcoal/10 mt-1"
                        >
                          View All Products
                        </Link>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </nav>

          <div className="flex items-center gap-1 sm:gap-3">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="hidden md:flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/10 text-ivory/80 hover:text-gold transition-colors"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              to={isAuthenticated ? '/account' : '/login'}
              className="hidden sm:flex items-center justify-center h-10 w-10 rounded-full hover:bg-white/10 text-ivory/80 hover:text-gold transition-colors"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </Link>
            <Link
              to="/cart"
              className="relative flex items-center gap-2 h-10 px-2 sm:px-3 rounded-full hover:bg-white/10 text-ivory/80 hover:text-gold transition-colors"
              aria-label="Cart"
            >
              <span className="relative">
                <ShoppingCart className="h-5 w-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 flex items-center justify-center rounded-full bg-gold text-black text-[10px] font-bold">
                    {itemCount}
                  </span>
                )}
              </span>
              <span className="hidden sm:inline text-sm font-semibold">${subtotal.toFixed(2)}</span>
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden flex items-center justify-center h-10 w-10 text-ivory"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        {searchOpen && (
          <div className="hidden md:block border-t border-white/10 bg-black">
            <form onSubmit={onSearchSubmit} className="container-app py-3 relative">
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Search products..."
                className="w-full max-w-md border border-white/20 bg-black rounded-md py-2 pl-3 pr-9 text-sm text-ivory placeholder:text-ivory/40 focus:outline-none focus:border-gold"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-ivory/60 hover:text-gold">
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>
        )}
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 h-full w-[85%] max-w-sm bg-ivory z-50 shadow-xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-charcoal/10">
                <span className="font-heading text-lg text-black">Menu</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu">
                  <X className="h-6 w-6 text-charcoal" />
                </button>
              </div>
              <form onSubmit={onSearchSubmit} className="p-4 relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Search products..."
                  className="w-full border border-charcoal/20 rounded-md py-3 pl-3 pr-9 text-sm focus:outline-none focus:border-gold"
                />
                <button type="submit" className="absolute right-6 top-1/2 -translate-y-1/2 text-charcoal/60">
                  <Search className="h-4 w-4" />
                </button>
              </form>
              <nav className="flex flex-col px-4 gap-1 flex-1">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `py-3 text-lg font-medium border-b border-charcoal/5 ${isActive ? 'text-gold-dark' : 'text-charcoal'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                ))}
                <Link
                  to={isAuthenticated ? '/account' : '/login'}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-lg font-medium text-charcoal border-b border-charcoal/5"
                >
                  {isAuthenticated ? 'My Account' : 'Login / Register'}
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
