import { useEffect, useState } from 'react';
import { useSearchParams, useLocation } from 'react-router-dom';
import { SlidersHorizontal, X, Search } from 'lucide-react';
import * as productService from '../services/productService';
import * as categoryService from '../services/categoryService';
import * as dealService from '../services/dealService';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import DealsCarousel from '../components/DealsCarousel';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { hash } = useLocation();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'name';
  const page = Number(searchParams.get('page')) || 1;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sale = searchParams.get('sale') || '';
  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);
  const [searchInput, setSearchInput] = useState(search);

  const onSearchSubmit = (e) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  useEffect(() => {
    categoryService
      .getCategories()
      .then((res) => setCategories((res.categories || []).filter((c) => c.isEnabled !== false)))
      .catch(() => setCategories([]));
    dealService
      .getDeals()
      .then((res) => setDeals((res.deals || []).filter((d) => d.isActive)))
      .catch(() => setDeals([]));
  }, []);

  // The Weekly Deals section only exists in the DOM once deals have loaded, so the browser's
  // own hash-scroll (which fires on initial render) misses it — scroll manually once it's there.
  useEffect(() => {
    if (hash !== '#weekly-deals' || deals.length === 0) return;
    document.getElementById('weekly-deals')?.scrollIntoView({ behavior: 'smooth' });
  }, [hash, deals]);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12, sort };
    if (category) params.category = category;
    if (search) params.search = search;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sale) params.sale = sale;
    productService
      .getProducts(params)
      .then((res) => {
        setProducts(res.products || []);
        setPagination(res.pagination || { page: 1, totalPages: 1 });
      })
      .catch(() => {
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [category, search, sort, page, minPrice, maxPrice, sale]);

  const applyPriceFilter = (e) => {
    e.preventDefault();
    const next = new URLSearchParams(searchParams);
    if (minPriceInput) next.set('minPrice', minPriceInput);
    else next.delete('minPrice');
    if (maxPriceInput) next.set('maxPrice', maxPriceInput);
    else next.delete('maxPrice');
    next.delete('page');
    setSearchParams(next);
  };

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  return (
    <div className="container-app section-py">
      <h1 className="font-heading text-3xl sm:text-4xl text-black mb-2">Shop</h1>
      <p className="text-charcoal/60 mb-8">
        {search ? `Results for "${search}"` : sale ? 'This week\'s deals and discounted products.' : 'Browse our full range of premium groceries.'}
      </p>

      <button
        onClick={() => setFiltersOpen((o) => !o)}
        className="lg:hidden flex items-center gap-2 mb-4 border border-charcoal/20 rounded-md px-4 py-2"
      >
        <SlidersHorizontal className="h-4 w-4" /> Filters
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-8">
        <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white rounded-lg shadow-card p-5 sticky top-28">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading text-lg text-black">Categories</h3>
              <button className="lg:hidden" onClick={() => setFiltersOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => updateParam('category', '')}
                  className={`text-sm ${!category ? 'text-gold-dark font-semibold' : 'text-charcoal/70 hover:text-gold-dark'}`}
                >
                  All Categories
                </button>
              </li>
              {categories.map((c) => (
                <li key={c._id}>
                  <button
                    onClick={() => updateParam('category', c._id)}
                    className={`text-sm ${category === c._id ? 'text-gold-dark font-semibold' : 'text-charcoal/70 hover:text-gold-dark'}`}
                  >
                    {c.name}
                  </button>
                </li>
              ))}
            </ul>

            <form onSubmit={applyPriceFilter} className="mt-6 pt-6 border-t border-charcoal/10">
              <h3 className="font-heading text-lg text-black mb-3">Price Range</h3>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  placeholder="Min"
                  className="w-full border border-charcoal/20 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-gold"
                />
                <span className="text-charcoal/40">–</span>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  placeholder="Max"
                  className="w-full border border-charcoal/20 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-gold"
                />
              </div>
              <button type="submit" className="btn-outline w-full justify-center text-sm py-2 mt-3">
                Apply
              </button>
            </form>
          </div>
        </aside>

        <div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-6">
            <form onSubmit={onSearchSubmit} className="relative flex-1 max-w-sm">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search products..."
                className="w-full border border-charcoal/20 rounded-md py-2 pl-9 pr-3 text-sm focus:outline-none focus:border-gold"
              />
              <button type="submit" aria-label="Search" className="absolute left-2.5 top-1/2 -translate-y-1/2 text-charcoal/40 hover:text-gold-dark">
                <Search className="h-4 w-4" />
              </button>
            </form>
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="border border-charcoal/20 rounded-md py-2 px-3 text-sm focus:outline-none focus:border-gold"
            >
              <option value="name">Name A-Z</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>

          {loading ? (
            <LoadingSpinner full />
          ) : products.length === 0 ? (
            <EmptyState title="No products found" message="Try adjusting your filters or search term." />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                {products.map((p) => (
                  <ProductCard key={p._id} product={p} />
                ))}
              </div>
              <Pagination
                page={pagination.page || page}
                totalPages={pagination.totalPages || 1}
                onPageChange={(p) => updateParam('page', String(p))}
              />
            </>
          )}
        </div>
      </div>

      {deals.length > 0 && (
        <div id="weekly-deals" className="mt-12 scroll-mt-24">
          <DealsCarousel deals={deals} />
        </div>
      )}
    </div>
  );
}
