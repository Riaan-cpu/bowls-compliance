import { useState } from 'react'
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

export default function Committee({ session }) {
  const navigate = useNavigate()
  const [active, setActive] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const s = {
    wrap: { display: 'flex', height: '100vh', fontFamily: 'Segoe UI, sans-serif', background: '#f1f5f9' },
    sidebar: { width: sidebarOpen ? 220 : 60, background: '#1e3a5f', color: 'white', transition: 'width 0.2s', display: 'flex', flexDirection: 'column' },
    sidebarHeader: { padding: '20px 16px', borderBottom: '1px solid #2d5080', display: 'flex', alignItems: 'center', gap: 10 },
    menuItem: (isActive) => ({ padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer', background: isActive ? '#2d5080' : 'transparent', borderLeft: isActive ? '3px solid #60a5fa' : '3px solid transparent' }),
    main: { flex: 1, overflow: 'auto', padding: 32 },
    card: { background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 16 },
    h1: { fontSize: 24, fontWeight: 700, color: '#1e3a5f', marginBottom: 4 },
    sub: { color: '#64748b', marginBottom: 28 },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 },
    statCard: (color) => ({ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', borderTop: `4px solid ${color}` }),
  }

  return (
    <div style={s.wrap}>
      {/* Sidebar */}
      <div style={s.sidebar}>
        <div style={s.sidebarHeader}>
          {sidebarOpen && <span style={{ fontWeight: 700, fontSize: 13, lineHeight: 1.3 }}>White River BC<br /><span style={{ opacity: 0.7, fontSize: 11 }}>Committee Portal</span></span>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'white', fontSize: 18, cursor: 'pointer' }}>☰</button>
        </div>

        {modules.map(m => (
          <div key={m.id} onClick={() => m.id === 'compliance' ? navigate('/compliance') : setActive(m.id)} style={s.menuItem(active === m.id)}>
            <span style={{ fontSize: 18 }}>{m.icon}</span>
            {sidebarOpen && <span style={{ fontSize: 14 }}>{m.label}</span>}
          </div>
        ))}

        <div style={{ marginTop: 'auto', padding: 16, borderTop: '1px solid #2d5080' }}>
          {sidebarOpen && <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>{session.user.email}</div>}
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '8px 12px', borderRadius: 8, cursor: 'pointer', fontSize: 13, width: sidebarOpen ? '100%' : 'auto' }}>
            {sidebarOpen ? '← Sign Out' : '←'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div style={s.main}>

        {/* DASHBOARD */}
        {active === 'dashboard' && (
          <div>
            <div style={s.h1}>Committee Dashboard</div>
            <div style={s.sub}>Welcome back, {session.user.email}</div>
            <div style={s.grid}>
              {[
                { label: 'Go to Meetings', icon: '📝', color: '#1e3a5f', id: 'meetings' },
                { label: 'Events & Tasks', icon: '📅', color: '#16a34a', id: 'events' },
                { label: 'Staff Records', icon: '👤', color: '#d97706', id: 'staff' },
                { label: 'Members DB', icon: '👥', color: '#7c3aed', id: 'members' },
                { label: 'Projects', icon: '🚦', color: '#dc2626', id: 'projects' },
                { label: 'Portal Admin', icon: '⚙️', color: '#0891b2', id: 'portal_admin' },
                { label: 'Compliance', icon: '⚖️', color: '#059669', id: 'compliance' },
              ].map(item => (
                <div key={item.id} onClick={() => item.id === 'compliance' ? navigate('/compliance') : setActive(item.id)}
                  style={{ ...s.statCard(item.color), cursor: 'pointer', textAlign: 'center', padding: 28 }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>{item.icon}</div>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === 'meetings' && <MeetingsPage />}
        {active === 'events' && <EventsPage />}
        {active === 'staff' && <StaffPage />}
        {active === 'members' && <MembersPage />}
        {active === 'projects' && <ProjectsPage />}
        {active === 'portal_admin' && <PortalAdminPage />}
      </div>
    </div>
  )
}

// ─── SHARED STYLES ───────────────────────────────────────
const btn = (color) => ({ padding: '8px 20px', background: color, color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 })
const editBtn = { padding: '6px 14px', background: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }
const inputStyle = { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14 }
const cardStyle = { background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 12 }

// ─── MEETINGS ────────────────────────────────────────────
function MeetingsPage() {
  const [items, setItems] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ title: '', meeting_date: '', type: 'Agenda', notes: '', file_url: '' })
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('upcoming')

  useState(() => { fetchItems() }, [])

  async function fetchItems() {
    const { data } = await supabase.from('committee_meetings').select('*').order('meeting_date', { ascending: false })
    if (data) setItems(data)
  }

  function openAdd() {
    setEditId(null)
    setForm({ title: '', meeting_date: '', type: 'Agenda', notes: '', file_url: '' })
    setShowForm(true)
  }

  function openEdit(item) {
    setEditId(item.id)
    setForm({ title: item.title || '', meeting_date: item.meeting_date || '', type: item.type || 'Agenda', notes: item.notes || '', file_url: item.file_url || '' })
    setShowForm(true)
  }

  async function saveItem() {
    setSaving(true)
    if (editId) {
      await supabase.from('committee_meetings').update(form).eq('id', editId)
    } else {
      await supabase.from('committee_meetings').insert([form])
    }
    setForm({ title: '', meeting_date: '', type: 'Agenda', notes: '', file_url: '' })
    setShowForm(false); setEditId(null); setSaving(false); fetchItems()
  }

  async function deleteItem(id) {
    await supabase.from('committee_meetings').delete().eq('id', id)
    fetchItems()
  }

  const tag = (type) => ({ background: type === 'Minutes' ? '#dcfce7' : type === 'Agenda' ? '#dbeafe' : '#fef3c7', color: type === 'Minutes' ? '#16a34a' : type === 'Agenda' ? '#1d4ed8' : '#d97706', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 })
  const tabBtn = (active) => ({ padding: '8px 20px', background: active ? '#1e3a5f' : 'white', color: active ? 'white' : '#64748b', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 })

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1e3a5f' }}>📝 Meetings</div>
          <div style={{ color: '#64748b' }}>Agendas, registers, minutes and archive</div>
        </div>
        <button style={btn('#1e3a5f')} onClick={openAdd}>+ Add Document</button>
      </div>

      {showForm && (
        <div style={{ ...cardStyle, background: '#f8fafc' }}>
          <div style={{ fontWeight: 600, marginBottom: 12, color: '#1e3a5f' }}>{editId ? '✏️ Edit Document' : '+ New Document'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
            <input type="date" value={form.meeting_date} onChange={e => setForm({ ...form, meeting_date: e.target.value })} style={inputStyle} />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={inputStyle}>
              <option>Agenda</option><option>Register</option><option>Minutes</option><option>Financials</option>
            </select>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
            <input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={inputStyle} />
            <input placeholder="File URL (optional)" value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={btn('#16a34a')} onClick={saveItem} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Save'}</button>
            <button style={btn('#64748b')} onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['upcoming', 'archive'].map(t => <button key={t} style={tabBtn(tab === t)} onClick={() => setTab(t)}>{t === 'upcoming' ? 'Recent' : 'Archive'}</button>)}
      </div>

      {items.map(item => (
        <div key={item.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={tag(item.type)}>{item.type}</span>
            <div>
              <div style={{ fontWeight: 600, color: '#1e293b' }}>{item.title}</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{item.meeting_date}{item.notes && ` · ${item.notes}`}</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {item.file_url && <a href={item.file_url} target="_blank" rel="noreferrer"><button style={btn('#2d5080')}>View</button></a>}
            <button onClick={() => openEdit(item)} style={editBtn}>✏️ Edit</button>
            <button onClick={() => deleteItem(item.id)} style={btn('#dc2626')}>Delete</button>
          </div>
        </div>
      ))}
      {items.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No meeting documents yet</div>}
    </div>
  )
}

// ─── EVENTS ──────────────────────────────────────────────
function EventsPage() {
  const [events, setEvents] = useState([])
  const [selected, setSelected] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ title: '', event_date: '', type: 'Competition', description: '', people_count: '', required_items: '', volunteers: '', notes: '', damage_report: '' })
  const [saving, setSaving] = useState(false)

  useState(() => { fetchEvents() }, [])

  async function fetchEvents() {
    const { data } = await supabase.from('committee_events').select('*').order('event_date')
    if (data) setEvents(data)
  }

  function openAdd() {
    setEditId(null)
    setForm({ title: '', event_date: '', type: 'Competition', description: '', people_count: '', required_items: '', volunteers: '', notes: '', damage_report: '' })
    setShowForm(true)
  }

  function openEdit(ev) {
    setEditId(ev.id)
    setForm({ title: ev.title || '', event_date: ev.event_date || '', type: ev.type || 'Competition', description: ev.description || '', people_count: ev.people_count || '', required_items: ev.required_items || '', volunteers: ev.volunteers || '', notes: ev.notes || '', damage_report: ev.damage_report || '' })
    setShowForm(true)
    setSelected(null)
  }

  async function saveEvent() {
    setSaving(true)
    if (editId) {
      await supabase.from('committee_events').update(form).eq('id', editId)
    } else {
      await supabase.from('committee_events').insert([form])
    }
    setForm({ title: '', event_date: '', type: 'Competition', description: '', people_count: '', required_items: '', volunteers: '', notes: '', damage_report: '' })
    setShowForm(false); setEditId(null); setSaving(false); fetchEvents()
  }

  async function deleteEvent(id) {
    await supabase.from('committee_events').delete().eq('id', id)
    setSelected(null); fetchEvents()
  }

  const typeColor = { Competition: '#7c3aed', 'Venue Hire': '#d97706', Social: '#16a34a', Meeting: '#1e3a5f' }
  const tag = (type) => ({ background: (typeColor[type] || '#64748b') + '20', color: typeColor[type] || '#64748b', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 })
  const label = { fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 4, display: 'block' }
  const fullInput = { ...inputStyle, width: '100%', boxSizing: 'border-box' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: selected ? '1fr 1fr' : '1fr', gap: 24 }}>
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#1e3a5f' }}>📅 Events & Tasks</div>
            <div style={{ color: '#64748b' }}>Competitions, venue hire, socials and to-do lists</div>
          </div>
          <button style={btn('#1e3a5f')} onClick={openAdd}>+ Add Event</button>
        </div>

        {showForm && (
          <div style={{ ...cardStyle }}>
            <div style={{ fontWeight: 600, marginBottom: 12, color: '#1e3a5f' }}>{editId ? '✏️ Edit Event' : '+ New Event'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div><label style={label}>Event Title</label><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={fullInput} /></div>
              <div><label style={label}>Date</label><input type="date" value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} style={fullInput} /></div>
              <div><label style={label}>Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={fullInput}>
                  <option>Competition</option><option>Venue Hire</option><option>Social</option><option>Meeting</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
              <div><label style={label}>Description</label><input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} style={fullInput} /></div>
              <div><label style={label}>Number of People</label><input value={form.people_count} onChange={e => setForm({ ...form, people_count: e.target.value })} style={fullInput} /></div>
              <div><label style={label}>Required Items</label><input value={form.required_items} onChange={e => setForm({ ...form, required_items: e.target.value })} style={fullInput} /></div>
              <div><label style={label}>Volunteers</label><input value={form.volunteers} onChange={e => setForm({ ...form, volunteers: e.target.value })} style={fullInput} /></div>
            </div>
            <div style={{ marginBottom: 12 }}><label style={label}>Notes / Comments</label><input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={fullInput} /></div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={btn('#16a34a')} onClick={saveEvent} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update Event' : 'Save Event'}</button>
              <button style={btn('#64748b')} onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</button>
            </div>
          </div>
        )}

        {events.map(ev => (
          <div key={ev.id} style={{ ...cardStyle, borderLeft: `4px solid ${typeColor[ev.type] || '#64748b'}`, cursor: 'pointer' }} onClick={() => setSelected(ev)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 700, color: '#1e293b', marginBottom: 4 }}>{ev.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>{ev.event_date} · {ev.description}</div>
                <span style={tag(ev.type)}>{ev.type}</span>
              </div>
              <div style={{ fontSize: 13, color: '#64748b' }}>{ev.people_count && `👥 ${ev.people_count}`}</div>
            </div>
          </div>
        ))}
        {events.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No events yet</div>}
      </div>

      {selected && (
        <div style={{ ...cardStyle, height: 'fit-content' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ fontWeight: 700, fontSize: 18, color: '#1e3a5f' }}>{selected.title}</div>
            <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18 }}>✕</button>
          </div>
          {[['Date', selected.event_date], ['Type', selected.type], ['Description', selected.description], ['People', selected.people_count], ['Required Items', selected.required_items], ['Volunteers', selected.volunteers], ['Notes', selected.notes], ['Damage Report', selected.damage_report]].map(([lbl, value]) => value ? (
            <div key={lbl} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 2 }}>{lbl}</div>
              <div style={{ fontSize: 14, color: '#1e293b' }}>{value}</div>
            </div>
          ) : null)}
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <button style={editBtn} onClick={() => openEdit(selected)}>✏️ Edit</button>
            <button style={btn('#dc2626')} onClick={() => deleteEvent(selected.id)}>Delete</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── STAFF ───────────────────────────────────────────────
function StaffPage() {
  const [staff, setStaff] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', id_number: '', contact: '', email: '', position: '', start_date: '', uif_number: '', coida_number: '', notes: '' })
  const [saving, setSaving] = useState(false)

  useState(() => { fetchStaff() }, [])

  async function fetchStaff() {
    const { data } = await supabase.from('staff').select('*').order('name')
    if (data) setStaff(data)
  }

  function openAdd() {
    setEditId(null)
    setForm({ name: '', id_number: '', contact: '', email: '', position: '', start_date: '', uif_number: '', coida_number: '', notes: '' })
    setShowForm(true)
  }

  function openEdit(member) {
    setEditId(member.id)
    setForm({ name: member.name || '', id_number: member.id_number || '', contact: member.contact || '', email: member.email || '', position: member.position || '', start_date: member.start_date || '', uif_number: member.uif_number || '', coida_number: member.coida_number || '', notes: member.notes || '' })
    setShowForm(true)
  }

  async function saveStaff() {
    setSaving(true)
    if (editId) {
      await supabase.from('staff').update(form).eq('id', editId)
    } else {
      await supabase.from('staff').insert([form])
    }
    setForm({ name: '', id_number: '', contact: '', email: '', position: '', start_date: '', uif_number: '', coida_number: '', notes: '' })
    setShowForm(false); setEditId(null); setSaving(false); fetchStaff()
  }

  async function deleteStaff(id) {
    await supabase.from('staff').delete().eq('id', id)
    fetchStaff()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1e3a5f' }}>👤 Staff Records</div>
          <div style={{ color: '#64748b' }}>Contracts, IDs, UIF, COIDA and performance</div>
        </div>
        <button style={btn('#1e3a5f')} onClick={openAdd}>+ Add Staff Member</button>
      </div>

      {showForm && (
        <div style={{ ...cardStyle, background: '#f8fafc' }}>
          <div style={{ fontWeight: 600, marginBottom: 12, color: '#1e3a5f' }}>{editId ? '✏️ Edit Staff Member' : '+ New Staff Member'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
            <input placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            <input placeholder="ID Number" value={form.id_number} onChange={e => setForm({ ...form, id_number: e.target.value })} style={inputStyle} />
            <input placeholder="Position" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} style={inputStyle} />
            <input placeholder="Contact Number" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} style={inputStyle} />
            <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            <input type="date" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} style={inputStyle} />
            <input placeholder="UIF Number" value={form.uif_number} onChange={e => setForm({ ...form, uif_number: e.target.value })} style={inputStyle} />
            <input placeholder="COIDA Number" value={form.coida_number} onChange={e => setForm({ ...form, coida_number: e.target.value })} style={inputStyle} />
            <input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={inputStyle} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={btn('#16a34a')} onClick={saveStaff} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Save Staff Member'}</button>
            <button style={btn('#64748b')} onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</button>
          </div>
        </div>
      )}

      {staff.map(member => (
        <div key={member.id} style={{ ...cardStyle, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 16, color: '#1e293b', marginBottom: 2 }}>{member.name}</div>
            <div style={{ color: '#2d5080', fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{member.position}</div>
            <div style={{ fontSize: 13, color: '#64748b', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px 24px' }}>
              {member.id_number && <span>🪪 {member.id_number}</span>}
              {member.contact && <span>📞 {member.contact}</span>}
              {member.email && <span>✉️ {member.email}</span>}
              {member.start_date && <span>📅 Started: {member.start_date}</span>}
              {member.uif_number && <span>UIF: {member.uif_number}</span>}
              {member.coida_number && <span>COIDA: {member.coida_number}</span>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => openEdit(member)} style={editBtn}>✏️ Edit</button>
            <button onClick={() => deleteStaff(member.id)} style={btn('#dc2626')}>Delete</button>
          </div>
        </div>
      ))}
      {staff.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No staff records yet</div>}
    </div>
  )
}

// ─── MEMBERS ─────────────────────────────────────────────
function MembersPage() {
  const [members, setMembers] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showBirthdays, setShowBirthdays] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ name: '', id_number: '', contact: '', email: '', birthday: '', membership_type: 'Full' })
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  useState(() => { fetchMembers() }, [])

  async function fetchMembers() {
    const { data } = await supabase.from('members').select('*').order('name')
    if (data) setMembers(data)
  }

  function openAdd() {
    setEditId(null)
    setForm({ name: '', id_number: '', contact: '', email: '', birthday: '', membership_type: 'Full' })
    setShowForm(true)
  }

  function openEdit(m) {
    setEditId(m.id)
    setForm({ name: m.name || '', id_number: m.id_number || '', contact: m.contact || '', email: m.email || '', birthday: m.birthday || '', membership_type: m.membership_type || 'Full' })
    setShowForm(true)
  }

  async function saveMember() {
    setSaving(true)
    if (editId) {
      await supabase.from('members').update(form).eq('id', editId)
    } else {
      await supabase.from('members').insert([form])
    }
    setForm({ name: '', id_number: '', contact: '', email: '', birthday: '', membership_type: 'Full' })
    setShowForm(false); setEditId(null); setSaving(false); fetchMembers()
  }

  async function deleteMember(id) {
    await supabase.from('members').delete().eq('id', id)
    fetchMembers()
  }

  const filtered = members.filter(m => m.name?.toLowerCase().includes(search.toLowerCase()) || m.email?.toLowerCase().includes(search.toLowerCase()))

  const upcomingBirthdays = [...members]
    .filter(m => m.birthday)
    .map(m => {
      const today = new Date()
      const bday = new Date(m.birthday)
      const next = new Date(today.getFullYear(), bday.getMonth(), bday.getDate())
      if (next < today) next.setFullYear(today.getFullYear() + 1)
      const days = Math.ceil((next - today) / (1000 * 60 * 60 * 24))
      return { ...m, daysUntil: days, nextBirthday: next }
    })
    .sort((a, b) => a.daysUntil - b.daysUntil)
    .slice(0, 10)

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1e3a5f' }}>👥 Members Database</div>
          <div style={{ color: '#64748b' }}>{members.length} members registered</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={btn('#ec4899')} onClick={() => setShowBirthdays(!showBirthdays)}>🎂 Birthdays</button>
          <button style={btn('#1e3a5f')} onClick={openAdd}>+ Add Member</button>
        </div>
      </div>

      {showBirthdays && (
        <div style={cardStyle}>
          <div style={{ fontWeight: 700, fontSize: 16, color: '#1e3a5f', marginBottom: 16 }}>🎂 Upcoming Birthdays</div>
          {upcomingBirthdays.map(m => (
            <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ fontWeight: 500 }}>{m.name}</span>
              <span style={{ color: m.daysUntil <= 7 ? '#dc2626' : '#64748b', fontWeight: m.daysUntil <= 7 ? 600 : 400 }}>
                {m.daysUntil === 0 ? '🎉 Today!' : `In ${m.daysUntil} days · ${m.nextBirthday.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long' })}`}
              </span>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={cardStyle}>
          <div style={{ fontWeight: 600, marginBottom: 12, color: '#1e3a5f' }}>{editId ? '✏️ Edit Member' : '+ New Member'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 12 }}>
            <input placeholder="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={inputStyle} />
            <input placeholder="ID Number" value={form.id_number} onChange={e => setForm({ ...form, id_number: e.target.value })} style={inputStyle} />
            <input placeholder="Contact Number" value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} style={inputStyle} />
            <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={inputStyle} />
            <input type="date" value={form.birthday} onChange={e => setForm({ ...form, birthday: e.target.value })} style={inputStyle} />
            <select value={form.membership_type} onChange={e => setForm({ ...form, membership_type: e.target.value })} style={inputStyle}>
              <option>Full</option><option>Social</option><option>Junior</option><option>Honorary</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={btn('#16a34a')} onClick={saveMember} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update Member' : 'Save Member'}</button>
            <button style={btn('#64748b')} onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</button>
          </div>
        </div>
      )}

      <input placeholder="🔍 Search members..." value={search} onChange={e => setSearch(e.target.value)}
        style={{ ...inputStyle, width: '100%', marginBottom: 16, boxSizing: 'border-box' }} />

      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f8fafc' }}>
            {['Name', 'ID Number', 'Contact', 'Email', 'Birthday', 'Type', ''].map(h => (
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {filtered.map(m => (
              <tr key={m.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{m.name}</td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{m.id_number}</td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{m.contact}</td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{m.email}</td>
                <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{m.birthday}</td>
                <td style={{ padding: '12px 16px' }}><span style={{ background: '#dbeafe', color: '#1d4ed8', padding: '2px 8px', borderRadius: 12, fontSize: 12 }}>{m.membership_type}</span></td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => openEdit(m)} style={editBtn}>✏️</button>
                    <button onClick={() => deleteMember(m.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No members found</div>}
      </div>
    </div>
  )
}

// ─── PROJECTS ────────────────────────────────────────────
function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({ title: '', responsible: '', due_date: '', status: 'Not Started', notes: '' })
  const [saving, setSaving] = useState(false)

  useState(() => { fetchProjects() }, [])

  async function fetchProjects() {
    const { data } = await supabase.from('projects').select('*').order('due_date')
    if (data) setProjects(data)
  }

  function openAdd() {
    setEditId(null)
    setForm({ title: '', responsible: '', due_date: '', status: 'Not Started', notes: '' })
    setShowForm(true)
  }

  function openEdit(p) {
    setEditId(p.id)
    setForm({ title: p.title || '', responsible: p.responsible || '', due_date: p.due_date || '', status: p.status || 'Not Started', notes: p.notes || '' })
    setShowForm(true)
  }

  async function saveProject() {
    setSaving(true)
    if (editId) {
      await supabase.from('projects').update(form).eq('id', editId)
    } else {
      await supabase.from('projects').insert([form])
    }
    setForm({ title: '', responsible: '', due_date: '', status: 'Not Started', notes: '' })
    setShowForm(false); setEditId(null); setSaving(false); fetchProjects()
  }

  async function updateStatus(id, status) {
    await supabase.from('projects').update({ status }).eq('id', id)
    fetchProjects()
  }

  async function deleteProject(id) {
    await supabase.from('projects').delete().eq('id', id)
    fetchProjects()
  }

  const statusColor = { 'Not Started': '#dc2626', 'In Progress': '#d97706', 'Completed': '#16a34a' }
  const statusEmoji = { 'Not Started': '🔴', 'In Progress': '🟡', 'Completed': '🟢' }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#1e3a5f' }}>🚦 Project Progress</div>
          <div style={{ color: '#64748b' }}>Track projects with Red / Yellow / Green indicators</div>
        </div>
        <button style={btn('#1e3a5f')} onClick={openAdd}>+ Add Project</button>
      </div>

      {showForm && (
        <div style={cardStyle}>
          <div style={{ fontWeight: 600, marginBottom: 12, color: '#1e3a5f' }}>{editId ? '✏️ Edit Project' : '+ New Project'}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
            <input placeholder="Project title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={inputStyle} />
            <input placeholder="Responsible person" value={form.responsible} onChange={e => setForm({ ...form, responsible: e.target.value })} style={inputStyle} />
            <input type="date" value={form.due_date} onChange={e => setForm({ ...form, due_date: e.target.value })} style={inputStyle} />
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inputStyle}>
              <option>Not Started</option><option>In Progress</option><option>Completed</option>
            </select>
          </div>
          <input placeholder="Notes" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} style={{ ...inputStyle, width: '100%', marginBottom: 12, boxSizing: 'border-box' }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <button style={btn('#16a34a')} onClick={saveProject} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update Project' : 'Save Project'}</button>
            <button style={btn('#64748b')} onClick={() => { setShowForm(false); setEditId(null) }}>Cancel</button>
          </div>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead><tr style={{ background: '#f8fafc' }}>
            {['Status', 'Project', 'Responsible', 'Due Date', 'Notes', 'Update', ''].map(h => (
              <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 12, color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>{h}</th>
            ))}
          </tr></thead>
          <tbody>
            {projects.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 16px', fontSize: 22 }}>{statusEmoji[p.status]}</td>
                <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>{p.title}</td>
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
                    <button onClick={() => deleteProject(p.id)} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}>🗑️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {projects.length === 0 && <div style={{ textAlign: 'center', padding: 48, color: '#94a3b8' }}>No projects yet</div>}
      </div>
    </div>
  )
}

// ─── PORTAL ADMIN ────────────────────────────────────────
function PortalAdminPage() {
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

  useState(() => { fetchAll() }, [])

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
    setUploading(true)
    setUploadError('')
    const ext = file.name.split('.').pop()
    const fileName = `${folder}/${Date.now()}_${file.name.replace(/\s+/g, '_')}`
    const { error } = await supabase.storage.from('documents').upload(fileName, file, { contentType: file.type })
    setUploading(false)
    if (error) { setUploadError('Upload failed: ' + error.message); return null }
    const { data } = supabase.storage.from('documents').getPublicUrl(fileName)
    return data.publicUrl
  }

  function openEdit(formSetter, item, fields) {
    setEditId(item.id)
    const filled = {}
    fields.forEach(f => { filled[f] = item[f] || '' })
    formSetter(filled)
  }

  async function save(table, form, reset) {
    setSaving(true)
    if (editId) {
      await supabase.from(table).update(form).eq('id', editId)
      setEditId(null)
    } else {
      await supabase.from(table).insert([form])
    }
    reset(); setSaving(false); fetchAll()
  }

  async function del(table, id) {
    await supabase.from(table).delete().eq('id', id)
    fetchAll()
  }

  const s = {
    input: { padding: '8px 12px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, width: '100%', boxSizing: 'border-box' },
    tabBtn: (active) => ({ padding: '8px 16px', background: active ? '#1e3a5f' : 'white', color: active ? 'white' : '#64748b', border: '1px solid #e2e8f0', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 }),
    formCard: { background: '#f8fafc', borderRadius: 12, padding: 20, marginBottom: 12 },
    row: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid #f1f5f9' },
    fileBox: { border: '2px dashed #cbd5e1', borderRadius: 8, padding: '12px 16px', background: 'white', cursor: 'pointer', fontSize: 13, color: '#64748b', textAlign: 'center' },
  }

  const tabs = [
    { id: 'contacts', label: '👥 Contacts' },
    { id: 'events', label: '📅 Events' },
    { id: 'documents', label: '📄 Documents' },
    { id: 'agm', label: '📊 AGM Docs' },
    { id: 'newsletter', label: '📰 Newsletter' },
  ]

  // Shared file upload widget
  function FileUpload({ currentUrl, onUploaded, folder }) {
    return (
      <div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
          PDF File {currentUrl && <a href={currentUrl} target="_blank" rel="noreferrer" style={{ color: '#0369a1', marginLeft: 8 }}>📎 View current file</a>}
        </div>
        <label style={s.fileBox}>
          {uploading ? '⏳ Uploading...' : '📁 Click to upload PDF (or drag & drop)'}
          <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }}
            onChange={async e => {
              const file = e.target.files[0]
              if (!file) return
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
      <div style={{ fontSize: 24, fontWeight: 700, color: '#1e3a5f', marginBottom: 4 }}>⚙️ Portal Admin</div>
      <div style={{ color: '#64748b', marginBottom: 24 }}>Manage all public-facing content</div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {tabs.map(t => <button key={t.id} style={s.tabBtn(tab === t.id)} onClick={() => { setTab(t.id); setEditId(null) }}>{t.label}</button>)}
      </div>

      {/* CONTACTS */}
      {tab === 'contacts' && (
        <div>
          <div style={s.formCard}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>{editId ? '✏️ Edit Contact' : 'Add Committee Contact'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 12 }}>
              <input placeholder="Name" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} style={s.input} />
              <input placeholder="Role / Position" value={contactForm.role} onChange={e => setContactForm({ ...contactForm, role: e.target.value })} style={s.input} />
              <input placeholder="Phone" value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} style={s.input} />
              <input placeholder="Email" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} style={s.input} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={btn('#16a34a')} onClick={() => save('portal_contacts', contactForm, () => setContactForm({ name: '', role: '', phone: '', email: '', sort_order: 0 }))} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Add Contact'}</button>
              {editId && <button style={btn('#64748b')} onClick={() => { setEditId(null); setContactForm({ name: '', role: '', phone: '', email: '', sort_order: 0 }) }}>Cancel</button>}
            </div>
          </div>
          {contacts.map(c => (
            <div key={c.id} style={s.row}>
              <div><span style={{ fontWeight: 600 }}>{c.name}</span> <span style={{ color: '#64748b', fontSize: 13 }}>· {c.role} · {c.phone} · {c.email}</span></div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={editBtn} onClick={() => openEdit(setContactForm, c, ['name', 'role', 'phone', 'email', 'sort_order'])}>✏️ Edit</button>
                <button style={btn('#dc2626')} onClick={() => del('portal_contacts', c.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* EVENTS */}
      {tab === 'events' && (
        <div>
          <div style={s.formCard}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>{editId ? '✏️ Edit Event' : 'Add Public Event'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <input placeholder="Event title" value={eventForm.title} onChange={e => setEventForm({ ...eventForm, title: e.target.value })} style={s.input} />
              <input type="date" value={eventForm.event_date} onChange={e => setEventForm({ ...eventForm, event_date: e.target.value })} style={s.input} />
              <select value={eventForm.type} onChange={e => setEventForm({ ...eventForm, type: e.target.value })} style={s.input}>
                <option>Competition</option><option>Birthday</option><option>Venue Hire</option><option>Social</option><option>General</option>
              </select>
            </div>
            <input placeholder="Description" value={eventForm.description} onChange={e => setEventForm({ ...eventForm, description: e.target.value })} style={{ ...s.input, marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={btn('#16a34a')} onClick={() => save('portal_events', eventForm, () => setEventForm({ title: '', event_date: '', type: 'Competition', description: '' }))} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Add Event'}</button>
              {editId && <button style={btn('#64748b')} onClick={() => { setEditId(null); setEventForm({ title: '', event_date: '', type: 'Competition', description: '' }) }}>Cancel</button>}
            </div>
          </div>
          {events.map(e => (
            <div key={e.id} style={s.row}>
              <div><span style={{ fontWeight: 600 }}>{e.title}</span> <span style={{ color: '#64748b', fontSize: 13 }}>· {e.event_date} · {e.type}</span></div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button style={editBtn} onClick={() => openEdit(setEventForm, e, ['title', 'event_date', 'type', 'description'])}>✏️ Edit</button>
                <button style={btn('#dc2626')} onClick={() => del('portal_events', e.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DOCUMENTS */}
      {tab === 'documents' && (
        <div>
          <div style={s.formCard}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>{editId ? '✏️ Edit Document' : 'Add Document'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <input placeholder="Document name" value={docForm.name} onChange={e => setDocForm({ ...docForm, name: e.target.value })} style={s.input} />
              <select value={docForm.category} onChange={e => setDocForm({ ...docForm, category: e.target.value })} style={s.input}>
                <option>White River</option><option>Lowveld</option><option>Mpumalanga</option><option>Bowls South Africa</option><option>Constitution & Bylaws</option>
              </select>
              <input type="date" value={docForm.file_date} onChange={e => setDocForm({ ...docForm, file_date: e.target.value })} style={s.input} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <FileUpload folder="documents" currentUrl={docForm.file_url} onUploaded={url => setDocForm({ ...docForm, file_url: url })} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={btn('#16a34a')} onClick={() => save('portal_documents', docForm, () => setDocForm({ name: '', category: 'White River', file_date: '', file_url: '' }))} disabled={saving || uploading}>{saving ? 'Saving...' : editId ? 'Update' : 'Add Document'}</button>
              {editId && <button style={btn('#64748b')} onClick={() => { setEditId(null); setDocForm({ name: '', category: 'White River', file_date: '', file_url: '' }) }}>Cancel</button>}
            </div>
          </div>
          {docs.map(d => (
            <div key={d.id} style={s.row}>
              <div>
                <span style={{ fontWeight: 600 }}>{d.name}</span>
                <span style={{ color: '#64748b', fontSize: 13 }}>· {d.category} · {d.file_date}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {d.file_url && <a href={d.file_url} target="_blank" rel="noreferrer"><button style={btn('#2d5080')}>📎 View</button></a>}
                <button style={editBtn} onClick={() => openEdit(setDocForm, d, ['name', 'category', 'file_date', 'file_url'])}>✏️ Edit</button>
                <button style={btn('#dc2626')} onClick={() => del('portal_documents', d.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* AGM */}
      {tab === 'agm' && (
        <div>
          <div style={s.formCard}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>{editId ? '✏️ Edit AGM Document' : 'Add AGM Document'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: 12, marginBottom: 12 }}>
              <input placeholder="Document name" value={agmForm.name} onChange={e => setAgmForm({ ...agmForm, name: e.target.value })} style={s.input} />
              <select value={agmForm.type} onChange={e => setAgmForm({ ...agmForm, type: e.target.value })} style={s.input}>
                <option>Minutes</option><option>Agenda</option><option>Financials</option>
              </select>
              <input placeholder="Year (e.g. 2025)" value={agmForm.year} onChange={e => setAgmForm({ ...agmForm, year: e.target.value })} style={s.input} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <FileUpload folder="agm" currentUrl={agmForm.file_url} onUploaded={url => setAgmForm({ ...agmForm, file_url: url })} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={btn('#16a34a')} onClick={() => save('portal_agm', agmForm, () => setAgmForm({ name: '', type: 'Minutes', year: '', file_url: '' }))} disabled={saving || uploading}>{saving ? 'Saving...' : editId ? 'Update' : 'Add Document'}</button>
              {editId && <button style={btn('#64748b')} onClick={() => { setEditId(null); setAgmForm({ name: '', type: 'Minutes', year: '', file_url: '' }) }}>Cancel</button>}
            </div>
          </div>
          {agm.map(a => (
            <div key={a.id} style={s.row}>
              <div>
                <span style={{ fontWeight: 600 }}>{a.name}</span>
                <span style={{ color: '#64748b', fontSize: 13 }}>· {a.type} · {a.year}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {a.file_url && <a href={a.file_url} target="_blank" rel="noreferrer"><button style={btn('#2d5080')}>📎 View</button></a>}
                <button style={editBtn} onClick={() => openEdit(setAgmForm, a, ['name', 'type', 'year', 'file_url'])}>✏️ Edit</button>
                <button style={btn('#dc2626')} onClick={() => del('portal_agm', a.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEWSLETTER */}
      {tab === 'newsletter' && (
        <div>
          <div style={s.formCard}>
            <div style={{ fontWeight: 600, marginBottom: 12 }}>{editId ? '✏️ Edit Newsletter' : 'Add Newsletter'}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
              <input placeholder="Newsletter title" value={nlForm.title} onChange={e => setNlForm({ ...nlForm, title: e.target.value })} style={s.input} />
              <input type="date" value={nlForm.published_date} onChange={e => setNlForm({ ...nlForm, published_date: e.target.value })} style={s.input} />
            </div>
            <div style={{ marginBottom: 12 }}>
              <FileUpload folder="newsletters" currentUrl={nlForm.file_url} onUploaded={url => setNlForm({ ...nlForm, file_url: url })} />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={btn('#16a34a')} onClick={() => save('portal_newsletter', nlForm, () => setNlForm({ title: '', published_date: '', file_url: '' }))} disabled={saving || uploading}>{saving ? 'Saving...' : editId ? 'Update' : 'Add Newsletter'}</button>
              {editId && <button style={btn('#64748b')} onClick={() => { setEditId(null); setNlForm({ title: '', published_date: '', file_url: '' }) }}>Cancel</button>}
            </div>
          </div>
          {newsletters.map(n => (
            <div key={n.id} style={s.row}>
              <div>
                <span style={{ fontWeight: 600 }}>{n.title}</span>
                <span style={{ color: '#64748b', fontSize: 13 }}>· {n.published_date}</span>
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {n.file_url && <a href={n.file_url} target="_blank" rel="noreferrer"><button style={btn('#2d5080')}>📎 View</button></a>}
                <button style={editBtn} onClick={() => openEdit(setNlForm, n, ['title', 'published_date', 'file_url'])}>✏️ Edit</button>
                <button style={btn('#dc2626')} onClick={() => del('portal_newsletter', n.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}