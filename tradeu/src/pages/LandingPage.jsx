import { Link } from 'react-router-dom'

// Placeholder landing page — swap this out for the real design once
// it's ready. Kept intentionally simple: headline, pitch, one CTA into
// the game at /play. Not wrapped in the phone-card shell GamePage uses,
// since a marketing landing page is typically a normal full-width page.
export default function LandingPage() {
  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'var(--bg)' }}
    >
      <svg viewBox="0 0 100 100" className="w-16 h-16 mb-6">
        <circle cx="50" cy="50" r="48" fill="var(--yellow)" />
        <path d="M 55 14 L 30 54 L 46 54 L 41 88 L 72 44 L 52 44 Z" fill="var(--ink)" />
      </svg>

      <h1
        className="text-3xl mb-3 max-w-xs"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Learn the trade. One lesson at a time.
      </h1>
      <p className="text-sm mb-8 max-w-xs" style={{ color: 'var(--ink-2)' }}>
        Spot real code violations, learn your wires, and test what you know — free, right in
        your browser.
      </p>

      <Link
        to="/play"
        className="inline-block rounded-xl px-8 py-3.5 text-sm font-semibold"
        style={{ background: 'var(--ink)', color: '#fff' }}
      >
        Try a free lesson
      </Link>

      <p className="text-xs mt-10" style={{ color: 'var(--ink-3)' }}>
        Placeholder landing page — swap in the real design here.
      </p>
    </div>
  )
}
