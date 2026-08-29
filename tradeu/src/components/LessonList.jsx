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
            onClick={() => onSelect(lesson.id)}
            className="text-left rounded-2xl p-4 border transition-colors"
            style={{ background: '#FFFFFF', borderColor: 'var(--border)' }}
          >
            <p
              className="text-base font-semibold mb-1"
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              {lesson.title}
            </p>
            <p className="text-sm mb-2" style={{ color: 'var(--ink-2)' }}>
              {lesson.description}
            </p>
            <p className="text-xs font-medium" style={{ color: 'var(--ink-3)' }}>
              {lesson.questions.length} questions
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
