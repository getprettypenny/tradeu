import { useState } from 'react'
import { Link } from 'react-router-dom'
import LeadForm from '../components/landing/LeadForm'
import CrmGate from '../components/landing/CrmGate'
import CrmDashboard from '../components/landing/CrmDashboard'
import { loadLeadCaptured } from '../lib/progress'
import './landing.css'

const TICKER_ITEMS = [
  '⚡ ELECTRICAL',
  '🔧 PLUMBING',
  '❄️ HVAC',
  '500K JOBS UNFILLED',
  '$48–72/HR LICENSED',
  'FREE TO START',
]

const PROBLEMS = [
  {
    tag: 'No way to test fit',
    body: "There's no quick way to find out if you'd actually like the work before enrolling somewhere and spending money.",
  },
  {
    tag: "Code books aren't teaching tools",
    body: (
      <>
        The NEC and IPC read like legal documents. <strong>There's no plain-English starting point</strong>{' '}
        for someone brand new to the field.
      </>
    ),
  },
  {
    tag: 'Nobody tells you what to expect',
    body: 'Pay cuts in year one, physical demands, and schedule pressure alongside a current job are rarely explained clearly before someone applies.',
  },
  {
    tag: 'Knowledge gets gatekept',
    body: (
      <>
        On most job sites, <strong>experienced workers protect their position</strong> instead of
        teaching. Success depends on luck, not access.
      </>
    ),
  },
]

function Ticker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="ticker">
      <div className="ticker-inner">
        {doubled.map((item, i) => (
          <span key={i}>
            <span className="ticker-item">{item}</span>
            {i < doubled.length - 1 && <span className="ticker-item ticker-sep">·</span>}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [crmGateOpen, setCrmGateOpen] = useState(false)
  const [crmDashboardOpen, setCrmDashboardOpen] = useState(false)
  const [alreadyCaptured] = useState(() => loadLeadCaptured())

  function scrollToForm() {
    document.getElementById('signup')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="landing-page">
      <nav className="site-nav">
        <div className="nav-inner">
          <div className="nav-logo">
            <span className="bolt">⚡</span> TRADEUNI
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <button type="button" className="crm-link" onClick={() => setCrmGateOpen(true)}>
              CRM ↗
            </button>
            <button type="button" className="nav-cta" onClick={scrollToForm}>
              Get Started Free
            </button>
          </div>
        </div>
      </nav>

      <Ticker />

      <section className="hero">
        <div className="wrap">
          <div className="hero-kicker">Trades education · Free to start</div>
          <h1>
            The trades need people.
            <br />
            <em>Find out if you're one of them.</em>
          </h1>
          <p className="hero-sub">
            TradeUni helps you figure out if a trade career fits before you commit to a program. Short
            lessons, real job site scenarios, no fluff. Electrical and plumbing to start.
          </p>
          <div className="hero-btns">
            <button type="button" className="btn-ink" onClick={scrollToForm}>
              Find My Path: It's Free
            </button>
            <button
              type="button"
              className="btn-ghost"
              onClick={() => document.getElementById('why')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Why TradeUni
            </button>
          </div>
        </div>
      </section>

      <div className="stats">
        <div className="stat">
          <div className="stat-n">65%</div>
          <div className="stat-l">of apprentices never finish their program</div>
        </div>
        <div className="stat">
          <div className="stat-n">81,000</div>
          <div className="stat-l">electrician job openings every year in the US</div>
        </div>
        <div className="stat">
          <div className="stat-n">$48–72</div>
          <div className="stat-l">per hour for a licensed journeyman electrician in LA</div>
        </div>
        <div className="stat">
          <div className="stat-n">$0</div>
          <div className="stat-l">to find out if it's the right fit for you</div>
        </div>
      </div>

      <section className="section" id="why">
        <div className="wrap">
          <div className="section-mono">The problem</div>
          <h2>Most people don't get a real look before they commit.</h2>
          <p className="section-sub">
            Trade programs ask for months and money before you know if the work suits you. TradeUni starts
            the other way around.
          </p>
          <div className="prob-table">
            {PROBLEMS.map((p) => (
              <div className="prob-row" key={p.tag}>
                <div className="prob-tag">{p.tag}</div>
                <div className="prob-body">{p.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="form-section" id="signup">
        <div className="wrap">
          <div className="form-grid">
            <div className="form-left">
              <div className="section-mono">Get started</div>
              <h2>Find out if a trade is right for you, free.</h2>
              <p>We'll match you to resources, programs, and lessons based on your trade interest and location.</p>
              <div className="trust-list">
                <div className="trust-item">
                  <div className="trust-check">✓</div>
                  Free to start, no credit card needed
                </div>
                <div className="trust-item">
                  <div className="trust-check">✓</div>
                  5-minute lessons built for busy schedules
                </div>
                <div className="trust-item">
                  <div className="trust-check">✓</div>
                  Programs near you based on your zip code
                </div>
                <div className="trust-item">
                  <div className="trust-check">✓</div>
                  No spam. Unsubscribe any time.
                </div>
              </div>
            </div>
            <div>
              {alreadyCaptured ? (
                <div className="form-card">
                  <h3>Welcome back.</h3>
                  <p className="sub">We've already got your info on file.</p>
                  <Link to="/play" className="success-btn" style={{ display: 'block', textAlign: 'center' }}>
                    Start a Lesson →
                  </Link>
                </div>
              ) : (
                <LeadForm />
              )}
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="footer-inner">
          <div className="footer-logo">⚡ TRADEUNI</div>
          <div className="footer-r">Built in Santa Monica, CA · © 2026</div>
        </div>
      </footer>

      {crmGateOpen && (
        <CrmGate
          onUnlock={() => {
            setCrmGateOpen(false)
            setCrmDashboardOpen(true)
          }}
          onClose={() => setCrmGateOpen(false)}
        />
      )}
      {crmDashboardOpen && <CrmDashboard onClose={() => setCrmDashboardOpen(false)} />}
    </div>
  )
}
