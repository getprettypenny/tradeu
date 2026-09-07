// Shared lead-capture endpoint, used by the landing page's form, the
// old in-game "more lessons" prompt, and the new challenge flow's
// capture sheet. Each caller adds its own `source` field so
// submissions are distinguishable in the Formspree inbox.
//
// Reads from VITE_FORMSPREE_URL (set it in .env.local for dev, and as
// an environment variable on whatever host you deploy to) with a
// fallback to the endpoint already in use, so nothing breaks if the
// env var isn't set. Note this isn't a secret either way: Vite
// inlines VITE_-prefixed vars into the client bundle at build time,
// so the URL is visible in the shipped JS regardless of where it's
// configured from.
import { getUtmParams } from './utm'

export const FORM_ENDPOINT = import.meta.env.VITE_FORMSPREE_URL || 'https://formspree.io/f/mzebznla'

// Every submission automatically carries this browser's first-touch UTM
// attribution (if any), so a lead can be traced back to the ad/campaign
// that brought it in without every call site having to remember to add
// it. Explicit fields win over stale utm data in the unlikely case of a
// name collision.
export async function submitLead(fields) {
  const res = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ ...getUtmParams(), ...fields }),
  })
  if (!res.ok) throw new Error('Lead submission failed')
}
