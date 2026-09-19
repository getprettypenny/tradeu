// Lightweight sound effects synthesized with the Web Audio API -- no
// audio files to source, license, or ship. Every function is a no-op if
// AudioContext isn't available, and any runtime error (autoplay policy
// not yet unlocked by a user gesture, browser quirks) is swallowed
// silently. Sound is a nice-to-have here; it should never be able to
// break gameplay.
let ctx = null

function getContext() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext
    if (!AudioContextClass) return null
    ctx = new AudioContextClass()
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {})
  return ctx
}

function tone({ frequency, duration, type = 'sine', volume = 0.15, delay = 0 }) {
  const audioCtx = getContext()
  if (!audioCtx) return
  try {
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()
    osc.type = type
    osc.frequency.value = frequency
    const startTime = audioCtx.currentTime + delay
    gain.gain.setValueAtTime(volume, startTime)
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)
    osc.connect(gain)
    gain.connect(audioCtx.destination)
    osc.start(startTime)
    osc.stop(startTime + duration)
  } catch {
    // audio failed for some reason: silently skip, never breaks gameplay
  }
}

// The 3-2-1 pre-game countdown tick.
export function playCountdownBeep() {
  tone({ frequency: 440, duration: 0.15, type: 'square', volume: 0.1 })
}

// The "GO!" that ends the countdown.
export function playGo() {
  tone({ frequency: 660, duration: 0.25, type: 'square', volume: 0.15 })
}

// A violation tapped and found.
export function playFound() {
  tone({ frequency: 880, duration: 0.12, type: 'sine', volume: 0.12 })
}

// A scene fully cleared: short ascending three-note chime.
export function playSceneClear() {
  tone({ frequency: 523.25, duration: 0.15, volume: 0.12 })
  tone({ frequency: 659.25, duration: 0.15, volume: 0.12, delay: 0.12 })
  tone({ frequency: 783.99, duration: 0.25, volume: 0.14, delay: 0.24 })
}
