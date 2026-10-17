import toast from 'react-hot-toast';
import { ExternalLink, Handshake } from 'lucide-react';
import resolveImageUrl from '../utils/resolveImageUrl';

// Shown directly below the hero. Fully admin-managed (Admin > Collaborations) — logo, name,
// tagline, and the menu link/coming-soon state all come from the Partner record.
export default function PartnerBanner({ partners }) {
  if (partners.length === 0) return null;

  return (
    <div className="bg-creme">
      <div className="container-app py-3 sm:py-4">
        <div className="flex flex-col gap-3">
          {partners.map((p) => {
            const showComingSoon = p.menuComingSoon || !p.menuLink;
            return (
              <div
                key={p._id}
                className="bg-white rounded-2xl shadow-card p-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
              >
                <div className="h-16 w-16 shrink-0 rounded-full bg-gold/10 flex items-center justify-center overflow-hidden">
                  {p.logo?.url ? (
                    <img src={resolveImageUrl(p.logo.url)} alt={p.name} className="h-full w-full object-contain p-1.5" />
                  ) : (
                    <Handshake className="h-7 w-7 text-gold-dark" />
                  )}
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <p className="text-gold-dark text-xs font-semibold uppercase tracking-widest mb-0.5">In Collaboration With</p>
                  <h2 className="font-heading text-lg sm:text-xl text-black">{p.name}</h2>
                  {p.tagline && <p className="text-sm text-charcoal/60">{p.tagline}</p>}
                </div>
                {showComingSoon ? (
                  <button
                    type="button"
                    onClick={() => toast('Menu coming soon!')}
                    className="btn-gold text-sm py-2 px-4 whitespace-nowrap shrink-0"
                  >
                    View Menu
                  </button>
                ) : (
                  <a
                    href={p.menuLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-gold text-sm py-2 px-4 whitespace-nowrap shrink-0"
                  >
                    View Menu <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
