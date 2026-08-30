import { useState } from 'react'
import Lesson from '../components/Lesson'
import HomePath from '../components/HomePath'
import SignupGate from '../components/SignupGate'
import SignupThankYou from '../components/SignupThankYou'
import { electricalBasicsLesson } from '../lessons/electricalBasics'
import { knowYourWiresLesson } from '../lessons/knowYourWires'
import { gfciAfciLesson } from '../lessons/gfciAfci'
import {
  loadCompletedLessonIds,
  saveCompletedLessonIds,
  loadBolts,
  saveBolts,
  loadSignupSubmitted,
  saveSignupSubmitted,
} from '../lib/progress'

const lessons = [electricalBasicsLesson, knowYourWiresLesson, gfciAfciLesson]

export default function GamePage() {
  const [selectedLessonId, setSelectedLessonId] = useState(null)
  const [completedLessonIds, setCompletedLessonIds] = useState(() => loadCompletedLessonIds())
  const [bolts, setBolts] = useState(() => loadBolts())
  const [boltPulse, setBoltPulse] = useState(0)
  const [signupSubmitted, setSignupSubmitted] = useState(() => loadSignupSubmitted())

  const selectedLesson = lessons.find((l) => l.id === selectedLessonId) ?? null
  const allLessonsComplete = lessons.every((l) => completedLessonIds.includes(l.id))

  const lessonsWithStatus = lessons.map((lesson, i) => ({
    ...lesson,
    completed: completedLessonIds.includes(lesson.id),
    // the first lesson is always open; every other one needs the one before it done
    locked: i > 0 && !completedLessonIds.includes(lessons[i - 1].id),
  }))

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
    saveSignupSubmitted()
    setSignupSubmitted(true)
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
        {selectedLesson ? (
          <Lesson
            key={selectedLesson.id}
            lesson={selectedLesson}
            onExit={() => setSelectedLessonId(null)}
            onComplete={handleComplete}
            bolts={bolts}
            boltPulse={boltPulse}
            onEarnBolt={handleEarnBolt}
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
        )}
      </div>
    </div>
  )
}
