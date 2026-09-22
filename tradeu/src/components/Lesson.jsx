import { useEffect, useState } from 'react'
import LessonProgressBar from './LessonProgressBar'
import FeedbackSheet from './FeedbackSheet'
import QuizQuestion from './QuizQuestion'
import WireQuestion from './WireQuestion'
import Outlet from './scenes/Outlet'
import { playBonus, playFound, playSceneClear, playTimeout } from '../lib/sound'

const ROUND_SECONDS = 25
const COMBO_SIZE = 10
const COMBO_BONUS_SECONDS = 10

function LessonComplete({ lesson, correct, total, bestStreak, onRestart, onExit }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-10 gap-2">
      <div className="pop-in text-5xl">🎉</div>
      <h2 className="text-xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Lesson complete!
      </h2>
      <div className="flex items-center gap-2 text-2xl font-bold mt-1" style={{ color: '#8A6D00' }}>
        <span aria-hidden="true">⚡</span>
        <span>+{correct}</span>
      </div>
      <p className="text-sm" style={{ color: 'var(--ink-2)' }}>
        {correct}/{total} correct in {lesson.title}.
      </p>
      {bestStreak >= COMBO_SIZE && (
        <p className="text-sm font-semibold" style={{ color: '#C99400' }}>
          🔥 {bestStreak}-answer speed streak!
        </p>
      )}
      <button
        type="button"
        onClick={onExit}
        className="mt-4 w-full rounded-xl py-3 text-sm font-semibold"
        style={{ background: 'var(--ink)', color: '#fff' }}
      >
        Continue
      </button>
      <button
        type="button"
        onClick={onRestart}
        className="w-full rounded-xl py-3 text-sm font-semibold"
        style={{ background: 'transparent', color: 'var(--ink-2)' }}
      >
        Do it again
      </button>
    </div>
  )
}

