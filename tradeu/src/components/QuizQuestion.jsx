export default function QuizQuestion({ question, selectedOptionId, onSelect }) {
  const answered = selectedOptionId !== null
  const isCorrect = selectedOptionId === question.correctOptionId

  return (
    <div className="flex flex-col">
      <h2
        className="text-lg font-semibold mb-4"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {question.prompt}
      </h2>

      <div className="flex flex-col gap-2.5">
        {question.options.map((option) => {
          const isSelected = option.id === selectedOptionId
          const isRightAnswer = option.id === question.correctOptionId

          let optionStyle = { background: '#FFFFFF', borderColor: 'var(--border)', color: 'var(--ink)' }
          if (answered && isRightAnswer) {
            optionStyle = { background: '#EAF7EE', borderColor: 'var(--green)', color: 'var(--green)' }
          } else if (answered && isSelected && !isRightAnswer) {
            optionStyle = { background: '#FCEAEA', borderColor: 'var(--red)', color: 'var(--red)' }
          }

          return (
            <button
              key={option.id}
              type="button"
              disabled={answered}
              onClick={() => onSelect(option.id)}
              className="text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors"
              style={optionStyle}
            >
              {option.label}
            </button>
          )
        })}
      </div>

      {answered && (
        <div
          className="mt-4 rounded-xl p-4 text-sm"
          style={{
            background: isCorrect ? '#EAF7EE' : '#FCEAEA',
            color: isCorrect ? 'var(--green)' : 'var(--red)',
            border: `1px solid ${isCorrect ? 'var(--green)' : 'var(--red)'}`,
          }}
        >
          {isCorrect ? '✅ Correct. ' : '❌ Not quite. '}
          {question.explanation}
          {question.code && (
            <div
              className="text-xs font-semibold uppercase tracking-wide mt-1.5"
              style={{ color: 'inherit', opacity: 0.7 }}
            >
              {question.code}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
