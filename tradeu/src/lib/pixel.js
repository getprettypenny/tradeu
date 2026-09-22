// Meta (Facebook/Instagram) Pixel, loaded only when VITE_META_PIXEL_ID is
// set. Absent the env var this whole module is a no-op: nothing loads,
// nothing tracks, dev and any build without the var are unaffected.
//
// Get a pixel ID from Meta Events Manager (Business Suite -> Events
// Manager -> Connect a data source -> Web -> Meta Pixel) and set it as
// VITE_META_PIXEL_ID before building for production. Since Vite inlines
// VITE_-prefixed vars into the client bundle, this was never a secret
// either way.
const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID

let initialized = false

// Injects the standard Meta Pixel base snippet and fires the first
// PageView. Call once, on app mount.
export function initPixel() {
  if (!PIXEL_ID || initialized || typeof window === 'undefined') return
  initialized = true

  /* eslint-disable */
  ;(function (f, b, e, v, n, t, s) {
    if (f.fbq) return
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
    }
    if (!f._fbq) f._fbq = n
    n.push = n
    n.loaded = true
    n.version = '2.0'
    n.queue = []
    t = b.createElement(e)
    t.async = true
    t.src = v
    s = b.getElementsByTagName(e)[0]
    s.parentNode.insertBefore(t, s)
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')
  /* eslint-enable */

  window.fbq('init', PIXEL_ID)
  window.fbq('track', 'PageView')
}

// Call on every client-side route change after the first (initPixel()
// already sent the first PageView above), so a full walk through the
// SPA -- landing page -> /play -> a lesson -- shows up as separate
// views in Meta's reporting instead of just the one initial load.
export function trackPageView() {
  if (!PIXEL_ID || typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', 'PageView')
}

// Call right after a lead capture succeeds (landing page form, /play
// signup card, /challenge capture sheet) so Meta can optimize ad
// delivery toward people likely to convert, and so campaign reporting
// shows real conversions instead of just clicks. `source` matches the
// same string already passed to submitLead() at each call site.
export function trackLead(source) {
  if (!PIXEL_ID || typeof window === 'undefined' || !window.fbq) return
  window.fbq('track', 'Lead', source ? { content_name: source } : undefined)
}

// Custom funnel-step events (Meta's own "standard" events don't cover
// mid-funnel game milestones). Each distinct `eventName` shows up as
// its own row with its own count in Events Manager, so a handful of
// well-placed calls turns "140 PageViews, 0 Leads, no idea why" into
// an actual step-by-step drop-off funnel without any extra Meta-side
// configuration.
export function trackCustom(eventName, params) {
  if (!PIXEL_ID || typeof window === 'undefined' || !window.fbq) return
  window.fbq('trackCustom', eventName, params)
}
