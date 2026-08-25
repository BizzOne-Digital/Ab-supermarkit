import { useEffect, useState } from 'react';
import * as contactService from '../../services/contactService';
import LoadingSpinner from '../../components/LoadingSpinner';
import EmptyState from '../../components/EmptyState';

export default function ContactSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    contactService
      .getContactSubmissions()
      .then((res) => setSubmissions(res.submissions || res.contacts || []))
      .catch(() => setSubmissions([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-heading text-2xl sm:text-3xl text-black mb-6">Contact Submissions</h1>
      {loading ? <LoadingSpinner full /> : submissions.length === 0 ? (
        <EmptyState title="No submissions yet" />
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => (
            <div key={s._id} className="bg-white rounded-lg shadow-card p-4">
              <div className="flex items-center justify-between mb-1">
                <p className="font-heading text-black">{s.name}</p>
                <span className="text-xs text-charcoal/50">{new Date(s.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gold-dark mb-2">{s.email}</p>
              <p className="text-sm text-charcoal/70">{s.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
