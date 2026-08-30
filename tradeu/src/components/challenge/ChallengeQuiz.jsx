import { useState } from 'react'
import QuizQuestion from '../QuizQuestion'
import WireQuestion from '../WireQuestion'
import Outlet from '../scenes/Outlet'
import BoltCounter from '../BoltCounter'
import { electricalQuizQuestions as questions } from '../../lessons/electricalQuiz'

export default function ChallengeQuiz({ bolts, boltPulse, onEarnBolt, onComplete }) {
  const [index, setIndex] = useState(0)
  const [selectedOptionId, setSelectedOptionId] = useState(null)
  const [correctCount, setCorrectCount] = useState(0)
  const [currentStreak, setCurrentStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  const question = questions[index]
  const isLast = index === questions.length - 1
  const answered = selectedOptionId !== null
  const QuizVisual = question.visual ?? Outlet

  function handleSelect(optionId) {
    if (selectedOptionId !== null) return
    setSelectedOptionId(optionId)

    if (optionId === question.correctOptionId) {
      onEarnBolt?.()
      setCorrectCount((c) => c + 1)
      setCurrentStreak((s) => {
        const next = s + 1
        setBestStreak((b) => Math.max(b, next))
        return next
      })
    } else {
      setCurrentStreak(0)
    }
  }

  function handleContinue() {
    if (isLast) {
      onComplete({ correct: correctCount, total: questions.length, bestStreak })
      return
    }
    setIndex((i) => i + 1)
    setSelectedOptionId(null)
  }

  return (
    <>
      <div className="flex items-center gap-3 px-5 pt-6 pb-2">
        <div className="flex-1 flex gap-1.5">
          {questions.map((_, i) => {
            const width = i < index ? '100%' : i === index && answered ? '100%' : '0%'
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
        <BoltCounter total={bolts} pulseKey={boltPulse} />
      </div>

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

        {question.interaction === 'wires' ? (
          <WireQuestion question={question} selectedOptionId={selectedOptionId} onSelect={handleSelect} />
        ) : (
          <>
            <QuizVisual />
            <QuizQuestion question={question} selectedOptionId={selectedOptionId} onSelect={handleSelect} />
          </>
        )}
      </main>

      <footer className="px-4 pb-6 pt-2">
        <button
          type="button"
          disabled={!answered}
          onClick={handleContinue}
          className="w-full rounded-xl py-3 text-sm font-semibold transition-colors"
          style={{
            background: answered ? 'var(--ink)' : 'var(--border)',
            color: answered ? '#fff' : 'var(--ink-3)',
            cursor: answered ? 'pointer' : 'not-allowed',
          }}
        >
          {isLast ? 'See Results' : 'Continue'}
        </button>
      </footer>
    </>
  )
}
