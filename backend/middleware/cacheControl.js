// Lets Vercel's edge CDN (and browsers) serve repeat requests for public, read-only data
// (categories, products, deals, offers, settings, etc.) without hitting the function/DB again.
// stale-while-revalidate means a slightly-stale response is served instantly while a fresh one
// is fetched in the background, so public visitors see changes within `swr` seconds, not never.
//
// The admin panel calls these exact same GET routes (there's no separate "admin" endpoint), and
// it always sends an Authorization header. If we cached those too, an admin deleting/editing
// something could still see the old list for up to maxAge+swr seconds — so any authenticated
// request bypasses the cache entirely and always gets a fresh response.
export const cacheControl = (maxAgeSeconds, swrSeconds = maxAgeSeconds * 5) => (req, res, next) => {
  if (req.headers.authorization) {
    res.set('Cache-Control', 'no-store');
  } else {
    res.set('Cache-Control', `public, max-age=${maxAgeSeconds}, stale-while-revalidate=${swrSeconds}`);
  }
  next();
};

export default cacheControl;
