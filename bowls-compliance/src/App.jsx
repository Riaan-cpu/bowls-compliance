import { Routes, Route, Navigate } from 'react-router-dom'
import Portal from './pages/Portal'
import ComplianceApp from './pages/ComplianceApp'
import Login from './pages/Login'
import Committee from './pages/Committee'
import MemberPortal from './pages/MemberPortal'
import { useState, useEffect } from 'react'
import { supabase } from './supabase'

export default function App() {
  const [session, setSession] = useState(undefined)
  const [role, setRole] = useState(null)        // ← null until known
  const [ready, setReady] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session)
      if (session) await fetchRole(session.user.id)  // ← await this
      setReady(true)                                  // ← only now mark ready
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      if (session) await fetchRole(session.user.id)
      else { setRole(null); setReady(true) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchRole(userId) {
    try {
      const { data } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .limit(1)
      setRole(data && data.length > 0 ? data[0].role : 'member')
    } catch {
      setRole('member')
    }
  }

  // Show loading until session AND role are both resolved
  if (!ready || (session && role === null)) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontFamily: 'Segoe UI', color: '#1e3a5f', fontSize: 18 }}>
      Loading...
    </div>
  )

  const isAdmin = role === 'admin' || role === 'committee'

  return (
    <Routes>
      <Route path="/" element={<Portal />} />
      <Route path="/login" element={
        session
          ? (isAdmin ? <Navigate to="/committee" /> : <Navigate to="/member" />)
          : <Login />
      } />
      <Route path="/member" element={
        session ? <MemberPortal session={session} /> : <Navigate to="/login" />
      } />
      <Route path="/committee/*" element={
        session && isAdmin
          ? <Committee session={session} role={role} />
          : session ? <Navigate to="/member" /> : <Navigate to="/login" />
      } />
      <Route path="/compliance/*" element={
        session && isAdmin ? <ComplianceApp session={session} /> : <Navigate to="/login" />
      } />
    </Routes>
  )
}