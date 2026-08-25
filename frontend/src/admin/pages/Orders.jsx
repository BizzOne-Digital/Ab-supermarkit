import { Fragment, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import * as orderService from '../../services/orderService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';

const statuses = ['Pending', 'Confirmed', 'Preparing', 'Ready for Pickup', 'Out for Delivery', 'Completed', 'Cancelled', 'Refunded'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    setLoading(true);
    orderService
      .getOrders({ page, limit: 15 })
      .then((res) => {
        setOrders(res.orders || []);
        setPagination(res.pagination || { page: 1, totalPages: 1 });
      })
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(load, [page]);

  const onStatusChange = async (id, status) => {
    try {
      await orderService.updateOrderStatus(id, { orderStatus: status });
      toast.success('Order status updated');
      setOrders((prev) => prev.map((o) => (o._id === id ? { ...o, orderStatus: status } : o)));
    } catch (err) {
      toast.error(err.message || 'Failed to update status');
    }
  };

  return (
    <div>
      <h1 className="font-heading text-2xl sm:text-3xl text-black mb-6">Orders</h1>
      {loading ? <LoadingSpinner full /> : orders.length === 0 ? (
        <EmptyState title="No orders yet" />
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-x-auto">
          <table className="w-full text-sm min-w-[760px]">
            <thead>
              <tr className="text-left text-charcoal/50 border-b border-charcoal/10">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <Fragment key={o._id}>
                  <tr className="border-b border-charcoal/5 cursor-pointer hover:bg-creme/40" onClick={() => setExpanded(expanded === o._id ? null : o._id)}>
                    <td className="py-3 px-4 font-medium">{o.orderNumber}</td>
                    <td className="py-3 px-4">{o.customerInfo?.name}</td>
                    <td className="py-3 px-4">${Number(o.total).toFixed(2)}</td>
                    <td className="py-3 px-4">{o.paymentStatus}</td>
                    <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={o.orderStatus}
                        onChange={(e) => onStatusChange(o._id, e.target.value)}
                        className="border border-charcoal/20 rounded-md py-1 px-2 text-xs focus:outline-none focus:border-gold"
                      >
                        {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="py-3 px-4 text-xs text-charcoal/50">{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                  {expanded === o._id && (
                    <tr className="bg-creme/30">
                      <td colSpan={6} className="p-4">
                        <div className="text-xs space-y-1">
                          <p><strong>Email:</strong> {o.customerInfo?.email} | <strong>Phone:</strong> {o.customerInfo?.phone}</p>
                          <p><strong>Delivery:</strong> {o.deliveryMethod}</p>
                          <div className="mt-2">
                            {o.items?.map((it, idx) => (
                              <p key={idx}>{it.name} × {it.qty} — ${(it.price * it.qty).toFixed(2)}</p>
                            ))}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={pagination.page || page} totalPages={pagination.totalPages || 1} onPageChange={setPage} />
    </div>
  );
}
