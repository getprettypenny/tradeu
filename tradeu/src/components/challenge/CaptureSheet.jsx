import { useRef, useState } from 'react'
import { submitLead } from '../../lib/formspree'

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

// Hard-gated bottom sheet: no close button, backdrop tap does nothing,
// and dragging it down always rubber-bands back rather than actually
// dismissing. Per spec, there is no way out without submitting at
// least an email (the minimal-mode form on the flip side).
export default function CaptureSheet({ visible, onSubmitted }) {
  const [mode, setMode] = useState('full') // full | minimal
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
            <h3 className="text-base font-semibold mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Save your score
            </h3>
            <p className="text-sm mb-2" style={{ color: 'var(--ink-2)' }}>
              Get notified when new scenes drop, and find out what's next for your trade.
            </p>

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
              {status === 'submitting' ? 'Saving…' : 'Save My Score'}
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
              Just save my email →
            </button>
          </form>
        ) : (
          <form onSubmit={handleMinimalSubmit} className="flex flex-col gap-2.5">
            <h3 className="text-base font-semibold mb-0.5" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Just your email
            </h3>
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
              {status === 'submitting' ? 'Saving…' : 'Remind me when new scenes drop.'}
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
              ← Fill out full form
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
