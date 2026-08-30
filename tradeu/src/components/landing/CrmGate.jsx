import { useState } from 'react'

// NOTE: this is a convenience gate for local demo use, not real
// security — the check runs entirely client-side, so anyone reading
// the page source (or just opening devtools) can see or bypass it.
// Never put anything actually sensitive behind this.
const CRM_PASSWORD = '9988'

export default function CrmGate({ onUnlock, onClose }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()
    if (password === CRM_PASSWORD) {
      onUnlock()
    } else {
      setError(true)
      setPassword('')
    }
  }

  return (
    <div id="crm-gate" className="landing-page">
      <div className="gate-box">
        <div className="gate-top">
          <h3>CRM Access</h3>
          <button type="button" className="gate-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>
        <p>Enter your password to view the lead dashboard.</p>
        <form onSubmit={handleSubmit}>
          <input
            className="gate-input"
            type="password"
            placeholder="Password"
            autoFocus
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError(false)
            }}
          />
          <button type="submit" className="gate-btn">
            Enter Dashboard
          </button>
          {error && <div className="gate-err" style={{ display: 'block' }}>Wrong password — try again</div>}
        </form>
      </div>
    </div>
  )
}
