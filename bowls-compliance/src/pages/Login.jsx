import { useState } from 'react'
import { supabase } from '../supabase'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError('Invalid email or password. Please try again.')
    setLoading(false)
  }

  const s = {
    wrap: { display: 'flex', minHeight: '100vh', fontFamily: 'Segoe UI, sans-serif', background: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
    box: { background: 'white', borderRadius: 16, padding: 48, boxShadow: '0 4px 24px rgba(0,0,0,0.10)', width: '100%', maxWidth: 400 },
    title: { fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 4, textAlign: 'center' },
    sub: { fontSize: 14, color: '#64748b', textAlign: 'center', marginBottom: 32 },
    label: { fontSize: 13, fontWeight: 600, color: '#333333', marginBottom: 6, display: 'block' },
    input: { width: '100%', padding: '10px 14px', border: '1px solid #e2e8f0', borderRadius: 8, fontSize: 14, marginBottom: 16, boxSizing: 'border-box' },
    btn: { width: '100%', padding: '12px 0', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 700, fontSize: 15 },
    error: { background: '#fee2e2', color: '#dc2626', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 16 },
    backBtn: { background: 'none', border: 'none', color: '#333333', cursor: 'pointer', fontWeight: 600, fontSize: 14 },
  }

  return (
    <div style={s.wrap}>
      <div style={s.box}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>⚪</div>
          <div style={s.title}>White River Bowls Club</div>
          <div style={s.sub}>Committee & admin sign in</div>
        </div>

        {error && <div style={s.error}>{error}</div>}

        <label style={s.label}>Email Address</label>
        <input style={s.input} type="email" placeholder="your@email.com"
          value={email} onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()} />

        <label style={s.label}>Password</label>
        <input style={s.input} type="password" placeholder="••••••••"
          value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()} />

        <button style={s.btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 20 }}>
          <button style={s.backBtn} onClick={() => navigate('/')}>← Back to Club Portal</button>
        </div>
      </div>
    </div>
  )
}