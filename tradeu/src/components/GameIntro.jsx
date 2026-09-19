import { useEffect, useRef, useState } from 'react'
import FeedbackSheet from './FeedbackSheet'
import BoltCounter from './BoltCounter'
import { electricalBasicsLesson } from '../lessons/electricalBasics'
import { playCountdownBeep, playFound, playGo, playSceneClear } from '../lib/sound'

// The same 3 "Spot the Violation" scenes /challenge uses, but this is
// the version shown to a fresh visitor landing straight on /play from
// an ad: a 3-2-1 countdown, a per-scene speed bonus, sound, and a
// celebratory score screen before the lead form ever appears. No way
// to skip ahead or exit mid-game, same as the rest of the app's
// strictly-linear flows -- browser back is still always available.
const scenes = electricalBasicsLesson.questions
const TOTAL_VIOLATIONS = scenes.reduce((sum, scene) => sum + scene.hotspots.filter((h) => h.isViolation).length, 0)
const SCENE_SECONDS = 25

function useCountUp(target, active) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!active) return
    setValue(0)
    if (target === 0) return
    const stepMs = 40
    const steps = Math.max(1, Math.round(600 / stepMs))
    let i = 0
    const id = setInterval(() => {
      i += 1
      setValue(Math.round((target * i) / steps))
      if (i >= steps) clearInterval(id)
    }, stepMs)
    return () => clearInterval(id)
  }, [target, active])
  return value
}

