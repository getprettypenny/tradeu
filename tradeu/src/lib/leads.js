// Local, per-browser lead log used only by the landing page's demo CRM
// view. This is NOT a real shared backend — it only ever reflects
// whatever this one browser has submitted, plus the seeded demo rows
// below. The real, cross-visitor lead list lives in Formspree
// (see lib/formspree.js) once a submission actually goes out.
const STORAGE_KEY = 'tradeu:leads-demo'

const SEED_LEADS = [
  {
    id: 1,
    name: 'Marcus T.',
    email: 'marcus@example.com',
    zip: '90025',
    trade: 'electrical',
    status: 'New',
    notes: '',
    programMatch: 'pending',
    date: 'Aug 14, 2026',
  },
  {
    id: 2,
    name: 'Sofia R.',
    email: 'sofia@example.com',
    zip: '90401',
    trade: 'plumbing',
    status: 'Contacted',
    notes: 'Called — interested in SMC program',
    programMatch: 'pending',
    date: 'Aug 13, 2026',
  },
  {
    id: 3,
    name: 'James W.',
    email: 'jamesw@example.com',
    zip: '93101',
    trade: 'not-sure',
    status: 'New',
    notes: '',
    programMatch: 'pending',
    date: 'Aug 12, 2026',
  },
]

export function loadLeads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      saveLeads(SEED_LEADS)
      return SEED_LEADS
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveLeads(leads) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
  } catch {
    // storage unavailable — demo CRM just won't persist this session
  }
}

export function addLead(lead) {
  const leads = [{ ...lead, id: Date.now() }, ...loadLeads()]
  saveLeads(leads)
  return leads[0]
}

export function updateLead(id, patch) {
  const leads = loadLeads().map((l) => (l.id === id ? { ...l, ...patch } : l))
  saveLeads(leads)
}

export function clearLeads() {
  saveLeads([])
}
