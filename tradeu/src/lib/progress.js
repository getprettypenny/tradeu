// Tracks which lessons the player has finished, persisted per-browser
// so unlocked lessons stay unlocked across visits. Every access is
// guarded — localStorage can throw (private browsing, disabled site
// data) and should never break the app when it does.
const STORAGE_KEY = 'tradeu:completed-lessons'

export function loadCompletedLessonIds() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function saveCompletedLessonIds(ids) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids))
  } catch {
    // storage unavailable — progress just won't persist this session
  }
}

// Lifetime lightning-bolt count — one per correct answer, across every
// lesson and every replay. Same guarded persistence pattern as above.
const BOLTS_KEY = 'tradeu:bolts'

export function loadBolts() {
  try {
    const raw = localStorage.getItem(BOLTS_KEY)
    const n = raw ? Number(raw) : 0
    return Number.isFinite(n) && n >= 0 ? n : 0
  } catch {
    return 0
  }
}

export function saveBolts(count) {
  try {
    localStorage.setItem(BOLTS_KEY, String(count))
  } catch {
    // storage unavailable — bolt count just won't persist this session
  }
}
