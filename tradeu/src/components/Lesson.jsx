import { useState } from 'react'
import LessonProgressBar from './LessonProgressBar'
import FeedbackSheet from './FeedbackSheet'
import QuizQuestion from './QuizQuestion'
import WireQuestion from './WireQuestion'
import Outlet from './scenes/Outlet'

function LessonComplete({ lesson, correct, total, onRestart, onExit }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-10 gap-3">
      <div className="text-5xl">🎉</div>
      <h2 className="text-xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Lesson complete!
      </h2>
      <p className="text-sm" style={{ color: 'var(--ink-2)' }}>
        You got {correct}/{total} correct in {lesson.title}.
      </p>
      <button
        type="button"
        onClick={onRestart}
        className="mt-4 w-full rounded-xl py-3 text-sm font-semibold"
        style={{ background: 'var(--ink)', color: '#fff' }}
      >
        Do it again
      </button>
      <button
        type="button"
        onClick={onExit}
        className="w-full rounded-xl py-3 text-sm font-semibold"
        style={{ background: 'transparent', color: 'var(--ink-2)' }}
      >
        Back to lessons
      </button>
    </div>
  )
}

export default function Lesson({ lesson, onExit }) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [foundIds, setFoundIds] = useState([])
  const [activeTap, setActiveTap] = useState(null)
  const [selectedOptionId, setSelectedOptionId] = useState(null)
  const [results, setResults] = useState([])
  const [complete, setComplete] = useState(false)

  const question = lesson.questions[questionIndex]
  const isQuiz = question.type === 'quiz'
  const isLastQuestion = questionIndex === lesson.questions.length - 1

  // "inspect" progress
  const totalViolations = !isQuiz ? question.hotspots.filter((h) => h.isViolation).length : 0
  const foundViolations = !isQuiz
    ? question.hotspots.filter((h) => h.isViolation && foundIds.includes(h.id)).length
    : 0
  const allFound = totalViolations === 0 ? false : foundViolations === totalViolations

  const canContinue = isQuiz ? selectedOptionId !== null : allFound
  const currentRatio = isQuiz
    ? selectedOptionId !== null
      ? 1
      : 0
    : totalViolations === 0
      ? 1
      : foundViolations / totalViolations

  function handleTap(hotspot) {
    setActiveTap(hotspot)
    setFoundIds((prev) => (prev.includes(hotspot.id) ? prev : [...prev, hotspot.id]))
  }

  function handleSelect(optionId) {
    if (selectedOptionId !== null) return
    setSelectedOptionId(optionId)
  }

  function handleContinue() {
    const score = isQuiz
      ? { correct: selectedOptionId === question.correctOptionId ? 1 : 0, total: 1 }
      : { correct: totalViolations, total: totalViolations }

    const nextResults = [...results, score]

    if (isLastQuestion) {
      setResults(nextResults)
      setComplete(true)
      return
    }

    setResults(nextResults)
    setQuestionIndex((i) => i + 1)
    setFoundIds([])
    setSelectedOptionId(null)
  }

  function handleRestart() {
    setQuestionIndex(0)
    setFoundIds([])
    setActiveTap(null)
    setSelectedOptionId(null)
    setResults([])
    setComplete(false)
  }

  if (complete) {
    const totalCorrect = results.reduce((sum, r) => sum + r.correct, 0)
    const totalPossible = results.reduce((sum, r) => sum + r.total, 0)
    return (
      <LessonComplete
        lesson={lesson}
        correct={totalCorrect}
        total={totalPossible}
        onRestart={handleRestart}
        onExit={onExit}
      />
    )
  }

  const { Scene } = question

  return (
    <>
      <LessonProgressBar
        questionCount={lesson.questions.length}
        questionIndex={questionIndex}
        currentRatio={currentRatio}
        onExit={onExit}
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

        {isQuiz ? (
          question.interaction === 'wires' ? (
            <WireQuestion question={question} selectedOptionId={selectedOptionId} onSelect={handleSelect} />
          ) : (
            <>
              <Outlet />
              <QuizQuestion question={question} selectedOptionId={selectedOptionId} onSelect={handleSelect} />
            </>
          )
        ) : (
          <>
            <Scene onTap={handleTap} foundIds={foundIds} />
            {allFound && (
              <div
                className="mt-4 rounded-xl p-4 text-sm"
                style={{ background: '#EAF7EE', color: 'var(--green)', border: '1px solid var(--green)' }}
              >
                🎉 {question.completeMessage}
              </div>
            )}
          </>
        )}
      </main>

      <footer className="px-4 pb-6 pt-2">
        <button
          type="button"
          disabled={!canContinue}
          onClick={handleContinue}
          className="w-full rounded-xl py-3 text-sm font-semibold transition-colors"
          style={{
            background: canContinue ? 'var(--ink)' : 'var(--border)',
            color: canContinue ? '#fff' : 'var(--ink-3)',
            cursor: canContinue ? 'pointer' : 'not-allowed',
          }}
        >
          {isLastQuestion ? 'Finish lesson' : 'Continue'}
        </button>
      </footer>

      {!isQuiz && <FeedbackSheet hotspot={activeTap} onClose={() => setActiveTap(null)} />}
    </>
  )
}
