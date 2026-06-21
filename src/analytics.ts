// analytics.ts — HitAds.ca Analytics Utility Module
// Safely fires GA4 (gtag) and Meta Pixel (fbq) events

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Fire a Google Analytics 4 event via gtag
 */
export function trackEvent(eventName: string, params?: Record<string, any>) {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, params);
    }
  } catch (e) {
    // Silently fail — analytics should never break the app
  }
}

/**
 * Fire a Meta/Facebook Pixel event
 */
export function trackPixelEvent(eventName: string, params?: Record<string, any>) {
  try {
    if (typeof window !== 'undefined' && window.fbq) {
      window.fbq('track', eventName, params);
    }
  } catch (e) {
    // Silently fail
  }
}

// ── Pre-defined Event Helpers ──

export function trackUserRegistration(method: string = 'email') {
  trackEvent('user_registration', { method });
  trackPixelEvent('CompleteRegistration', { method });
}

export function trackListingSubmission(category: string, price: number, location: string) {
  trackEvent('listing_submission', { category, price, location });
  trackPixelEvent('Purchase', { content_category: category, value: price, currency: 'CAD' });
}

export function trackSearchAction(searchTerm: string, categorySelected?: string) {
  trackEvent('search_action', { search_term: searchTerm, category_selected: categorySelected });
  trackPixelEvent('Search', { search_string: searchTerm });
}

export function trackContactClick(itemId: string | number, contactType: 'phone' | 'email' | 'message') {
  trackEvent('contact_click', { item_id: itemId, contact_type: contactType });
  trackPixelEvent('Contact', { content_ids: [itemId] });
}

export function trackCategoryNavigation(categoryName: string) {
  trackEvent('category_navigation', { category_name: categoryName });
  trackPixelEvent('ViewContent', { content_category: categoryName });
}
