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
    box: { background: 'white', borderRadius: 12, padding: 48, border: '1px solid #e2e8f0', width: '100%', maxWidth: 380 },
    mark: { fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#1a1a1a', textTransform: 'uppercase', marginBottom: 24, textAlign: 'center' },
    title: { fontSize: 20, fontWeight: 700, color: '#1a1a1a', marginBottom: 4, textAlign: 'center' },
    sub: { fontSize: 13, color: '#64748b', textAlign: 'center', marginBottom: 32 },
    label: { fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5, display: 'block' },
    input: { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: 6, fontSize: 14, marginBottom: 16, boxSizing: 'border-box', outline: 'none' },
    btn: { width: '100%', padding: '11px 0', background: '#1a1a1a', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600, fontSize: 14 },
    error: { background: '#fee2e2', color: '#dc2626', padding: '10px 12px', borderRadius: 6, fontSize: 13, marginBottom: 16 },
    backBtn: { background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: 13 },
  }

  return (
    <div style={s.wrap}>
      <div style={s.box}>
        <div style={s.mark}>White River Bowls Club</div>
        <div style={s.title}>Sign In</div>
        <div style={s.sub}>Committee &amp; admin access</div>

        {error && <div style={s.error}>{error}</div>}

        <label style={s.label}>Email</label>
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
          <button style={s.backBtn} onClick={() => navigate('/')}>Back to Club Portal</button>
        </div>
      </div>
    </div>
  )
}
