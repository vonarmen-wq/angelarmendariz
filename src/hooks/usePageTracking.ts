import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '@/lib/analytics';

function getSessionId() {
  let id = sessionStorage.getItem('_sid');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('_sid', id);
  }
  return id;
}

export const usePageTracking = () => {
  const location = useLocation();
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;

  useEffect(() => {
    const path = location.pathname + location.search;
    // GA4 tracking
    trackPageView(path);

    // Custom DB tracking (fire-and-forget)
    if (projectId) {
      fetch(`https://${projectId}.supabase.co/functions/v1/track-pageview`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path,
          referrer: document.referrer || null,
          session_id: getSessionId(),
        }),
      }).catch(() => {/* silent fail */});
    }
  }, [location, projectId]);
};
