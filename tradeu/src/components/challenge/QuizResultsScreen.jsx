export default function QuizResultsScreen({ correct, total, bestStreak, streakDays }) {
  const accuracy = total === 0 ? 0 : Math.round((correct / total) * 100)

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-10 gap-2">
      <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--green)' }}>
        🎯 Level 2 Complete
      </p>
      <div className="text-5xl mb-1">🏆</div>
      <h2 className="text-xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Quiz complete!
      </h2>
      <div className="flex items-center gap-2 text-2xl font-bold mt-1" style={{ color: '#8A6D00' }}>
        <span aria-hidden="true">⚡</span>
        <span>+{correct}</span>
      </div>
      <p className="text-sm" style={{ color: 'var(--ink-2)' }}>
        {correct}/{total} correct · {accuracy}% accuracy · Best streak {bestStreak}
      </p>
      {streakDays > 0 && (
        <p className="text-sm font-semibold mt-1" style={{ color: '#C9722A' }}>
          🔥 {streakDays}-day streak
        </p>
      )}
    </div>
  )
}
