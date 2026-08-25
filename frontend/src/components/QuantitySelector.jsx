import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="inline-flex items-center border border-charcoal/20 rounded-md">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="h-10 w-10 flex items-center justify-center text-charcoal hover:text-gold transition-colors"
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-10 text-center font-semibold select-none">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="h-10 w-10 flex items-center justify-center text-charcoal hover:text-gold transition-colors"
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
