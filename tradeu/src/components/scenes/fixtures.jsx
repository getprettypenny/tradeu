// Small, non-interactive fixture drawings shared across room scenes.
// Each interactive Hotspot is layered on top of one of these at the
// same coordinates, so keeping the fixture and its tap target as
// separate pieces is what lets a scene reuse the same visual for both
// violation and compliant states.

// Standard duplex outlet, no GFCI markings. x/y is the top-left corner.
export function OutletIcon({ x, y }) {
  return (
    <g>
      <rect x={x} y={y} width="20" height="28" rx="2" fill="#FBF8F2" stroke="var(--ink-2)" strokeWidth="1.5" />
      <rect x={x + 4} y={y + 5} width="3" height="7" fill="var(--ink-2)" />
      <rect x={x + 13} y={y + 5} width="3" height="7" fill="var(--ink-2)" />
      <circle cx={x + 10} cy={y + 20} r="1.6" fill="var(--ink-2)" />
    </g>
  )
}

// GFCI outlet with test/reset buttons. x/y is the top-left corner.
export function GfciOutletIcon({ x, y }) {
  return (
    <g>
      <rect x={x} y={y} width="20" height="28" rx="2" fill="#FBF8F2" stroke="var(--ink-2)" strokeWidth="1.5" />
      <rect x={x + 3} y={y + 4} width="6" height="4" fill="var(--blue)" />
      <rect x={x + 11} y={y + 4} width="6" height="4" fill="var(--red)" />
      <rect x={x + 4} y={y + 12} width="3" height="7" fill="var(--ink-2)" />
      <rect x={x + 13} y={y + 12} width="3" height="7" fill="var(--ink-2)" />
    </g>
  )
}

// Wall switch plate. x/y is the top-left corner.
export function SwitchIcon({ x, y }) {
  return (
    <g>
      <rect x={x} y={y} width="20" height="28" rx="2" fill="#FBF8F2" stroke="var(--ink-2)" strokeWidth="1.5" />
      <rect x={x + 6} y={y + 7} width="8" height="14" rx="1.5" fill="var(--ink-3)" stroke="var(--ink-2)" strokeWidth="1" />
    </g>
  )
}

// Open junction/ceiling box, exposed splices, no cover plate. cx/cy is the center.
export function OpenJunctionBoxIcon({ cx, cy }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r="10" fill="none" stroke="var(--ink-2)" strokeWidth="2" />
      <path d={`M ${cx} ${cy} L ${cx - 10} ${cy - 8}`} stroke="var(--yellow)" strokeWidth="1.5" />
      <path d={`M ${cx} ${cy} L ${cx + 8} ${cy - 9}`} stroke="var(--ink)" strokeWidth="1.5" />
      <path d={`M ${cx} ${cy} L ${cx + 6} ${cy + 9}`} stroke="var(--red)" strokeWidth="1.5" />
    </g>
  )
}

// A wall outlet feeding a crowded, daisy-chained power strip. cx/cy is
// the center of the outlet at the top of the stack.
export function OverloadedOutletIcon({ cx, cy }) {
  const top = cy - 17
  const left = cx - 22

  return (
    <g>
      <rect x={cx - 10} y={top} width="20" height="14" rx="2" fill="#FBF8F2" stroke="var(--ink-2)" strokeWidth="1.5" />
      <rect x={cx - 6} y={top + 3} width="3" height="6" fill="var(--ink-2)" />
      <rect x={cx + 3} y={top + 3} width="3" height="6" fill="var(--ink-2)" />

      <path d={`M ${cx} ${top + 14} L ${cx} ${top + 20}`} stroke="var(--ink-3)" strokeWidth="2" />

      <rect x={left} y={top + 20} width="44" height="11" rx="2.5" fill="#FFFFFF" stroke="var(--red)" strokeWidth="1.5" />
      <circle cx={left + 7} cy={top + 25.5} r="1.4" fill="var(--red)" />
      <circle cx={left + 16} cy={top + 25.5} r="1.4" fill="var(--red)" />
      <circle cx={left + 25} cy={top + 25.5} r="1.4" fill="var(--red)" />
      <circle cx={left + 34} cy={top + 25.5} r="1.4" fill="var(--red)" />

      {/* a second cord looping back into the same strip, implying daisy-chaining */}
      <path
        d={`M ${left + 34} ${top + 31} Q ${left + 44} ${top + 40} ${left + 4} ${top + 31}`}
        fill="none"
        stroke="var(--ink-3)"
        strokeWidth="1.5"
      />
    </g>
  )
}
