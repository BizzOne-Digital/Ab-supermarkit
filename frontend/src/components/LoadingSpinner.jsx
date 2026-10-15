export default function LoadingSpinner({ size = 'md', full = false }) {
  const sizes = { sm: 'h-5 w-5 border-2', md: 'h-8 w-8 border-2', lg: 'h-12 w-12 border-[3px]' };
  const spinner = (
    <div
      className={`${sizes[size]} rounded-full border-gold border-t-transparent animate-spin`}
      role="status"
      aria-label="Loading"
    />
  );
  if (full) {
    // Covers the whole viewport (including header/footer) instead of just the content area,
    // so a page load doesn't show a spinner floating oddly between an already-rendered nav
    // and footer.
    return (
      <div className="fixed inset-0 z-50 bg-ivory flex flex-col items-center justify-center gap-5">
        <img src="/logo.png" alt="AB's Supermarket" className="h-20 w-auto object-contain" />
        {spinner}
      </div>
    );
  }
  return spinner;
}
