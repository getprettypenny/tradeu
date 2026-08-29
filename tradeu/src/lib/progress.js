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
