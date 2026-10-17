import { ExternalLink, Handshake } from 'lucide-react';
import resolveImageUrl from '../utils/resolveImageUrl';

// Shown directly below the hero. Fully admin-managed (Admin > Collaborations) — logo, name,
// tagline, and the menu link all come from the Partner record, nothing hardcoded.
export default function PartnerBanner({ partners }) {
  if (partners.length === 0) return null;

  return (
    <div className="bg-creme">
      <div className="container-app py-4 sm:py-5">
        <div className="flex flex-col gap-3">
          {partners.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-2xl shadow-card p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4 sm:gap-6"
            >
              <div className="h-14 w-14 shrink-0 rounded-full bg-gold/10 flex items-center justify-center overflow-hidden">
                {p.logo?.url ? (
                  <img src={resolveImageUrl(p.logo.url)} alt={p.name} className="h-full w-full object-contain p-1.5" />
                ) : (
                  <Handshake className="h-6 w-6 text-gold-dark" />
                )}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-gold-dark text-xs font-semibold uppercase tracking-widest mb-0.5">In Collaboration With</p>
                <h2 className="font-heading text-lg sm:text-xl text-black">{p.name}</h2>
                {p.tagline && <p className="text-sm text-charcoal/60">{p.tagline}</p>}
              </div>
              {p.menuLink && (
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
          ))}
        </div>
      </div>
    </div>
  );
}
