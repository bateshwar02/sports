import React, { useState, useEffect } from 'react'
import { Calendar, Users, CheckCircle2, XCircle, Clock, MapPin } from 'lucide-react'
import PortalLayout from '../../layouts/PortalLayout'
import Modal from '../../components/Modal'
import Badge from '../../components/Badge'
import { api } from '../../services/api'

export default function VolunteerGames() {
  const [games, setGames] = useState([])
  const [players, setPlayers] = useState([])
  const [selectedGame, setSelectedGame] = useState(null)
  const [selectedSlot, setSelectedSlot] = useState('all')

  const loadData = async () => {
    const gRes = await api.getGames()
    if (gRes.success) {
      setGames(gRes.data || [])
      if (!selectedGame && gRes.data?.length > 0) {
        setSelectedGame(gRes.data[0])
      }
    }

    const pRes = await api.getPlayers()
    if (pRes.success) setPlayers(pRes.data.players || [])
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleToggleCheckIn = async (playerId, currentPresence) => {
    await api.toggleCheckIn(playerId, !currentPresence)
    loadData()
  }

  const enrolledPlayers = selectedGame
    ? players.filter((p) => {
        if (p.game_id !== selectedGame.id || p.status !== 'Approved') return false
        if (selectedSlot !== 'all') {
          return String(p.slot_id) === String(selectedSlot)
        }
        return true
      })
    : []

  return (
    <PortalLayout
      role="volunteer"
      title="स्लॉट एवं खेल रोस्टर पर्यवेक्षण (Slot & Game Roster Supervision)"
      subtitle="Blueprint Section 4.2: Real-time athlete check-in, court readiness & presence tracking"
    >
      {/* Game Selector Bar */}
      <div style={{ background: '#ffffff', padding: '16px 20px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', marginBottom: '24px', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>
              प्रतियोगिता का चयन करें (Select Game):
            </label>
            <select
              className="form-select"
              style={{ minWidth: '320px' }}
              value={selectedGame?.id || ''}
              onChange={(e) => {
                const g = games.find((x) => x.id === Number(e.target.value))
                setSelectedGame(g)
                setSelectedSlot('all')
              }}
            >
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} — {g.category}
                </option>
              ))}
            </select>
          </div>

          {selectedGame?.slots && (
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--slate-600)', display: 'block', marginBottom: '4px' }}>
                समय स्लॉट फ़िल्टर (Slot Filter):
              </label>
              <select
                className="form-select"
                value={selectedSlot}
                onChange={(e) => setSelectedSlot(e.target.value)}
              >
                <option value="all">सभी स्लॉट (All Slots)</option>
                {selectedGame.slots.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.slot_name} ({s.start_time} - {s.end_time})
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedGame && (
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>स्थान व समय</div>
                <div style={{ fontWeight: 600, color: 'var(--slate-900)' }}>{selectedGame.venue}</div>
              </div>
              <span className="badge-pill badge-approved">
                {enrolledPlayers.filter((p) => p.is_present).length} / {enrolledPlayers.length} उपस्थित
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Roster & Court Attendance Table */}
      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem' }}>
          खिलाड़ी उपस्थिति एवं कोर्ट तत्परता (Live Attendance Sheet)
        </h3>

        {enrolledPlayers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--slate-500)' }}>
            इस स्लॉट में कोई स्वीकृत खिलाड़ी नामांकित नहीं है।
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="datatable-table">
              <thead>
                <tr>
                  <th>खिलाड़ी</th>
                  <th>पिता का नाम</th>
                  <th>आवंटित स्लॉट</th>
                  <th>ग्राम</th>
                  <th>मोबाइल</th>
                  <th>उपस्थिति स्थिति (Court Status)</th>
                  <th style={{ textAlign: 'right' }}>चेक-इन एक्शन</th>
                </tr>
              </thead>
              <tbody>
                {enrolledPlayers.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={p.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                          alt={p.name}
                          style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <strong>{p.name}</strong>
                      </div>
                    </td>
                    <td>{p.father_name}</td>
                    <td>{p.slot_name || 'Main Scheduled'}</td>
                    <td>{p.village}</td>
                    <td>{p.mobile}</td>
                    <td>
                      {p.is_present ? (
                        <span className="badge-pill badge-approved">
                          ✓ कोर्ट पर उपस्थित (Present)
                        </span>
                      ) : (
                        <span className="badge-pill badge-rejected">
                          ✕ अनुपस्थित (Absent)
                        </span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        type="button"
                        className={`btn btn-sm ${p.is_present ? 'btn-secondary' : 'btn-success'}`}
                        onClick={() => handleToggleCheckIn(p.id, p.is_present)}
                      >
                        {p.is_present ? 'अनुपस्थित चिन्हित करें' : 'उपस्थिति दर्ज करें (Check-in)'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PortalLayout>
  )
}
