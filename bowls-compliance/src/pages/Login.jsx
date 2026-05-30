import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Invalid email or password. Please try again.')
    setLoading(false)
  }

  async function handleSignup() {
    setLoading(true)
    setError('')
    setSuccess('')
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError(error.message)
    } else if (data.user) {
      await supabase.from('user_roles').insert([{ user_id: data.user.id, role: 'member' }])
      setSuccess('Account created! You can now sign in.')
      setMode('login')
    }
    setLoading(false)
  }

  const s = {
    wrap: { display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif', background: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
    box: { background: 'white', borderRadius: 16, padding: 48, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', width: '100%', maxWidth: 400 },
    title: { fontSize: 24, fontWeight: 700, color: '#1e3a5f', marginBottom: 4, textAlign: 'center' },
    sub: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 32 },
    label: { fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' },
    input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, marginBottom: 16, boxSizing: 'border-box' },
    btn: { width: '100%', padding: '12px 0', background: '#1e3a5f', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15 },
    error: { background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
    success: { background: '#dcfce7', color: '#16a34a', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
    toggle: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#64748b' },
    toggleBtn: { background: 'none', border: 'none', color: '#1e3a5f', cursor: 'pointer', fontWeight: 700, fontSize: 14 },
    tabs: { display: 'flex', marginBottom: 32, borderRadius: 8, overflow: 'hidden', border: '1px solid #e2e8f0' },
    tab: (active) => ({ flex: 1, padding: '10px 0', background: active ? '#1e3a5f' : 'white', color: active ? 'white' : '#64748b', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14 }),
  }

  return (
    <div style={s.wrap}>
      <div style={s.box}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚪</div>
          <div style={s.title}>White River Bowls Club</div>
          <div style={s.sub}>Member & Committee Portal</div>
        </div>

        <div style={s.tabs}>
          <button style={s.tab(mode === 'login')} onClick={() => { setMode('login'); setError(''); setSuccess('') }}>Sign In</button>
          <button style={s.tab(mode === 'signup')} onClick={() => { setMode('signup'); setError(''); setSuccess('') }}>Register</button>
        </div>

        {error && <div style={s.error}>{error}</div>}
        {success && <div style={s.success}>{success}</div>}

        <label style={s.label}>Email Address</label>
        <input style={s.input} type="email" placeholder="your@email.com"
          value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleSignup())} />

        <label style={s.label}>Password</label>
        <input style={s.input} type="password" placeholder="••••••••"
          value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (mode === 'login' ? handleLogin() : handleSignup())} />

        {mode === 'signup' && (
          <div style={{ background: '#f0f9ff', borderRadius: 8, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: '#0369a1' }}>
            ℹ️ Members get access to the Events Calendar after registering.
          </div>
        )}

        <button style={s.btn} onClick={mode === 'login' ? handleLogin : handleSignup} disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>

        <div style={s.toggle}>
          <button style={s.toggleBtn} onClick={() => navigate('/')}>← Back to Member Portal</button>
        </div>
      </div>
    </div>
  )
}