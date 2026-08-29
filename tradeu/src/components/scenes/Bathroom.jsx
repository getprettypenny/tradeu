import Hotspot from './Hotspot'
import { OutletIcon, GfciOutletIcon, SwitchIcon, OpenJunctionBoxIcon } from './fixtures'

export const hotspots = [
  {
    id: 'bathroom-sink-outlet',
    label: 'Standard outlet near sink',
    isViolation: true,
    explanation:
      'Outlets within 3 ft of a sink need GFCI protection. A standard outlet here is a shock hazard (NEC 210.8).',
    cx: 208,
    cy: 300,
  },
  {
    id: 'bathroom-toilet-junction-box',
    label: 'Open junction box above toilet',
    isViolation: true,
    explanation:
      'Junction boxes must stay covered. An open box with exposed splices is a shock and fire hazard (NEC 314.25).',
    cx: 332,
    cy: 150,
  },
  {
    id: 'bathroom-door-gfci-outlet',
    label: 'GFCI outlet near door',
    isViolation: false,
    explanation:
      'This outlet is GFCI-protected, exactly what a bathroom circuit needs. Nothing to flag here.',
    cx: 40,
    cy: 300,
  },
  {
    id: 'bathroom-light-switch',
    label: 'Light switch',
    isViolation: false,
    explanation:
      "A standard switch is fine here since it's out of reach of any water source.",
    cx: 40,
    cy: 190,
  },
]

export default function Bathroom({ onTap, foundIds = [] }) {
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
      <OutletIcon x={198} y={291} />
      <OpenJunctionBoxIcon cx={332} cy={150} />
      <GfciOutletIcon x={30} y={291} />
      <SwitchIcon x={30} y={181} />

      {/* ===== interactive hotspots ===== */}
      {hotspots.map((h) => (
        <Hotspot key={h.id} {...h} isFound={foundIds.includes(h.id)} onTap={onTap} />
      ))}
    </svg>
  )
}
