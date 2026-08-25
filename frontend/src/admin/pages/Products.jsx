import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X } from 'lucide-react';
import * as productService from '../../services/productService';
import * as categoryService from '../../services/categoryService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';

const emptyForm = {
  name: '',
  sku: '',
  barcode: '',
  description: '',
  shortDescription: '',
  category: '',
  subcategory: '',
  brand: '',
  regularPrice: '',
  salePrice: '',
  stockQuantity: '',
  unit: 'each',
  isFeatured: false,
  isBestSeller: false,
  status: 'active',
  lowStockThreshold: 10,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [saving, setSaving] = useState(false);

  const loadProducts = () => {
    setLoading(true);
    productService
      .getProducts({ page, limit: 10 })
      .then((res) => {
        setProducts(res.products || []);
        setPagination(res.pagination || { page: 1, totalPages: 1 });
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    categoryService.getCategories().then((res) => setCategories(res.categories || [])).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFiles([]);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name || '',
      sku: p.sku || '',
      barcode: p.barcode || '',
      description: p.description || '',
      shortDescription: p.shortDescription || '',
      category: p.category?._id || p.category || '',
      subcategory: p.subcategory || '',
      brand: p.brand || '',
      regularPrice: p.regularPrice ?? '',
      salePrice: p.salePrice ?? '',
      stockQuantity: p.stockQuantity ?? '',
      unit: p.unit || 'each',
      isFeatured: !!p.isFeatured,
      isBestSeller: !!p.isBestSeller,
      status: p.status || 'active',
      lowStockThreshold: p.lowStockThreshold ?? 10,
    });
    setFiles([]);
    setModalOpen(true);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      files.forEach((f) => fd.append('images', f));

      if (editing) {
        await productService.updateProduct(editing._id, fd);
        toast.success('Product updated');
      } else {
        await productService.createProduct(fd);
        toast.success('Product created');
      }
      setModalOpen(false);
      loadProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted');
      loadProducts();
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl sm:text-3xl text-black">Products</h1>
        <button onClick={openCreate} className="btn-gold text-sm py-2 px-4">
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {loading ? (
        <LoadingSpinner full />
      ) : products.length === 0 ? (
        <EmptyState title="No products yet" message="Add your first product to get started." />
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-x-auto">
          <table className="w-full text-sm min-w-[720px]">
            <thead>
              <tr className="text-left text-charcoal/50 border-b border-charcoal/10">
                <th className="py-3 px-4">Image</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-charcoal/5">
                  <td className="py-3 px-4">
                    <div className="h-10 w-10 bg-creme rounded overflow-hidden">
                      {p.images?.[0]?.url && <img src={p.images[0].url} alt="" className="h-full w-full object-cover" />}
                    </div>
                  </td>
                  <td className="py-3 px-4">{p.name}</td>
                  <td className="py-3 px-4">{p.category?.name || '—'}</td>
                  <td className="py-3 px-4">${Number(p.regularPrice).toFixed(2)}</td>
                  <td className="py-3 px-4">{p.stockQuantity}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded ${p.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-charcoal/10 text-charcoal/60'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button onClick={() => openEdit(p)} className="text-charcoal/50 hover:text-gold-dark mr-3"><Pencil className="h-4 w-4 inline" /></button>
                    <button onClick={() => onDelete(p._id)} className="text-charcoal/50 hover:text-red-600"><Trash2 className="h-4 w-4 inline" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={pagination.page || page} totalPages={pagination.totalPages || 1} onPageChange={setPage} />

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-charcoal/10 sticky top-0 bg-white">
              <h2 className="font-heading text-xl text-black">{editing ? 'Edit Product' : 'Add Product'}</h2>
              <button onClick={() => setModalOpen(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={onSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-charcoal/70">Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">SKU</label>
                  <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Barcode</label>
                  <input value={form.barcode} onChange={(e) => setForm({ ...form, barcode: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3">
                    <option value="">Select category</option>
                    {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Brand</label>
                  <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Regular Price</label>
                  <input type="number" step="0.01" required value={form.regularPrice} onChange={(e) => setForm({ ...form, regularPrice: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Sale Price</label>
                  <input type="number" step="0.01" value={form.salePrice} onChange={(e) => setForm({ ...form, salePrice: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Stock Quantity</label>
                  <input type="number" value={form.stockQuantity} onChange={(e) => setForm({ ...form, stockQuantity: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Unit</label>
                  <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Low Stock Threshold</label>
                  <input type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
                <div>
                  <label className="text-sm font-medium text-charcoal/70">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-charcoal/70">Short Description</label>
                  <input value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-charcoal/70">Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full mt-1 border border-charcoal/20 rounded-md py-2 px-3" />
                </div>
                <div className="sm:col-span-2 flex gap-6">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-gold" /> Featured
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={form.isBestSeller} onChange={(e) => setForm({ ...form, isBestSeller: e.target.checked })} className="accent-gold" /> Best Seller
                  </label>
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-charcoal/70">Images (up to 6)</label>
                  <input type="file" multiple accept="image/*" onChange={(e) => setFiles(Array.from(e.target.files))} className="w-full mt-1 text-sm" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn-outline text-sm py-2 px-4">Cancel</button>
                <button type="submit" disabled={saving} className="btn-gold text-sm py-2 px-4 disabled:opacity-60">
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
