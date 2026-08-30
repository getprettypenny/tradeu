import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import GamePage from './pages/GamePage'
import ChallengePage from './pages/ChallengePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/play" element={<GamePage />} />
        <Route path="/challenge" element={<ChallengePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
