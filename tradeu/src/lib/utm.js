// First-touch UTM attribution. Captures utm_* params from the URL the
// first time this browser shows up with any, and remembers them so
// every lead this browser eventually submits -- whether that's on this
// visit or three days later after finishing the lesson path -- carries
// the campaign/ad that actually brought them in.
//
// Later visits with different (or no) utm params never overwrite an
// attribution that's already stored: first-touch is what you want for
// "which ad worked," not "whatever URL happened to load last."
const UTM_KEY = 'tradeu:utm'
const UTM_FIELDS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term']

// Call once on app load. No-op if this browser is already attributed,
// or if the current URL has no utm_* params at all.
export function captureUtmParams() {
  try {
    if (localStorage.getItem(UTM_KEY)) return

    const params = new URLSearchParams(window.location.search)
    const found = {}
    for (const field of UTM_FIELDS) {
      const value = params.get(field)
      if (value) found[field] = value
    }
    if (Object.keys(found).length > 0) {
      localStorage.setItem(UTM_KEY, JSON.stringify(found))
    }
  } catch {
    // storage unavailable or URL parsing failed: submissions just won't
    // carry UTM attribution this session
  }
}

// Returns the stored utm_* fields (an empty object if there are none),
// for merging into a Formspree submission.
export function getUtmParams() {
  try {
    const raw = localStorage.getItem(UTM_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}
