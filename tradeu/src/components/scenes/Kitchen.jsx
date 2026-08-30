import Hotspot from './Hotspot'
import { OutletIcon, GfciOutletIcon, SwitchIcon, OverloadedOutletIcon } from './fixtures'

export const hotspots = [
  {
    id: 'kitchen-sink-outlet',
    label: 'Standard outlet near the sink',
    isViolation: true,
    explanation: 'Outlets near a kitchen sink need GFCI protection.',
    code: 'NEC 210.8',
    cx: 128,
    cy: 285,
  },
  {
    id: 'kitchen-overloaded-outlet',
    label: 'Daisy-chained power strip',
    isViolation: true,
    explanation: 'Stacked power strips can overload the circuit.',
    code: 'NEC 210.52',
    cx: 258,
    cy: 300,
  },
  {
    id: 'kitchen-gfci-outlet',
    label: 'GFCI outlet on the counter',
    isViolation: false,
    explanation: "GFCI protected and clear of the sink — good to go.",
    cx: 190,
    cy: 285,
  },
  {
    id: 'kitchen-light-switch',
    label: 'Light switch',
    isViolation: false,
    explanation: 'Just a light switch — no GFCI needed.',
    cx: 372,
    cy: 190,
  },
]

export default function Kitchen({ onTap, foundIds = [] }) {
  return (
    <svg
      viewBox="0 0 400 520"
      className="w-full h-auto select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ceiling */}
      <rect x="0" y="0" width="400" height="34" fill="#EAE3D5" stroke="var(--border)" strokeWidth="1" />

      {/* light fixture */}
      <g>
        <rect x="170" y="10" width="60" height="12" rx="6" fill="var(--yellow)" stroke="var(--ink)" strokeWidth="1.5" />
      </g>

      {/* walls */}
      <rect x="0" y="34" width="400" height="346" fill="#F0EBE0" />

      {/* backsplash tile behind counter */}
      <rect x="0" y="220" width="400" height="100" fill="#E7E1D6" />
      <g stroke="var(--border)" strokeWidth="1">
        {Array.from({ length: 20 }).map((_, i) => (
          <line key={`btile-${i}`} x1={i * 20} y1="220" x2={i * 20} y2="320" />
        ))}
        <line x1="0" y1="270" x2="400" y2="270" />
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

      {/* ===== refrigerator, far left ===== */}
      <rect x="8" y="150" width="66" height="230" rx="3" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="2" />
      <line x1="8" y1="220" x2="74" y2="220" stroke="var(--ink-2)" strokeWidth="1.5" />
      <rect x="14" y="180" width="3" height="24" rx="1.5" fill="var(--ink-3)" />
      <rect x="14" y="240" width="3" height="18" rx="1.5" fill="var(--ink-3)" />

      {/* ===== counter run with cabinets ===== */}
      <rect x="90" y="300" width="220" height="80" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="2" />
      <rect x="90" y="300" width="220" height="10" fill="#E5DFD2" stroke="var(--ink-2)" strokeWidth="1.5" />
      {Array.from({ length: 4 }).map((_, i) => (
        <line
          key={`cab-${i}`}
          x1={90 + i * 55}
          y1="312"
          x2={90 + i * 55}
          y2="380"
          stroke="var(--ink-3)"
          strokeWidth="1.5"
        />
      ))}
      <circle cx="112" cy="345" r="2.2" fill="var(--ink-2)" />
      <circle cx="123" cy="345" r="2.2" fill="var(--ink-2)" />

      {/* sink cut into the counter */}
      <rect x="140" y="304" width="60" height="16" rx="6" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="2" />
      <path
        d="M 170 300 L 170 288 Q 170 282 176 282 L 182 282"
        fill="none"
        stroke="var(--ink-2)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* ===== range, far right ===== */}
      <rect x="330" y="300" width="62" height="80" rx="2" fill="#EDEAE4" stroke="var(--ink-2)" strokeWidth="2" />
      <rect x="336" y="306" width="50" height="16" rx="2" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="1.5" />
      <circle cx="346" cy="332" r="6" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <circle cx="376" cy="332" r="6" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <circle cx="346" cy="352" r="6" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />
      <circle cx="376" cy="352" r="6" fill="none" stroke="var(--ink-2)" strokeWidth="1.5" />

      {/* ===== hotspot fixtures (visuals) ===== */}
      <OutletIcon x={118} y={271} />
      <OverloadedOutletIcon cx={258} cy={300} />
      <GfciOutletIcon x={180} y={271} />
      <SwitchIcon x={362} y={176} />

      {/* ===== interactive hotspots ===== */}
      {hotspots.map((h) => (
        <Hotspot key={h.id} {...h} isFound={foundIds.includes(h.id)} onTap={onTap} />
      ))}
    </svg>
  )
}
