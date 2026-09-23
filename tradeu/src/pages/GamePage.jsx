import { useState } from 'react'
import Lesson from '../components/Lesson'
import HomePath from '../components/HomePath'
import SignupGate from '../components/SignupGate'
import SignupThankYou from '../components/SignupThankYou'
import CaptureSheet from '../components/challenge/CaptureSheet'
import { electricalBasicsLesson } from '../lessons/electricalBasics'
import { knowYourWiresLesson } from '../lessons/knowYourWires'
import { gfciAfciLesson } from '../lessons/gfciAfci'
import {
  loadCompletedLessonIds,
  saveCompletedLessonIds,
  loadBolts,
  saveBolts,
  loadLeadCaptured,
  saveLeadCaptured,
} from '../lib/progress'
import { trackCustom } from '../lib/pixel'

const lessons = [electricalBasicsLesson, knowYourWiresLesson, gfciAfciLesson]

// Visual-only filler so the path teases more depth than exists yet.
// Always locked, no real content or names behind them.
const COMING_SOON_COUNT = 4
const comingSoonNodes = Array.from({ length: COMING_SOON_COUNT }, (_, i) => ({
  id: `coming-soon-${i}`,
  title: '',
  locked: true,
  completed: false,
  comingSoon: true,
}))

export default function GamePage() {
  const [selectedLessonId, setSelectedLessonId] = useState(null)
  const [completedLessonIds, setCompletedLessonIds] = useState(() => loadCompletedLessonIds())
  const [bolts, setBolts] = useState(() => loadBolts())
  const [boltPulse, setBoltPulse] = useState(0)
  const [signupSubmitted, setSignupSubmitted] = useState(() => loadLeadCaptured())

  // The speed-combo streak spans whichever lessons get played in one
  // visit -- no single lesson has 10 scoreable items on its own
  // (electrical-basics tops out at 6, the quizzes at 5 each), so
  // tracking it per-lesson would make the 10-in-a-row bonus
  // unreachable. Lives here, not in localStorage: it's a session-long
  // hot streak, fine to lose on a refresh.
  const [streak, setStreak] = useState(0)
  const [bestStreak, setBestStreak] = useState(0)

  // Ads link straight here. A browser that hasn't handed over a lead
  // yet (on ANY surface -- landing page, /play, or /challenge) plays
  // the gamified 3-scene intro first and only sees the home path after
  // submitting the lead form. Anyone already captured skips straight
  // to the normal path below, never forced to replay it.
  const [introStep, setIntroStep] = useState(() => (loadLeadCaptured() ? 'done' : 'game')) // game | capture | done

  const selectedLesson = lessons.find((l) => l.id === selectedLessonId) ?? null
  const allLessonsComplete = lessons.every((l) => completedLessonIds.includes(l.id))

  const lessonsWithStatus = [
    ...lessons.map((lesson, i) => ({
      ...lesson,
      completed: completedLessonIds.includes(lesson.id),
      // the first lesson is always open; every other one needs the one before it done
      locked: i > 0 && !completedLessonIds.includes(lessons[i - 1].id),
    })),
    ...comingSoonNodes,
  ]

  function handleSelect(lessonId) {
    const target = lessonsWithStatus.find((l) => l.id === lessonId)
    if (!target || target.locked) return
    setSelectedLessonId(lessonId)
  }

  function handleComplete(lessonId) {
    setCompletedLessonIds((prev) => {
      if (prev.includes(lessonId)) return prev
      const next = [...prev, lessonId]
      saveCompletedLessonIds(next)
      return next
    })
  }

  function handleEarnBolt() {
    setBolts((prev) => {
      const next = prev + 1
      saveBolts(next)
      return next
    })
    setBoltPulse((p) => p + 1)
  }

  function handleSignupSubmitted() {
    saveLeadCaptured()
    setSignupSubmitted(true)
  }

  function handleStreakChange(next) {
    setStreak(next)
    setBestStreak((b) => Math.max(b, next))
  }

  function handleStreakReset() {
    setStreak(0)
  }

  function handleIntroLeadSubmitted() {
    saveLeadCaptured()
    setSignupSubmitted(true)
    setIntroStep('done')
  }

  // Funnel-step Pixel events for the ad-linked intro flow only -- this
  // is the one path real ad traffic actually walks, so these are the
  // events worth watching for drop-off (PageView -> IntroStart ->
  // IntroRoom1/2/3Complete -> IntroCaptureShown -> Lead). Regular
  // lessons picked off the home path don't fire any of these.
  //
  // IntroStartTimed vs IntroStartUntimed also tells us whether people
  // are opting into the timer at all now that it's no longer forced --
  // useful on its own, and for reading IntroTimeout counts correctly
  // (only the timed group can ever generate one).
  function handleIntroStart(timedMode) {
    trackCustom('IntroStart')
    trackCustom(timedMode ? 'IntroStartTimed' : 'IntroStartUntimed')
  }
  function handleIntroItemComplete(index) {
    trackCustom(`IntroRoom${index + 1}Complete`)
  }
  function handleIntroTimeout(index) {
    trackCustom('IntroTimeout', { room: index + 1 })
  }
  function handleIntroCaptureShown() {
    trackCustom('IntroCaptureShown')
    setIntroStep('capture')
  }

  const frame = (children) => (
    <div
      className="min-h-screen w-full flex justify-center md:py-8 md:px-4"
      style={{ background: '#EAE3D3' }}
    >
      <div
        className="relative w-full max-w-[430px] min-h-screen md:min-h-0 flex flex-col overflow-hidden md:rounded-[2.5rem] md:shadow-2xl md:border"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
      >
        {children}
      </div>
    </div>
  )

  if (introStep !== 'done') {
    // The exact same Lesson component every other lesson runs through,
    // just with the exit "x" hidden (no way to bail early) and its
    // "Continue" from the finish screen wired to the lead form instead
    // of back to a lesson picker. Lesson stays mounted (sitting on its
    // own LessonComplete screen) while the capture sheet slides up over
    // it, same as ChallengePage keeps its results screen visible behind
    // the sheet rather than cutting to an empty frame.
    return frame(
      <>
        <Lesson
          key="intro"
          lesson={electricalBasicsLesson}
          showExit={false}
          onExit={handleIntroCaptureShown}
          onComplete={handleComplete}
          bolts={bolts}
          boltPulse={boltPulse}
          onEarnBolt={handleEarnBolt}
          streak={streak}
          bestStreak={bestStreak}
          onStreakChange={handleStreakChange}
          onStreakReset={handleStreakReset}
          onStart={handleIntroStart}
          onItemComplete={handleIntroItemComplete}
          onTimeout={handleIntroTimeout}
        />
        <CaptureSheet visible={introStep === 'capture'} onSubmitted={handleIntroLeadSubmitted} />
      </>,
    )
  }

  return frame(
    selectedLesson ? (
      <Lesson
        key={selectedLesson.id}
        lesson={selectedLesson}
        onExit={() => setSelectedLessonId(null)}
        onComplete={handleComplete}
        bolts={bolts}
        boltPulse={boltPulse}
        onEarnBolt={handleEarnBolt}
        streak={streak}
        bestStreak={bestStreak}
        onStreakChange={handleStreakChange}
        onStreakReset={handleStreakReset}
      />
    ) : (
      <HomePath
        lessons={lessonsWithStatus}
        onSelect={handleSelect}
        bolts={bolts}
        footer={
          allLessonsComplete ? (
            signupSubmitted ? (
              <SignupThankYou />
            ) : (
              <SignupGate onSubmitted={handleSignupSubmitted} />
            )
          ) : null
        }
      />
    ),
  )
}
