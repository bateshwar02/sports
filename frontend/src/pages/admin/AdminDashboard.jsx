import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Clock, CheckCircle2, Trophy, UserCheck, Calendar, Award, ArrowUpRight, Plus } from 'lucide-react'
import PortalLayout from '../../layouts/PortalLayout'
import { api } from '../../services/api'
import Badge from '../../components/Badge'

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalPlayers: 0,
    pendingQueue: 0,
    verifiedAthletes: 0,
    totalGames: 0,
    activeVolunteers: 0,
    publishedWinners: 0,
    availableSlots: 0
  })

  const [recentPlayers, setRecentPlayers] = useState([])

  useEffect(() => {
    async function loadMetrics() {
      try {
        const pRes = await api.getPlayers()
        const players = pRes?.data?.players || []

        const gRes = await api.getGames()
        const games = gRes?.data || []

        const vRes = await api.getVolunteers()
        const volunteers = vRes?.data || []

        const wRes = await api.getWinners()
        const winners = wRes?.data || []

        const pending = players.filter((p) => p.status === 'Pending').length
        const verified = players.filter((p) => p.status === 'Approved').length
        const activeVol = volunteers.filter((v) => v.status === 'active').length

        let totalSlotsCount = 0
        games.forEach((g) => {
          if (g.slots) totalSlotsCount += g.slots.length
        })

        setMetrics({
          totalPlayers: players.length,
          pendingQueue: pending,
          verifiedAthletes: verified,
          totalGames: games.length,
          activeVolunteers: activeVol,
          publishedWinners: winners.length,
          availableSlots: totalSlotsCount
        })

        setRecentPlayers(players.slice(0, 5))
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err)
      }
    }
    loadMetrics()
  }, [])

  return (
    <PortalLayout
      role="admin"
      title="कार्यकारी प्रशासनिक डैशबोर्ड (Executive Dashboard)"
      subtitle="रियल-टाइम टूर्नामेंट मेट्रिक्स, सत्यापन कतार एवं समग्र नियंत्रण"
    >
      {/* 1. Responsive Metrics Grid */}
      <div
        className="metric-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}
      >
        <div className="metric-card">
          <div className="metric-icon-wrap metric-purple">
            <Users size={24} />
          </div>
          <div className="metric-data">
            <h4>कुल पंजीकृत खिलाड़ी</h4>
            <div className="metric-value">{metrics.totalPlayers}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap metric-amber">
            <Clock size={24} />
          </div>
          <div className="metric-data">
            <h4>लंबित सत्यापन कतार</h4>
            <div className="metric-value" style={{ color: 'var(--amber-500)' }}>
              {metrics.pendingQueue}
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap metric-emerald">
            <CheckCircle2 size={24} />
          </div>
          <div className="metric-data">
            <h4>सत्यापित एथलीट</h4>
            <div className="metric-value" style={{ color: 'var(--emerald-600)' }}>
              {metrics.verifiedAthletes}
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap metric-blue">
            <Calendar size={24} />
          </div>
          <div className="metric-data">
            <h4>कॉन्फ़िगर खेल</h4>
            <div className="metric-value">{metrics.totalGames}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap metric-pink">
            <UserCheck size={24} />
          </div>
          <div className="metric-data">
            <h4>सक्रिय स्वयंसेवक दल</h4>
            <div className="metric-value">{metrics.activeVolunteers}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap metric-purple">
            <Award size={24} />
          </div>
          <div className="metric-data">
            <h4>प्रकाशित विजेता</h4>
            <div className="metric-value">{metrics.publishedWinners}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap metric-emerald">
            <Trophy size={24} />
          </div>
          <div className="metric-data">
            <h4>उपलब्ध टाइम-स्लॉट</h4>
            <div className="metric-value">{metrics.availableSlots}</div>
          </div>
        </div>
      </div>

      {/* 2. Responsive Quick Actions Bar */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '28px',
          flexWrap: 'wrap'
        }}
      >
        <Link to="/admin/players" className="btn btn-primary" style={{ flex: '1 1 220px', justifyContent: 'center' }}>
          <Users size={16} /> खिलाड़ी सत्यापन कतार ({metrics.pendingQueue})
        </Link>
        <Link to="/admin/games" className="btn btn-secondary" style={{ flex: '1 1 200px', justifyContent: 'center' }}>
          <Plus size={16} /> नई प्रतियोगिता जोड़ें (Add Game)
        </Link>
        <Link to="/admin/winners" className="btn btn-secondary" style={{ flex: '1 1 220px', justifyContent: 'center' }}>
          <Award size={16} /> विजेता मैपिंग इंजन (Winner Mapping)
        </Link>
        <Link to="/admin/volunteers" className="btn btn-outline" style={{ flex: '1 1 200px', justifyContent: 'center' }}>
          <UserCheck size={16} /> स्वयंसेवक स्टाफिंग (Staffing)
        </Link>
      </div>

      {/* 3. Recent Submissions Section */}
      <div
        style={{
          background: '#ffffff',
          borderRadius: 'var(--radius-lg, 12px)',
          border: '1px solid var(--border-card, #e2e8f0)',
          padding: 'clamp(16px, 3vw, 24px)',
          boxShadow: 'var(--shadow-card, 0 1px 3px rgba(0,0,0,0.1))'
        }}
      >
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '18px'
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: 'clamp(1rem, 2vw, 1.2rem)', color: 'var(--slate-900, #0f172a)' }}>
              हाल ही में प्राप्त खिलाड़ी आवेदन (Recent Athlete Registrations)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--slate-500, #64748b)', display: 'block', marginTop: '4px' }}>
              पहचान एवं फोटो सत्यापन हेतु लंबित आवेदनों की त्वरित समीक्षा
            </span>
          </div>
          <Link to="/admin/players" className="btn btn-outline btn-sm" style={{ whiteSpace: 'nowrap' }}>
            सभी खिलाड़ी देखें <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Responsive Table Wrapper */}
        <div
          style={{
            overflowX: 'auto',
            WebkitOverflowScrolling: 'touch',
            margin: '0 -4px'
          }}
        >
          <table className="datatable-table" style={{ width: '100%', minWidth: '650px', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>खिलाड़ी</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>पिता का नाम</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>प्रतियोगिता</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>ग्राम</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>मोबाइल</th>
                <th style={{ textAlign: 'left', padding: '10px 12px' }}>स्थिति (Status)</th>
                <th style={{ textAlign: 'center', padding: '10px 12px' }}>क्रिया (Action)</th>
              </tr>
            </thead>
            <tbody>
              {recentPlayers.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--slate-500, #64748b)' }}>
                    कोई नया आवेदन उपलब्ध नहीं है
                  </td>
                </tr>
              ) : (
                recentPlayers.map((p) => (
                  <tr key={p.id}>
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={p.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                          alt={p.name}
                          style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        />
                        <strong style={{ fontSize: '0.9rem' }}>{p.name}</strong>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{p.father_name}</td>
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{p.game_name}</td>
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{p.village}</td>
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>{p.mobile}</td>
                    <td style={{ padding: '10px 12px', whiteSpace: 'nowrap' }}>
                      <Badge status={p.status} />
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                      <Link to="/admin/players" className="btn btn-outline btn-sm">
                        समीक्षा करें
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  )
}