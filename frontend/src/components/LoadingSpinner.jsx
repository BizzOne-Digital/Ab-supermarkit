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
    return <div className="flex items-center justify-center py-20">{spinner}</div>;
  }
  return spinner;
}
