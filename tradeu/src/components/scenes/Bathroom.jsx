const HOTSPOTS = [
  {
    id: 'sink-outlet',
    label: 'Standard outlet near sink',
    isViolation: true,
    cx: 208,
    cy: 300,
  },
  {
    id: 'toilet-junction-box',
    label: 'Open junction box above toilet',
    isViolation: true,
    cx: 332,
    cy: 150,
  },
  {
    id: 'door-gfci-outlet',
    label: 'GFCI outlet near door',
    isViolation: false,
    cx: 40,
    cy: 300,
  },
  {
    id: 'light-switch',
    label: 'Light switch',
    isViolation: false,
    cx: 40,
    cy: 190,
  },
]

function Hotspot({ id, label, isViolation, cx, isFound, cy, onTap }) {
  const found = isFound
  return (
    <g
      onClick={() => onTap({ id, label, isViolation })}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label={label}
    >
      {/* transparent tap area, larger than the visual so it's easy to hit */}
      <circle cx={cx} cy={cy} r={22} fill="transparent" />

      {found && (
        <circle
          cx={cx}
          cy={cy}
          r={18}
          fill="none"
          stroke="var(--green)"
          strokeWidth={2.5}
        />
      )}

      {!found && isViolation && (
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

export default function Bathroom({ onTap, foundIds = [] }) {
  return (
    <svg
      viewBox="0 0 400 520"
      className="w-full h-auto select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <style>
        {`
          @keyframes hotspot-dash {
            from { stroke-dashoffset: 0; }
            to { stroke-dashoffset: -14; }
          }
          .hotspot-pulse {
            animation: hotspot-dash 1s linear infinite;
          }
        `}
      </style>

      {/* ceiling */}
      <rect x="0" y="0" width="400" height="34" fill="#EAE3D5" stroke="var(--border)" strokeWidth="1" />

      {/* light fixture */}
      <g>
        <circle cx="200" cy="17" r="12" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="1.5" />
        <circle cx="200" cy="17" r="4" fill="var(--ink)" opacity="0.15" />
      </g>

      {/* walls */}
      <rect x="0" y="34" width="400" height="346" fill="#F0EBE0" />

      {/* wall tile wainscot behind sink/toilet */}
      <rect x="0" y="220" width="400" height="160" fill="#E5DFD2" />
      <g stroke="var(--border)" strokeWidth="1">
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`wtile-${i}`} x1={i * 40} y1="220" x2={i * 40} y2="380" />
        ))}
        <line x1="0" y1="300" x2="400" y2="300" />
      </g>

      {/* floor */}
      <rect x="0" y="380" width="400" height="140" fill="#DAD2C2" />
      <g stroke="var(--border)" strokeWidth="1">
        {Array.from({ length: 10 }).map((_, i) => (
          <line key={`ftile-${i}`} x1={i * 40} y1="380" x2={i * 40} y2="520" />
        ))}
        <line x1="0" y1="450" x2="400" y2="450" />
      </g>

      {/* baseboard */}
      <rect x="0" y="376" width="400" height="6" fill="var(--ink-3)" opacity="0.4" />

      {/* door, far left */}
      <g>
        <rect x="4" y="110" width="66" height="270" fill="#E2D8C4" stroke="var(--ink-2)" strokeWidth="2" />
        <circle cx="60" cy="248" r="3.5" fill="var(--ink-2)" />
      </g>

      {/* ===== sink ===== */}
      {/* mirror */}
      <rect x="90" y="60" width="100" height="80" rx="4" fill="#CFE6EE" stroke="var(--ink-2)" strokeWidth="3" />
      <rect x="98" y="68" width="30" height="64" fill="#ffffff" opacity="0.25" />

      {/* faucet */}
      <path
        d="M 140 232 L 140 218 Q 140 210 148 210 L 156 210"
        fill="none"
        stroke="var(--ink-2)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <circle cx="126" cy="228" r="3" fill="var(--ink-2)" />
      <circle cx="154" cy="228" r="3" fill="var(--ink-2)" />

      {/* basin */}
      <rect x="90" y="230" width="100" height="22" rx="10" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="2" />

      {/* cabinet */}
      <rect x="82" y="252" width="116" height="86" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="2" />
      <rect x="90" y="260" width="48" height="70" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <rect x="142" y="260" width="48" height="70" fill="none" stroke="var(--ink-3)" strokeWidth="1.5" />
      <circle cx="134" cy="295" r="2.5" fill="var(--ink-2)" />
      <circle cx="146" cy="295" r="2.5" fill="var(--ink-2)" />

      {/* drain pipe peeking out below cabinet */}
      <path
        d="M 140 338 L 140 352 Q 140 360 148 360 L 158 360 L 158 378"
        fill="none"
        stroke="var(--ink-3)"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* ===== toilet ===== */}
      <rect x="300" y="240" width="66" height="46" rx="3" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="2" />
      <rect x="296" y="230" width="74" height="12" rx="3" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="2" />
      <path
        d="M 300 286 L 300 300 Q 300 336 333 336 Q 366 336 366 300 L 366 286 Z"
        fill="#FFFFFF"
        stroke="var(--ink-2)"
        strokeWidth="2"
      />
      <ellipse cx="333" cy="292" rx="24" ry="12" fill="none" stroke="var(--ink-2)" strokeWidth="2" />

      {/* ===== hotspot fixtures (visuals) ===== */}
      {/* standard outlet near sink */}
      <g>
        <rect x="198" y="291" width="20" height="28" rx="2" fill="#FBF8F2" stroke="var(--ink-2)" strokeWidth="1.5" />
        <rect x="202" y="296" width="3" height="7" fill="var(--ink-2)" />
        <rect x="211" y="296" width="3" height="7" fill="var(--ink-2)" />
        <circle cx="208" cy="311" r="1.6" fill="var(--ink-2)" />
      </g>

      {/* open junction box above toilet, no cover plate */}
      <g>
        <circle cx="332" cy="150" r="10" fill="none" stroke="var(--ink-2)" strokeWidth="2" />
        <path d="M 332 150 L 322 142" stroke="var(--yellow)" strokeWidth="1.5" />
        <path d="M 332 150 L 340 141" stroke="var(--ink)" strokeWidth="1.5" />
        <path d="M 332 150 L 338 159" stroke="var(--red)" strokeWidth="1.5" />
      </g>

      {/* GFCI outlet near door */}
      <g>
        <rect x="30" y="291" width="20" height="28" rx="2" fill="#FBF8F2" stroke="var(--ink-2)" strokeWidth="1.5" />
        <rect x="33" y="295" width="6" height="4" fill="var(--blue)" />
        <rect x="41" y="295" width="6" height="4" fill="var(--red)" />
        <rect x="34" y="303" width="3" height="7" fill="var(--ink-2)" />
        <rect x="43" y="303" width="3" height="7" fill="var(--ink-2)" />
      </g>

      {/* light switch */}
      <g>
        <rect x="30" y="181" width="20" height="28" rx="2" fill="#FBF8F2" stroke="var(--ink-2)" strokeWidth="1.5" />
        <rect x="36" y="188" width="8" height="14" rx="1.5" fill="var(--ink-3)" stroke="var(--ink-2)" strokeWidth="1" />
      </g>

      {/* ===== interactive hotspots ===== */}
      {HOTSPOTS.map((h) => (
        <Hotspot key={h.id} {...h} isFound={foundIds.includes(h.id)} onTap={onTap} />
      ))}
    </svg>
  )
}
