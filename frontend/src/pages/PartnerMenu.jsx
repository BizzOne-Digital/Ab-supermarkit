import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, UtensilsCrossed, Drumstick, Fish, Beef, Soup } from 'lucide-react';
import * as partnerService from '../services/partnerService';
import * as menuItemService from '../services/menuItemService';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import resolveImageUrl from '../utils/resolveImageUrl';

const CATEGORY_ICON_RULES = [
  [/chicken|tandoori|momo/i, Drumstick],
  [/seafood|fish/i, Fish],
  [/goat|lamb|meat/i, Beef],
  [/veg|soup/i, Soup],
];

const iconFor = (category) => CATEGORY_ICON_RULES.find(([re]) => re.test(category))?.[1] || UtensilsCrossed;

export default function PartnerMenu() {
  const { partnerId } = useParams();
  const [partner, setPartner] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      partnerService.getPartners().then((res) => (res.partners || []).find((p) => p._id === partnerId) || null),
      menuItemService.getMenuItems({ partner: partnerId }),
    ])
      .then(([partnerRes, itemsRes]) => {
        setPartner(partnerRes);
        setItems(itemsRes.menuItems || []);
      })
      .catch(() => {
        setPartner(null);
        setItems([]);
      })
      .finally(() => setLoading(false));
  }, [partnerId]);

  if (loading) return <LoadingSpinner full />;

  const grouped = items.reduce((acc, item) => {
    (acc[item.category] = acc[item.category] || []).push(item);
    return acc;
  }, {});

  return (
    <div className="container-app section-py">
      <Link to="/" className="inline-flex items-center gap-1 text-sm text-charcoal/60 hover:text-gold-dark mb-6">
        <ChevronLeft className="h-4 w-4" /> Back to Home
      </Link>

      {partner && (
        <div className="flex flex-col items-center text-center mb-10">
          {partner.logo?.url && (
            <img src={resolveImageUrl(partner.logo.url)} alt={partner.name} className="h-20 w-auto object-contain mb-4" />
          )}
          <p className="text-gold-dark text-xs font-semibold uppercase tracking-widest mb-1">In Collaboration With AB&apos;s Supermarket</p>
          <h1 className="font-heading text-3xl sm:text-4xl text-black">{partner.name}</h1>
          {partner.tagline && <p className="text-charcoal/60 mt-2 max-w-xl">{partner.tagline}</p>}
        </div>
      )}

      {Object.keys(grouped).length === 0 ? (
        <EmptyState title="Menu coming soon" message="Check back shortly — we're putting the menu together." />
      ) : (
        <div className="max-w-3xl mx-auto space-y-10">
          {Object.entries(grouped).map(([category, catItems]) => {
            const Icon = iconFor(category);
            return (
              <div key={category}>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-gold-dark">
                  <Icon className="h-5 w-5 text-gold-dark" />
                  <h2 className="font-heading text-xl text-black uppercase tracking-wide">{category}</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
                  {catItems.map((item) => (
                    <div key={item._id} className="flex items-center gap-3">
                      <div className="h-12 w-12 shrink-0 rounded-md bg-creme overflow-hidden flex items-center justify-center">
                        {item.image?.url ? (
                          <img src={resolveImageUrl(item.image.url)} alt={item.name} className="h-full w-full object-cover" />
                        ) : (
                          <Icon className="h-5 w-5 text-gold-dark/60" />
                        )}
                      </div>
                      <div className="flex-1 flex items-baseline justify-between gap-2 border-b border-dotted border-charcoal/20 pb-1">
                        <span className="text-sm text-black">{item.name}</span>
                        <span className="text-sm font-semibold text-gold-dark whitespace-nowrap">
                          ${Number(item.price).toFixed(2)}{item.unit ? ` ${item.unit}` : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
