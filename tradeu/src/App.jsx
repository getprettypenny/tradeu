import Lesson from './components/Lesson'
import { electricalBasicsLesson } from './lessons/electricalBasics'

function App() {
  return (
    <div
      className="min-h-screen w-full flex justify-center md:py-8 md:px-4"
      style={{ background: '#EAE3D3' }}
    >
      <div
        className="relative w-full max-w-[430px] min-h-screen md:min-h-0 flex flex-col overflow-hidden md:rounded-[2.5rem] md:shadow-2xl md:border"
        style={{ background: 'var(--bg)', borderColor: 'var(--border)' }}
      >
        <Lesson lesson={electricalBasicsLesson} />
      </div>
    </div>
  )
}

export default App
