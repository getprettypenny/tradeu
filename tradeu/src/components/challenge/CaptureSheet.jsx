import { useRef, useState } from 'react'
import { submitLead } from '../../lib/formspree'
import { trackLead } from '../../lib/pixel'

const TRADE_OPTIONS = [
  { value: 'electrical', label: '⚡ Electrical' },
  { value: 'plumbing', label: '🔧 Plumbing' },
  { value: 'hvac', label: '❄️ HVAC' },
  { value: 'not-sure', label: 'Not sure' },
]

const JOURNEY_OPTIONS = [
  { value: 'exploring', label: 'Just exploring' },
  { value: 'switching', label: 'Thinking about switching' },
  { value: 'in-program', label: 'Already in a program' },
  { value: 'ready', label: 'Ready to apply' },
]

const inputStyle = {
  background: '#FFFFFF',
  border: '1px solid var(--border)',
  color: 'var(--ink)',
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

// Three retention hooks borrowed from Duolingo/mobile-game onboarding,
// shown above the form itself: loss aversion (bolts + streak they'd be
// walking away from), and a curiosity-gap preview of what's still
// locked. Shared between both form modes so the pitch doesn't change
// depending on which one someone's looking at.
function StatsRecap({ bolts, streakDays, nextLessons }) {
  return (
    <>
      <div className="flex items-center gap-3 mb-1">
        <div className="flex items-center gap-1 text-lg font-bold" style={{ color: '#8A6D00' }}>
          <span aria-hidden="true">⚡</span>
          <span>{bolts}</span>
        </div>
        {streakDays > 0 && (
          <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: '#C99400' }}>
            <span aria-hidden="true">🔥</span>
            <span>{streakDays}-day streak</span>
          </div>
        )}
      </div>
      <h3 className="text-base font-semibold mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        Don't lose your bolts
      </h3>
      <p className="text-sm mb-2" style={{ color: 'var(--ink-2)' }}>
        Make a free account so your {bolts} bolts{streakDays > 0 ? ' and streak' : ''} are saved, and keep playing.
      </p>
      {nextLessons.length > 0 && (
        <div className="flex gap-2 mb-2">
          {nextLessons.map((l) => (
            <div
              key={l.id}
              className="flex-1 rounded-xl p-2.5 text-xs"
              style={{ background: '#F5F0E8', border: '1px dashed var(--border)', color: 'var(--ink-2)' }}
            >
              <div className="flex items-center gap-1 font-semibold mb-0.5" style={{ color: 'var(--ink)' }}>
                <span aria-hidden="true">🔒</span>
                <span>{l.title}</span>
              </div>
              <p>{l.description}</p>
            </div>
          ))}
        </div>
      )}
    </>
  )
}

