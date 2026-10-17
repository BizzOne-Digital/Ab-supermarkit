import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // A hash means something wants to scroll to a specific section (e.g. the Weekly Deals
    // anchor on Shop) — don't fight that by forcing back to the top.
    if (hash) return;
    // Watch search too — category/filter changes on Shop keep the same pathname but swap the
    // query string, which previously left the scroll position wherever it was.
    window.scrollTo(0, 0);
  }, [pathname, search, hash]);

  return null;
}
