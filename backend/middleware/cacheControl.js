// Lets Vercel's edge CDN (and browsers) serve repeat requests for public, read-only data
// (categories, products, deals, offers, settings, etc.) without hitting the function/DB again.
// stale-while-revalidate means a slightly-stale response is served instantly while a fresh one
// is fetched in the background, so admin changes still show up within `swr` seconds, not never.
export const cacheControl = (maxAgeSeconds, swrSeconds = maxAgeSeconds * 5) => (req, res, next) => {
  res.set('Cache-Control', `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${swrSeconds}`);
  next();
};

export default cacheControl;
