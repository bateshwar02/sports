import React, { useState, useEffect } from 'react'
import { Trophy, Award, Medal, Printer, Search, ShieldCheck } from 'lucide-react'
import Navbar from '../../layouts/Navbar'
import { api } from '../../services/api'
import CertificateModal from '../../components/CertificateModal'

export default function PublicWinners() {
  const [winners, setWinners] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedWinner, setSelectedWinner] = useState(null)
  const [certModalOpen, setCertModalOpen] = useState(false)

  useEffect(() => {
    async function loadWinners() {
      setLoading(true)
      const res = await api.getWinners()
      if (res.success) {
        setWinners(res.data || [])
      }
      setLoading(false)
    }
    loadWinners()
  }, [])

  const filteredWinners = winners.filter((w) => {
    if (!search.trim()) return true
    const q = search.toLowerCase()
    return (
      w.player_name.toLowerCase().includes(q) ||
      w.game_name.toLowerCase().includes(q) ||
      w.village.toLowerCase().includes(q) ||
      (w.prize_title && w.prize_title.toLowerCase().includes(q))
    )
  })

  const handlePrintCertificate = (winner) => {
    setSelectedWinner(winner)
    setCertModalOpen(true)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-app)' }}>
      <Navbar />

      <main style={{ maxWidth: '1280px', margin: '30px auto', padding: '0 20px', width: '100%', flex: 1 }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 12px',
            borderRadius: '9999px',
            background: 'rgba(236, 72, 153, 0.1)',
            color: 'var(--pink-600)',
            fontSize: '0.82rem',
            fontWeight: 700,
            marginBottom: '10px'
          }}>
            <Trophy size={16} /> आधिकारिक विजेता पोडियम (Official Tournament Podium)
          </div>
          <h1 style={{ fontSize: '2.4rem', color: 'var(--slate-900)', margin: '0 0 10px' }}>
            आरव खेलकूद उत्सव • विजेता एवं गौरव सूची
          </h1>
          <p style={{ color: 'var(--slate-600)', maxWidth: '600px', margin: '0 auto 24px' }}>
            सत्यापित निर्णायकों एवं खेल समिति द्वारा प्रमाणित पदक विजेता।
          </p>

          <div style={{ maxWidth: '450px', margin: '0 auto' }}>
            <input
              type="text"
              className="form-input"
              placeholder="खिलाड़ी, खेल या ग्राम के नाम से खोजें..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ textAlign: 'center' }}
            />
          </div>
        </div>

        {/* Podium Champions Cards */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--slate-500)' }}>
            विजेता परिणाम लोड हो रहे हैं...
          </div>
        ) : filteredWinners.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px', background: '#fff', borderRadius: '12px', border: '1px solid var(--border-card)' }}>
            <Trophy size={48} color="var(--slate-300)" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ color: 'var(--slate-700)' }}>कोई विजेता परिणाम नहीं मिला</h3>
            <p style={{ color: 'var(--slate-500)' }}>
              प्रतियोगिता समाप्त होने पर आधिकारिक परिणाम यहां प्रकाशित किए जाएंगे।
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
            {filteredWinners.map((winner) => {
              const isFirst = winner.position === '1st'
              const isSecond = winner.position === '2nd'
              const isThird = winner.position === '3rd'

              const borderGlow = isFirst
                ? 'linear-gradient(135deg, #f59e0b, #fbbf24)'
                : isSecond
                ? 'linear-gradient(135deg, #94a3b8, #cbd5e1)'
                : 'linear-gradient(135deg, #b45309, #d97706)'

              return (
                <div
                  key={winner.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--border-card)',
                    boxShadow: isFirst ? '0 12px 30px rgba(245, 158, 11, 0.2)' : 'var(--shadow-card)',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{
                    background: isFirst ? '#fffbeb' : isSecond ? '#f8fafc' : '#fef3c7',
                    padding: '16px 20px',
                    borderBottom: '1px solid var(--slate-100)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '1rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: isFirst ? '#b45309' : isSecond ? '#475569' : '#92400e'
                    }}>
                      {isFirst ? '🥇 प्रथम स्थान (Champion)' : isSecond ? '🥈 द्वितीय स्थान (Runner-up)' : '🥉 तृतीय स्थान (Bronze)'}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                      Verified
                    </span>
                  </div>

                  <div style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                      <img
                        src={winner.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                        alt={winner.player_name}
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: isFirst ? '3px solid #f59e0b' : '3px solid #94a3b8'
                        }}
                      />
                      <div>
                        <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem', color: 'var(--slate-900)' }}>
                          {winner.player_name}
                        </h3>
                        <div style={{ fontSize: '0.84rem', color: 'var(--slate-500)' }}>
                          पिता: श्री {winner.father_name} • ग्राम: {winner.village}
                        </div>
                      </div>
                    </div>

                    <div style={{ background: 'var(--slate-50)', padding: '12px 14px', borderRadius: '8px', marginBottom: '16px', fontSize: '0.88rem' }}>
                      <div style={{ color: 'var(--purple-600)', fontWeight: 700, marginBottom: '4px' }}>
                        प्रतियोगिता: {winner.game_name}
                      </div>
                      <div style={{ color: 'var(--slate-700)', fontWeight: 600 }}>
                        पुरस्कार: {winner.prize_title}
                      </div>
                      {winner.remarks && (
                        <div style={{ fontSize: '0.8rem', color: 'var(--slate-500)', marginTop: '4px', fontStyle: 'italic' }}>
                          "{winner.remarks}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '14px 20px', borderTop: '1px solid var(--slate-100)', background: 'var(--slate-50)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>
                      आधिकारिक सम्मान
                    </span>
                    <button
                      type="button"
                      className="btn btn-outline btn-sm"
                      onClick={() => handlePrintCertificate(winner)}
                    >
                      <Printer size={14} /> प्रमाण पत्र (Certificate)
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        winner={selectedWinner}
      />
    </div>
  )
}
