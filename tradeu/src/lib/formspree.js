// Shared lead-capture endpoint, used by both the landing page's signup
// form and the in-game "more lessons" prompt after finishing every
// lesson. Each caller adds its own `source` field so submissions from
// the two forms are distinguishable in the Formspree inbox.
export const FORM_ENDPOINT = 'https://formspree.io/f/mzebznla'

export async function submitLead(fields) {
  const res = await fetch(FORM_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(fields),
  })
  if (!res.ok) throw new Error('Lead submission failed')
}
