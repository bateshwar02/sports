import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  UserCheck,
  Trophy,
  Layers,
  Award,
  FileText,
  LogOut,
  Home,
  CheckCircle,
  Calendar,
  User,
  ShieldAlert
} from 'lucide-react'
import { api } from '../services/api'
import Badge from '../components/Badge'

export default function PortalLayout({ role, title, subtitle, children }) {
  const location = useLocation()
  const navigate = useNavigate()
  const user = api.getCurrentUser()

  const handleLogout = () => {
    api.logout()
    navigate('/login')
  }

  // Navigation items based on Blueprint Section 12
  const adminNav = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'डैशबोर्ड (Dashboard)' },
    { to: '/admin/players', icon: Users, label: 'खिलाड़ी प्रबंधन (Players)' },
    { to: '/admin/volunteers', icon: UserCheck, label: 'स्वयंसेवक दल (Volunteers)' },
    { to: '/admin/games', icon: Calendar, label: 'खेल एवं स्लॉट (Games & Slots)' },
    { to: '/admin/classes', icon: Layers, label: 'वर्ग प्रबंधन (Classes)' },
    { to: '/admin/winners', icon: Award, label: 'विजेता मैपिंग (Winner Engine)' },
    { to: '/admin/reports', icon: FileText, label: 'रिपोर्ट्स (Reports)' }
  ]

  const volunteerNav = [
    { to: '/volunteer/dashboard', icon: LayoutDashboard, label: 'कार्यक्षेत्र डैशबोर्ड (Desk)' },
    { to: '/volunteer/players', icon: UserCheck, label: 'दस्तावेज़ सत्यापन (Doc Inspect)' },
    { to: '/volunteer/games', icon: Calendar, label: 'स्लॉट एवं उपस्थिति (Roster)' },
    { to: '/volunteer/classes', icon: Layers, label: 'वर्ग सूची (Classes)' },
    { to: '/volunteer/winners', icon: Award, label: 'विजेता सूची (Winners)' }
  ]

  const playerNav = [
    { to: '/player/dashboard', icon: LayoutDashboard, label: 'आवेदन स्थिति (My Status)' },
    { to: '/player/profile', icon: User, label: 'मेरी प्रोफाइल (My Profile)' },
    { to: '/player/registration', icon: FileText, label: 'पंजीकरण विवरण (Registration)' },
    { to: '/player/results', icon: Trophy, label: 'परिणाम व प्रमाण पत्र (Certificates)' }
  ]

  const navItems = role === 'admin' ? adminNav : role === 'volunteer' ? volunteerNav : playerNav

  return (
    <div className="portal-layout">
      {/* Sidebar */}
      <aside className="portal-sidebar">
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand">
            <div className="sidebar-brand-icon">
              {role === 'admin' ? '⚡' : role === 'volunteer' ? '🤝' : '🏃'}
            </div>
            <div className="sidebar-brand-text">
              <h2>आरव खेलकूद</h2>
              <span>{role === 'admin' ? 'Admin Suite' : role === 'volunteer' ? 'Volunteer Desk' : 'Player Hub'}</span>
            </div>
          </Link>
        </div>

        <nav className="sidebar-nav">
          <div style={{ padding: '0 12px 6px', fontSize: '0.72rem', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            नेविगेशन मेनू
          </div>
          {navItems.map((item) => {
            const Icon = item.icon
            const active = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`sidebar-link ${active ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}

          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <Link
              to="/"
              className="sidebar-link"
              style={{ color: 'var(--slate-400)' }}
            >
              <Home size={18} />
              <span>पब्लिक पोर्टल (Public Site)</span>
            </Link>
          </div>
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                background: 'var(--purple-600)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.85rem'
              }}>
                {user?.name ? user.name[0] : 'U'}
              </div>
              <div style={{ minWidth: 0, overflow: 'hidden' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || user?.username || 'User'}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--purple-400)', textTransform: 'capitalize' }}>
                  {user?.role} Access
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="btn btn-secondary btn-sm"
              style={{ padding: '6px', borderRadius: '50%', background: 'transparent', border: 'none', color: 'var(--slate-400)' }}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="portal-main">
        {/* Topbar */}
        <header className="portal-topbar">
          <div>
            <h1 style={{ fontSize: '1.25rem', margin: 0, color: 'var(--slate-900)' }}>
              {title}
            </h1>
            {subtitle && (
              <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                {subtitle}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="badge-pill badge-active">
              ● Live Tournament DB
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--slate-600)' }}>
              Role: <strong>{user?.role}</strong>
            </span>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              onClick={handleLogout}
            >
              <LogOut size={14} /> लॉगआउट
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="portal-content">
          {children}
        </main>
      </div>
    </div>
  )
}