// Hard-gated bottom sheet: no close button, backdrop tap does nothing,
// and dragging it down always rubber-bands back rather than actually
// dismissing. Per spec, there is no way out without submitting at
// least an email.
//
// Defaults to the minimal (email-only) form, not the full one: real ad
// traffic was converting at 0% with the 5-field form as the first
// thing shown. Lowest-friction ask goes first now, with the fuller
// form as an opt-in upgrade for people willing to give more, not the
// other way around.
export default function CaptureSheet({ visible, onSubmitted, bolts = 0, streakDays = 0, nextLessons = [] }) {
  const [mode, setMode] = useState('minimal') // minimal | full
  const [firstName, setFirstName] = useState('')
  const [email, setEmail] = useState('')
  const [zip, setZip] = useState('')
  const [trade, setTrade] = useState('')
  const [journeyStage, setJourneyStage] = useState('')
  const [minimalEmail, setMinimalEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | error
  const [dragY, setDragY] = useState(0)
  const dragging = useRef(false)

  const fullValid = firstName.trim() && isValidEmail(email) && /^\d{5}$/.test(zip) && trade && journeyStage
  const minimalValid = isValidEmail(minimalEmail)

  async function handleFullSubmit(e) {
    e.preventDefault()
    if (!fullValid) return
    setStatus('submitting')
    try {
      await submitLead({ firstName, email, zip, trade, journeyStage, source: 'full' })
      trackLead('full')
      onSubmitted()
    } catch {
      setStatus('error')
    }
  }

  async function handleMinimalSubmit(e) {
    e.preventDefault()
    if (!minimalValid) return
    setStatus('submitting')
    try {
      await submitLead({ email: minimalEmail, source: 'minimal' })
      trackLead('minimal')
      onSubmitted()
    } catch {
      setStatus('error')
    }
  }

  function handlePointerDown(e) {
    dragging.current = { startY: e.clientY }
  }
  function handlePointerMove(e) {
    if (!dragging.current) return
    const delta = e.clientY - dragging.current.startY
    if (delta > 0) setDragY(Math.min(delta * 0.4, 70))
  }
  function handlePointerUp() {
    dragging.current = false
    setDragY(0) // always rubber-bands back: this sheet never actually closes
  }

  return (
    <div
      className="absolute inset-0 z-30 flex items-end justify-center"
      style={{
        background: 'rgba(0,0,0,0.5)',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        transition: 'opacity 200ms ease-out',
      }}
      aria-hidden={!visible}
    >
      <div
        className="relative w-full rounded-t-3xl p-5 pb-7 shadow-[0_-8px_24px_rgba(0,0,0,0.15)]"
        style={{
          background: '#FFFFFF',
          borderTop: '1px solid var(--border)',
          transform: visible ? `translateY(${dragY}px)` : 'translateY(100%)',
          transition: dragging.current ? 'none' : 'transform 320ms cubic-bezier(0.32,0.72,0,1)',
          touchAction: 'none',
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="w-10 h-1.5 rounded-full mx-auto mb-4" style={{ background: 'var(--border)' }} />

        {mode === 'full' ? (
          <form onSubmit={handleFullSubmit} className="flex flex-col gap-2.5">
            <StatsRecap bolts={bolts} streakDays={streakDays} nextLessons={nextLessons} />

            <input
              required
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="rounded-xl px-3.5 py-2.5 text-sm outline-none"
              style={inputStyle}
            />
            <input
              required
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl px-3.5 py-2.5 text-sm outline-none"
              style={inputStyle}
            />
            <input
              required
              placeholder="Zip code"
              maxLength={5}
              inputMode="numeric"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
              className="rounded-xl px-3.5 py-2.5 text-sm outline-none"
              style={inputStyle}
            />
            <select
              required
              value={trade}
              onChange={(e) => setTrade(e.target.value)}
              className="rounded-xl px-3.5 py-2.5 text-sm outline-none"
              style={inputStyle}
            >
              <option value="">Trade interest…</option>
              {TRADE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
            <select
              required
              value={journeyStage}
              onChange={(e) => setJourneyStage(e.target.value)}
              className="rounded-xl px-3.5 py-2.5 text-sm outline-none"
              style={inputStyle}
            >
              <option value="">Where are you at?…</option>
              {JOURNEY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>

            <button
              type="submit"
              disabled={!fullValid || status === 'submitting'}
              className="rounded-xl py-2.5 text-sm font-bold mt-1"
              style={{
                background: 'var(--yellow)',
                color: 'var(--ink)',
                opacity: !fullValid || status === 'submitting' ? 0.6 : 1,
              }}
            >
              {status === 'submitting' ? 'Creating…' : 'Create My Account'}
            </button>
            {status === 'error' && (
              <p className="text-xs" style={{ color: 'var(--red)' }}>
                Something went wrong. Mind trying again?
              </p>
            )}

            <button
              type="button"
              onClick={() => setMode('minimal')}
              className="text-xs font-semibold mt-1 text-center"
              style={{ color: 'var(--ink-2)' }}
            >
              ← Just save my email instead
            </button>
          </form>
        ) : (
          <form onSubmit={handleMinimalSubmit} className="flex flex-col gap-2.5">
            <StatsRecap bolts={bolts} streakDays={streakDays} nextLessons={nextLessons} />
            <input
              required
              type="email"
              placeholder="Email"
              value={minimalEmail}
              onChange={(e) => setMinimalEmail(e.target.value)}
              className="rounded-xl px-3.5 py-2.5 text-sm outline-none"
              style={inputStyle}
            />
            <button
              type="submit"
              disabled={!minimalValid || status === 'submitting'}
              className="rounded-xl py-2.5 text-sm font-bold mt-1"
              style={{
                background: 'var(--yellow)',
                color: 'var(--ink)',
                opacity: !minimalValid || status === 'submitting' ? 0.6 : 1,
              }}
            >
              {status === 'submitting' ? 'Creating…' : 'Create My Account'}
            </button>
            {status === 'error' && (
              <p className="text-xs" style={{ color: 'var(--red)' }}>
                Something went wrong. Mind trying again?
              </p>
            )}

            <button
              type="button"
              onClick={() => setMode('full')}
              className="text-xs font-semibold mt-1 text-center"
              style={{ color: 'var(--ink-2)' }}
            >
              Want to be matched with a trade program near you? →
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
