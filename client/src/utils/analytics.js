const ANALYTICS_ENABLED = import.meta.env.VITE_ANALYTICS_ID;

export function trackPageView(page) {
  if (!ANALYTICS_ENABLED) return;
  try {
    const data = { page, timestamp: new Date().toISOString(), referrer: document.referrer, userAgent: navigator.userAgent.slice(0, 120) };
    if (typeof gtag === "function") gtag("config", ANALYTICS_ENABLED, { page_path: page });
    navigator.sendBeacon?.("/api/log/page-view", JSON.stringify(data));
  } catch {}
}

export function trackEvent(category, action, label) {
  if (!ANALYTICS_ENABLED) return;
  try {
    if (typeof gtag === "function") gtag("event", action, { event_category: category, event_label: label });
  } catch {}
}
