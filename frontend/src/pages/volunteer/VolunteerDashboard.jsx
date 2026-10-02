import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle2, Clock, Users, Calendar, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react'
import PortalLayout from '../../layouts/PortalLayout'
import { api } from '../../services/api'
import Badge from '../../components/Badge'

export default function VolunteerDashboard() {
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    total: 0,
    checkedIn: 0
  })
  const [pendingQueue, setPendingQueue] = useState([])

  useEffect(() => {
    async function loadData() {
      const res = await api.getPlayers()
      if (res.success) {
        const players = res.data.players || []
        const pending = players.filter((p) => p.status === 'Pending')
        const approved = players.filter((p) => p.status === 'Approved')
        const checkedIn = players.filter((p) => p.is_present).length

        setStats({
          pending: pending.length,
          approved: approved.length,
          total: players.length,
          checkedIn
        })
        setPendingQueue(pending.slice(0, 6))
      }
    }
    loadData()
  }, [])

  return (
    <PortalLayout
      role="volunteer"
      title="कार्यक्षेत्र स्वयंसेवक डेस्क (Volunteer Field Workstation)"
      subtitle="दस्तावेज़ सत्यापन, आधार जांच, कोर्ट उपस्थिति एवं रोस्टर पर्यवेक्षण"
    >
      {/* Field Review Summary Metrics */}
      <div className="metric-grid">
        <div className="metric-card">
          <div className="metric-icon-wrap metric-amber">
            <Clock size={24} />
          </div>
          <div className="metric-data">
            <h4>लंबित सत्यापन कतार</h4>
            <div className="metric-value" style={{ color: 'var(--amber-500)' }}>
              {stats.pending}
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
              {stats.approved}
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap metric-purple">
            <UserCheck size={24} />
          </div>
          <div className="metric-data">
            <h4>कोर्ट पर उपस्थित खिलाड़ी</h4>
            <div className="metric-value">{stats.checkedIn}</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon-wrap metric-blue">
            <Users size={24} />
          </div>
          <div className="metric-data">
            <h4>कुल पंजीकृत खिलाड़ी</h4>
            <div className="metric-value">{stats.total}</div>
          </div>
        </div>
      </div>

      {/* Quick Action Navigation */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <Link to="/volunteer/players" className="btn btn-primary">
          <ShieldCheck size={16} /> तत्काल दस्तावेज़ सत्यापन शुरू करें ({stats.pending})
        </Link>
        <Link to="/volunteer/games" className="btn btn-secondary">
          <Calendar size={16} /> स्लॉट उपस्थिति एवं चेक-इन (Court Readiness)
        </Link>
        <Link to="/volunteer/classes" className="btn btn-outline">
          वर्ग सूची देखें (Classes)
        </Link>
      </div>

      {/* Pending Athletes Quick Workstation Cards */}
      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--slate-900)' }}>
              समीक्षा हेतु लंबित खिलाड़ी (Awaiting Document Verification)
            </h3>
            <span style={{ fontSize: '0.82rem', color: 'var(--slate-500)' }}>
              आधार आईडी एवं पासपोर्ट फोटो का मिलान कर स्वीकृति अथवा अस्वीकृति प्रदान करें।
            </span>
          </div>
          <Link to="/volunteer/players" className="btn btn-outline btn-sm">
            पूरी कतार देखें <ArrowRight size={14} />
          </Link>
        </div>

        {pendingQueue.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-500)' }}>
            🎉 वर्तमान में कोई आवेदन लंबित नहीं है! सभी खिलाड़ी सत्यापित हैं।
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {pendingQueue.map((p) => (
              <div
                key={p.id}
                style={{
                  border: '1px solid var(--slate-200)',
                  borderRadius: 'var(--radius-md)',
                  padding: '16px',
                  background: 'var(--slate-50)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                    <img
                      src={p.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                      alt={p.name}
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <strong style={{ color: 'var(--slate-900)' }}>{p.name}</strong>
                      <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>पिता: {p.father_name}</div>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--slate-600)', marginBottom: '12px' }}>
                    <div>खेल: <strong>{p.game_name}</strong></div>
                    <div>ग्राम: {p.village} • मोबाइल: {p.mobile}</div>
                  </div>
                </div>

                <Link
                  to="/volunteer/players"
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  <ShieldCheck size={14} /> दस्तावेज़ जांचें (Inspect Aadhaar)
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
