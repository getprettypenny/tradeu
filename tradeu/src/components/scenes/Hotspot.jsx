// Shared interactive tap target used by every room scene. Draws a
// transparent hit area over a fixture, plus a red pulsing ring on
// unresolved violations that turns into a solid green ring once found.
export default function Hotspot({ id, label, isViolation, explanation, cx, cy, isFound, onTap }) {
  const tap = () => onTap({ id, label, isViolation, explanation })

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

      {isFound && (
        <circle cx={cx} cy={cy} r={18} fill="none" stroke="var(--green)" strokeWidth={2.5} />
      )}

      {!isFound && isViolation && (
        <circle
          cx={cx}
          cy={cy}
          r={18}
          fill="none"
          stroke="var(--red)"
          strokeWidth={2.5}
          strokeDasharray="4 3"
          className="hotspot-pulse"
        />
      )}
    </g>
  )
}
