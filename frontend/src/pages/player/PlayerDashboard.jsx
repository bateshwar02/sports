import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Clock, CheckCircle2, XCircle, MapPin, Calendar, Trophy, Printer, ArrowRight, User } from 'lucide-react'
import PortalLayout from '../../layouts/PortalLayout'
import Badge from '../../components/Badge'
import CertificateModal from '../../components/CertificateModal'
import { api } from '../../services/api'

export default function PlayerDashboard() {
  const [player, setPlayer] = useState(null)
  const [certModalOpen, setCertModalOpen] = useState(false)
  const currentUser = api.getCurrentUser()

  useEffect(() => {
    async function loadAthlete() {
      const res = await api.getPlayers()
      if (res.success && res.data.players) {
        // Find player by user mobile or fallback to first player
        const found = res.data.players.find(
          (p) => p.mobile === currentUser?.username || p.id === currentUser?.playerId
        ) || res.data.players[0]
        setPlayer(found)
      }
    }
    loadAthlete()
  }, [])

  if (!player) {
    return (
      <PortalLayout role="player" title="खिलाड़ी डैशबोर्ड (Athlete Hub)">
        <div style={{ textAlign: 'center', padding: '60px' }}>लोड हो रहा है...</div>
      </PortalLayout>
    )
  }

  const isApproved = player.status === 'Approved'
  const isPending = player.status === 'Pending'
  const isRejected = player.status === 'Rejected'

  return (
    <PortalLayout
      role="player"
      title="खिलाड़ी सेल्फ-सर्विस पोर्टल (Athlete Self-Service Dashboard)"
      subtitle="Blueprint Section 4.3: Real-time status, assigned court slot & venue instructions"
    >
      {/* Verification Status Banner (Blueprint Section 4.3) */}
      <div style={{
        background: isApproved ? 'linear-gradient(135deg, #ecfdf5, #d1fae5)' : isPending ? 'linear-gradient(135deg, #fffbeb, #fef3c7)' : 'linear-gradient(135deg, #fff1f2, #ffe4e6)',
        border: `1px solid ${isApproved ? '#a7f3d0' : isPending ? '#fde68a' : '#fecdd3'}`,
        borderRadius: 'var(--radius-xl)',
        padding: '28px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--shadow-card)'
          }}>
            {isApproved ? (
              <CheckCircle2 size={36} color="var(--emerald-600)" />
            ) : isPending ? (
              <Clock size={36} color="var(--amber-500)" />
            ) : (
              <XCircle size={36} color="var(--rose-600)" />
            )}
          </div>
          <div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', color: isApproved ? '#065f46' : isPending ? '#92400e' : '#9f1239' }}>
              सत्यापन स्थिति (Application Status)
            </div>
            <h2 style={{ margin: '4px 0', fontSize: '1.7rem', color: '#0f172a' }}>
              {isApproved ? 'आपका आवेदन स्वीकृत है! (Verified & Confirmed)' : isPending ? 'सत्यापन प्रक्रियाधीन (Awaiting Review)' : 'आवेदन अस्वीकृत (Application Rejected)'}
            </h2>
            <p style={{ margin: 0, fontSize: '0.92rem', color: '#334155' }}>
              {isApproved
                ? 'आपके दस्तावेज़ एवं आधार कार्ड की सफलतापूर्वक पुष्टि हो चुकी है। कृपया निर्धारित समय पर कोर्ट पर उपस्थित रहें।'
                : isPending
                ? 'हमारे कार्यक्षेत्र स्वयंसेवक आपके आधार व फोटो की समीक्षा कर रहे हैं। शीघ्र ही स्थिति अपडेट होगी।'
                : `कारण: ${player.rejection_reason || 'दस्तावेज़ नियमों के अनुरूप नहीं पाए गए।'}`}
            </p>
          </div>
        </div>

        <div>
          {isApproved && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => setCertModalOpen(true)}
            >
              <Printer size={16} /> सहभागिता प्रमाण पत्र देखें (Certificate)
            </button>
          )}
        </div>
      </div>

      {/* Athlete Match Instructions & Slot Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '24px' }}>
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', padding: '24px', boxShadow: 'var(--shadow-card)' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '1.2rem', color: 'var(--slate-900)' }}>
            प्रतियोगिता एवं आवंटित स्लॉट निर्देश (Court & Slot Assignment)
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.88rem' }}>नामांकित खेल:</span>
              <strong style={{ color: 'var(--slate-900)' }}>{player.game_name}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.88rem' }}>आवंटित टाइम-स्लॉट:</span>
              <strong style={{ color: 'var(--purple-600)' }}>{player.slot_name || 'Heat 1 - Court A (09:00 AM)'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.88rem' }}>खेल स्थल (Venue):</span>
              <strong>मुख्य खेल मैदान, ग्राम सभा सारीपट्टी</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 14px', background: 'var(--slate-50)', borderRadius: '8px' }}>
              <span style={{ color: 'var(--slate-500)', fontSize: '0.88rem' }}>रिपोर्टिंग समय:</span>
              <span className="badge-pill badge-approved">मैच समय से 30 मिनट पूर्व</span>
            </div>
          </div>

          <div style={{ marginTop: '20px', padding: '14px', background: 'rgba(124, 58, 237, 0.05)', borderRadius: '8px', border: '1px solid rgba(124, 58, 237, 0.2)' }}>
            <h4 style={{ margin: '0 0 4px', fontSize: '0.9rem', color: 'var(--purple-600)' }}>
              मैदान पर क्या लेकर आएं?
            </h4>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--slate-600)', lineHeight: 1.6 }}>
              • मूल आधार कार्ड (Original Aadhaar ID) चेक-इन हेतु अनिवार्य है।<br />
              • उपयुक्त खेल पोशाक एवं जूते।<br />
              • रिपोर्टिंग काउंटर पर अपना खिलाड़ी आईडी <strong>#{player.id}</strong> बताएं।
            </p>
          </div>
        </div>

        {/* Profile Snapshot Card */}
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-card)', padding: '24px', boxShadow: 'var(--shadow-card)', textAlign: 'center' }}>
          <img
            src={player.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={player.name}
            style={{ width: '90px', height: '90px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 12px', border: '3px solid var(--purple-500)' }}
          />
          <h3 style={{ margin: '0 0 4px', fontSize: '1.25rem' }}>{player.name}</h3>
          <div style={{ fontSize: '0.85rem', color: 'var(--slate-500)', marginBottom: '16px' }}>
            पंजीकरण आईडी: #{player.id} • {player.village}
          </div>

          <div style={{ textAlign: 'left', fontSize: '0.85rem', color: 'var(--slate-700)', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--slate-100)', paddingTop: '16px' }}>
            <div>पिता का नाम: <strong>{player.father_name}</strong></div>
            <div>जन्म तिथि: <strong>{player.dob}</strong></div>
            <div>मोबाइल: <strong>{player.mobile}</strong></div>
            <div>वर्ग: <strong>{player.class_name}</strong></div>
            <div>आधार: <code>XXXX-XXXX-{String(player.aadhaar_no || '').slice(-4)}</code></div>
          </div>

          <div style={{ marginTop: '20px' }}>
            <Link to="/player/profile" className="btn btn-outline btn-sm" style={{ width: '100%' }}>
              <User size={14} /> पूरी प्रोफाइल देखें
            </Link>
          </div>
        </div>
      </div>

      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        player={player}
      />
    </PortalLayout>
  )
}
