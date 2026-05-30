import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function MemberPortal({ session }) {
  const navigate = useNavigate()
  const [events, setEvents] = useState([])

  useEffect(() => { fetchEvents() }, [])

  async function fetchEvents() {
    const { data } = await supabase.from('portal_events').select('*').order('event_date')
    if (data) setEvents(data)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    navigate('/')
  }

  const typeColor = { Competition: '#7c3aed', Birthday: '#ec4899', 'Venue Hire': '#d97706', Social: '#16a34a', General: '#1e3a5f' }

  return (
    <div style={{ minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif', background: '#f8fafc' }}>
      <header style={{ background: '#1e3a5f', color: 'white', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
        <div style={{ fontWeight: 700, fontSize: 18 }}>⚪ White River Bowls Club</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, opacity: 0.8 }}>{session.user.email}</span>
          <button onClick={handleLogout} style={{ background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13 }}>Sign Out</button>
        </div>
      </header>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 32px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#1e3a5f', marginBottom: 4 }}>📅 Events Calendar</h1>
        <p style={{ color: '#64748b', marginBottom: 32 }}>Upcoming events at White River Bowls Club</p>

        {events.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0', color: '#94a3b8' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
            <div style={{ fontSize: 18 }}>No upcoming events yet</div>
          </div>
        )}

        {events.map(ev => (
          <div key={ev.id} style={{ background: 'white', borderRadius: 12, padding: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: 12, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
            <div style={{ background: '#1e3a5f', color: 'white', borderRadius: 12, padding: '12px 16px', textAlign: 'center', minWidth: 60 }}>
              <div style={{ fontSize: 22, fontWeight: 700 }}>{new Date(ev.event_date).getDate()}</div>
              <div style={{ fontSize: 11, opacity: 0.8 }}>{new Date(ev.event_date).toLocaleString('default', { month: 'short' }).toUpperCase()}</div>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#1e293b', marginBottom: 4 }}>{ev.title}</div>
              <div style={{ color: '#64748b', fontSize: 14, marginBottom: 8 }}>{ev.description}</div>
              <span style={{ background: (typeColor[ev.type] || '#64748b') + '20', color: typeColor[ev.type] || '#64748b', padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{ev.type}</span>
            </div>
          </div>
        ))}
      </main>

      <footer style={{ background: '#1e3a5f', color: 'rgba(255,255,255,0.6)', textAlign: 'center', padding: '20px 32px', fontSize: 13 }}>
        © 2026 White River Bowls Club · All rights reserved
      </footer>
    </div>
  )
}