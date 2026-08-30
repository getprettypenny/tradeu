export default function GameScoreScreen({ violationsFound, totalViolations, onNext }) {
  const accuracy = totalViolations === 0 ? 100 : Math.round((violationsFound / totalViolations) * 100)

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-10 gap-2">
      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--green)' }}>
        🎮 Level 1 Complete
      </p>
      <div className="text-5xl mb-1">🔧</div>
      <h2 className="text-xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Nice work!
      </h2>
      <div className="flex items-center gap-2 text-2xl font-bold mt-1" style={{ color: '#8A6D00' }}>
        <span aria-hidden="true">⚡</span>
        <span>+{violationsFound}</span>
      </div>
      <p className="text-sm" style={{ color: 'var(--ink-2)' }}>
        {violationsFound}/{totalViolations} violations found · {accuracy}% accuracy
      </p>

      <button
        type="button"
        onClick={onNext}
        className="mt-4 w-full rounded-xl py-3 text-sm font-semibold"
        style={{ background: 'var(--ink)', color: '#fff' }}
      >
        Try the Quiz →
      </button>
    </div>
  )
}
