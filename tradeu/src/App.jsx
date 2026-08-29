import { useState } from 'react'
import Bathroom, { hotspots as bathroomHotspots } from './components/scenes/Bathroom'
import FeedbackSheet from './components/FeedbackSheet'

const TOTAL_VIOLATIONS = bathroomHotspots.filter((h) => h.isViolation).length

function App() {
  const [foundIds, setFoundIds] = useState([])
  const [activeTap, setActiveTap] = useState(null)

  const foundViolations = bathroomHotspots.filter(
    (h) => h.isViolation && foundIds.includes(h.id),
  ).length
  const allViolationsFound = foundViolations === TOTAL_VIOLATIONS

  function handleTap(hotspot) {
    setActiveTap(hotspot)
    setFoundIds((prev) => (prev.includes(hotspot.id) ? prev : [...prev, hotspot.id]))
  }

  return (
    <div className="min-h-screen w-full flex justify-center md:py-8 md:px-4" style={{ background: '#EAE3D3' }}>
      <div
        className="relative w-full max-w-[430px] min-h-screen md:min-h-0 flex flex-col overflow-hidden md:rounded-[2.5rem] md:shadow-2xl md:border"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
      >
        <header className="px-5 pt-6 pb-3 flex items-center justify-between">
          <h1
            className="text-2xl"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            TradeU
          </h1>
          <div
            className="text-sm font-medium px-3 py-1 rounded-full transition-colors"
            style={{
              background: allViolationsFound ? 'var(--green)' : 'var(--yellow)',
              color: allViolationsFound ? '#fff' : 'var(--ink)',
            }}
          >
            {foundViolations}/{TOTAL_VIOLATIONS} violations
          </div>
        </header>

        <main className="flex-1 px-4 pb-6 flex flex-col">
          <p className="text-sm mb-3" style={{ color: 'var(--ink-2)' }}>
            Tap anything on the wall that looks off to code.
          </p>

          <Bathroom onTap={handleTap} foundIds={foundIds} />

          {allViolationsFound && (
            <div
              className="mt-4 rounded-xl p-4 text-sm"
              style={{ background: '#EAF7EE', color: 'var(--green)', border: '1px solid var(--green)' }}
            >
              🎉 Nice work — you caught every violation in this bathroom.
            </div>
          )}
        </main>

        <FeedbackSheet hotspot={activeTap} onClose={() => setActiveTap(null)} />
      </div>
    </div>
  )
}

export default App