export default function GameIntro({ bolts, boltPulse, onEarnBolt, onComplete }) {
  const [phase, setPhase] = useState('countdown') // countdown | playing | score
  const [countdownValue, setCountdownValue] = useState(3)
  const [sceneIndex, setSceneIndex] = useState(0)
  const [foundIds, setFoundIds] = useState([])
  const [activeTap, setActiveTap] = useState(null)
  const [totalFound, setTotalFound] = useState(0)
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [timeLeft, setTimeLeft] = useState(SCENE_SECONDS)
  const clearedSoundPlayed = useRef(false)

  const scene = scenes[sceneIndex]
  const isLastScene = sceneIndex === scenes.length - 1
  const totalViolations = scene.hotspots.filter((h) => h.isViolation).length
  const foundViolations = scene.hotspots.filter((h) => h.isViolation && foundIds.includes(h.id)).length
  const allFound = totalViolations > 0 && foundViolations === totalViolations

  // Pre-game "3, 2, 1, GO!" countdown.
  useEffect(() => {
    if (phase !== 'countdown') return
    if (countdownValue === 0) {
      playGo()
      const t = setTimeout(() => setPhase('playing'), 500)
      return () => clearTimeout(t)
    }
    playCountdownBeep()
    const t = setTimeout(() => setCountdownValue((v) => v - 1), 700)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, countdownValue])

  // Per-scene countdown. Purely a speed-bonus signal -- reaching 0
  // never blocks or forces anything, it just means no bonus bolt.
  useEffect(() => {
    if (phase !== 'playing') return
    setTimeLeft(SCENE_SECONDS)
    const id = setInterval(() => {
      setTimeLeft((t) => (t <= 0 ? 0 : t - 1))
    }, 1000)
    return () => clearInterval(id)
  }, [phase, sceneIndex])

  // Play the scene-clear chime once, right when the last violation in
  // the room is found (not on the Continue click, so it lands at the
  // actual moment of completion).
  useEffect(() => {
    if (allFound && !clearedSoundPlayed.current) {
      clearedSoundPlayed.current = true
      playSceneClear()
    }
  }, [allFound])

  function handleTap(hotspot) {
    setActiveTap(hotspot)
    if (foundIds.includes(hotspot.id)) return
    setFoundIds((prev) => [...prev, hotspot.id])
    if (hotspot.isViolation) {
      playFound()
      onEarnBolt?.()
    }
  }

  function handleContinue() {
    const clearedInTime = timeLeft > 0
    const nextStreak = clearedInTime ? streak + 1 : 0
    setStreak(nextStreak)
    setBestStreak((b) => Math.max(b, nextStreak))
    if (clearedInTime) onEarnBolt?.() // speed bonus bolt

    const newTotalFound = totalFound + foundViolations
    setTotalFound(newTotalFound)
    if (isLastScene) {
      setPhase('score')
      return
    }
    setSceneIndex((i) => i + 1)
    setFoundIds([])
    clearedSoundPlayed.current = false
  }

  const finalScore = useCountUp(totalFound, phase === 'score')
  const timerUrgent = timeLeft <= 8

  if (phase === 'countdown') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3">
        <p className="text-sm font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
          Spot the Violation
        </p>
        <div
          key={countdownValue}
          className="pop-in text-7xl font-bold"
          style={{ fontFamily: "'Space Grotesk', sans-serif", color: countdownValue === 0 ? 'var(--green)' : 'var(--ink)' }}
        >
          {countdownValue === 0 ? 'GO!' : countdownValue}
        </div>
      </div>
    )
  }

  if (phase === 'score') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-10 gap-2">
        <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--green)' }}>
          🎮 Round Complete
        </p>
        <div className="relative flex items-center justify-center my-2">
          <div
            className="glow-pulse absolute w-20 h-20 rounded-full"
            style={{ background: 'var(--yellow)' }}
            aria-hidden="true"
          />
          <div className="relative text-5xl">⚡</div>
        </div>
        <h2 className="text-xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {finalScore}/{TOTAL_VIOLATIONS} violations found
        </h2>
        {bestStreak >= 2 && (
          <p className="text-sm font-semibold" style={{ color: '#C99400' }}>
            🔥 {bestStreak}-scene speed streak!
          </p>
        )}
        <p className="text-sm" style={{ color: 'var(--ink-2)' }}>
          Nice work spotting real code violations, like an inspector would.
        </p>

        <button
          type="button"
          onClick={onComplete}
          className="mt-6 w-full rounded-xl py-3 text-sm font-semibold"
          style={{ background: 'var(--ink)', color: '#fff' }}
        >
          Save My Progress →
        </button>
      </div>
    )
  }

  const { Scene } = scene

  return (
    <>
      <div className="flex items-center gap-3 px-5 pt-6 pb-2">
        <div className="flex-1 flex gap-1.5">
          {scenes.map((_, i) => {
            const width =
              i < sceneIndex
                ? '100%'
                : i === sceneIndex
                  ? `${totalViolations === 0 ? 100 : Math.round((foundViolations / totalViolations) * 100)}%`
                  : '0%'
            return (
              <div
                key={i}
                className="h-2 flex-1 rounded-full overflow-hidden"
                style={{ background: 'var(--border)' }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width, background: 'var(--yellow)' }}
                />
              </div>
            )
          })}
        </div>
        {streak > 0 && (
          <span className="text-sm font-semibold shrink-0" style={{ color: '#C99400' }}>
            🔥{streak}
          </span>
        )}
        <BoltCounter total={bolts} pulseKey={boltPulse} />
      </div>

      <main className="flex-1 px-4 pb-4 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between mb-1">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
            {scene.jobLabel}
          </p>
          <p
            className="text-xs font-bold tabular-nums"
            style={{ color: timerUrgent ? 'var(--red)' : 'var(--ink-3)' }}
          >
            ⏱ 0:{String(timeLeft).padStart(2, '0')}
          </p>
        </div>
        <p className="text-sm mb-3" style={{ color: 'var(--ink-2)' }}>
          {scene.narrative}
        </p>

        <Scene onTap={handleTap} foundIds={foundIds} />

        {allFound && (
          <div
            className="pop-in mt-4 rounded-xl p-4 text-sm"
            style={{ background: '#EAF7EE', color: 'var(--green)', border: '1px solid var(--green)' }}
          >
            🎉 {scene.completeMessage}
            {timeLeft > 0 && <span className="font-semibold"> +1⚡ speed bonus!</span>}
          </div>
        )}
      </main>

      <footer className="px-4 pb-6 pt-2">
        <button
          type="button"
          disabled={!allFound}
          onClick={handleContinue}
          className="w-full rounded-xl py-3 text-sm font-semibold transition-colors"
          style={{
            background: allFound ? 'var(--ink)' : 'var(--border)',
            color: allFound ? '#fff' : 'var(--ink-3)',
            cursor: allFound ? 'pointer' : 'not-allowed',
          }}
        >
          {isLastScene ? 'Finish' : 'Continue'}
        </button>
      </footer>

      <FeedbackSheet hotspot={activeTap} onClose={() => setActiveTap(null)} />
    </>
  )
}
