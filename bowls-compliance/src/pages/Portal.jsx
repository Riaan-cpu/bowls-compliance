import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const navItems = [
  { id: 'home', label: 'Home', icon: '🏠' },
  { id: 'documents', label: 'Documents', icon: '📄' },
  { id: 'events', label: 'Events', icon: '📅' },
  { id: 'contacts', label: 'Committee', icon: '👥' },
  { id: 'agm', label: 'AGM & Financials', icon: '📊' },
  { id: 'newsletter', label: 'Newsletter', icon: '📰' },
]

export default function Portal() {
  const navigate = useNavigate()
  const [active, setActive] = useState('home')
  const [documents, setDocuments] = useState([])
  const [events, setEvents] = useState([])
  const [contacts, setContacts] = useState([])
  const [agmDocs, setAgmDocs] = useState([])
  const [newsletters, setNewsletters] = useState([])

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const [d, e, c, a, n] = await Promise.all([
      supabase.from('portal_documents').select('*').order('created_at', { ascending: false }),
      supabase.from('portal_events').select('*').order('event_date'),
      supabase.from('portal_contacts').select('*').order('sort_order'),
      supabase.from('portal_agm').select('*').order('created_at', { ascending: false }),
      supabase.from('portal_newsletter').select('*').order('created_at', { ascending: false }),
    ])
    if (!d.error) setDocuments(d.data)
    if (!e.error) setEvents(e.data)
    if (!c.error) setContacts(c.data)
    if (!a.error) setAgmDocs(a.data)
    if (!n.error) setNewsletters(n.data)
  }

  const s = {
    wrap: { display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif', background: '#f8fafc' },
    header: { background: '#1e3a5f', color: 'white', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 },
    logo: { fontWeight: 700, fontSize: 18 },
    nav: { display: 'flex', gap: 4 },
    navBtn: (active, id) => ({ background: active === id ? 'rgba(255,255,255,0.15)' : 'none', border: 'none', color: 'white', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: active === id ? 600 : 400 }),
    loginBtn: { background: 'white', color: '#1e3a5f', border: 'none', padding: '8px 20px', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 14 },
    hero: { background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5080 100%)', color: 'white', padding: '64px 32px', textAlign: 'center' },
    heroTitle: { fontSize: 42, fontWeight: 700, marginBottom: 12 },
    heroSub: { fontSize: 18, opacity: 0.85, marginBottom: 32 },
    main: { maxWidth: 1100, margin: '0 auto', padding: '40px 32px', flex: 1 },
    card: { background: 'white', borderRadius: 12, padding: 24, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 16 },
    sectionTitle: { fontSize: 22, fontWeight: 700, color: '#1e3a5f', marginBottom: 20 },
    tag: (color) => ({ background: color + '20', color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }),
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
    grid2: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 },
    docCard: { background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', gap: 8 },
    btn: { padding: '8px 16px', background: '#1e3a5f', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600, fontSize: 13 },
    emptyState: { textAlign: 'center', padding: '48px 0', color: '#94a3b8' },
  }

  const docCategories = ['Constitution & Bylaws', 'White River', 'Lowveld', 'Mpumalanga', 'Bowls South Africa']

  return (
    <div style={s.wrap}>
      {/* Header */}
      <header style={s.header}>
        <div style={s.logo}>⚪ White River Bowls Club</div>
        <nav style={s.nav}>
          {navItems.map(n => (
            <button key={n.id} style={s.navBtn(active, n.id)} onClick={() => setActive(n.id)}>
              {n.label}
            </button>
          ))}
        </nav>
        <button style={s.loginBtn} onClick={() => navigate('/login')}>Committee Login</button>
      </header>

      {/* Hero - only on home */}
      {active === 'home' && (
        <div style={s.hero}>
          <div style={s.heroTitle}>Welcome to White River Bowls Club</div>
          <div style={s.heroSub}>Your club information, documents and events — all in one place</div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {navItems.filter(n => n.id !== 'home').map(n => (
              <button key={n.id} onClick={() => setActive(n.id)}
                style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', padding: '10px 20px', borderRadius: 8, cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                {n.icon} {n.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <main style={s.main}>
        {/* DOCUMENTS */}
        {active === 'documents' && (
          <div>
            <div style={s.sectionTitle}>📄 Constitution & Bylaws</div>
            {docCategories.map(cat => {
              const catDocs = documents.filter(d => d.category === cat)
              if (catDocs.length === 0) return null
              return (
                <div key={cat} style={{ marginBottom: 28 }}>
                  <div style={{ fontWeight: 700, color: '#2d5080', marginBottom: 12, fontSize: 15 }}>{cat}</div>
                  <div style={s.grid3}>
                    {catDocs.map(doc => (
                      <div key={doc.id} style={s.docCard}>
                        <div style={{ fontSize: 28 }}>📄</div>
                        <div style={{ fontWeight: 600, fontSize: 14, color: '#1e293b' }}>{doc.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{doc.category} · {doc.file_date}</div>
                        {doc.file_url && <a href={doc.file_url} target="_blank" rel="noreferrer"><button style={s.btn}>Download</button></a>}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
            {documents.length === 0 && <div style={s.emptyState}><div style={{ fontSize: 48 }}>📄</div><div>No documents uploaded yet</div></div>}
          </div>
        )}

        {/* EVENTS */}
        {active === 'events' && (
          <div>
            <div style={s.sectionTitle}>📅 Upcoming Events</div>
            {events.length === 0 && <div style={s.emptyState}><div style={{ fontSize: 48 }}>📅</div><div>No events scheduled yet</div></div>}
            {events.map(ev => (
              <div key={ev.id} style={{ ...s.card, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ background: '#1e3a5f', color: 'white', borderRadius: 12, padding: '12px 16px', textAlign: 'center', minWidth: 60 }}>
                  <div style={{ fontSize: 22, fontWeight: 700 }}>{new Date(ev.event_date).getDate()}</div>
                  <div style={{ fontSize: 11, opacity: 0.8 }}>{new Date(ev.event_date).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#1e293b', marginBottom: 4 }}>{ev.title}</div>
                  <div style={{ color: '#64748b', fontSize: 14, marginBottom: 8 }}>{ev.description}</div>
                  <span style={s.tag(ev.type === 'Competition' ? '#7c3aed' : ev.type === 'Birthday' ? '#ec4899' : ev.type === 'Venue Hire' ? '#d97706' : '#1e3a5f')}>{ev.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONTACTS */}
        {active === 'contacts' && (
          <div>
            <div style={s.sectionTitle}>👥 Committee Contact Details</div>
            {contacts.length === 0 && <div style={s.emptyState}><div style={{ fontSize: 48 }}>👥</div><div>No contacts added yet</div></div>}
            <div style={s.grid2}>
              {contacts.map(c => (
                <div key={c.id} style={s.card}>
                  <div style={{ fontWeight: 700, fontSize: 16, color: '#1e293b', marginBottom: 4 }}>{c.name}</div>
                  <div style={{ color: '#2d5080', fontWeight: 600, fontSize: 13, marginBottom: 8 }}>{c.role}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8 }}>
                    {c.phone && <div>📞 {c.phone}</div>}
                    {c.email && <div>✉️ {c.email}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AGM */}
        {active === 'agm' && (
          <div>
            <div style={s.sectionTitle}>📊 AGM Minutes, Agendas & Financials</div>
            {agmDocs.length === 0 && <div style={s.emptyState}><div style={{ fontSize: 48 }}>📊</div><div>No AGM documents uploaded yet</div></div>}
            <div style={s.grid3}>
              {agmDocs.map(doc => (
                <div key={doc.id} style={s.docCard}>
                  <div style={{ fontSize: 28 }}>{doc.type === 'Minutes' ? '📝' : doc.type === 'Financials' ? '💰' : '📋'}</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{doc.name}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{doc.type} · {doc.year}</div>
                  {doc.file_url && <a href={doc.file_url} target="_blank" rel="noreferrer"><button style={s.btn}>Download</button></a>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* NEWSLETTER */}
        {active === 'newsletter' && (
          <div>
            <div style={s.sectionTitle}>📰 Newsletter</div>
            {newsletters.length === 0 && <div style={s.emptyState}><div style={{ fontSize: 48 }}>📰</div><div>No newsletters published yet</div></div>}
            <div style={s.grid3}>
              {newsletters.map(n => (
                <div key={n.id} style={s.docCard}>
                  <div style={{ fontSize: 28 }}>📰</div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{n.published_date}</div>
                  {n.file_url && <a href={n.file_url} target="_blank" rel="noreferrer"><button style={s.btn}>Read</button></a>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* HOME */}
        {active === 'home' && (
          <div style={s.grid3}>
            {navItems.filter(n => n.id !== 'home').map(n => (
              <div key={n.id} onClick={() => setActive(n.id)} style={{ ...s.card, cursor: 'pointer', textAlign: 'center', padding: 32 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>{n.icon}</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#1e3a5f' }}>{n.label}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ background: '#1e3a5f', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '20px 32px', fontSize: 13 }}>
        © 2026 White River Bowls Club · All rights reserved
      </footer>
    </div>
  )
}