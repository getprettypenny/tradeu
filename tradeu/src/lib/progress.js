// Tracks which lessons the player has finished, persisted per-browser
// so unlocked lessons stay unlocked across visits. Every access is
// guarded: localStorage can throw (private browsing, disabled site
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
    // storage unavailable, progress just won't persist this session
  }
}

// Lifetime lightning-bolt count: one per correct answer, across every
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
    // storage unavailable, bolt count just won't persist this session
  }
}

// Whether this browser has already handed over a lead (name + email,
// at minimum) through ANY of the three capture surfaces: the landing
// page form, the /play signup card, or the /challenge capture sheet.
// Shared across all three so submitting once means none of them ask
// again.
const LEAD_CAPTURED_KEY = 'tradeu:lead-captured'

export function loadLeadCaptured() {
  try {
    return localStorage.getItem(LEAD_CAPTURED_KEY) === 'true'
  } catch {
    return false
  }
}

export function saveLeadCaptured() {
  try {
    localStorage.setItem(LEAD_CAPTURED_KEY, 'true')
  } catch {
    // storage unavailable, will just be asked again next visit
  }
}

// Daily play streak, Duolingo-style: consecutive calendar days with at
// least one completed quiz. Playing again the same day doesn't add to
// it; missing a day resets it to 1. Dates are stored as plain
// YYYY-MM-DD strings (local calendar day, not a timestamp) so the
// comparison is just string/day-count math, no timezone-aware parsing.
const STREAK_KEY = 'tradeu:streak'
const LAST_PLAYED_KEY = 'tradeu:last-played-date'

function todayKey() {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function daysBetween(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000
  return Math.round((new Date(b) - new Date(a)) / msPerDay)
}

export function loadStreak() {
  try {
    const n = Number(localStorage.getItem(STREAK_KEY))
    return Number.isFinite(n) && n > 0 ? n : 0
  } catch {
    return 0
  }
}

// Call once per completed quiz. Returns the up-to-date streak count.
export function recordPlaySession() {
  try {
    const today = todayKey()
    const lastPlayed = localStorage.getItem(LAST_PLAYED_KEY)
    const prevStreak = loadStreak()

    let nextStreak
    if (!lastPlayed) {
      nextStreak = 1
    } else if (lastPlayed === today) {
      nextStreak = prevStreak || 1
    } else if (daysBetween(lastPlayed, today) === 1) {
      nextStreak = prevStreak + 1
    } else {
      nextStreak = 1
    }

    localStorage.setItem(LAST_PLAYED_KEY, today)
    localStorage.setItem(STREAK_KEY, String(nextStreak))
    return nextStreak
  } catch {
    return loadStreak()
  }
}
