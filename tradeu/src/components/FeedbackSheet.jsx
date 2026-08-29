export default function FeedbackSheet({ hotspot, onClose }) {
  const open = Boolean(hotspot)

  return (
    <div
      className={`absolute inset-0 z-20 flex items-end justify-center transition-opacity duration-200 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
      aria-hidden={!open}
    >
      <button
        type="button"
        aria-label="Dismiss"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className={`relative w-full rounded-t-3xl p-5 pb-7 shadow-[0_-8px_24px_rgba(0,0,0,0.12)] transition-transform duration-200 ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ background: '#FFFFFF', borderTop: '1px solid var(--border)' }}
      >
        {hotspot && (
          <>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold shrink-0"
                style={{ background: hotspot.isViolation ? 'var(--red)' : 'var(--green)' }}
              >
                {hotspot.isViolation ? '!' : '✓'}
              </span>
              <h2
                className="text-base font-semibold"
                style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {hotspot.isViolation ? 'Code violation' : 'Up to code'}
              </h2>
            </div>

            <p className="text-sm font-medium mb-1">{hotspot.label}</p>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-2)' }}>
              {hotspot.explanation}
            </p>

            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full rounded-xl py-2.5 text-sm font-medium"
              style={{ background: 'var(--ink)', color: '#fff' }}
            >
              Got it
            </button>
          </>
        )}
      </div>
    </div>
  )
}
