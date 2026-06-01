import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase'

const navItems = [
  { id: 'home', label: 'Home' },
  { id: 'documents', label: 'Documents' },
  { id: 'events', label: 'Events' },
  { id: 'contacts', label: 'Committee' },
  { id: 'newsletter', label: 'Newsletter' },
]

export default function Portal() {
  const navigate = useNavigate()
  const [active, setActive] = useState('home')
  const [documents, setDocuments] = useState([])
  const [events, setEvents] = useState([])
  const [contacts, setContacts] = useState([])
  const [newsletters, setNewsletters] = useState([])

  useEffect(() => { fetchAll() }, [])

  async function fetchAll() {
    const [d, e, c, n] = await Promise.all([
      supabase.from('portal_documents').select('*').order('created_at', { ascending: false }),
      supabase.from('portal_events').select('*').order('event_date'),
      supabase.from('portal_contacts').select('*').order('sort_order'),
      supabase.from('portal_newsletter').select('*').order('created_at', { ascending: false }),
    ])
    if (!d.error) setDocuments(d.data ?? [])
    if (!e.error) setEvents(e.data ?? [])
    if (!c.error) setContacts(c.data ?? [])
    if (!n.error) setNewsletters(n.data ?? [])
  }

  const s = {
    wrap: { display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif', background: '#f5f5f5' },
    header: { background: '#1a1a1a', color: 'white', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 },
    logo: { fontWeight: 700, fontSize: 13, letterSpacing: 1, textTransform: 'uppercase' },
    nav: { display: 'flex', gap: 2 },
    navBtn: (a, id) => ({ background: a === id ? 'rgba(255,255,255,0.12)' : 'none', border: 'none', color: a === id ? 'white' : 'rgba(255,255,255,0.6)', padding: '8px 14px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: a === id ? 600 : 400 }),
    hero: { background: '#1a1a1a', color: 'white', padding: '72px 32px', textAlign: 'center' },
    heroTitle: { fontSize: 36, fontWeight: 700, marginBottom: 10, letterSpacing: -0.5 },
    heroSub: { fontSize: 15, opacity: 0.6, marginBottom: 36 },
    main: { maxWidth: 1080, margin: '0 auto', padding: '40px 32px', flex: 1, width: '100%', boxSizing: 'border-box' },
    card: { background: 'white', borderRadius: 10, padding: 20, border: '1px solid #e2e8f0', marginBottom: 12 },
    sectionTitle: { fontSize: 18, fontWeight: 700, color: '#1a1a1a', marginBottom: 20 },
    grid3: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 },
    grid2: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 },
    docCard: { background: 'white', borderRadius: 10, padding: 18, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: 6 },
    btn: { padding: '7px 14px', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 12 },
    emptyState: { textAlign: 'center', padding: '48px 0', color: '#94a3b8', fontSize: 13 },
  }

  const docCategories = ['Constitution & Bylaws', 'White River', 'Lowveld', 'Mpumalanga', 'Bowls South Africa']

  return (
    <div style={s.wrap}>
      <header style={s.header}>
        <div style={s.logo}>White River Bowls Club</div>
        <nav style={s.nav}>
          {navItems.map(n => (
            <button key={n.id} style={s.navBtn(active, n.id)} onClick={() => setActive(n.id)}>{n.label}</button>
          ))}
        </nav>
        <button style={{ background: 'none', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.5)', padding: '5px 12px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }} onClick={() => navigate('/login')}>Admin</button>
      </header>

      {active === 'home' && (
        <div style={s.hero}>
          <div style={s.heroTitle}>White River Bowls Club</div>
          <div style={s.heroSub}>Club information, documents and events — all in one place</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            {navItems.filter(n => n.id !== 'home').map(n => (
              <button key={n.id} onClick={() => setActive(n.id)} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.85)', padding: '8px 18px', borderRadius: 6, cursor: 'pointer', fontSize: 13, fontWeight: 500 }}>
                {n.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <main style={s.main}>
        {active === 'documents' && (
          <div>
            <div style={s.sectionTitle}>Documents</div>
            {docCategories.map(cat => {
              const catDocs = documents.filter(d => d.category === cat)
              if (catDocs.length === 0) return null
              return (
                <div key={cat} style={{ marginBottom: 28 }}>
                  <div style={{ fontWeight: 600, color: '#333', marginBottom: 12, fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>{cat}</div>
                  <div style={s.grid3}>
                    {catDocs.map(doc => (
                      <div key={doc.id} style={s.docCard}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: '#1a1a1a' }}>{doc.name}</div>
                        <div style={{ fontSize: 12, color: '#64748b' }}>{doc.category} · {doc.file_date}</div>
                        {doc.file_url && <a href={doc.file_url} target="_blank" rel="noreferrer"><button style={s.btn}>Download</button></a>}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
            {documents.length === 0 && <div style={s.emptyState}>No documents uploaded yet</div>}
          </div>
        )}

        {active === 'events' && (
          <div>
            <div style={s.sectionTitle}>Upcoming Events</div>
            {events.length === 0 && <div style={s.emptyState}>No events scheduled yet</div>}
            {events.map(ev => (
              <div key={ev.id} style={{ ...s.card, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{ background: '#1a1a1a', color: 'white', borderRadius: 8, padding: '10px 14px', textAlign: 'center', minWidth: 52, flexShrink: 0 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, lineHeight: 1 }}>{new Date(ev.event_date).getDate()}</div>
                  <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>{new Date(ev.event_date).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a', marginBottom: 4 }}>{ev.title}</div>
                  <div style={{ color: '#64748b', fontSize: 13, marginBottom: 8 }}>{ev.description}</div>
                  <span style={{ background: '#f5f5f5', color: '#333', padding: '2px 10px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>{ev.type}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {active === 'contacts' && (
          <div>
            <div style={s.sectionTitle}>Committee</div>
            {contacts.length === 0 && <div style={s.emptyState}>No contacts added yet</div>}
            <div style={s.grid2}>
              {contacts.map(c => (
                <div key={c.id} style={s.card}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: '#1a1a1a', marginBottom: 2 }}>{c.name}</div>
                  <div style={{ color: '#333', fontWeight: 500, fontSize: 12, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>{c.role}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.8 }}>
                    {c.phone && <div>{c.phone}</div>}
                    {c.email && <div>{c.email}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {active === 'newsletter' && (
          <div>
            <div style={s.sectionTitle}>Newsletter</div>
            {newsletters.length === 0 && <div style={s.emptyState}>No newsletters published yet</div>}
            <div style={s.grid3}>
              {newsletters.map(n => (
                <div key={n.id} style={s.docCard}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{n.published_date}</div>
                  {n.file_url && <a href={n.file_url} target="_blank" rel="noreferrer"><button style={s.btn}>Read</button></a>}
                </div>
              ))}
            </div>
          </div>
        )}

        {active === 'home' && (
          <div style={s.grid3}>
            {navItems.filter(n => n.id !== 'home').map(n => (
              <div key={n.id} onClick={() => setActive(n.id)} style={{ ...s.card, cursor: 'pointer', textAlign: 'center', padding: '28px 20px' }}>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1a1a1a' }}>{n.label}</div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer style={{ background: '#1a1a1a', color: 'rgba(255,255,255,0.4)', textAlign: 'center', padding: '16px 32px', fontSize: 12 }}>
        &copy; 2026 White River Bowls Club
      </footer>
    </div>
  )
}
