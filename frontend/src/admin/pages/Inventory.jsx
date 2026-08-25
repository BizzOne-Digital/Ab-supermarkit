import { useEffect, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import * as productService from '../../services/productService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService
      .getProducts({ limit: 100 })
      .then((res) => setProducts(res.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const lowStock = products.filter((p) => p.stockQuantity <= (p.lowStockThreshold ?? 10));

  return (
    <div>
      <h1 className="font-heading text-2xl sm:text-3xl text-black mb-6">Inventory</h1>
      {loading ? (
        <LoadingSpinner full />
      ) : products.length === 0 ? (
        <EmptyState title="No products yet" />
      ) : (
        <>
          {lowStock.length > 0 && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-sm rounded-md px-4 py-3 mb-6">
              <AlertTriangle className="h-4 w-4 shrink-0" /> {lowStock.length} product(s) are low on stock.
            </div>
          )}
          <div className="bg-white rounded-lg shadow-card overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              <thead>
                <tr className="text-left text-charcoal/50 border-b border-charcoal/10">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Threshold</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {products.map((p) => {
                  const low = p.stockQuantity <= (p.lowStockThreshold ?? 10);
                  return (
                    <tr key={p._id} className="border-b border-charcoal/5">
                      <td className="py-3 px-4">{p.name}</td>
                      <td className="py-3 px-4">{p.sku || '—'}</td>
                      <td className="py-3 px-4">{p.stockQuantity}</td>
                      <td className="py-3 px-4">{p.lowStockThreshold}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-0.5 rounded ${low ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {low ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
