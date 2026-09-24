import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X } from 'lucide-react';
import * as productService from '../services/productService';
import * as categoryService from '../services/categoryService';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || 'name';
  const page = Number(searchParams.get('page')) || 1;

  useEffect(() => {
    categoryService
      .getCategories()
      .then((res) => setCategories((res.categories || []).filter((c) => c.isEnabled !== false)))
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, limit: 12, sort };
    if (category) params.category = category;
    if (search) params.search = search;
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
  }, [category, search, sort, page]);

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
        {search ? `Results for "${search}"` : 'Browse our full range of premium groceries.'}
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
          </div>
        </aside>

        <div>
          <div className="flex items-center justify-end mb-6">
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
    </div>
  );
}
