import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

const modules = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'meetings', label: 'Meetings', icon: '📝' },
  { id: 'events', label: 'Events & Tasks', icon: '📅' },
  { id: 'staff', label: 'Staff Records', icon: '👤' },
  { id: 'members', label: 'Members DB', icon: '👥' },
  { id: 'projects', label: 'Projects', icon: '🚦' },
  { id: 'portal_admin', label: 'Portal Admin', icon: '⚙️' },
  { id: 'compliance', label: 'Compliance', icon: '⚖️' },
]

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [])
  return isMobile
}

export default function Committee({ session }) {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  function go(id) {
    if (id === 'compliance') navigate('/compliance')
    else setActive(id)
  }

  return (
    <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', height: '100vh', fontFamily: 'Segoe UI, sans-serif', background: '#f5f5f5' }}>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <div style={{ width: sidebarOpen ? 220 : 60, background: '#1a1a1a', color: 'white', transition: 'width 0.2s', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '20px 16px', borderBottom: '1px solid #333333', display: 'flex', alignItems: 'center', gap: 10 }}>
            {sidebarOpen && <span style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>White River BC<br /><span style={{ opacity: 0.7, fontSize: 11 }}>Committee Portal</span></span>}
            <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer' }}>☰</button>
          </div>
          {modules.map(m => (
            <div key={m.id} onClick={() => go(m.id)} style={{ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: active === m.id ? '#333333' : 'transparent', borderLeft: active === m.id ? '3px solid #ffffff' : '3px solid transparent' }}>
              <span style={{ fontSize: 18 }}>{m.icon}</span>
              {sidebarOpen && <span style={{ fontSize: 14 }}>{m.label}</span>}
            </div>
          ))}
          <div style={{ marginTop: 'auto', padding: 16, borderTop: '1px solid #333333' }}>
            {sidebarOpen && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{session.user.email}</div>}
            <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, width: sidebarOpen ? '100%' : 'auto' }}>
              {sidebarOpen ? '← Sign Out' : '←'}
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: isMobile ? 16 : 32, paddingBottom: isMobile ? 80 : 32 }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>⚪ White River BC</div>
            <button onClick={handleLogout} style={{ background: '#1a1a1a', border: 'none', color: 'white', padding: '6px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Sign Out</button>
          </div>
        )}

        {active === 'dashboard' && (
          <div>
            <div style={{ fontSize: isMobile ? 20 : 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Committee Dashboard</div>
            <div style={{ color: '#64748b', marginBottom: 24, fontSize: 13 }}>Welcome back, {session.user.email}</div>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: isMobile ? 12 : 16 }}>
              {[
                { label: 'Meetings', icon: '📝', color: '#1a1a1a', id: 'meetings' },
                { label: 'Events & Tasks', icon: '📅', color: '#16a34a', id: 'events' },
                { label: 'Staff Records', icon: '👤', color: '#d97706', id: 'staff' },
                { label: 'Members DB', icon: '👥', color: '#7c3aed', id: 'members' },
                { label: 'Projects', icon: '🚦', color: '#dc2626', id: 'projects' },
                { label: 'Portal Admin', icon: '⚙️', color: '#0891b2', id: 'portal_admin' },
                { label: 'Compliance', icon: '⚖️', color: '#059669', id: 'compliance' },
              ].map(item => (
                <div key={item.id} onClick={() => go(item.id)} style={{ background: 'white', borderRadius: 12, padding: isMobile ? 16 : 28, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: `4px solid ${item.color}`, cursor: 'pointer', textAlign: 'center' }}>
                  <div style={{ fontSize: isMobile ? 24 : 32, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: isMobile ? 12 : 14, color: '#1e293b' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === 'meetings' && <MeetingsPage isMobile={isMobile} />}
        {active === 'events' && <EventsPage isMobile={isMobile} />}
        {active === 'staff' && <StaffPage isMobile={isMobile} />}
        {active === 'members' && <MembersPage isMobile={isMobile} />}
        {active === 'projects' && <ProjectsPage isMobile={isMobile} />}
        {active === 'portal_admin' && <PortalAdminPage isMobile={isMobile} />}
      </div>

      {/* Mobile Bottom Nav */}
      {isMobile && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#1a1a1a', display: 'flex', overflowX: 'auto', zIndex: 100, borderTop: '1px solid #333333' }}>
          {modules.map(m => (
            <div key={m.id} onClick={() => go(m.id)} style={{ flex: '0 0 auto', padding: '8px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, cursor: 'pointer', background: active === m.id ? '#333333' : 'transparent', borderBottom: active === m.id ? '3px solid #ffffff' : '3px solid transparent', minWidth: 56 }}>
              <span style={{ fontSize: 20 }}>{m.icon}</span>
              <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap' }}>{m.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── SHARED ───────────────────────────────────────────────
const btn = (color) => ({ padding: '8px 14px', background: color, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 })
const editBtn = { padding: '6px 10px', background: '#f5f5f5', color: '#333333', border: '1px solid #e0e0e0', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }
const inp = { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, width: '100%', boxSizing: 'border-box' }
const card = { background: 'white', borderRadius: 12, padding: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 12 }

function Grid({ cols, mCols = 1, isMobile, children, gap = 10 }) {
  return <div style={{ display: 'grid', gridTemplateColumns: `repeat(${isMobile ? mCols : cols}, 1fr)`, gap, marginBottom: gap }}>{children}</div>
}

// ─── MEETINGS ────────────────────────────────────────────
function MeetingsPage({ isMobile }) {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ title: '', meeting_date: '', type: 'Agenda', notes: '', file_url: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await supabase.from('committee_meetings').select('*').order('meeting_date', { ascending: false })
    if (data) setItems(data)
  }
  function openAdd() { setEditId(null); setForm({ title: '', meeting_date: '', type: 'Agenda', notes: '', file_url: '' }); setShowForm(true) }
  function openEdit(item) { setEditId(item.id); setForm({ title: item.title || '', meeting_date: item.meeting_date || '', type: item.type || 'Agenda', notes: item.notes || '', file_url: item.file_url || '' }); setShowForm(true) }
  async function save() {
    setSaving(true)
    if (editId) await supabase.from('committee_meetings').update(form).eq('id', editId)
    else await supabase.from('committee_meetings').insert([form])
    setShowForm(false); setEditId(null); setSaving(false); load()
  }
  async function del(id) { await supabase.from('committee_meetings').delete().eq('id', id); load() }

  const tag = (type) => ({ background: type === 'Minutes' ? '#dcfce7' : type === 'Agenda' ? '#f0f0f0' : '#fef3c7', color: type === 'Minutes' ? '#16a34a' : type === 'Agenda' ? '#333333' : '#d97706', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: 'nowrap' })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#1a1a1a' }}>📝 Meetings</div>
          <div style={{ color: '#64748b', fontSize: 13 }}>Agendas, registers, minutes</div>
        </div>
        <button style={btn('#1a1a1a')} onClick={openAdd}>+ Add</button>
      </div>

      {showForm && (
        <div style={{ ...card, background: '#fafafa' }}>
          <div style={{ fontWeight: 600, marginBottom: 12, color: '#1a1a1a' }}>{editId ? '✏️ Edit' : '+ New'}</div>
          <Grid cols={3} mCols={1} isMobile={isMobile}>
            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inp} />
            <input type="date" value={form.meeting_date} onChange={e => setForm({ ...form, meeting_date: e.target.value })} style={inp} />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inp}>
              <option>Agenda</option><option>Register</option><option>Minutes</option><option>Financials</option>
            </select>
          </Grid>
          <Grid cols={2} mCols={1} isMobile={isMobile}>
            <input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={inp} />
            <input placeholder="File URL (optional)" value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} style={inp} />
          </Grid>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={btn('#16a34a')} onClick={save} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
            <button style={btn('#64748b')} onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</button>
          </div>
        </div>
      )}

      {items.map(item => (
        <div key={item.id} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', flex: 1 }}>
              <span style={tag(item.type)}>{item.type}</span>
              <div>
                <div style={{ fontWeight: 600, color: '#1e293b', fontSize: 13 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{item.meeting_date}{item.notes && ` · ${item.notes}`}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
              {item.file_url && <a href={item.file_url} target="_blank" rel="noreferrer"><button style={btn('#333333')}>📎</button></a>}
              <button onClick={() => openEdit(item)} style={editBtn}>✏️</button>
              <button onClick={() => del(item.id)} style={btn('#dc2626')}>🗑️</button>
            </div>
          </div>
        </div>
      ))}
      {items.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No meeting documents yet</div>}
    </div>
  )
}

// ─── EVENTS ──────────────────────────────────────────────
function EventsPage({ isMobile }) {
  const [events, setEvents] = useState([])
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ title: '', event_date: '', type: 'Competition', description: '', people_count: '', required_items: '', volunteers: '', notes: '', damage_report: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await supabase.from('committee_events').select('*').order('event_date')
    if (data) setEvents(data)
  }
  function openAdd() { setEditId(null); setForm({ title: '', event_date: '', type: 'Competition', description: '', people_count: '', required_items: '', volunteers: '', notes: '', damage_report: '' }); setShowForm(true) }
  function openEdit(ev) { setEditId(ev.id); setForm({ title: ev.title || '', event_date: ev.event_date || '', type: ev.type || 'Competition', description: ev.description || '', people_count: ev.people_count || '', required_items: ev.required_items || '', volunteers: ev.volunteers || '', notes: ev.notes || '', damage_report: ev.damage_report || '' }); setShowForm(true); setSelected(null) }
  async function saveEvent() {
    setSaving(true)
    if (editId) await supabase.from('committee_events').update(form).eq('id', editId)
    else await supabase.from('committee_events').insert([form])
    setShowForm(false); setEditId(null); setSaving(false); load()
  }
  async function del(id) { await supabase.from('committee_events').delete().eq('id', id); setSelected(null); load() }

  const typeColor = { Competition: '#7c3aed', 'Venue Hire': '#d97706', Social: '#16a34a', Meeting: '#1a1a1a' }
  const tag = (type) => ({ background: (typeColor[type] || '#64748b') + '20', color: typeColor[type] || '#64748b', padding: '3px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 })
  const lbl = (text) => <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', display: 'block', marginBottom: 4 }}>{text}</label>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#1a1a1a' }}>📅 Events & Tasks</div>
          <div style={{ color: '#64748b', fontSize: 13 }}>Competitions, venue hire, socials</div>
        </div>
        <button style={btn('#1a1a1a')} onClick={openAdd}>+ Add</button>
      </div>

      {showForm && (
        <div style={card}>
          <div style={{ fontWeight: 600, marginBottom: 12, color: '#1a1a1a' }}>{editId ? '✏️ Edit Event' : '+ New Event'}</div>
          <Grid cols={3} mCols={1} isMobile={isMobile}>
            <div>{lbl('Event Title')}<input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inp} /></div>
            <div>{lbl('Date')}<input type="date" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} style={inp} /></div>
            <div>{lbl('Type')}<select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inp}><option>Competition</option><option>Venue Hire</option><option>Social</option><option>Meeting</option></select></div>
          </Grid>
          <Grid cols={2} mCols={1} isMobile={isMobile}>
            <div>{lbl('Description')}<input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={inp} /></div>
            <div>{lbl('People')}<input value={form.people_count} onChange={e => setForm({ ...form, people_count: e.target.value })} style={inp} /></div>
            <div>{lbl('Required Items')}<input value={form.required_items} onChange={e => setForm({ ...form, required_items: e.target.value })} style={inp} /></div>
            <div>{lbl('Volunteers')}<input value={form.volunteers} onChange={e => setForm({ ...form, volunteers: e.target.value })} style={inp} /></div>
          </Grid>
          <div style={{ marginBottom: 10 }}>{lbl('Notes')}<input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={inp} /></div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={btn('#16a34a')} onClick={saveEvent} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
            <button style={btn('#64748b')} onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</button>
          </div>
        </div>
      )}

      {selected && (
        <div style={{ ...card, borderLeft: '4px solid #1a1a1a', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a' }}>{selected.title}</div>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: 8, marginBottom: 12 }}>
            {[['Date', selected.event_date], ['Type', selected.type], ['Description', selected.description], ['People', selected.people_count], ['Required Items', selected.required_items], ['Volunteers', selected.volunteers], ['Notes', selected.notes], ['Damage Report', selected.damage_report]].map(([l, v]) => v ? (
              <div key={l}><div style={{ fontSize: 11, fontWeight: 600, color: '#64748b' }}>{l}</div><div style={{ fontSize: 13 }}>{v}</div></div>
            ) : null)}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={editBtn} onClick={() => openEdit(selected)}>✏️ Edit</button>
            <button style={btn('#dc2626')} onClick={() => del(selected.id)}>Delete</button>
          </div>
        </div>
      )}

      {events.map(ev => (
        <div key={ev.id} style={{ ...card, borderLeft: `4px solid ${typeColor[ev.type] || '#64748b'}`, cursor: 'pointer' }} onClick={() => setSelected(ev)}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4, fontSize: 13 }}>{ev.title}</div>
              <div style={{ fontSize: 12, color: '#64748b', marginBottom: 6 }}>{ev.event_date}{ev.description && ` · ${ev.description}`}</div>
              <span style={tag(ev.type)}>{ev.type}</span>
            </div>
            {ev.people_count && <div style={{ fontSize: 12, color: '#64748b' }}>👥 {ev.people_count}</div>}
          </div>
        </div>
      ))}
      {events.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No events yet</div>}
    </div>
  )
}

// ─── STAFF ───────────────────────────────────────────────
function StaffPage({ isMobile }) {
  const [staff, setStaff] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', id_number: '', contact: '', email: '', position: '', start_date: '', uif_number: '', coida_number: '', notes: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await supabase.from('staff').select('*').order('name')
    if (data) setStaff(data)
  }
  function openAdd() { setEditId(null); setForm({ name: '', id_number: '', contact: '', email: '', position: '', start_date: '', uif_number: '', coida_number: '', notes: '' }); setShowForm(true) }
  function openEdit(m) { setEditId(m.id); setForm({ name: m.name || '', id_number: m.id_number || '', contact: m.contact || '', email: m.email || '', position: m.position || '', start_date: m.start_date || '', uif_number: m.uif_number || '', coida_number: m.coida_number || '', notes: m.notes || '' }); setShowForm(true) }
  async function save() {
    setSaving(true)
    if (editId) await supabase.from('staff').update(form).eq('id', editId)
    else await supabase.from('staff').insert([form])
    setShowForm(false); setEditId(null); setSaving(false); load()
  }
  async function del(id) { await supabase.from('staff').delete().eq('id', id); load() }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#1a1a1a' }}>👤 Staff Records</div>
          <div style={{ color: '#64748b', fontSize: 13 }}>Contracts, IDs, UIF, COIDA</div>
        </div>
        <button style={btn('#1a1a1a')} onClick={openAdd}>+ Add</button>
      </div>

      {showForm && (
        <div style={{ ...card, background: '#fafafa' }}>
          <div style={{ fontWeight: 600, marginBottom: 12, color: '#1a1a1a' }}>{editId ? '✏️ Edit Staff' : '+ New Staff Member'}</div>
          <Grid cols={3} mCols={1} isMobile={isMobile}>
            {[['Full Name', 'name'], ['ID Number', 'id_number'], ['Position', 'position'], ['Contact Number', 'contact'], ['Email', 'email'], ['UIF Number', 'uif_number'], ['COIDA Number', 'coida_number'], ['Notes', 'notes']].map(([ph, key]) => (
              <input key={key} placeholder={ph} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} style={inp} />
            ))}
            <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} style={inp} />
          </Grid>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={btn('#16a34a')} onClick={save} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
            <button style={btn('#64748b')} onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</button>
          </div>
        </div>
      )}

      {staff.map(m => (
        <div key={m.id} style={card}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b', marginBottom: 2 }}>{m.name}</div>
              <div style={{ color: '#333333', fontWeight: 600, fontSize: 13, marginBottom: 6 }}>{m.position}</div>
              <div style={{ fontSize: 12, color: '#64748b', display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3, 1fr)', gap: '3px 16px' }}>
                {m.id_number && <span>🪪 {m.id_number}</span>}
                {m.contact && <span>📞 {m.contact}</span>}
                {m.email && <span>✉️ {m.email}</span>}
                {m.start_date && <span>📅 {m.start_date}</span>}
                {m.uif_number && <span>UIF: {m.uif_number}</span>}
                {m.coida_number && <span>COIDA: {m.coida_number}</span>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
              <button onClick={() => openEdit(m)} style={editBtn}>✏️</button>
              <button onClick={() => del(m.id)} style={btn('#dc2626')}>🗑️</button>
            </div>
          </div>
        </div>
      ))}
      {staff.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No staff records yet</div>}
    </div>
  )
}

// ─── MEMBERS ─────────────────────────────────────────────
function MembersPage({ isMobile }) {
  const [members, setMembers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showBirthdays, setShowBirthdays] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', id_number: '', contact: '', email: '', birthday: '', membership_type: 'Full' })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await supabase.from('members').select('*').order('name')
    if (data) setMembers(data)
  }
  function openAdd() { setEditId(null); setForm({ name: '', id_number: '', contact: '', email: '', birthday: '', membership_type: 'Full' }); setShowForm(true) }
  function openEdit(m) { setEditId(m.id); setForm({ name: m.name || '', id_number: m.id_number || '', contact: m.contact || '', email: m.email || '', birthday: m.birthday || '', membership_type: m.membership_type || 'Full' }); setShowForm(true) }
  async function save() {
    setSaving(true)
    if (editId) await supabase.from('members').update(form).eq('id', editId)
    else await supabase.from('members').insert([form])
    setShowForm(false); setEditId(null); setSaving(false); load()
  }
  async function del(id) { await supabase.from('members').delete().eq('id', id); load() }

  const filtered = members.filter(m => m.name?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase()))
  const upcomingBirthdays = [...members].filter(m => m.birthday).map(m => {
    const today = new Date(); const bday = new Date(m.birthday)
    const next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate())
    if (next < today) next.setFullYear(today.getFullYear() + 1)
    const days = Math.ceil((next - today) / (1000 * 60 * 60 * 24))
    return { ...m, daysUntil: days, nextBirthday: next }
  }).sort((a, b) => a.daysUntil - b.daysUntil).slice(0, 10)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#1a1a1a' }}>👥 Members</div>
          <div style={{ color: '#64748b', fontSize: 13 }}>{members.length} members</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={btn('#ec4899')} onClick={() => setShowBirthdays(!showBirthdays)}>🎂</button>
          <button style={btn('#1a1a1a')} onClick={openAdd}>+ Add</button>
        </div>
      </div>

      {showBirthdays && (
        <div style={card}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 12 }}>🎂 Upcoming Birthdays</div>
          {upcomingBirthdays.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5' }}>
              <span style={{ fontWeight: 500, fontSize: 13 }}>{m.name}</span>
              <span style={{ color: m.daysUntil <= 7 ? '#dc2626' : '#64748b', fontSize: 12, fontWeight: m.daysUntil <= 7 ? 600 : 400 }}>
                {m.daysUntil === 0 ? '🎉 Today!' : `${m.daysUntil}d · ${m.nextBirthday.toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}`}
              </span>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={card}>
          <div style={{ fontWeight: 600, marginBottom: 12, color: '#1a1a1a' }}>{editId ? '✏️ Edit Member' : '+ New Member'}</div>
          <Grid cols={3} mCols={1} isMobile={isMobile}>
            <input placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inp} />
            <input placeholder="ID Number" value={form.id_number} onChange={e => setForm({ ...form, id_number: e.target.value })} style={inp} />
            <input placeholder="Contact" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} style={inp} />
            <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inp} />
            <input type="date" value={form.birthday} onChange={e => setForm({ ...form, birthday: e.target.value })} style={inp} />
            <select value={form.membership_type} onChange={e => setForm({ ...form, membership_type: e.target.value })} style={inp}>
              <option>Full</option><option>Social</option><option>Junior</option><option>Honorary</option>
            </select>
          </Grid>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={btn('#16a34a')} onClick={save} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
            <button style={btn('#64748b')} onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</button>
          </div>
        </div>
      )}

      <input placeholder="🔍 Search members..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, marginBottom: 12 }} />

      {isMobile ? (
        filtered.map(m => (
          <div key={m.id} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{m.name}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{m.contact}{m.email && ` · ${m.email}`}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{m.birthday}{m.id_number && ` · ${m.id_number}`}</div>
                <span style={{ background: '#f0f0f0', color: '#333333', padding: '2px 8px', borderRadius: 12, fontSize: 11, marginTop: 4, display: 'inline-block' }}>{m.membership_type}</span>
              </div>
              <div style={{ display: 'flex', gap: 6 }}>
                <button onClick={() => openEdit(m)} style={editBtn}>✏️</button>
                <button onClick={() => del(m.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>🗑️</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#fafafa' }}>
              {['Name', 'ID Number', 'Contact', 'Email', 'Birthday', 'Type', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(m => (
                <tr key={m.id} style={{ borderTop: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px 16px', fontWeight: 500 }}>{m.name}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{m.id_number}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{m.contact}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{m.email}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{m.birthday}</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: '#f0f0f0', color: '#333333', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>{m.membership_type}</span></td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(m)} style={editBtn}>✏️</button>
                      <button onClick={() => del(m.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No members found</div>}
        </div>
      )}
    </div>
  )
}

// ─── PROJECTS ────────────────────────────────────────────
function ProjectsPage({ isMobile }) {
  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ title: '', responsible: '', due_date: '', status: 'Not Started', notes: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await supabase.from('projects').select('*').order('due_date')
    if (data) setProjects(data)
  }
  function openAdd() { setEditId(null); setForm({ title: '', responsible: '', due_date: '', status: 'Not Started', notes: '' }); setShowForm(true) }
  function openEdit(p) { setEditId(p.id); setForm({ title: p.title || '', responsible: p.responsible || '', due_date: p.due_date || '', status: p.status || 'Not Started', notes: p.notes || '' }); setShowForm(true) }
  async function save() {
    setSaving(true)
    if (editId) await supabase.from('projects').update(form).eq('id', editId)
    else await supabase.from('projects').insert([form])
    setShowForm(false); setEditId(null); setSaving(false); load()
  }
  async function updateStatus(id, status) { await supabase.from('projects').update({ status }).eq('id', id); load() }
  async function del(id) { await supabase.from('projects').delete().eq('id', id); load() }

  const statusColor = { 'Not Started': '#dc2626', 'In Progress': '#d97706', 'Completed': '#16a34a' }
  const statusEmoji = { 'Not Started': '🔴', 'In Progress': '🟡', 'Completed': '🟢' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#1a1a1a' }}>🚦 Projects</div>
          <div style={{ color: '#64748b', fontSize: 13 }}>Red / Yellow / Green indicators</div>
        </div>
        <button style={btn('#1a1a1a')} onClick={openAdd}>+ Add</button>
      </div>

      {showForm && (
        <div style={card}>
          <div style={{ fontWeight: 600, marginBottom: 12, color: '#1a1a1a' }}>{editId ? '✏️ Edit Project' : '+ New Project'}</div>
          <Grid cols={4} mCols={1} isMobile={isMobile}>
            <input placeholder="Project title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inp} />
            <input placeholder="Responsible" value={form.responsible} onChange={e => setForm({ ...form, responsible: e.target.value })} style={inp} />
            <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} style={inp} />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inp}>
              <option>Not Started</option><option>In Progress</option><option>Completed</option>
            </select>
          </Grid>
          <input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inp, marginBottom: 10 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={btn('#16a34a')} onClick={save} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
            <button style={btn('#64748b')} onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</button>
          </div>
        </div>
      )}

      {isMobile ? (
        projects.map(p => (
          <div key={p.id} style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 18 }}>{statusEmoji[p.status]}</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{p.title}</span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{p.responsible}{p.due_date && ` · Due: ${p.due_date}`}</div>
                {p.notes && <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>{p.notes}</div>}
                <select value={p.status} onChange={e => updateStatus(p.id, e.target.value)}
                  style={{ padding: '4px 8px', border: `2px solid ${statusColor[p.status]}`, borderRadius: 8, fontSize: 12, color: statusColor[p.status], fontWeight: 600, background: statusColor[p.status] + '10' }}>
                  <option>Not Started</option><option>In Progress</option><option>Completed</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 6, marginLeft: 8 }}>
                <button onClick={() => openEdit(p)} style={editBtn}>✏️</button>
                <button onClick={() => del(p.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 16 }}>🗑️</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead><tr style={{ background: '#fafafa' }}>
              {['Status', 'Project', 'Responsible', 'Due Date', 'Notes', 'Update', ''].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id} style={{ borderTop: '1px solid #f5f5f5' }}>
                  <td style={{ padding: '12px 16px', fontSize: 22 }}>{statusEmoji[p.status]}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600 }}>{p.title}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{p.responsible}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{p.due_date}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{p.notes}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <select value={p.status} onChange={e => updateStatus(p.id, e.target.value)}
                      style={{ padding: '4px 8px', border: `2px solid ${statusColor[p.status]}`, borderRadius: 8, fontSize: 13, color: statusColor[p.status], fontWeight: 600, background: statusColor[p.status] + '10' }}>
                      <option>Not Started</option><option>In Progress</option><option>Completed</option>
                    </select>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => openEdit(p)} style={editBtn}>✏️</button>
                      <button onClick={() => del(p.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {projects.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No projects yet</div>}
        </div>
      )}
    </div>
  )
}

// ─── PORTAL ADMIN ────────────────────────────────────────
function PortalAdminPage({ isMobile }) {
  const [tab, setTab] = useState('contacts')
  const [contacts, setContacts] = useState([])
  const [events, setEvents] = useState([])
  const [docs, setDocs] = useState([])
  const [agm, setAgm] = useState([])
  const [newsletters, setNewsletters] = useState([])
  const [editId, setEditId] = useState(null)
  const [contactForm, setContactForm] = useState({ name: '', role: '', phone: '', email: '', sort_order: 0 })
  const [eventForm, setEventForm] = useState({ title: '', event_date: '', type: 'Competition', description: '' })
  const [docForm, setDocForm] = useState({ name: '', category: 'White River', file_date: '', file_url: '' })
  const [agmForm, setAgmForm] = useState({ name: '', type: 'Minutes', year: '', file_url: '' })
  const [nlForm, setNlForm] = useState({ title: '', published_date: '', file_url: '' })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const [c, e, d, a, n] = await Promise.all([
      supabase.from('portal_contacts').select('*').order('sort_order'),
      supabase.from('portal_events').select('*').order('event_date'),
      supabase.from('portal_documents').select('*').order('created_at', { ascending: false }),
      supabase.from('portal_agm').select('*').order('year', { ascending: false }),
      supabase.from('portal_newsletter').select('*').order('published_date', { ascending: false }),
    ])
    if (!c.error) setContacts(c.data)
    if (!e.error) setEvents(e.data)
    if (!d.error) setDocs(d.data)
    if (!a.error) setAgm(a.data)
    if (!n.error) setNewsletters(n.data)
  }

  async function uploadFile(file, folder) {
    if (!file) return null
    setUploading(true); setUploadError('')
    const fileName = `${folder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`
    const { error } = await supabase.storage.from('documents').upload(fileName, file, { contentType: file.type })
    setUploading(false)
    if (error) { setUploadError('Upload failed: ' + error.message); return null }
    const { data } = supabase.storage.from('documents').getPublicUrl(fileName)
    return data.publicUrl
  }

  function openEdit(setter, item, fields) {
    setEditId(item.id)
    const filled = {}
    fields.forEach(f => { filled[f] = item[f] || '' })
    setter(filled)
  }

  async function save(table, form, reset) {
    setSaving(true)
    if (editId) { await supabase.from(table).update(form).eq('id', editId); setEditId(null) }
    else await supabase.from(table).insert([form])
    reset(); setSaving(false); fetchAll()
  }

  async function del(table, id) { await supabase.from(table).delete().eq('id', id); fetchAll() }

  const tabBtn = (active) => ({ padding: isMobile ? '6px 8px' : '8px 14px', background: active ? '#1a1a1a' : 'white', color: active ? 'white' : '#64748b', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: isMobile ? 11 : 13 })
  const fileBox = { border: '2px dashed #cbd5e1', borderRadius: 8, padding: '12px 16px', background: 'white', cursor: 'pointer', fontSize: 13, color: '#64748b', textAlign: 'center', display: 'block', width: '100%', boxSizing: 'border-box' }
  const row = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f5f5f5', gap: 8 }
  const formCard = { background: '#fafafa', borderRadius: 12, padding: 16, marginBottom: 12 }

  const tabs = [
    { id: 'contacts', label: isMobile ? '👥' : '👥 Contacts' },
    { id: 'events', label: isMobile ? '📅' : '📅 Events' },
    { id: 'documents', label: isMobile ? '📄' : '📄 Documents' },
    { id: 'agm', label: isMobile ? '📊' : '📊 AGM' },
    { id: 'newsletter', label: isMobile ? '📰' : '📰 Newsletter' },
  ]

  function FileUpload({ currentUrl, onUploaded, folder }) {
    return (
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
          PDF File {currentUrl && <a href={currentUrl} target="_blank" rel="noreferrer" style={{ color: '#333333', marginLeft: 8 }}>📎 View</a>}
        </div>
        <label style={fileBox}>
          {uploading ? '⏳ Uploading...' : '📁 Click to upload PDF'}
          <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
            onChange={async e => {
              const file = e.target.files[0]; if (!file) return
              const url = await uploadFile(file, folder)
              if (url) onUploaded(url)
            }} />
        </label>
        {uploadError && <div style={{ color: '#dc2626', fontSize: 12, marginTop: 4 }}>{uploadError}</div>}
        {currentUrl && <div style={{ fontSize: 12, color: '#16a34a', marginTop: 4 }}>✅ File attached</div>}
      </div>
    )
  }

  return (
    <div>
      <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>⚙️ Portal Admin</div>
      <div style={{ color: '#64748b', marginBottom: 16, fontSize: 13 }}>Manage public-facing content</div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {tabs.map(t => <button key={t.id} style={tabBtn(tab === t.id)} onClick={() => { setTab(t.id); setEditId(null) }}>{t.label}</button>)}
      </div>

      {tab === 'contacts' && (
        <div>
          <div style={formCard}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>{editId ? '✏️ Edit Contact' : 'Add Contact'}</div>
            <Grid cols={4} mCols={1} isMobile={isMobile}>
              <input placeholder="Name" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} style={inp} />
              <input placeholder="Role" value={contactForm.role} onChange={e => setContactForm({ ...contactForm, role: e.target.value })} style={inp} />
              <input placeholder="Phone" value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} style={inp} />
              <input placeholder="Email" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} style={inp} />
            </Grid>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={btn('#16a34a')} onClick={() => save('portal_contacts', contactForm, () => setContactForm({ name: '', role: '', phone: '', email: '', sort_order: 0 }))} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Add'}</button>
              {editId && <button style={btn('#64748b')} onClick={() => { setEditId(null); setContactForm({ name: '', role: '', phone: '', email: '', sort_order: 0 }) }}>Cancel</button>}
            </div>
          </div>
          {contacts.map(c => (
            <div key={c.id} style={row}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                <div style={{ color: '#64748b', fontSize: 12, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.role} · {c.phone}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button style={editBtn} onClick={() => openEdit(setContactForm, c, ['name', 'role', 'phone', 'email', 'sort_order'])}>✏️</button>
                <button style={btn('#dc2626')} onClick={() => del('portal_contacts', c.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'events' && (
        <div>
          <div style={formCard}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>{editId ? '✏️ Edit Event' : 'Add Event'}</div>
            <Grid cols={3} mCols={1} isMobile={isMobile}>
              <input placeholder="Event title" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} style={inp} />
              <input type="date" value={eventForm.event_date} onChange={e => setEventForm({ ...eventForm, event_date: e.target.value })} style={inp} />
              <select value={eventForm.type} onChange={e => setEventForm({ ...eventForm, type: e.target.value })} style={inp}>
                <option>Competition</option><option>Birthday</option><option>Venue Hire</option><option>Social</option><option>General</option>
              </select>
            </Grid>
            <input placeholder="Description" value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} style={{ ...inp, marginBottom: 10 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={btn('#16a34a')} onClick={() => save('portal_events', eventForm, () => setEventForm({ title: '', event_date: '', type: 'Competition', description: '' }))} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Add'}</button>
              {editId && <button style={btn('#64748b')} onClick={() => { setEditId(null); setEventForm({ title: '', event_date: '', type: 'Competition', description: '' }) }}>Cancel</button>}
            </div>
          </div>
          {events.map(e => (
            <div key={e.id} style={row}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{e.title}</div>
                <div style={{ color: '#64748b', fontSize: 12 }}>{e.event_date} · {e.type}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                <button style={editBtn} onClick={() => openEdit(setEventForm, e, ['title', 'event_date', 'type', 'description'])}>✏️</button>
                <button style={btn('#dc2626')} onClick={() => del('portal_events', e.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'documents' && (
        <div>
          <div style={formCard}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>{editId ? '✏️ Edit Document' : 'Add Document'}</div>
            <Grid cols={3} mCols={1} isMobile={isMobile}>
              <input placeholder="Document name" value={docForm.name} onChange={e => setDocForm({ ...docForm, name: e.target.value })} style={inp} />
              <select value={docForm.category} onChange={e => setDocForm({ ...docForm, category: e.target.value })} style={inp}>
                <option>White River</option><option>Lowveld</option><option>Mpumalanga</option><option>Bowls South Africa</option><option>Constitution & Bylaws</option>
              </select>
              <input type="date" value={docForm.file_date} onChange={e => setDocForm({ ...docForm, file_date: e.target.value })} style={inp} />
            </Grid>
            <div style={{ marginBottom: 10 }}>
              <FileUpload folder="documents" currentUrl={docForm.file_url} onUploaded={url => setDocForm({ ...docForm, file_url: url })} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={btn('#16a34a')} onClick={() => save('portal_documents', docForm, () => setDocForm({ name: '', category: 'White River', file_date: '', file_url: '' }))} disabled={saving || uploading}>{saving ? 'Saving...' : editId ? 'Update' : 'Add'}</button>
              {editId && <button style={btn('#64748b')} onClick={() => { setEditId(null); setDocForm({ name: '', category: 'White River', file_date: '', file_url: '' }) }}>Cancel</button>}
            </div>
          </div>
          {docs.map(d => (
            <div key={d.id} style={row}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{d.name}</div>
                <div style={{ color: '#64748b', fontSize: 12 }}>{d.category} · {d.file_date}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {d.file_url && <a href={d.file_url} target="_blank" rel="noreferrer"><button style={btn('#333333')}>📎</button></a>}
                <button style={editBtn} onClick={() => openEdit(setDocForm, d, ['name', 'category', 'file_date', 'file_url'])}>✏️</button>
                <button style={btn('#dc2626')} onClick={() => del('portal_documents', d.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'agm' && (
        <div>
          <div style={formCard}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>{editId ? '✏️ Edit AGM Doc' : 'Add AGM Document'}</div>
            <Grid cols={3} mCols={1} isMobile={isMobile}>
              <input placeholder="Document name" value={agmForm.name} onChange={e => setAgmForm({ ...agmForm, name: e.target.value })} style={inp} />
              <select value={agmForm.type} onChange={e => setAgmForm({ ...agmForm, type: e.target.value })} style={inp}>
                <option>Minutes</option><option>Agenda</option><option>Financials</option>
              </select>
              <input placeholder="Year (e.g. 2025)" value={agmForm.year} onChange={e => setAgmForm({ ...agmForm, year: e.target.value })} style={inp} />
            </Grid>
            <div style={{ marginBottom: 10 }}>
              <FileUpload folder="agm" currentUrl={agmForm.file_url} onUploaded={url => setAgmForm({ ...agmForm, file_url: url })} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={btn('#16a34a')} onClick={() => save('portal_agm', agmForm, () => setAgmForm({ name: '', type: 'Minutes', year: '', file_url: '' }))} disabled={saving || uploading}>{saving ? 'Saving...' : editId ? 'Update' : 'Add'}</button>
              {editId && <button style={btn('#64748b')} onClick={() => { setEditId(null); setAgmForm({ name: '', type: 'Minutes', year: '', file_url: '' }) }}>Cancel</button>}
            </div>
          </div>
          {agm.map(a => (
            <div key={a.id} style={row}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{a.name}</div>
                <div style={{ color: '#64748b', fontSize: 12 }}>{a.type} · {a.year}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {a.file_url && <a href={a.file_url} target="_blank" rel="noreferrer"><button style={btn('#333333')}>📎</button></a>}
                <button style={editBtn} onClick={() => openEdit(setAgmForm, a, ['name', 'type', 'year', 'file_url'])}>✏️</button>
                <button style={btn('#dc2626')} onClick={() => del('portal_agm', a.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'newsletter' && (
        <div>
          <div style={formCard}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>{editId ? '✏️ Edit Newsletter' : 'Add Newsletter'}</div>
            <Grid cols={2} mCols={1} isMobile={isMobile}>
              <input placeholder="Newsletter title" value={nlForm.title} onChange={e => setNlForm({ ...nlForm, title: e.target.value })} style={inp} />
              <input type="date" value={nlForm.published_date} onChange={e => setNlForm({ ...nlForm, published_date: e.target.value })} style={inp} />
            </Grid>
            <div style={{ marginBottom: 10 }}>
              <FileUpload folder="newsletters" currentUrl={nlForm.file_url} onUploaded={url => setNlForm({ ...nlForm, file_url: url })} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={btn('#16a34a')} onClick={() => save('portal_newsletter', nlForm, () => setNlForm({ title: '', published_date: '', file_url: '' }))} disabled={saving || uploading}>{saving ? 'Saving...' : editId ? 'Update' : 'Add'}</button>
              {editId && <button style={btn('#64748b')} onClick={() => { setEditId(null); setNlForm({ title: '', published_date: '', file_url: '' }) }}>Cancel</button>}
            </div>
          </div>
          {newsletters.map(n => (
            <div key={n.id} style={row}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</div>
                <div style={{ color: '#64748b', fontSize: 12 }}>{n.published_date}</div>
              </div>
              <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {n.file_url && <a href={n.file_url} target="_blank" rel="noreferrer"><button style={btn('#333333')}>📎</button></a>}
                <button style={editBtn} onClick={() => openEdit(setNlForm, n, ['title', 'published_date', 'file_url'])}>✏️</button>
                <button style={btn('#dc2626')} onClick={() => del('portal_newsletter', n.id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}