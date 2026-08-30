import { useState } from 'react'
import GameRound from '../components/challenge/GameRound'
import GameScoreScreen from '../components/challenge/GameScoreScreen'
import TradePicker from '../components/challenge/TradePicker'
import ChallengeQuiz from '../components/challenge/ChallengeQuiz'
import QuizResultsScreen from '../components/challenge/QuizResultsScreen'
import CaptureSheet from '../components/challenge/CaptureSheet'
import { electricalBasicsLesson } from '../lessons/electricalBasics'
import { loadBolts, saveBolts, recordPlaySession, loadStreak } from '../lib/progress'

const TOTAL_GAME_VIOLATIONS = electricalBasicsLesson.questions.reduce(
  (sum, scene) => sum + scene.hotspots.filter((h) => h.isViolation).length,
  0,
)

// Strictly linear: game -> game-score -> trade-picker -> quiz ->
// quiz-results (capture sheet auto-appears) -> submitted -> (Play
// Again loops back to game). No way to skip ahead or jump between
// steps — each step's own screen is the only way forward.
export default function ChallengePage() {
  const [step, setStep] = useState('game')
  const [bolts, setBolts] = useState(() => loadBolts())
  const [boltPulse, setBoltPulse] = useState(0)
  const [gameViolationsFound, setGameViolationsFound] = useState(0)
  const [quizResult, setQuizResult] = useState(null)
  const [streakDays, setStreakDays] = useState(() => loadStreak())
  const [sheetVisible, setSheetVisible] = useState(false)

  function handleEarnBolt() {
    setBolts((prev) => {
      const next = prev + 1
      saveBolts(next)
      return next
    })
    setBoltPulse((p) => p + 1)
  }

  function handleGameComplete(violationsFound) {
    setGameViolationsFound(violationsFound)
    setStep('game-score')
  }

  function handleQuizComplete(result) {
    setQuizResult(result)
    setStreakDays(recordPlaySession())
    setStep('quiz-results')
    setTimeout(() => setSheetVisible(true), 1000)
  }

  function handleSubmitted() {
    setSheetVisible(false)
    setStep('submitted')
  }

  function handlePlayAgain() {
    setStep('game')
    setGameViolationsFound(0)
    setQuizResult(null)
    setSheetVisible(false)
  }

  return (
    <div
      className="min-h-screen w-full flex justify-center md:py-8 md:px-4"
      style={{ background: '#EAE3D3' }}
    >
      <div
        className="relative w-full max-w-[430px] min-h-screen md:min-h-0 flex flex-col overflow-hidden md:rounded-[2.5rem] md:shadow-2xl md:border"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
      >
        {step === 'game' && (
          <GameRound
            bolts={bolts}
            boltPulse={boltPulse}
            onEarnBolt={handleEarnBolt}
            onComplete={handleGameComplete}
          />
        )}

        {step === 'game-score' && (
          <GameScoreScreen
            violationsFound={gameViolationsFound}
            totalViolations={TOTAL_GAME_VIOLATIONS}
            onNext={() => setStep('trade-picker')}
          />
        )}

        {step === 'trade-picker' && <TradePicker onSelect={() => setStep('quiz')} />}

        {step === 'quiz' && (
          <ChallengeQuiz
            bolts={bolts}
            boltPulse={boltPulse}
            onEarnBolt={handleEarnBolt}
            onComplete={handleQuizComplete}
          />
        )}

        {step === 'quiz-results' && quizResult && (
          <>
            <QuizResultsScreen
              correct={quizResult.correct}
              total={quizResult.total}
              bestStreak={quizResult.bestStreak}
              streakDays={streakDays}
            />
            <CaptureSheet visible={sheetVisible} onSubmitted={handleSubmitted} />
          </>
        )}

        {step === 'submitted' && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-8 py-10 gap-3">
            <div className="text-5xl">✅</div>
            <h2 className="text-xl font-semibold" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              You're in.
            </h2>
            <p className="text-sm" style={{ color: 'var(--ink-2)' }}>
              We'll be in touch when new scenes drop.
            </p>
            <button
              type="button"
              onClick={handlePlayAgain}
              className="mt-4 w-full rounded-xl py-3 text-sm font-semibold"
              style={{ background: 'var(--ink)', color: '#fff' }}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
