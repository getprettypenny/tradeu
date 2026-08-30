export default function TradePicker({ onSelect }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 gap-4 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
        Pick your trade
      </p>
      <h2
        className="text-xl font-semibold mb-2"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        Which trade do you want to test?
      </h2>

      <div className="w-full flex flex-col gap-3">
        <button
          type="button"
          onClick={() => onSelect('electrical')}
          className="rounded-2xl py-5 text-base font-semibold"
          style={{ background: 'var(--yellow)', color: 'var(--ink)' }}
        >
          ⚡ Electrical
        </button>
        <button
          type="button"
          disabled
          className="rounded-2xl py-5 text-base font-semibold flex items-center justify-center gap-2"
          style={{ background: '#EDE7DA', color: 'var(--ink-3)', cursor: 'not-allowed' }}
        >
          🔧 Plumbing
          <span
            className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full"
            style={{ background: '#DED5C2', color: 'var(--ink-2)' }}
          >
            Coming soon
          </span>
        </button>
      </div>
    </div>
  )
}
