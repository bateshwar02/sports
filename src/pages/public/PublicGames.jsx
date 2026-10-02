import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Clock, Users, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react'
import Navbar from '../../layouts/Navbar'
import { api } from '../../services/api'

export default function PublicGames() {
  const [games, setGames] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDay, setSelectedDay] = useState('all')

  useEffect(() => {
    async function loadGames() {
      setLoading(true)
      const res = await api.getGames()
      if (res.success) {
        setGames(res.data || [])
      }
      setLoading(false)
    }
    loadGames()
  }, [])

  const filteredGames = games.filter((g) => {
    if (selectedDay === 'day1') return g.date === '2026-11-06'
    if (selectedDay === 'day2') return g.date === '2026-11-07'
    return true
  })

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <Navbar />

      <main style={{ maxWidth: '1280px', margin: '30px auto', padding: '0 20px', width: '100%', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--purple-600)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              OFFICIAL EVENT SCHEDULE
            </span>
            <h1 style={{ fontSize: '2.2rem', color: 'var(--slate-900)', margin: '6px 0 0' }}>
              खेल एवं प्रतियोगिता समय-सारणी
            </h1>
            <p style={{ color: 'var(--slate-600)', margin: '4px 0 0' }}>
              प्रतियोगिताओं का विवरण, स्थान, आयु वर्ग एवं आवंटित समय-स्लॉट।
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className={`btn ${selectedDay === 'all' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedDay('all')}
            >
              सभी खेल (All)
            </button>
            <button
              type="button"
              className={`btn ${selectedDay === 'day1' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedDay('day1')}
            >
              प्रथम दिवस (06 Nov)
            </button>
            <button
              type="button"
              className={`btn ${selectedDay === 'day2' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedDay('day2')}
            >
              द्वितीय दिवस (07 Nov)
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--slate-500)' }}>
            लोड हो रहा है...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '22px' }}>
            {filteredGames.map((game) => (
              <div
                key={game.id}
                style={{
                  background: '#ffffff',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-card)',
                  padding: '24px',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.18s, box-shadow 0.18s'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <span className="badge-pill badge-active">
                      {game.date === '2026-11-06' ? '06 Nov (Day 1)' : '07 Nov (Day 2)'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--purple-600)', fontWeight: 700, background: 'rgba(124, 58, 237, 0.08)', padding: '2px 8px', borderRadius: '4px' }}>
                      {game.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: 'var(--slate-900)', margin: '0 0 10px' }}>
                    {game.name}
                  </h3>

                  <div style={{ fontSize: '0.86rem', color: 'var(--slate-600)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={15} color="var(--purple-600)" />
                      <span>समय: <strong>{game.start_time} - {game.end_time}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={15} color="var(--emerald-600)" />
                      <span>स्थान: <strong>{game.venue}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={15} color="var(--blue-600)" />
                      <span>अधिकतम सीमा: <strong>{game.max_players} खिलाड़ी</strong> ({game.registered_count || 0} पंजीकृत)</span>
                    </div>
                  </div>

                  {/* Configured Slots */}
                  {game.slots && game.slots.length > 0 && (
                    <div style={{ background: 'var(--slate-50)', padding: '10px 12px', borderRadius: '8px', marginBottom: '16px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--slate-500)', textTransform: 'uppercase', marginBottom: '4px' }}>
                        समय स्लॉट (Allocated Slots):
                      </div>
                      {game.slots.map((s) => (
                        <div key={s.id} style={{ fontSize: '0.8rem', color: 'var(--slate-700)', display: 'flex', justifyContent: 'space-between', padding: '2px 0' }}>
                          <span>• {s.slot_name}</span>
                          <span style={{ fontWeight: 600 }}>{s.start_time} - {s.end_time}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div style={{ paddingTop: '14px', borderTop: '1px solid var(--slate-100)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>
                    {game.registered_count < game.max_players ? 'सीटें उपलब्ध' : 'प्रवेश पूर्ण'}
                  </span>
                  <Link
                    to="/register"
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--purple-600)', borderColor: 'var(--purple-400)' }}
                  >
                    भाग लें (Register) <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
