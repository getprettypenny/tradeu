import { useEffect, useState } from 'react'

// Shared interactive tap target used by every room scene. Before a tap,
// every fixture, violation or not, gets the same quiet neutral marker,
// so nothing gives away which ones are wrong. After a tap, the ring
// reveals the answer: red for a violation, green for up to code.
export default function Hotspot({ id, label, isViolation, explanation, code, cx, cy, isFound, onTap }) {
  const tap = () => onTap({ id, label, isViolation, explanation, code })

  // A first-time visitor lands straight in a scene with no "how to
  // play" step, so give the tap targets a brief, more noticeable ping
  // on mount to draw the eye -- fades out on its own, no interaction
  // required, and applies equally to every hotspot so it doesn't leak
  // which one's the violation.
  const [showHint, setShowHint] = useState(true)
  useEffect(() => {
    const id = setTimeout(() => setShowHint(false), 2500)
    return () => clearTimeout(id)
  }, [])

  return (
    <g
      onClick={tap}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          tap()
        }
      }}
      style={{ cursor: 'pointer' }}
      role="button"
      tabIndex={0}
      aria-label={label}
    >
      {/* transparent tap area, larger than the visual so it's easy to hit */}
      <circle cx={cx} cy={cy} r={22} fill="transparent" />

      {isFound ? (
        <circle
          cx={cx}
          cy={cy}
          r={18}
          fill="none"
          stroke={isViolation ? 'var(--red)' : 'var(--green)'}
          strokeWidth={2.5}
        />
      ) : (
        <>
          {showHint && (
            <circle cx={cx} cy={cy} r={18} fill="none" stroke="var(--yellow)" strokeWidth={2} className="hotspot-hint" />
          )}
          <circle
            cx={cx}
            cy={cy}
            r={18}
            fill="none"
            stroke="var(--ink-3)"
            strokeWidth={2}
            strokeDasharray="3 4"
            opacity={0.55}
            className="hotspot-pulse"
          />
        </>
      )}
    </g>
  )
}