// Every lesson -- room-inspection or multiple-choice alike -- runs the
// same shape: a "Ready?" gate, then each question/scene gets 25
// seconds. Running out of time only costs you that one item (found
// hotspots so far in the room, or an unanswered question) -- it never
// throws out progress on earlier items in the lesson.
//
// The combo streak is deliberately NOT owned here: no single lesson
// has 10 scoreable items on its own (electrical-basics tops out at 6
// violations, the quizzes at 5 questions each), so a per-lesson streak
// could never actually reach the 10-in-a-row bonus. GamePage tracks it
// across whichever lessons get played in one visit and hands it down
// as `streak`/`bestStreak`, so momentum carries from one lesson into
// the next.
export default function Lesson({
  lesson,
  onExit,
  onComplete,
  bolts,
  boltPulse,
  onEarnBolt,
  showExit = true,
  streak,
  bestStreak,
  onStreakChange,
  onStreakReset,
  // Optional funnel-analytics hooks. Nobody passes these for a normal
  // lesson picked off the home path -- they exist so GamePage's
  // fresh-visitor intro run can report Pixel events for each step
  // (Start tapped, each room/question cleared, a timeout hit) without
  // Lesson itself knowing anything about Pixel or ad funnels.
  onStart,
  onItemComplete,
  onTimeout,
}) {
  const [started, setStarted] = useState(false)
  const [questionIndex, setQuestionIndex] = useState(0)
  const [foundIds, setFoundIds] = useState([])
  const [activeTap, setActiveTap] = useState(null)
  const [selectedOptionId, setSelectedOptionId] = useState(null)
  const [results, setResults] = useState([])
  const [complete, setComplete] = useState(false)
  const [timeLeft, setTimeLeft] = useState(ROUND_SECONDS)
  const [timedOut, setTimedOut] = useState(false)
  const [retryTick, setRetryTick] = useState(0)

  const question = lesson.questions[questionIndex]
  const isQuiz = question.type === 'quiz'
  const isLastQuestion = questionIndex === lesson.questions.length - 1
  const QuizVisual = question.visual ?? Outlet

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

  // Fresh 25s every time a new item starts or the current one is retried.
  useEffect(() => {
    setTimeLeft(ROUND_SECONDS)
    setTimedOut(false)
  }, [questionIndex, retryTick])

  // Ticks down while the item is actually in progress. Stops the moment
  // it's been solved (canContinue) so nobody times out while just
  // reading the feedback before clicking Continue.
  useEffect(() => {
    if (!started || complete || timedOut || canContinue) return
    if (timeLeft <= 0) {
      playTimeout()
      setTimedOut(true)
      onStreakReset?.()
      onTimeout?.(questionIndex, lesson.questions.length)
      return
    }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000)
    return () => clearTimeout(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, complete, timedOut, canContinue, timeLeft])

  function registerCorrect() {
    onEarnBolt?.()
    playFound()
    const next = streak + 1
    onStreakChange?.(next)
    if (next % COMBO_SIZE === 0) {
      playBonus()
      setTimeLeft((t) => t + COMBO_BONUS_SECONDS)
    }
  }

  function handleTap(hotspot) {
    setActiveTap(hotspot)
    if (foundIds.includes(hotspot.id)) return
    setFoundIds((prev) => (prev.includes(hotspot.id) ? prev : [...prev, hotspot.id]))
    if (hotspot.isViolation) registerCorrect()
  }

  function handleSelect(optionId) {
    if (selectedOptionId !== null) return
    setSelectedOptionId(optionId)
    if (optionId === question.correctOptionId) {
      registerCorrect()
    } else {
      onStreakReset?.()
    }
  }

  function handleTryAgain() {
    setFoundIds([])
    setSelectedOptionId(null)
    setActiveTap(null)
    setRetryTick((t) => t + 1)
  }

  function handleContinue() {
    if (!isQuiz) playSceneClear()
    onItemComplete?.(questionIndex, lesson.questions.length)
    const score = isQuiz
      ? { correct: selectedOptionId === question.correctOptionId ? 1 : 0, total: 1 }
      : { correct: totalViolations, total: totalViolations }

    const nextResults = [...results, score]

    if (isLastQuestion) {
      setResults(nextResults)
      setComplete(true)
      onComplete?.(lesson.id)
      return
    }

    setResults(nextResults)
    setQuestionIndex((i) => i + 1)
    setFoundIds([])
    setSelectedOptionId(null)
  }

  function handleRestart() {
    setStarted(false)
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
        bestStreak={bestStreak}
        onRestart={handleRestart}
        onExit={onExit}
      />
    )
  }

  if (!started) {
    return (
      <>
        <LessonProgressBar
          questionCount={lesson.questions.length}
          questionIndex={0}
          currentRatio={0}
          onExit={onExit}
          showExit={showExit}
          bolts={bolts}
          boltPulse={boltPulse}
        />
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
            {lesson.title}
          </p>
          <h2 className="text-xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Ready?
          </h2>
          <p className="text-sm" style={{ color: 'var(--ink-2)' }}>
            You've got {ROUND_SECONDS} seconds per {isQuiz ? 'question' : 'room'}. Find a groove and you'll earn
            bonus time.
          </p>
          <button
            type="button"
            onClick={() => {
              onStart?.()
              setStarted(true)
            }}
            className="mt-2 w-full rounded-xl py-3 text-sm font-semibold"
            style={{ background: 'var(--ink)', color: '#fff' }}
          >
            Start
          </button>
        </div>
      </>
    )
  }

  const { Scene } = question
  const timerUrgent = timeLeft <= 8

  return (
    <>
      <LessonProgressBar
        questionCount={lesson.questions.length}
        questionIndex={questionIndex}
        currentRatio={currentRatio}
        onExit={onExit}
        showExit={showExit}
        bolts={bolts}
        boltPulse={boltPulse}
      />

      {timedOut ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8 gap-3">
          <div className="text-5xl">⏰</div>
          <h2 className="text-xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Oh no, you ran out of time!
          </h2>
          <p className="text-sm" style={{ color: 'var(--ink-2)' }}>
            Want to try the game again?
          </p>
          <button
            type="button"
            onClick={handleTryAgain}
            className="mt-2 w-full rounded-xl py-3 text-sm font-semibold"
            style={{ background: 'var(--ink)', color: '#fff' }}
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          <main className="flex-1 px-4 pb-4 flex flex-col overflow-y-auto">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--ink-3)' }}>
                {question.jobLabel}
              </p>
              <p
                className="text-xs font-bold tabular-nums"
                style={{ color: timerUrgent ? 'var(--red)' : 'var(--ink-3)' }}
              >
                ⏱ 0:{String(timeLeft).padStart(2, '0')}
              </p>
            </div>
            <p className="text-sm mb-3" style={{ color: 'var(--ink-2)' }}>
              {question.narrative}
            </p>

            {isQuiz ? (
              question.interaction === 'wires' ? (
                <WireQuestion question={question} selectedOptionId={selectedOptionId} onSelect={handleSelect} />
              ) : (
                <>
                  <QuizVisual />
                  <QuizQuestion question={question} selectedOptionId={selectedOptionId} onSelect={handleSelect} />
                </>
              )
            ) : (
              <>
                <Scene onTap={handleTap} foundIds={foundIds} />
                {allFound && (
                  <div
                    className="pop-in mt-4 rounded-xl p-4 text-sm"
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
      )}
    </>
  )
}
