import React, { useState, useEffect } from 'react'
import { FileText, CheckCircle2, Clock } from 'lucide-react'
import PortalLayout from '../../layouts/PortalLayout'
import Badge from '../../components/Badge'
import { api } from '../../services/api'

export default function PlayerRegistration() {
  const [player, setPlayer] = useState(null)
  const currentUser = api.getCurrentUser()

  useEffect(() => {
    async function load() {
      const res = await api.getPlayers()
      if (res.success && res.data.players) {
        const found = res.data.players.find(
          (p) => p.mobile === currentUser?.username || p.id === currentUser?.playerId
        ) || res.data.players[0]
        setPlayer(found)
      }
    }
    load()
  }, [])

  if (!player) return null

  return (
    <PortalLayout
      role="player"
      title="पंजीकरण प्रपत्र प्रतिलिपि (Registration Submission Slip)"
      subtitle="आपके द्वारा सबमिट किया गया मूल आवेदन प्रपत्र एवं संदर्भ विवरण"
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '32px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--slate-200)', paddingBottom: '16px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.3rem' }}>आधिकारिक पंजीकरण रसीद</h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--slate-500)' }}>रसीद सं: SMS-REC-{player.id}</span>
          </div>
          <Badge status={player.status} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.92rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--slate-200)' }}>
            <span style={{ color: 'var(--slate-500)' }}>खिलाड़ी का नाम:</span>
            <strong>{player.name}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--slate-200)' }}>
            <span style={{ color: 'var(--slate-500)' }}>पिता का नाम:</span>
            <span>{player.father_name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--slate-200)' }}>
            <span style={{ color: 'var(--slate-500)' }}>प्रतियोगिता:</span>
            <strong style={{ color: 'var(--purple-600)' }}>{player.game_name}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--slate-200)' }}>
            <span style={{ color: 'var(--slate-500)' }}>वर्ग:</span>
            <span>{player.class_name}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--slate-200)' }}>
            <span style={{ color: 'var(--slate-500)' }}>ग्राम:</span>
            <span>{player.village}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--slate-200)' }}>
            <span style={{ color: 'var(--slate-500)' }}>मोबाइल:</span>
            <span>{player.mobile}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed var(--slate-200)' }}>
            <span style={{ color: 'var(--slate-500)' }}>पंजीकरण तिथि:</span>
            <span>{player.created_at || '2026-10-01 10:30:00'}</span>
          </div>
        </div>

        <div style={{ marginTop: '28px', textAlign: 'center' }}>
          <button type="button" className="btn btn-outline" onClick={() => window.print()}>
            रसीद प्रिंट करें (Print Slip)
          </button>
        </div>
      </div>
    </PortalLayout>
  )
}
