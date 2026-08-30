// Shared interactive tap target used by every room scene. Before a tap,
// every fixture — violation or not — gets the same quiet neutral marker,
// so nothing gives away which ones are wrong. After a tap, the ring
// reveals the answer: red for a violation, green for up to code.
export default function Hotspot({ id, label, isViolation, explanation, code, cx, cy, isFound, onTap }) {
  const tap = () => onTap({ id, label, isViolation, explanation, code })

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
      )}
    </g>
  )
}
