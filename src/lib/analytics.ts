// Google Analytics 4 tracking utilities
// Replace G-XXXXXXXXXX with your actual GA4 Measurement ID

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

export const GA_MEASUREMENT_ID = 'G-XXXXXXXXXX';

// Track page views
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title,
    });
  }
};

// Track custom events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track essay views
export const trackEssayView = (essaySlug: string, essayTitle: string) => {
  trackEvent('view_essay', 'content', essayTitle);
  trackPageView(`/essays/${essaySlug}`, essayTitle);
};

// Track button clicks
export const trackButtonClick = (buttonName: string, location: string) => {
  trackEvent('click', 'button', `${buttonName} - ${location}`);
};

// Track external link clicks
export const trackExternalLink = (url: string, linkText: string) => {
  trackEvent('click', 'external_link', `${linkText}: ${url}`);
};

// Track newsletter signup
export const trackNewsletterSignup = (source: string) => {
  trackEvent('sign_up', 'newsletter', source);
};
