import { useEffect, useState } from 'react';
import * as newsletterService from '../../services/newsletterService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function Newsletter() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    newsletterService
      .getNewsletterSubscribers()
      .then((res) => setSubscribers(res.subscribers || []))
      .catch(() => setSubscribers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl sm:text-3xl text-black mb-6">Newsletter Subscribers</h1>
      {loading ? <LoadingSpinner full /> : subscribers.length === 0 ? (
        <EmptyState title="No subscribers yet" />
      ) : (
        <div className="bg-white rounded-lg shadow-card overflow-x-auto">
          <table className="w-full text-sm min-w-[400px]">
            <thead>
              <tr className="text-left text-charcoal/50 border-b border-charcoal/10">
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Subscribed On</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr key={s._id} className="border-b border-charcoal/5">
                  <td className="py-3 px-4">{s.email}</td>
                  <td className="py-3 px-4">{new Date(s.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
