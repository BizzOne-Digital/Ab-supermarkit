// Images uploaded through our own API are stored with a relative URL like
// "/api/uploads/products/xyz.jpg" (see backend storedUploadService). The frontend and backend
// are deployed as separate Vercel projects on different domains, so that relative path must be
// resolved against the backend's own origin, not the page's — otherwise the browser requests it
// from the frontend's domain, where it 404s (showing as a broken image).
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

export default function resolveImageUrl(url) {
  if (!url) return url;
  if (url.startsWith('/api/')) return `${API_ORIGIN}${url}`;
  return url;
}
