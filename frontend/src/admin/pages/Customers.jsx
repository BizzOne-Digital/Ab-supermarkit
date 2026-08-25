import { useEffect, useState } from 'react';
import * as orderService from '../../services/orderService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderService
      .getOrders({ limit: 200 })
      .then((res) => {
        const orders = res.orders || [];
        const map = new Map();
        orders.forEach((o) => {
          const key = o.customerInfo?.email || o.user?._id || o._id;
          const existing = map.get(key) || {
            name: o.customerInfo?.name,
            email: o.customerInfo?.email,
            phone: o.customerInfo?.phone,
            orderCount: 0,
            totalSpent: 0,
          };
          existing.orderCount += 1;
          existing.totalSpent += Number(o.total) || 0;
          map.set(key, existing);
        });
        setCustomers(Array.from(map.values()).sort((a, b) => b.totalSpent - a.totalSpent));
      })
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl sm:text-3xl text-black mb-2">Customers</h1>
      <p className="text-sm text-charcoal/50 mb-6">Derived from order history.</p>
      {loading ? <LoadingSpinner full /> : customers.length === 0 ? (
        <EmptyState title="No customers yet" />
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-charcoal/50 border-b border-charcoal/10">
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Total Spent</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c, idx) => (
                <tr key={idx} className="border-b border-charcoal/5">
                  <td className="py-3 px-4">{c.name}</td>
                  <td className="py-3 px-4">{c.email}</td>
                  <td className="py-3 px-4">{c.phone}</td>
                  <td className="py-3 px-4">{c.orderCount}</td>
                  <td className="py-3 px-4">${c.totalSpent.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
