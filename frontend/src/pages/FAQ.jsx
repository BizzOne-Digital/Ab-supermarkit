import { useEffect, useState } from 'react';
import * as faqService from '../services/faqService';
import FaqAccordionItem from '../components/FaqAccordionItem';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

export default function FAQ() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    faqService
      .getFaqs()
      .then((res) => setFaqs((res.faqs || []).filter((f) => f.isEnabled !== false)))
      .catch(() => setFaqs([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container-app section-py max-w-3xl">
      <h1 className="font-heading text-3xl sm:text-4xl text-black mb-2 text-center">Frequently Asked Questions</h1>
      <p className="text-charcoal/60 text-center mb-10">Everything you need to know.</p>
      {loading ? (
        <LoadingSpinner full />
      ) : faqs.length === 0 ? (
        <EmptyState title="No FAQs yet" />
      ) : (
        <div>
          {faqs.map((f) => (
            <FaqAccordionItem key={f._id} faq={f} />
          ))}
        </div>
      )}
    </div>
  );
}
