import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Shield, AlertCircle } from 'lucide-react'
import Navbar from '../../layouts/Navbar'
import { api } from '../../services/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e?.preventDefault()
    setError('')
    setLoading(true)

    const res = await api.login(username, password)
    setLoading(false)

    if (res.success) {
      const role = res.data.user.role
      const from = location.state?.from?.pathname || `/${role}/dashboard`
      navigate(from, { replace: true })
    } else {
      setError(res.message || 'लॉगिन असफल रहा (Login failed)')
    }
  }

  // Convenient 1-Click Credential Helpers
  const fillCredentials = (u, p) => {
    setUsername(u)
    setPassword(p)
    setError('')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <Navbar />

      <main style={{ maxWidth: '480px', margin: '40px auto', padding: '0 20px', width: '100%', flex: 1 }}>
        <div style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-card)',
          padding: '36px 32px',
          boxShadow: 'var(--shadow-elevated)'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, var(--purple-600), #4f46e5)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 4px 14px rgba(124, 58, 237, 0.4)'
            }}>
              <Shield size={26} />
            </div>
            <h2 style={{ fontSize: '1.6rem', color: 'var(--slate-900)', margin: '0 0 4px' }}>
              आधिकारिक लॉगिन पोर्टल
            </h2>
            <p style={{ color: 'var(--slate-500)', fontSize: '0.88rem', margin: 0 }}>
              प्रशासक, स्वयंसेवक एवं खिलाड़ी डैशबोर्ड एक्सेस
            </p>
          </div>

          {/* Quick Demo Credential Pills */}
          <div style={{ background: 'var(--slate-50)', padding: '12px', borderRadius: '10px', marginBottom: '20px', border: '1px solid var(--slate-200)' }}>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '8px', textAlign: 'center' }}>
              त्वरित डेमो लॉगिन (1-Click Test Credentials):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillCredentials('admin', 'admin123')}
                style={{ fontSize: '0.75rem', padding: '6px 4px' }}
              >
                ⚡ Admin
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillCredentials('volunteer', 'vol123')}
                style={{ fontSize: '0.75rem', padding: '6px 4px' }}
              >
                🤝 Volunteer
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => fillCredentials('9876543210', 'player123')}
                style={{ fontSize: '0.75rem', padding: '6px 4px' }}
              >
                🏃 Athlete
              </button>
            </div>
          </div>

          {error && (
            <div style={{ padding: '10px 14px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', color: '#9f1239', fontSize: '0.85rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">उपयोगकर्ता नाम / मोबाइल (Username or Mobile)</label>
              <input
                type="text"
                className="form-input"
                placeholder="admin / volunteer / 9876543210"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">पासवर्ड (Password)</label>
              <input
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '11px', marginTop: '8px', fontSize: '0.95rem' }}
              disabled={loading}
            >
              {loading ? 'सत्यापित किया जा रहा है...' : 'प्रवेश करें (Login)'}
            </button>
          </form>

          <div style={{ marginTop: '22px', textAlign: 'center', fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            खिलाड़ी के रूप में नया पंजीकरण करना चाहते हैं?{' '}
            <Link to="/register" style={{ color: 'var(--purple-600)', fontWeight: 600 }}>
              यहाँ क्लिक करें
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
