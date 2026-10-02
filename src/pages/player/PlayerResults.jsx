import React, { useState, useEffect } from 'react'
import { Trophy, Award, Printer, ShieldCheck } from 'lucide-react'
import PortalLayout from '../../layouts/PortalLayout'
import CertificateModal from '../../components/CertificateModal'
import { api } from '../../services/api'

export default function PlayerResults() {
  const [player, setPlayer] = useState(null)
  const [winnerEntry, setWinnerEntry] = useState(null)
  const [certModalOpen, setCertModalOpen] = useState(false)
  const currentUser = api.getCurrentUser()

  useEffect(() => {
    async function load() {
      const pRes = await api.getPlayers()
      let currentP = null
      if (pRes.success && pRes.data.players) {
        currentP = pRes.data.players.find(
          (p) => p.mobile === currentUser?.username || p.id === currentUser?.playerId
        ) || pRes.data.players[0]
        setPlayer(currentP)
      }

      if (currentP) {
        const wRes = await api.getWinners()
        if (wRes.success) {
          const entry = wRes.data.find((w) => Number(w.player_id) === Number(currentP.id))
          setWinnerEntry(entry || null)
        }
      }
    }
    load()
  }, [])

  if (!player) return null

  return (
    <PortalLayout
      role="player"
      title="टूर्नामेंट परिणाम एवं प्रमाण पत्र (Results & Certificates)"
      subtitle="पोडियम स्टैंडिंग, प्राप्त पुरस्कार एवं सहभागिता / मेरिट प्रमाण पत्र"
    >
      <div style={{ maxWidth: '840px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {winnerEntry ? (
          <div style={{
            background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
            border: '2px solid #f59e0b',
            borderRadius: 'var(--radius-xl)',
            padding: '32px',
            textAlign: 'center',
            boxShadow: '0 12px 30px rgba(245, 158, 11, 0.2)'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '8px' }}>🏆</div>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#b45309', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              बधाई! आप पोडियम विजेता हैं (Podium Winner)
            </span>
            <h2 style={{ fontSize: '2rem', color: '#78350f', margin: '8px 0 12px' }}>
              {winnerEntry.position === '1st' ? '🥇 प्रथम स्थान (Champion)' : winnerEntry.position === '2nd' ? '🥈 द्वितीय स्थान (Runner-up)' : '🥉 तृतीय स्थान (Bronze)'}
            </h2>
            <p style={{ fontSize: '1.1rem', color: '#92400e', margin: '0 0 18px' }}>
              पुरस्कार: <strong>{winnerEntry.prize_title}</strong>
            </p>
            {winnerEntry.remarks && (
              <p style={{ fontStyle: 'italic', color: '#78350f', fontSize: '0.9rem', margin: '0 0 24px' }}>
                "{winnerEntry.remarks}"
              </p>
            )}

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCertModalOpen(true)}
              style={{ background: 'linear-gradient(135deg, #d97706, #b45309)', borderColor: '#b45309' }}
            >
              <Printer size={16} /> उत्कृष्टता प्रमाण-पत्र प्रिंट करें (Print Merit Certificate)
            </button>
          </div>
        ) : (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-card)', padding: '36px', textAlign: 'center', boxShadow: 'var(--shadow-card)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f1f5f9', color: 'var(--purple-600)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Award size={36} />
            </div>

            <h3 style={{ fontSize: '1.4rem', color: 'var(--slate-900)', margin: '0 0 8px' }}>
              आधिकारिक सहभागिता प्रमाण पत्र (Participation Certificate)
            </h3>
            <p style={{ color: 'var(--slate-600)', maxWidth: '500px', margin: '0 auto 24px', fontSize: '0.92rem' }}>
              आरव खेलकूद उत्सव में आपकी सक्रिय उपस्थिति एवं खेल भावना को सम्मानित करते हुए आयोजन समिति द्वारा यह प्रमाण पत्र जारी किया गया है।
            </p>

            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCertModalOpen(true)}
            >
              <Printer size={16} /> प्रमाण पत्र देखें एवं प्रिंट करें (Print Certificate)
            </button>
          </div>
        )}
      </div>

      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        winner={winnerEntry}
        player={player}
      />
    </PortalLayout>
  )
}
