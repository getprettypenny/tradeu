import { useState } from 'react'
import { Link } from 'react-router-dom'
import { submitLead } from '../../lib/formspree'
import { addLead } from '../../lib/leads'
import { saveLeadCaptured } from '../../lib/progress'

const TRADE_LABEL = {
  electrical: '⚡ Electrical',
  plumbing: '🔧 Plumbing',
  hvac: '❄️ HVAC',
  'not-sure': 'Not sure',
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function LeadForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [zip, setZip] = useState('')
  const [trade, setTrade] = useState('')
  const [wantsMatch, setWantsMatch] = useState(true)
  const [status, setStatus] = useState('idle') // idle | submitting | error
  const [submitted, setSubmitted] = useState(false)

  const valid = name.trim() && isValidEmail(email) && /^\d{5}$/.test(zip) && trade

  async function handleSubmit(e) {
    e.preventDefault()
    if (!valid) return

    setStatus('submitting')
    try {
      await submitLead({ name, email, zip, trade, wantsMatch, source: 'landing-page' })
      addLead({
        name,
        email,
        zip,
        trade,
        status: 'New',
        notes: '',
        programMatch: wantsMatch ? 'yes' : 'no',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      })
      saveLeadCaptured()
      setSubmitted(true)
    } catch {
      setStatus('error')
    }
  }

  if (submitted) {
    return (
      <div className="form-card">
        <div className="success-state" style={{ display: 'block' }}>
          <h3>You're in.</h3>
          <p>Your first lesson is ready. It takes about 5 minutes.</p>
          <Link to="/play" className="success-btn">
            Start Your First Lesson →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="form-card">
      <h3>Find your path</h3>
      <p className="sub">Takes about 30 seconds.</p>

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="f-name">First name</label>
          <input
            id="f-name"
            type="text"
            placeholder="e.g. Marcus"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="f-email">Email address</label>
          <input
            id="f-email"
            type="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="f-zip">Zip code</label>
          <input
            id="f-zip"
            type="text"
            placeholder="e.g. 90402"
            maxLength={5}
            inputMode="numeric"
            value={zip}
            onChange={(e) => setZip(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="f-trade">Which trade interests you?</label>
          <select id="f-trade" value={trade} onChange={(e) => setTrade(e.target.value)}>
            <option value="">Select a trade…</option>
            {Object.entries(TRADE_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            fontSize: 13,
            color: 'var(--ink-2)',
            marginBottom: 14,
            cursor: 'pointer',
          }}
        >
          <input
            type="checkbox"
            checked={wantsMatch}
            onChange={(e) => setWantsMatch(e.target.checked)}
            style={{ marginTop: 2 }}
          />
          Match me with electrical and plumbing programs near you. Free, no obligation.
        </label>

        <button type="submit" className="submit-btn" disabled={!valid || status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Get Free Access'}
        </button>

        {status === 'error' && (
          <p style={{ fontSize: 13, color: 'var(--lp-red)', marginTop: 10 }}>
            Something went wrong. Mind trying again?
          </p>
        )}

        <p className="form-fine">
          By signing up you agree to receive occasional emails about TradeU and programs near you.
        </p>
      </form>
    </div>
  )
}
