import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { trackMetaEvent } from '@/lib/metaTracking';

export default function ScrollToTop() {
  const [pathname] = useLocation();

  useEffect(() => {
    // Prevent browser from restoring scroll position on refresh
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    // Force scroll to top on initial load
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    // 1. Scroll to top on route change
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });

    // 2. Track Meta PageView
    trackMetaEvent({ eventName: 'PageView' });
  }, [pathname]);

  return null;
}
