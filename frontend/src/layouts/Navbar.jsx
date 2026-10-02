import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { LogIn, UserPlus, Calendar, Award, Shield } from 'lucide-react'
import { api } from '../services/api'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation()
  const navigate = useNavigate()
  const currentUser = api.getCurrentUser()

  const handleLogout = () => {
    api.logout()
    navigate('/')
    window.location.reload()
  }

  const isActive = (path) => location.pathname === path

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid var(--slate-200)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    }}
    className="header"
    >
      <div style={{
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto',
        padding: '0 20px',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
      className="logo"
      >
        {/* Brand */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, var(--purple-600), #4f46e5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '1.3rem',
            boxShadow: '0 4px 12px rgba(124, 58, 237, 0.35)'
          }}>
            🏆
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem', color: 'var(--slate-900)', lineHeight: 1.1 }}>
              आरव खेलकूद उत्सव
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--slate-500)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Sports Management System
            </div>
          </div>
        </Link>
        {/* Hamburger icon for mobile view */}
        <button 
          className="menu-toggle" 
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle navigation"
        >
          {isOpen ? '✕' : '☰'}
        </button>

        {/* Public Navlinks */}
        <nav className={`nav-menu ${isOpen ? 'open' : ''}`}>
          <Link
            to="/"
            className={`btn ${isActive('/') ? 'btn-secondary' : 'btn-outline'}`}
            style={{ border: 'none' }}
          >
            होम (Home)
          </Link>
          <Link
            to="/games"
            className={`btn ${isActive('/games') ? 'btn-secondary' : 'btn-outline'}`}
            style={{ border: 'none' }}
          >
            <Calendar size={15} /> खेल सूची (Games)
          </Link>
          <Link
            to="/winners"
            className={`btn ${isActive('/winners') ? 'btn-secondary' : 'btn-outline'}`}
            style={{ border: 'none' }}
          >
            <Award size={15} /> परिणाम (Winners)
          </Link>
          <Link
            to="/register"
            className="btn btn-primary"
            style={{ marginLeft: '6px' }}
          >
            <UserPlus size={15} /> खिलाड़ी पंजीकरण (Register)
          </Link>

          {/* User state / Login portal button */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: '12px' }}>
              <Link
                to={`/${currentUser.role}/dashboard`}
                className="btn btn-secondary"
                style={{ fontWeight: 700, borderColor: 'var(--purple-400)' }}
              >
                <Shield size={15} color="var(--purple-600)" /> {currentUser.name?.split(' ')[0] || 'Dashboard'} ({currentUser.role})
              </Link>
              <button type="button" className="btn btn-outline btn-sm" onClick={handleLogout}>
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="btn btn-secondary"
              style={{ marginLeft: '8px' }}
            >
              <LogIn size={15} /> लॉगिन (Login)
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
