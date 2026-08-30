import { useState } from 'react'

// TODO: replace with a real Formspree (or similar) endpoint, e.g.
// https://formspree.io/f/xxxxxxxx — sign up free at formspree.io,
// create a form, and paste its endpoint URL here.
const FORM_ENDPOINT = 'REPLACE_WITH_YOUR_FORM_ENDPOINT'

const inputStyle = {
  background: '#FFFFFF',
  border: '1px solid var(--border)',
  color: 'var(--ink)',
}

export default function SignupGate({ onSubmitted }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [interest, setInterest] = useState('trade-school')
  const [status, setStatus] = useState('idle') // idle | submitting | error

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim() || !email.trim()) return

    if (FORM_ENDPOINT === 'REPLACE_WITH_YOUR_FORM_ENDPOINT') {
      // eslint-disable-next-line no-console
      console.warn('SignupGate: FORM_ENDPOINT is still a placeholder — set a real Formspree URL.')
      onSubmitted()
      return
    }

    setStatus('submitting')
    try {
      const res = await fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, interest }),
      })
      if (!res.ok) throw new Error('submit failed')
      onSubmitted()
    } catch {
      setStatus('error')
    }
  }

  return (
    <div
      className="mx-5 mb-6 rounded-2xl p-5"
      style={{ background: '#FFF6D6', border: '1px solid #F0D98A' }}
    >
      <p className="text-base font-semibold mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
        🎉 You finished every lesson!
      </p>
      <p className="text-sm mb-4" style={{ color: 'var(--ink-2)' }}>
        More lessons are on the way. Leave your info and we'll let you know when they're ready
        — and if you're weighing trade school, tell us that too.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2.5">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          className="rounded-xl px-3.5 py-2.5 text-sm outline-none"
          style={inputStyle}
        />
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="rounded-xl px-3.5 py-2.5 text-sm outline-none"
          style={inputStyle}
        />
        <select
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          className="rounded-xl px-3.5 py-2.5 text-sm outline-none"
          style={inputStyle}
        >
          <option value="trade-school">I'm interested in trade school</option>
          <option value="more-lessons">Just want more lessons like this</option>
          <option value="both">Both!</option>
        </select>

        <button
          type="submit"
          disabled={status === 'submitting'}
          className="rounded-xl py-2.5 text-sm font-semibold mt-1"
          style={{ background: 'var(--ink)', color: '#fff', opacity: status === 'submitting' ? 0.7 : 1 }}
        >
          {status === 'submitting' ? 'Sending…' : 'Notify me'}
        </button>

        {status === 'error' && (
          <p className="text-xs" style={{ color: 'var(--red)' }}>
            Something went wrong — mind trying again?
          </p>
        )}
      </form>
    </div>
  )
}
