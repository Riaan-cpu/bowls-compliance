import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const modules = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'licences', label: 'Licences', icon: '📜' },
  { id: 'cipc', label: 'CIPC', icon: '🏛️' },
  { id: 'governance', label: 'Governance', icon: '⚖️' },
  { id: 'risk', label: 'Risk Register', icon: '⚠️' },
  { id: 'documents', label: 'Documents', icon: '📁' },
]

function parseLocalDate(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function calcStatus(dateStr) {
  if (!dateStr) return 'Compliant'
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const due = parseLocalDate(dateStr)
  const days = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
  if (days < 0) return 'Overdue'
  if (days <= 90) return 'Due Soon'
  return 'Compliant'
}

const statusColor = (status) => {
  if (status === 'Compliant') return '#16a34a'
  if (status === 'Due Soon') return '#d97706'
  if (status === 'Overdue') return '#dc2626'
  return '#6b7280'
}

const impactColor = (v) => {
  if (v === 'Critical') return '#7c3aed'
  if (v === 'High') return '#dc2626'
  if (v === 'Medium') return '#d97706'
  return '#16a34a'
}

export default function ComplianceApp({ session }) {
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [complianceItems, setComplianceItems] = useState([])
  const [licences, setLicences] = useState([])
  const [cipc, setCipc] = useState([])
  const [governance, setGovernance] = useState([])
  const [risks, setRisks] = useState([])
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [complianceForm, setComplianceForm] = useState({ name: '', due_date: '', owner: '' })
  const [licenceForm, setLicenceForm] = useState({ name: '', licence_number: '', issued_date: '', expiry_date: '', authority: '' })
  const [govForm, setGovForm] = useState({ name: '', frequency: '', last_done: '', next_due: '' })
  const [riskForm, setRiskForm] = useState({ risk: '', category: '', likelihood: 'Low', impact: 'Low', mitigation: '' })

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    setLoading(true)
    const [c, l, ci, g, r, d] = await Promise.all([
      supabase.from('compliance_items').select('*').order('due_date'),
      supabase.from('licences').select('*').order('expiry_date'),
      supabase.from('cipc').select('*'),
      supabase.from('governance').select('*').order('next_due'),
      supabase.from('risk_register').select('*'),
      supabase.from('documents').select('*').order('file_date'),
    ])
    if (!c.error) setComplianceItems(c.data ?? [])
    if (!l.error) setLicences(l.data ?? [])
    if (!ci.error) setCipc(ci.data ?? [])
    if (!g.error) setGovernance(g.data ?? [])
    if (!r.error) setRisks(r.data ?? [])
    if (!d.error) setDocuments(d.data ?? [])
    setLoading(false)
  }

  async function deleteRow(table, id) {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) { setDbError('Delete failed: ' + error.message); return }
    fetchAll()
  }

  async function addCompliance() {
    setSaving(true)
    try {
      const status = calcStatus(complianceForm.due_date)
      const { error } = await supabase.from('compliance_items').insert([{ ...complianceForm, status }])
      if (error) { setDbError('Save failed: ' + error.message); return }
      setComplianceForm({ name: '', due_date: '', owner: '' })
      setShowForm(false)
      fetchAll()
    } finally {
      setSaving(false)
    }
  }

  async function addLicence() {
    setSaving(true)
    try {
      const status = calcStatus(licenceForm.expiry_date)
      const { error } = await supabase.from('licences').insert([{ ...licenceForm, status }])
      if (error) { setDbError('Save failed: ' + error.message); return }
      setLicenceForm({ name: '', licence_number: '', issued_date: '', expiry_date: '', authority: '' })
      setShowForm(false)
      fetchAll()
    } finally {
      setSaving(false)
    }
  }

  async function addGovernance() {
    setSaving(true)
    try {
      const status = calcStatus(govForm.next_due)
      const { error } = await supabase.from('governance').insert([{ ...govForm, status }])
      if (error) { setDbError('Save failed: ' + error.message); return }
      setGovForm({ name: '', frequency: '', last_done: '', next_due: '' })
      setShowForm(false)
      fetchAll()
    } finally {
      setSaving(false)
    }
  }

  async function addRisk() {
    setSaving(true)
    try {
      const { error } = await supabase.from('risk_register').insert([riskForm])
      if (error) { setDbError('Save failed: ' + error.message); return }
      setRiskForm({ risk: '', category: '', likelihood: 'Low', impact: 'Low', mitigation: '' })
      setShowForm(false)
      fetchAll()
    } finally {
      setSaving(false)
    }
  }

  // Always recalculate status from date on display
  const itemsWithStatus = complianceItems.map(i => ({ ...i, status: calcStatus(i.due_date) }))
  const licencesWithStatus = licences.map(l => ({ ...l, status: calcStatus(l.expiry_date) }))
  const govWithStatus = governance.map(g => ({ ...g, status: calcStatus(g.next_due) }))

  const counts = {
    total: itemsWithStatus.length,
    compliant: itemsWithStatus.filter(i => i.status === 'Compliant').length,
    dueSoon: itemsWithStatus.filter(i => i.status === 'Due Soon').length,
    overdue: itemsWithStatus.filter(i => i.status === 'Overdue').length,
  }

  function daysUntil(dateStr) {
    if (!dateStr) return null
    const today = new Date(); today.setHours(0,0,0,0)
    const due = parseLocalDate(dateStr)
    const days = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
    if (days < 0) return `${Math.abs(days)}d overdue`
    if (days === 0) return 'Due today'
    return `${days}d remaining`
  }

  const inp = { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, width: '100%', boxSizing: 'border-box' }
  const addBtn = { padding: '10px 20px', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }
  const saveBtn = { padding: '8px 24px', background: '#333333', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }
  const lbl = (text) => <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>{text}</label>

  return (
    <div style={{ display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif', background: '#f5f5f5' }}>
      {/* Sidebar */}
      <div style={{ width: sidebarOpen ? 220 : 60, background: '#1a1a1a', color: 'white', transition: 'width 0.2s', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '20px 16px', borderBottom: '1px solid #333', display: 'flex', alignItems: 'center', gap: 10 }}>
          {sidebarOpen && <span style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>Compliance<br /><span style={{ opacity: 0.6, fontSize: 11 }}>White River BC</span></span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer' }}>☰</button>
        </div>
        {modules.map(m => (
          <div key={m.id} onClick={() => { setActive(m.id); setShowForm(false) }}
            style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: active === m.id ? '#333' : 'transparent', borderLeft: active === m.id ? '3px solid #fff' : '3px solid transparent' }}>
            <span style={{ fontSize: 18 }}>{m.icon}</span>
            {sidebarOpen && <span style={{ fontSize: 14 }}>{m.label}</span>}
          </div>
        ))}
        <div style={{ marginTop: 'auto', padding: 16, borderTop: '1px solid #333' }}>
          <button onClick={() => navigate('/committee')} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, width: sidebarOpen ? '100%' : 'auto' }}>
            {sidebarOpen ? '← Committee' : '←'}
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex: 1, overflow: 'auto', padding: 32 }}>

          {dbError && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 10, padding: '10px 18px', marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#dc2626', fontWeight: 600, fontSize: 13 }}>{dbError}</span>
            <button onClick={() => setDbError(null)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}>×</button>
          </div>
        )}

        {/* DASHBOARD */}
        {active === 'dashboard' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
              <div>
                <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Compliance Dashboard</h1>
                <p style={{ color: '#64748b' }}>Status auto-calculates from due date · &gt;90 days = Compliant · ≤90 days = Due Soon · Past due = Overdue</p>
              </div>
              <button onClick={() => setShowForm(!showForm)} style={addBtn}>+ Add Item</button>
            </div>

            {itemsWithStatus.filter(i => i.status === 'Overdue').length > 0 && (
              <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', borderRadius: 12, padding: '12px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>🚨</span>
                <span style={{ color: '#dc2626', fontWeight: 600 }}>{itemsWithStatus.filter(i => i.status === 'Overdue').length} item(s) are overdue and require immediate attention!</span>
              </div>
            )}
            {itemsWithStatus.filter(i => i.status === 'Due Soon').length > 0 && (
              <div style={{ background: '#fef3c7', border: '1px solid #fcd34d', borderRadius: 12, padding: '12px 20px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <span style={{ color: '#d97706', fontWeight: 600 }}>{itemsWithStatus.filter(i => i.status === 'Due Soon').length} item(s) are due within 90 days.</span>
              </div>
            )}

            {showForm && (
              <div style={{ background: 'white', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <div style={{ fontWeight: 600, marginBottom: 16, color: '#1a1a1a' }}>New Compliance Item</div>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
                  <div>{lbl('Obligation Name')}<input placeholder="e.g. Annual return filing" value={complianceForm.name} onChange={e => setComplianceForm({ ...complianceForm, name: e.target.value })} style={inp} /></div>
                  <div>
                    {lbl('Due Date')}
                    <input type="date" value={complianceForm.due_date} onChange={e => setComplianceForm({ ...complianceForm, due_date: e.target.value })} style={inp} />
                  </div>
                  <div>{lbl('Owner')}<input placeholder="Responsible person" value={complianceForm.owner} onChange={e => setComplianceForm({ ...complianceForm, owner: e.target.value })} style={inp} /></div>
                </div>
                {complianceForm.due_date && (
                  <div style={{ marginBottom: 16, padding: '8px 14px', borderRadius: 8, background: statusColor(calcStatus(complianceForm.due_date)) + '15', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: statusColor(calcStatus(complianceForm.due_date)), fontWeight: 600, fontSize: 13 }}>
                      Status will be: {calcStatus(complianceForm.due_date)} · {daysUntil(complianceForm.due_date)}
                    </span>
                  </div>
                )}
                <button onClick={addCompliance} disabled={saving} style={saveBtn}>{saving ? 'Saving...' : 'Save Item'}</button>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
              {[{ label: 'Total Items', value: counts.total, color: '#1a1a1a' }, { label: 'Compliant', value: counts.compliant, color: '#16a34a' }, { label: 'Due Soon', value: counts.dueSoon, color: '#d97706' }, { label: 'Overdue', value: counts.overdue, color: '#dc2626' }].map(c => (
                <div key={c.label} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: `3px solid ${c.color}` }}>
                  <div style={{ fontSize: 32, fontWeight: 700, color: c.color }}>{c.value}</div>
                  <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>{c.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #e2e8f0', fontWeight: 600, color: '#1a1a1a' }}>All Compliance Items</div>
              {loading ? <div style={{ padding: 40, textAlign: 'center', color: '#64748b' }}>Loading...</div> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead><tr style={{ background: '#f5f5f5' }}>
                    {['Obligation', 'Due Date', 'Days', 'Status', 'Owner', ''].map(h => <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {itemsWithStatus.map(item => (
                      <tr key={item.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 20px', fontWeight: 500 }}>{item.name}</td>
                        <td style={{ padding: '14px 20px', color: '#64748b' }}>{item.due_date}</td>
                        <td style={{ padding: '14px 20px', fontSize: 13, color: statusColor(item.status), fontWeight: 600 }}>{daysUntil(item.due_date)}</td>
                        <td style={{ padding: '14px 20px' }}><span style={{ background: statusColor(item.status) + '20', color: statusColor(item.status), padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{item.status}</span></td>
                        <td style={{ padding: '14px 20px', color: '#64748b' }}>{item.owner}</td>
                        <td style={{ padding: '14px 20px' }}><button onClick={() => deleteRow('compliance_items', item.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>🗑️</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {itemsWithStatus.length === 0 && !loading && <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No compliance items yet</div>}
            </div>
          </div>
        )}

        {/* LICENCES */}
        {active === 'licences' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
              <div><h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Licence Tracker</h1><p style={{ color: '#64748b' }}>Status auto-calculates from expiry date</p></div>
              <button onClick={() => setShowForm(!showForm)} style={addBtn}>+ Add Licence</button>
            </div>
            {showForm && (
              <div style={{ background: 'white', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
                  <div>{lbl('Licence Name')}<input placeholder="e.g. Liquor licence" value={licenceForm.name} onChange={e => setLicenceForm({ ...licenceForm, name: e.target.value })} style={inp} /></div>
                  <div>{lbl('Licence Number')}<input placeholder="Licence number" value={licenceForm.licence_number} onChange={e => setLicenceForm({ ...licenceForm, licence_number: e.target.value })} style={inp} /></div>
                  <div>{lbl('Authority')}<input placeholder="Issuing authority" value={licenceForm.authority} onChange={e => setLicenceForm({ ...licenceForm, authority: e.target.value })} style={inp} /></div>
                  <div>{lbl('Issue Date')}<input type="date" value={licenceForm.issued_date} onChange={e => setLicenceForm({ ...licenceForm, issued_date: e.target.value })} style={inp} /></div>
                  <div>
                    {lbl('Expiry Date')}
                    <input type="date" value={licenceForm.expiry_date} onChange={e => setLicenceForm({ ...licenceForm, expiry_date: e.target.value })} style={inp} />
                  </div>
                </div>
                {licenceForm.expiry_date && (
                  <div style={{ marginBottom: 12, padding: '8px 14px', borderRadius: 8, background: statusColor(calcStatus(licenceForm.expiry_date)) + '15', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: statusColor(calcStatus(licenceForm.expiry_date)), fontWeight: 600, fontSize: 13 }}>
                      Status will be: {calcStatus(licenceForm.expiry_date)} · {daysUntil(licenceForm.expiry_date)}
                    </span>
                  </div>
                )}
                <div><button onClick={addLicence} disabled={saving} style={saveBtn}>{saving ? 'Saving...' : 'Save'}</button></div>
              </div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {licencesWithStatus.map(lic => (
                <div key={lic.id} style={{ background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: `4px solid ${statusColor(lic.status)}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontWeight: 700 }}>{lic.name}</span>
                    <span style={{ background: statusColor(lic.status) + '20', color: statusColor(lic.status), padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{lic.status}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 2 }}>
                    <div><b>No:</b> {lic.licence_number}</div>
                    <div><b>Issued:</b> {lic.issued_date}</div>
                    <div><b>Expires:</b> {lic.expiry_date}</div>
                    <div><b>Authority:</b> {lic.authority}</div>
                    <div style={{ color: statusColor(lic.status), fontWeight: 600 }}>{daysUntil(lic.expiry_date)}</div>
                  </div>
                  <button onClick={() => deleteRow('licences', lic.id)} style={{ marginTop: 12, width: '100%', padding: '8px 0', background: '#f5f5f5', color: '#dc2626', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                </div>
              ))}
            </div>
            {licencesWithStatus.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No licences yet</div>}
          </div>
        )}

        {/* CIPC */}
        {active === 'cipc' && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>CIPC Management</h1>
            <p style={{ color: '#64748b', marginBottom: 28 }}>Annual return filings and registration status</p>
            {cipc.map(c => (
              <div key={c.id} style={{ background: 'white', borderRadius: 12, padding: 28, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', maxWidth: 600 }}>
                {[['Entity Name', c.entity_name], ['Registration No.', c.registration_number], ['Entity Type', c.entity_type], ['Last Annual Return', c.last_return], ['Next Due Date', c.next_due], ['Status', calcStatus(c.next_due)]].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: 8, marginBottom: 8, fontSize: 13 }}>
                    <span style={{ color: '#64748b' }}><b>{label}</b></span>
                    {label === 'Status' ? <span style={{ background: statusColor(value) + '20', color: statusColor(value), padding: '2px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{value}</span> : <span>{value}</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* GOVERNANCE */}
        {active === 'governance' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
              <div><h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Governance Obligations</h1><p style={{ color: '#64748b' }}>Status auto-calculates from next due date</p></div>
              <button onClick={() => setShowForm(!showForm)} style={addBtn}>+ Add</button>
            </div>
            {showForm && (
              <div style={{ background: 'white', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
                  <div>{lbl('Obligation')}<input placeholder="e.g. Board meeting" value={govForm.name} onChange={e => setGovForm({ ...govForm, name: e.target.value })} style={inp} /></div>
                  <div>{lbl('Frequency')}<input placeholder="e.g. Monthly" value={govForm.frequency} onChange={e => setGovForm({ ...govForm, frequency: e.target.value })} style={inp} /></div>
                  <div>{lbl('Last Done')}<input type="date" value={govForm.last_done} onChange={e => setGovForm({ ...govForm, last_done: e.target.value })} style={inp} /></div>
                  <div>{lbl('Next Due')}<input type="date" value={govForm.next_due} onChange={e => setGovForm({ ...govForm, next_due: e.target.value })} style={inp} /></div>
                </div>
                {govForm.next_due && (
                  <div style={{ marginBottom: 12, padding: '8px 14px', borderRadius: 8, background: statusColor(calcStatus(govForm.next_due)) + '15', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: statusColor(calcStatus(govForm.next_due)), fontWeight: 600, fontSize: 13 }}>
                      Status will be: {calcStatus(govForm.next_due)} · {daysUntil(govForm.next_due)}
                    </span>
                  </div>
                )}
                <div><button onClick={addGovernance} disabled={saving} style={saveBtn}>{saving ? 'Saving...' : 'Save'}</button></div>
              </div>
            )}
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f5f5f5' }}>{['Obligation', 'Frequency', 'Last Done', 'Next Due', 'Days', 'Status', ''].map(h => <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
                <tbody>{govWithStatus.map(item => (
                  <tr key={item.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 500 }}>{item.name}</td>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>{item.frequency}</td>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>{item.last_done}</td>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>{item.next_due}</td>
                    <td style={{ padding: '14px 20px', fontSize: 13, color: statusColor(item.status), fontWeight: 600 }}>{daysUntil(item.next_due)}</td>
                    <td style={{ padding: '14px 20px' }}><span style={{ background: statusColor(item.status) + '20', color: statusColor(item.status), padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{item.status}</span></td>
                    <td style={{ padding: '14px 20px' }}><button onClick={() => deleteRow('governance', item.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>🗑️</button></td>
                  </tr>
                ))}</tbody>
              </table>
              {govWithStatus.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No governance items yet</div>}
            </div>
          </div>
        )}

        {/* RISK */}
        {active === 'risk' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 28 }}>
              <div><h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Risk Register</h1><p style={{ color: '#64748b' }}>Compliance risks before they escalate</p></div>
              <button onClick={() => setShowForm(!showForm)} style={addBtn}>+ Add Risk</button>
            </div>
            {showForm && (
              <div style={{ background: 'white', borderRadius: 12, padding: 24, marginBottom: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr 2fr', gap: 12, marginBottom: 16 }}>
                  <input placeholder="Risk" value={riskForm.risk} onChange={e => setRiskForm({ ...riskForm, risk: e.target.value })} style={inp} />
                  <input placeholder="Category" value={riskForm.category} onChange={e => setRiskForm({ ...riskForm, category: e.target.value })} style={inp} />
                  <select value={riskForm.likelihood} onChange={e => setRiskForm({ ...riskForm, likelihood: e.target.value })} style={inp}><option>Low</option><option>Medium</option><option>High</option></select>
                  <select value={riskForm.impact} onChange={e => setRiskForm({ ...riskForm, impact: e.target.value })} style={inp}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select>
                  <input placeholder="Mitigation" value={riskForm.mitigation} onChange={e => setRiskForm({ ...riskForm, mitigation: e.target.value })} style={inp} />
                </div>
                <button onClick={addRisk} disabled={saving} style={saveBtn}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            )}
            <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead><tr style={{ background: '#f5f5f5' }}>{['Risk', 'Category', 'Likelihood', 'Impact', 'Mitigation', ''].map(h => <th key={h} style={{ padding: '10px 20px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>)}</tr></thead>
                <tbody>{risks.map(r => (
                  <tr key={r.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 20px', fontWeight: 500 }}>{r.risk}</td>
                    <td style={{ padding: '14px 20px', color: '#64748b' }}>{r.category}</td>
                    <td style={{ padding: '14px 20px' }}><span style={{ color: impactColor(r.likelihood), fontWeight: 600 }}>{r.likelihood}</span></td>
                    <td style={{ padding: '14px 20px' }}><span style={{ color: impactColor(r.impact), fontWeight: 600 }}>{r.impact}</span></td>
                    <td style={{ padding: '14px 20px', color: '#64748b', fontSize: 13 }}>{r.mitigation}</td>
                    <td style={{ padding: '14px 20px' }}><button onClick={() => deleteRow('risk_register', r.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>🗑️</button></td>
                  </tr>
                ))}</tbody>
              </table>
              {risks.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No risks logged yet</div>}
            </div>
          </div>
        )}

        {/* DOCUMENTS */}
        {active === 'documents' && (
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Document Repository</h1>
            <p style={{ color: '#64748b', marginBottom: 28 }}>Compliance documents</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {documents.map(doc => (
                <div key={doc.id} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📄</div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{doc.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>{doc.type} · {doc.file_date}</div>
                  <button onClick={() => deleteRow('documents', doc.id)} style={{ width: '100%', padding: '6px 0', background: '#f5f5f5', color: '#dc2626', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                </div>
              ))}
            </div>
            {documents.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No documents yet</div>}
          </div>
        )}
      </div>
    </div>
  )
}