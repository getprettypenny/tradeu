// Interactive quiz question for wire-color answers: instead of a text
// button list, an open wall box with colored wire leads that you tap
// directly to answer — same tap-to-answer language as the rest of the app.
const ENDPOINTS = [
  { x: 62, y: 210 },
  { x: 154, y: 240 },
  { x: 246, y: 240 },
  { x: 338, y: 210 },
]

export default function WireQuestion({ question, selectedOptionId, onSelect }) {
  const answered = selectedOptionId !== null
  const isCorrect = selectedOptionId === question.correctOptionId

  return (
    <div className="flex flex-col">
      <h2
        className="text-lg font-semibold mb-2 text-center"
        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
      >
        {question.prompt}
      </h2>

      <svg viewBox="0 0 400 270" className="w-full h-auto select-none">
        {/* open wall box */}
        <rect x="150" y="16" width="100" height="56" rx="6" fill="#FBF8F2" stroke="var(--ink-2)" strokeWidth="2" />
        <circle cx="172" cy="30" r="2" fill="var(--ink-3)" />
        <circle cx="228" cy="30" r="2" fill="var(--ink-3)" />

        {question.options.map((option, i) => {
          const end = ENDPOINTS[i]
          const start = { x: 172 + i * 18.5, y: 72 }
          const isSelected = option.id === selectedOptionId
          const isRightAnswer = option.id === question.correctOptionId

          let ringColor = 'var(--border)'
          if (answered && isRightAnswer) ringColor = 'var(--green)'
          else if (answered && isSelected && !isRightAnswer) ringColor = 'var(--red)'

          const needsOutline = option.color === '#DCD5C4' // white wire needs a visible edge

          const wirePath = `M ${start.x} ${start.y} Q ${start.x} ${(start.y + end.y) / 2} ${end.x} ${end.y - 26}`

          return (
            <g key={option.id}>
              {needsOutline && (
                <path d={wirePath} fill="none" stroke="var(--ink-3)" strokeWidth="6" strokeLinecap="round" />
              )}
              <path d={wirePath} fill="none" stroke={option.color} strokeWidth="4" strokeLinecap="round" />

              <g
                onClick={() => !answered && onSelect(option.id)}
                onKeyDown={(e) => {
                  if (!answered && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault()
                    onSelect(option.id)
                  }
                }}
                style={{ cursor: answered ? 'default' : 'pointer' }}
                role="button"
                tabIndex={0}
                aria-label={option.label}
              >
                <circle cx={end.x} cy={end.y - 26} r="22" fill="transparent" />
                <circle
                  cx={end.x}
                  cy={end.y - 26}
                  r="12"
                  fill={option.color}
                  stroke={ringColor}
                  strokeWidth="3.5"
                />
              </g>

              <text
                x={end.x}
                y={end.y + 6}
                textAnchor="middle"
                fontSize="13"
                fontWeight="600"
                fill={answered && isSelected ? ringColor : 'var(--ink-2)'}
              >
                {option.shortLabel ?? option.label}
              </text>
            </g>
          )
        })}
      </svg>

      {answered && (
        <div
          className="mt-2 rounded-xl p-4 text-sm"
          style={{
            background: isCorrect ? '#EAF7EE' : '#FCEAEA',
            color: isCorrect ? 'var(--green)' : 'var(--red)',
            border: `1px solid ${isCorrect ? 'var(--green)' : 'var(--red)'}`,
          }}
        >
          {isCorrect ? '✅ Correct. ' : '❌ Not quite. '}
          {question.explanation}
        </div>
      )}
    </div>
  )
}
