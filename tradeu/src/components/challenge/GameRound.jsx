import { useState } from 'react'
import FeedbackSheet from '../FeedbackSheet'
import BoltCounter from '../BoltCounter'
import { electricalBasicsLesson } from '../../lessons/electricalBasics'

// The 3 "Spot the Violation" scenes, run back to back with no way to
// skip ahead — no exit control here by design, per the strictly
// linear flow. Browser back is still always available.
const scenes = electricalBasicsLesson.questions

export default function GameRound({ bolts, boltPulse, onEarnBolt, onComplete }) {
  const [sceneIndex, setSceneIndex] = useState(0)
  const [foundIds, setFoundIds] = useState([])
  const [activeTap, setActiveTap] = useState(null)
  const [totalFound, setTotalFound] = useState(0)

  const scene = scenes[sceneIndex]
  const isLastScene = sceneIndex === scenes.length - 1
  const totalViolations = scene.hotspots.filter((h) => h.isViolation).length
  const foundViolations = scene.hotspots.filter((h) => h.isViolation && foundIds.includes(h.id)).length
  const allFound = totalViolations > 0 && foundViolations === totalViolations

  function handleTap(hotspot) {
    setActiveTap(hotspot)
    if (foundIds.includes(hotspot.id)) return
    setFoundIds((prev) => [...prev, hotspot.id])
    if (hotspot.isViolation) onEarnBolt?.()
  }

  function handleContinue() {
    const newTotalFound = totalFound + foundViolations
    if (isLastScene) {
      onComplete(newTotalFound)
      return
    }
    setTotalFound(newTotalFound)
    setSceneIndex((i) => i + 1)
    setFoundIds([])
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
        <BoltCounter total={bolts} pulseKey={boltPulse} />
      </div>

      <main className="flex-1 px-4 pb-4 flex flex-col overflow-y-auto">
        <p
          className="text-xs font-semibold uppercase tracking-wide mb-1"
          style={{ color: 'var(--ink-3)' }}
        >
          {scene.jobLabel}
        </p>
        <p className="text-sm mb-3" style={{ color: 'var(--ink-2)' }}>
          {scene.narrative}
        </p>

        <Scene onTap={handleTap} foundIds={foundIds} />

        {allFound && (
          <div
            className="mt-4 rounded-xl p-4 text-sm"
            style={{ background: '#EAF7EE', color: 'var(--green)', border: '1px solid var(--green)' }}
          >
            🎉 {scene.completeMessage}
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
