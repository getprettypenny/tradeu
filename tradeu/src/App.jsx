import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import LandingPage from './pages/LandingPage'
import GamePage from './pages/GamePage'
import ChallengePage from './pages/ChallengePage'
import { initPixel, trackPageView } from './lib/pixel'
import { captureUtmParams } from './lib/utm'

// Renders nothing -- just runs the app-wide analytics setup once
// (UTM capture, Meta Pixel init) and fires a PageView on every
// client-side route change. Has to live inside BrowserRouter to read
// the current location.
function Analytics() {
  const location = useLocation()
  const isFirstRender = useRef(true)

  useEffect(() => {
    captureUtmParams()
    initPixel() // sends the first PageView itself
  }, [])

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    trackPageView()
  }, [location.pathname])

  return null
}

function App() {
  return (
    <BrowserRouter>
      <Analytics />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/play" element={<GamePage />} />
        <Route path="/challenge" element={<ChallengePage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
