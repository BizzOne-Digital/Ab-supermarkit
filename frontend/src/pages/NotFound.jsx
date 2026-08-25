import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-app section-py text-center">
      <h1 className="font-heading text-6xl text-gold mb-4">404</h1>
      <p className="text-charcoal/70 mb-6">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link to="/" className="btn-gold">Back to Home</Link>
    </div>
  );
}
