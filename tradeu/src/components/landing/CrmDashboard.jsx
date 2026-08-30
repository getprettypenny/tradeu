import { useMemo, useState } from 'react'
import { loadLeads, updateLead, clearLeads } from '../../lib/leads'

const TRADE_LABEL = {
  electrical: '⚡ Electrical',
  plumbing: '🔧 Plumbing',
  hvac: '❄️ HVAC',
  'not-sure': 'Not sure',
}

function exportCSV(leads) {
  if (!leads.length) {
    alert('No leads to export yet.')
    return
  }
  const rows = [
    ['Name', 'Email', 'Zip', 'Trade', 'Program Match', 'Status', 'Notes', 'Date'],
    ...leads.map((l) => [l.name, l.email, l.zip, l.trade, l.programMatch || 'pending', l.status, l.notes || '', l.date]),
  ]
  const csv = rows.map((r) => r.map((v) => `"${v}"`).join(',')).join('\n')
  const a = document.createElement('a')
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
  a.download = 'tradeu-leads-' + new Date().toISOString().slice(0, 10) + '.csv'
  a.click()
}

export default function CrmDashboard({ onClose }) {
  const [leads, setLeads] = useState(() => loadLeads())
  const [search, setSearch] = useState('')
  const [tradeFilter, setTradeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  function handleUpdate(id, patch) {
    updateLead(id, patch)
    setLeads(loadLeads())
  }

  function handleClearAll() {
    if (!confirm('Delete ALL leads? Cannot be undone.')) return
    clearLeads()
    setLeads([])
  }

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return leads.filter((l) => {
      const matchesSearch = !q || l.name.toLowerCase().includes(q) || l.email.toLowerCase().includes(q)
      const matchesTrade = !tradeFilter || l.trade === tradeFilter
      const matchesStatus = !statusFilter || l.status === statusFilter
      return matchesSearch && matchesTrade && matchesStatus
    })
  }, [leads, search, tradeFilter, statusFilter])

  const stats = {
    total: leads.length,
    new: leads.filter((l) => l.status === 'New').length,
    contacted: leads.filter((l) => l.status === 'Contacted').length,
    enrolled: leads.filter((l) => l.status === 'Enrolled').length,
    wantMatch: leads.filter((l) => l.programMatch === 'yes').length,
  }

  return (
    <div id="crm-dashboard" className="landing-page">
      <div className="crm-header">
        <div className="crm-logo">
          <span className="bolt">⚡</span> TRADEU · Lead Dashboard
        </div>
        <div className="crm-hbtns">
          <button type="button" className="crm-btn" onClick={() => exportCSV(leads)}>
            Export CSV
          </button>
          <button type="button" className="crm-btn" onClick={onClose}>
            ✕ Close
          </button>
        </div>
      </div>

      <div className="crm-body">
        <p className="crm-note">
          Local demo data only. This reflects this browser, not every visitor. Real submissions go to
          your Formspree inbox.
        </p>

        <div className="crm-stats">
          <div className="crm-stat">
            <div className="crm-stat-n">{stats.total}</div>
            <div className="crm-stat-l">Total leads</div>
          </div>
          <div className="crm-stat">
            <div className="crm-stat-n" style={{ color: '#b38600' }}>
              {stats.new}
            </div>
            <div className="crm-stat-l">New</div>
          </div>
          <div className="crm-stat">
            <div className="crm-stat-n" style={{ color: '#1A3799' }}>
              {stats.contacted}
            </div>
            <div className="crm-stat-l">Contacted</div>
          </div>
          <div className="crm-stat">
            <div className="crm-stat-n" style={{ color: 'var(--teal)' }}>
              {stats.enrolled}
            </div>
            <div className="crm-stat-l">Enrolled</div>
          </div>
          <div className="crm-stat">
            <div className="crm-stat-n" style={{ color: '#0D9373' }}>
              {stats.wantMatch}
            </div>
            <div className="crm-stat-l">Want program match</div>
          </div>
        </div>

        <div className="crm-controls">
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <input
              className="crm-search"
              type="text"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <select className="crm-filter" value={tradeFilter} onChange={(e) => setTradeFilter(e.target.value)}>
              <option value="">All trades</option>
              {Object.entries(TRADE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select className="crm-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Enrolled">Enrolled</option>
            </select>
          </div>
          <button type="button" className="crm-danger-btn" onClick={handleClearAll}>
            Clear All
          </button>
        </div>

        <div className="crm-table-wrap">
          {filtered.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Zip</th>
                  <th>Trade</th>
                  <th>Match?</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 600 }}>{l.name}</td>
                    <td className="td-mono">
                      <a href={`mailto:${l.email}`} style={{ color: 'var(--lp-ink)', textDecoration: 'none' }}>
                        {l.email}
                      </a>
                    </td>
                    <td className="td-mono">{l.zip}</td>
                    <td style={{ fontSize: 13 }}>{TRADE_LABEL[l.trade] || l.trade}</td>
                    <td style={{ fontSize: 13 }}>{l.programMatch === 'yes' ? '✓' : l.programMatch === 'no' ? '✕' : '…'}</td>
                    <td>
                      <select
                        className="status-select"
                        value={l.status}
                        onChange={(e) => handleUpdate(l.id, { status: e.target.value })}
                      >
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Enrolled</option>
                      </select>
                    </td>
                    <td>
                      <input
                        className="note-input"
                        type="text"
                        defaultValue={l.notes || ''}
                        placeholder="Add note…"
                        onBlur={(e) => handleUpdate(l.id, { notes: e.target.value })}
                      />
                    </td>
                    <td className="td-mono" style={{ color: 'var(--ink-3)', fontSize: 12, whiteSpace: 'nowrap' }}>
                      {l.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="crm-empty">No leads yet. Share the landing page to start collecting signups.</div>
          )}
        </div>
      </div>
    </div>
  )
}
