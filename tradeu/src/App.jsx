import { useState } from 'react'
import Lesson from './components/Lesson'
import LessonList from './components/LessonList'
import { electricalBasicsLesson } from './lessons/electricalBasics'
import { knowYourWiresLesson } from './lessons/knowYourWires'

const lessons = [electricalBasicsLesson, knowYourWiresLesson]

function App() {
  const [selectedLessonId, setSelectedLessonId] = useState(null)
  const selectedLesson = lessons.find((l) => l.id === selectedLessonId) ?? null

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
          />
        ) : (
          <LessonList lessons={lessons} onSelect={setSelectedLessonId} />
        )}
      </div>
    </div>
  )
}

export default App
