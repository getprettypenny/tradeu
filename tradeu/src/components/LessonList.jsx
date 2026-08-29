export default function LessonList({ lessons, onSelect }) {
  return (
    <div className="flex-1 flex flex-col px-5 pt-8 pb-6 overflow-y-auto">
      <h1
        className="text-2xl mb-1"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        TradeU
      </h1>
      <p className="text-sm mb-6" style={{ color: 'var(--ink-2)' }}>
        Pick a lesson to start.
      </p>

      <div className="flex flex-col gap-3">
        {lessons.map((lesson) => (
          <button
            key={lesson.id}
            type="button"
            disabled={lesson.locked}
            onClick={() => onSelect(lesson.id)}
            aria-disabled={lesson.locked}
            className="text-left rounded-2xl p-4 border transition-colors"
            style={{
              background: lesson.locked ? '#F0EBE0' : '#FFFFFF',
              borderColor: 'var(--border)',
              opacity: lesson.locked ? 0.65 : 1,
              cursor: lesson.locked ? 'not-allowed' : 'pointer',
            }}
          >
            <div className="flex items-center gap-2 mb-1">
              <p
                className="text-base font-semibold"
                style={{ fontFamily: "'Space Grotesk', sans-serif", color: 'var(--ink)' }}
              >
                {lesson.title}
              </p>
              {lesson.completed && (
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full text-white text-xs font-bold shrink-0"
                  style={{ background: 'var(--green)' }}
                >
                  ✓
                </span>
              )}
              {lesson.locked && (
                <span className="text-sm shrink-0" style={{ color: 'var(--ink-3)' }}>
                  🔒
                </span>
              )}
            </div>
            <p className="text-sm mb-2" style={{ color: 'var(--ink-2)' }}>
              {lesson.description}
            </p>
            <p className="text-xs font-medium" style={{ color: 'var(--ink-3)' }}>
              {lesson.locked ? 'Finish the lesson above to unlock' : `${lesson.questions.length} questions`}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
