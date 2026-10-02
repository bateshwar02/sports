import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Users, Clock, CheckCircle2, Trophy, UserCheck, Calendar, Award, ArrowUpRight, Plus, Shield } from 'lucide-react'
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
    }
    loadMetrics()
  }, [])

  return (
    <PortalLayout
      role="admin"
      title="कार्यकारी प्रशासनिक डैशबोर्ड (Executive Dashboard)"
      subtitle="रियल-टाइम टूर्नामेंट मेट्रिक्स, सत्यापन कतार एवं समग्र नियंत्रण"
    >
      {/* 7 Core Executive Metrics per Blueprint Section 4.1 */}
      <div className="metric-grid">
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

      {/* Quick Action Bar */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '28px', flexWrap: 'wrap' }}>
        <Link to="/admin/players" className="btn btn-primary">
          <Users size={16} /> खिलाड़ी सत्यापन कतार ({metrics.pendingQueue})
        </Link>
        <Link to="/admin/games" className="btn btn-secondary">
          <Plus size={16} /> नई प्रतियोगिता जोड़ें (Add Game)
        </Link>
        <Link to="/admin/winners" className="btn btn-secondary">
          <Award size={16} /> विजेता मैपिंग इंजन (Winner Mapping)
        </Link>
        <Link to="/admin/volunteers" className="btn btn-outline">
          <UserCheck size={16} /> स्वयंसेवक स्टाफिंग (Staffing)
        </Link>
      </div>

      {/* Recent Athlete Submissions */}
      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--slate-900)' }}>
              हाल ही में प्राप्त खिलाड़ी आवेदन (Recent Athlete Registrations)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              आधार एवं फोटो सत्यापन हेतु लंबित आवेदनों की त्वरित समीक्षा
            </span>
          </div>
          <Link to="/admin/players" className="btn btn-outline btn-sm">
            सभी खिलाड़ी देखें <ArrowUpRight size={14} />
          </Link>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="datatable-table">
            <thead>
              <tr>
                <th>खिलाड़ी</th>
                <th>पिता का नाम</th>
                <th>प्रतियोगिता</th>
                <th>ग्राम</th>
                <th>मोबाइल</th>
                <th>स्थिति (Status)</th>
                <th>क्रिया (Action)</th>
              </tr>
            </thead>
            <tbody>
              {recentPlayers.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={p.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                        alt={p.name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <strong>{p.name}</strong>
                    </div>
                  </td>
                  <td>{p.father_name}</td>
                  <td>{p.game_name}</td>
                  <td>{p.village}</td>
                  <td>{p.mobile}</td>
                  <td>
                    <Badge status={p.status} />
                  </td>
                  <td>
                    <Link to="/admin/players" className="btn btn-outline btn-sm">
                      समीक्षा करें
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PortalLayout>
  )
}
