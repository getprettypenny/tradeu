import BoltCounter from './BoltCounter'

const NODE_Y_START = 40
const NODE_Y_GAP = 148
const X_PATTERN = [50, 28, 72] // percentages — center, left, right, repeating

function nodeState(lesson) {
  if (lesson.completed) return 'completed'
  if (lesson.locked) return 'locked'
  return 'open'
}

function PlugBadge({ state }) {
  if (state === 'locked') {
    return (
      <svg viewBox="0 0 64 64" className="w-16 h-16">
        <circle cx="32" cy="32" r="30" fill="#E5DFD2" />
        <text x="32" y="40" textAnchor="middle" fontSize="22">
          🔒
        </text>
      </svg>
    )
  }

  const bg = state === 'completed' ? 'var(--green)' : 'var(--yellow)'
  const plugColor = state === 'completed' ? '#fff' : 'var(--ink)'

  return (
    <svg viewBox="0 0 64 64" className="w-16 h-16">
      <circle
        cx="32"
        cy="32"
        r="30"
        fill={bg}
        stroke={state === 'open' ? 'var(--ink)' : 'none'}
        strokeWidth="2.5"
      />
      {/* plug glyph */}
      <rect x="20" y="24" width="24" height="20" rx="6" fill="none" stroke={plugColor} strokeWidth="3" />
      <rect x="26" y="16" width="4" height="10" rx="1.5" fill={plugColor} />
      <rect x="34" y="16" width="4" height="10" rx="1.5" fill={plugColor} />

      {state === 'completed' && (
        <>
          <circle cx="52" cy="12" r="11" fill="#fff" stroke="var(--green)" strokeWidth="2" />
          <text x="52" y="16.5" textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--green)">
            ✓
          </text>
        </>
      )}
    </svg>
  )
}

export default function HomePath({ lessons, onSelect, bolts, footer }) {
  const height = NODE_Y_START + (lessons.length - 1) * NODE_Y_GAP + 100

  return (
    <div className="flex-1 flex flex-col overflow-y-auto">
      <div className="px-5 pt-8 pb-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            TradeU
          </h1>
          <p className="text-sm" style={{ color: 'var(--ink-2)' }}>
            Follow the path to level up.
          </p>
        </div>
        <BoltCounter total={bolts} pulseKey={0} />
      </div>

      <div className="relative" style={{ height }}>
        <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
          {lessons.slice(1).map((lesson, idx) => {
            const i = idx + 1
            const x1 = X_PATTERN[(i - 1) % 3]
            const x2 = X_PATTERN[i % 3]
            const y1 = NODE_Y_START + (i - 1) * NODE_Y_GAP
            const y2 = NODE_Y_START + i * NODE_Y_GAP
            return (
              <path
                key={lesson.id}
                d={`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${(y1 + y2) / 2} ${x2} ${y2}`}
                fill="none"
                vectorEffect="non-scaling-stroke"
                stroke={lesson.locked ? 'var(--border)' : 'var(--yellow)'}
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray="1 9"
              />
            )
          })}
        </svg>

        {lessons.map((lesson, i) => {
          const state = nodeState(lesson)
          const x = X_PATTERN[i % 3]
          const y = NODE_Y_START + i * NODE_Y_GAP
          return (
            <button
              key={lesson.id}
              type="button"
              disabled={lesson.locked}
              onClick={() => onSelect(lesson.id)}
              className="absolute flex flex-col items-center gap-1.5 -translate-x-1/2"
              style={{
                left: `${x}%`,
                top: y,
                width: 120,
                cursor: lesson.locked ? 'not-allowed' : 'pointer',
              }}
              aria-label={lesson.title || 'Locked module'}
            >
              <PlugBadge state={state} />
              <span
                className="text-xs font-semibold text-center leading-tight"
                style={{ color: lesson.locked ? 'var(--ink-3)' : 'var(--ink)' }}
              >
                {lesson.title}
              </span>
            </button>
          )
        })}
      </div>

      {footer}
    </div>
  )
}
