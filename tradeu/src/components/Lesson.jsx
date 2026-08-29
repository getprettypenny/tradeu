import { useState } from 'react'
import LessonProgressBar from './LessonProgressBar'
import FeedbackSheet from './FeedbackSheet'

function LessonComplete({ lesson, totalViolations, onRestart }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-10 gap-3">
      <div className="text-5xl">🎉</div>
      <h2 className="text-xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Lesson complete!
      </h2>
      <p className="text-sm" style={{ color: 'var(--ink-2)' }}>
        You caught all {totalViolations} violations across {lesson.questions.length} jobs in{' '}
        {lesson.title}.
      </p>
      <button
        type="button"
        onClick={onRestart}
        className="mt-4 w-full rounded-xl py-3 text-sm font-semibold"
        style={{ background: 'var(--ink)', color: '#fff' }}
      >
        Do it again
      </button>
    </div>
  )
}

export default function Lesson({ lesson }) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [foundIds, setFoundIds] = useState([])
  const [activeTap, setActiveTap] = useState(null)
  const [complete, setComplete] = useState(false)

  const question = lesson.questions[questionIndex]
  const totalViolations = question.hotspots.filter((h) => h.isViolation).length
  const foundViolations = question.hotspots.filter(
    (h) => h.isViolation && foundIds.includes(h.id),
  ).length
  const allFound = foundViolations === totalViolations
  const isLastQuestion = questionIndex === lesson.questions.length - 1

  const lessonTotalViolations = lesson.questions.reduce(
    (sum, q) => sum + q.hotspots.filter((h) => h.isViolation).length,
    0,
  )

  function handleTap(hotspot) {
    setActiveTap(hotspot)
    setFoundIds((prev) => (prev.includes(hotspot.id) ? prev : [...prev, hotspot.id]))
  }

  function handleContinue() {
    if (isLastQuestion) {
      setComplete(true)
      return
    }
    setQuestionIndex((i) => i + 1)
    setFoundIds([])
  }

  function handleRestart() {
    setQuestionIndex(0)
    setFoundIds([])
    setActiveTap(null)
    setComplete(false)
  }

  if (complete) {
    return (
      <LessonComplete
        lesson={lesson}
        totalViolations={lessonTotalViolations}
        onRestart={handleRestart}
      />
    )
  }

  const { Scene } = question

  return (
    <>
      <LessonProgressBar
        questionCount={lesson.questions.length}
        questionIndex={questionIndex}
        currentRatio={totalViolations === 0 ? 1 : foundViolations / totalViolations}
        onExit={handleRestart}
      />

      <main className="flex-1 px-4 pb-4 flex flex-col overflow-y-auto">
        <p
          className="text-xs font-semibold uppercase tracking-wide mb-1"
          style={{ color: 'var(--ink-3)' }}
        >
          {question.jobLabel}
        </p>
        <p className="text-sm mb-3" style={{ color: 'var(--ink-2)' }}>
          {question.narrative}
        </p>

        <Scene onTap={handleTap} foundIds={foundIds} />

        {allFound && (
          <div
            className="mt-4 rounded-xl p-4 text-sm"
            style={{ background: '#EAF7EE', color: 'var(--green)', border: '1px solid var(--green)' }}
          >
            🎉 {question.completeMessage}
          </div>
        )}
      </main>

      <footer className="px-4 pb-6 pt-2">
        <button
          type="button"
          disabled={!allFound}
          onClick={handleContinue}
          className="w-full rounded-xl py-3 text-sm font-semibold transition-colors"
          style={{
            background: allFound ? 'var(--ink)' : 'var(--border)',
            color: allFound ? '#fff' : 'var(--ink-3)',
            cursor: allFound ? 'pointer' : 'not-allowed',
          }}
        >
          {isLastQuestion ? 'Finish lesson' : 'Continue'}
        </button>
      </footer>

      <FeedbackSheet hotspot={activeTap} onClose={() => setActiveTap(null)} />
    </>
  )
}
