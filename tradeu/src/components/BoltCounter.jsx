import { useEffect, useRef, useState } from 'react'

// Shows the lifetime bolt total. pulseKey is a monotonically increasing
// counter owned by the app, incremented once per bolt earned, but
// since it's global, a freshly mounted counter (e.g. entering a new
// lesson) would otherwise see a non-zero value on its very first
// render and play a false "+1" for a bolt it didn't just earn. The ref
// below seeds itself with whatever pulseKey already was at mount time,
// so the pop only fires on a genuine change afterward.
export default function BoltCounter({ total, pulseKey }) {
  const seen = useRef(pulseKey)
  const [showPop, setShowPop] = useState(false)

  useEffect(() => {
    if (pulseKey === seen.current) return
    seen.current = pulseKey
    setShowPop(true)
    const timer = setTimeout(() => setShowPop(false), 900)
    return () => clearTimeout(timer)
  }, [pulseKey])

  return (
    <div
      className="relative inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-sm font-semibold shrink-0"
      style={{ background: '#FFF6D6', color: '#8A6D00' }}
    >
      <span aria-hidden="true">⚡</span>
      <span>{total}</span>
      {showPop && (
        <span key={pulseKey} className="bolt-pop" aria-hidden="true">
          +1⚡
        </span>
      )}
    </div>
  )
}
