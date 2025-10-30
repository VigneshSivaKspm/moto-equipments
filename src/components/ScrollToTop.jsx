import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Scroll to top on every route change
export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, let the browser handle anchor jumps after a tick
    if (hash) {
      // Small timeout to allow DOM to render before jumping
      setTimeout(() => {
        const el = document.getElementById(hash.slice(1));
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        }
      }, 0);
    } else {
      // Default: scroll to top
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
      // Fallbacks for older browsers
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [pathname, search, hash]);

  return null;
}
