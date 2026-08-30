import Hotspot from './Hotspot'
import { OutletIcon, SwitchIcon, OpenJunctionBoxIcon, OverloadedOutletIcon } from './fixtures'

export const hotspots = [
  {
    id: 'bedroom-fan-box',
    label: 'Exposed wiring at the new ceiling fan',
    isViolation: true,
    explanation: 'A fan needs a covered, fan-rated box — exposed wires are dangerous.',
    code: 'NEC 314.27',
    cx: 200,
    cy: 30,
  },
  {
    id: 'bedroom-overloaded-outlet',
    label: 'Daisy-chained power strip by the desk',
    isViolation: true,
    explanation: 'Too much plugged into one outlet is a fire risk.',
    code: 'NEC 210.52',
    cx: 345,
    cy: 290,
  },
  {
    id: 'bedroom-nightstand-outlet',
    label: 'Outlet by the nightstand',
    isViolation: false,
    explanation: "A single outlet is fine — GFCI isn't required in bedrooms.",
    cx: 255,
    cy: 300,
  },
  {
    id: 'bedroom-light-switch',
    label: 'Fan/light switch',
    isViolation: false,
    explanation: 'Controls the fan and light — wired correctly.',
    cx: 30,
    cy: 190,
  },
]

export default function Bedroom({ onTap, foundIds = [] }) {
  return (
    <svg
      viewBox="0 0 400 520"
      className="w-full h-auto select-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* ceiling */}
      <rect x="0" y="0" width="400" height="34" fill="#EAE3D5" stroke="var(--border)" strokeWidth="1" />

      {/* walls */}
      <rect x="0" y="34" width="400" height="346" fill="#F0EBE0" />

      {/* floor */}
      <rect x="0" y="380" width="400" height="140" fill="#E2D8C4" />
      <rect x="140" y="400" width="180" height="90" rx="8" fill="#EFE6D6" stroke="var(--border)" strokeWidth="1.5" />

      {/* baseboard */}
      <rect x="0" y="376" width="400" height="6" fill="var(--ink-3)" opacity="0.4" />

      {/* door, far left */}
      <g>
        <rect x="4" y="100" width="56" height="280" fill="#E2D8C4" stroke="var(--ink-2)" strokeWidth="2" />
        <circle cx="50" cy="248" r="3.5" fill="var(--ink-2)" />
      </g>

      {/* window, back wall */}
      <g>
        <rect x="300" y="70" width="80" height="100" rx="2" fill="#CFE6EE" stroke="var(--ink-2)" strokeWidth="3" />
        <line x1="340" y1="70" x2="340" y2="170" stroke="var(--ink-2)" strokeWidth="2" />
        <line x1="300" y1="120" x2="380" y2="120" stroke="var(--ink-2)" strokeWidth="2" />
      </g>

      {/* ===== bed ===== */}
      <rect x="70" y="230" width="140" height="50" rx="4" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="2" />
      <rect x="70" y="280" width="140" height="60" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="2" />
      <rect x="76" y="292" width="128" height="30" rx="4" fill="#F4A6A0" opacity="0.55" />
      <rect x="80" y="238" width="30" height="22" rx="6" fill="#F0EBE0" stroke="var(--ink-3)" strokeWidth="1.5" />
      <rect x="118" y="238" width="30" height="22" rx="6" fill="#F0EBE0" stroke="var(--ink-3)" strokeWidth="1.5" />

      {/* nightstand + lamp */}
      <rect x="220" y="310" width="40" height="70" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="2" />
      <rect x="234" y="292" width="4" height="16" fill="var(--ink-3)" />
      <path d="M 226 292 L 250 292 L 244 278 L 232 278 Z" fill="var(--yellow)" stroke="var(--ink-2)" strokeWidth="1.2" />

      {/* desk */}
      <rect x="290" y="330" width="90" height="6" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="2" />
      <rect x="296" y="336" width="6" height="44" fill="var(--ink-3)" />
      <rect x="368" y="336" width="6" height="44" fill="var(--ink-3)" />

      {/* ===== ceiling fan (just installed) ===== */}
      <g>
        <line x1="200" y1="34" x2="200" y2="44" stroke="var(--ink-2)" strokeWidth="2" />
        {[0, 120, 240].map((deg) => (
          <ellipse
            key={deg}
            cx="200"
            cy="44"
            rx="28"
            ry="5"
            fill="var(--ink-3)"
            opacity="0.55"
            transform={`rotate(${deg} 200 44)`}
          />
        ))}
        <circle cx="200" cy="44" r="5" fill="var(--ink-3)" stroke="var(--ink-2)" strokeWidth="1.5" />
      </g>

      {/* ===== hotspot fixtures (visuals) ===== */}
      <OpenJunctionBoxIcon cx={200} cy={30} />
      <OverloadedOutletIcon cx={345} cy={290} />
      <OutletIcon x={245} y={286} />
      <SwitchIcon x={20} y={176} />

      {/* ===== interactive hotspots ===== */}
      {hotspots.map((h) => (
        <Hotspot key={h.id} {...h} isFound={foundIds.includes(h.id)} onTap={onTap} />
      ))}
    </svg>
  )
}
