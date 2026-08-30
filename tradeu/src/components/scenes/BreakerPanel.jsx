// Decorative breaker panel, shown above every question in the
// GFCI/AFCI lesson. This lesson is about protection types, not
// wires, so it gets its own visual identity instead of reusing Outlet.
export default function BreakerPanel() {
  const breakers = [0, 1, 2, 3]
  return (
    <svg viewBox="0 0 200 200" className="w-28 h-auto mx-auto mb-4" xmlns="http://www.w3.org/2000/svg">
      {/* panel door */}
      <rect x="15" y="10" width="170" height="180" rx="10" fill="#FBF8F2" stroke="var(--ink-2)" strokeWidth="2.5" />
      <circle cx="100" cy="22" r="2.5" fill="var(--ink-3)" />

      {/* main breaker up top */}
      <rect x="70" y="34" width="60" height="20" rx="3" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="1.75" />
      <rect x="94" y="38" width="12" height="12" rx="2" fill="var(--ink-2)" />

      {/* breaker rows */}
      {breakers.map((row) => (
        <g key={row}>
          <rect x="34" y={68 + row * 26} width="58" height="18" rx="2.5" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="1.5" />
          <rect
            x="56"
            y={71 + row * 26}
            width="10"
            height="12"
            rx="2"
            fill={row === 1 ? 'var(--green)' : 'var(--ink-3)'}
          />
          <rect x="108" y={68 + row * 26} width="58" height="18" rx="2.5" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="1.5" />
          <rect
            x="130"
            y={71 + row * 26}
            width="10"
            height="12"
            rx="2"
            fill={row === 2 ? 'var(--green)' : 'var(--ink-3)'}
          />
        </g>
      ))}
    </svg>
  )
}
