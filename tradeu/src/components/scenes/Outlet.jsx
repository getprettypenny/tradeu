// Decorative duplex outlet, shown above every quiz question as a
// visual anchor for the "Know Your Wires" lesson.
export default function Outlet() {
  return (
    <svg viewBox="0 0 200 240" className="w-28 h-auto mx-auto mb-4" xmlns="http://www.w3.org/2000/svg">
      {/* faceplate */}
      <rect x="20" y="10" width="160" height="220" rx="14" fill="#FBF8F2" stroke="var(--ink-2)" strokeWidth="2.5" />
      <circle cx="100" cy="24" r="2.5" fill="var(--ink-3)" />

      {/* top outlet */}
      <rect x="45" y="40" width="110" height="70" rx="8" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="2" />
      <rect x="65" y="55" width="8" height="20" rx="2" fill="var(--ink-2)" />
      <rect x="127" y="55" width="8" height="20" rx="2" fill="var(--ink-2)" />
      <circle cx="100" cy="92" r="4" fill="var(--ink-2)" />

      {/* bottom outlet */}
      <rect x="45" y="120" width="110" height="70" rx="8" fill="#FFFFFF" stroke="var(--ink-2)" strokeWidth="2" />
      <rect x="65" y="135" width="8" height="20" rx="2" fill="var(--ink-2)" />
      <rect x="127" y="135" width="8" height="20" rx="2" fill="var(--ink-2)" />
      <circle cx="100" cy="172" r="4" fill="var(--ink-2)" />

      <circle cx="100" cy="216" r="2.5" fill="var(--ink-3)" />
    </svg>
  )
}
