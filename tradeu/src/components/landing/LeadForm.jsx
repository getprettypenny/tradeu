import { useState } from 'react'
import { Link } from 'react-router-dom'
import { submitLead } from '../../lib/formspree'
import { addLead, updateLead } from '../../lib/leads'

const TRADE_LABEL = {
  electrical: '⚡ Electrical',
  plumbing: '🔧 Plumbing',
  hvac: '❄️ HVAC',
  'not-sure': '— Not sure',
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function LeadForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [zip, setZip] = useState('')
  const [trade, setTrade] = useState('')
  const [status, setStatus] = useState('idle') // idle | submitting | error
  const [submittedLeadId, setSubmittedLeadId] = useState(null)
  const [step, setStep] = useState('form') // form | app | matched | no-match

  const valid = name.trim() && isValidEmail(email) && /^\d{5}$/.test(zip) && trade

  async function handleSubmit(e) {
    e.preventDefault()
    if (!valid) return

    setStatus('submitting')
    try {
      await submitLead({ name, email, zip, trade, source: 'landing-page' })
      const lead = addLead({
        name,
        email,
        zip,
        trade,
        status: 'New',
        notes: '',
        programMatch: 'pending',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      })
      setSubmittedLeadId(lead.id)
      setStep('app')
    } catch {
      setStatus('error')
    }
  }

  function handleMatch(wantsMatch) {
    if (submittedLeadId) updateLead(submittedLeadId, { programMatch: wantsMatch ? 'yes' : 'no' })
    setStep(wantsMatch ? 'matched' : 'no-match')
  }

  if (step === 'app' || step === 'matched' || step === 'no-match') {
    return (
      <div className="form-card">
        <div className="success-state" style={{ display: 'block' }}>
          {step === 'app' && (
            <div>
              <h3>You're in.</h3>
              <p>Your first lesson is ready — it takes about 5 minutes.</p>
              <Link to="/play" className="success-btn">
                Start Your First Lesson →
              </Link>
              <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid var(--line)' }}>
                <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--lp-ink)', marginBottom: 6 }}>
                  One more thing —
                </p>
                <p style={{ fontSize: 14, color: 'var(--ink-2)', marginBottom: 16, lineHeight: 1.6 }}>
                  Would you like us to match you with electrical and plumbing programs near you? Free —
                  no obligation.
                </p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => handleMatch(true)}
                    style={{
                      flex: 1,
                      background: 'var(--lp-ink)',
                      color: 'var(--white)',
                      border: 'none',
                      padding: 12,
                      fontSize: 14,
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: "'IBM Plex Sans', sans-serif",
                    }}
                  >
                    Yes, match me
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMatch(false)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      color: 'var(--ink-2)',
                      border: '1.5px solid var(--line)',
                      padding: 12,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontFamily: "'IBM Plex Sans', sans-serif",
                    }}
                  >
                    No thanks
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'matched' && (
            <div>
              <p style={{ fontSize: 32, marginBottom: 12 }}>⚡</p>
              <h3>We'll be in touch.</h3>
              <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 16 }}>
                We'll reach out with programs near you based on your zip code and trade interest. In the
                meantime — start your first lesson.
              </p>
              <Link to="/play" className="success-btn">
                Start Your First Lesson →
              </Link>
            </div>
          )}

          {step === 'no-match' && (
            <div>
              <p style={{ fontSize: 32, marginBottom: 12 }}>👍</p>
              <h3>Got it.</h3>
              <p style={{ fontSize: 14, color: 'var(--ink-2)', lineHeight: 1.6, marginBottom: 16 }}>
                No worries — your lesson is ready whenever you are.
              </p>
              <Link to="/play" className="success-btn">
                Start Your First Lesson →
              </Link>
            </div>
          )}
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

        <button type="submit" className="submit-btn" disabled={!valid || status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Get Free Access'}
        </button>

        {status === 'error' && (
          <p style={{ fontSize: 13, color: 'var(--lp-red)', marginTop: 10 }}>
            Something went wrong — mind trying again?
          </p>
        )}

        <p className="form-fine">
          By signing up you agree to receive occasional emails about TradeU and programs near you.
        </p>
      </form>
    </div>
  )
}
