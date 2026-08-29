// Duolingo-style segmented progress bar: one segment per question.
// Past questions are fully filled, the current one fills proportionally
// to violations found so far, and future ones stay empty.
export default function LessonProgressBar({ questionCount, questionIndex, currentRatio, onExit }) {
  return (
    <div className="flex items-center gap-3 px-5 pt-6 pb-2">
      <button
        type="button"
        onClick={onExit}
        aria-label="Exit lesson"
        className="text-2xl leading-none shrink-0"
        style={{ color: 'var(--ink-3)' }}
      >
        ×
      </button>

      <div className="flex-1 flex gap-1.5">
        {Array.from({ length: questionCount }).map((_, i) => {
          const width =
            i < questionIndex ? '100%' : i === questionIndex ? `${Math.round(currentRatio * 100)}%` : '0%'
          return (
            <div
              key={i}
              className="h-2 flex-1 rounded-full overflow-hidden"
              style={{ background: 'var(--border)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width, background: 'var(--yellow)' }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
