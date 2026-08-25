import { PackageSearch } from 'lucide-react';

export default function EmptyState({ icon: Icon = PackageSearch, title = 'Nothing here yet', message = '', action = null }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      <div className="h-16 w-16 rounded-full bg-creme flex items-center justify-center mb-4">
        <Icon className="h-7 w-7 text-gold-dark" />
      </div>
      <h3 className="font-heading text-xl text-black mb-1">{title}</h3>
      {message && <p className="text-charcoal/70 max-w-sm mb-4">{message}</p>}
      {action}
    </div>
  );
}
