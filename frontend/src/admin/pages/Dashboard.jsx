import { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, AlertTriangle, Users } from 'lucide-react';
import * as dashboardService from '../../services/dashboardService';
import LoadingSpinner from '../../components/LoadingSpinner';

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-lg shadow-card p-5 flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-black flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5 text-gold" />
      </div>
      <div>
        <p className="text-sm text-charcoal/60">{label}</p>
        <p className="font-heading text-2xl text-black">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getDashboardStats()
      .then((res) => setStats(res.stats))
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner full />;
  if (!stats) return <p className="text-charcoal/60">Unable to load dashboard stats.</p>;

  return (
    <div>
      <h1 className="font-heading text-2xl sm:text-3xl text-black mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${Number(stats.totalRevenue).toFixed(2)}`} />
        <StatCard icon={ShoppingBag} label="Total Orders" value={stats.totalOrders} />
        <StatCard icon={AlertTriangle} label="Low Stock Products" value={stats.lowStockProductCount} />
        <StatCard icon={Users} label="Total Customers" value={stats.totalCustomers} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-card p-5">
          <h2 className="font-heading text-lg text-black mb-4">Recent Orders</h2>
          {stats.recentOrders?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-charcoal/50 border-b border-charcoal/10">
                    <th className="py-2 pr-4">Order #</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentOrders.map((o) => (
                    <tr key={o._id} className="border-b border-charcoal/5">
                      <td className="py-2 pr-4">{o.orderNumber}</td>
                      <td className="py-2 pr-4">{o.orderStatus}</td>
                      <td className="py-2">${Number(o.total).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-sm text-charcoal/50">No recent orders.</p>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-card p-5">
          <h2 className="font-heading text-lg text-black mb-4">Best Sellers</h2>
          {stats.bestSellers?.length ? (
            <ul className="space-y-2 text-sm">
              {stats.bestSellers.map((b) => (
                <li key={b._id} className="flex justify-between border-b border-charcoal/5 pb-2">
                  <span>{b._id}</span>
                  <span className="font-semibold">{b.totalSold} sold</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-charcoal/50">No sales data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
