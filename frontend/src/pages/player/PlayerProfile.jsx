import React, { useState, useEffect } from 'react'
import { ShieldCheck, MapPin, Phone, Calendar, User } from 'lucide-react'
import PortalLayout from '../../layouts/PortalLayout'
import Badge from '../../components/Badge'
import { api } from '../../services/api'

export default function PlayerProfile() {
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
      title="खिलाड़ी प्रोफाइल (Athlete Profile)"
      subtitle="व्यक्तिगत विवरण, संपर्क जानकारी एवं पहचान पत्र"
    >
      <div style={{ maxWidth: '800px', margin: '0 auto', background: '#fff', padding: '32px', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-card)', boxShadow: 'var(--shadow-card)' }}>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', marginBottom: '28px' }}>
          <img
            src={player.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={player.name}
            style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--purple-500)' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ margin: 0, fontSize: '1.6rem' }}>{player.name}</h2>
              <Badge status={player.status} />
            </div>
            <p style={{ margin: '4px 0 0', color: 'var(--slate-500)' }}>
              पंजीकरण आईडी: #{player.id} • आरव खेलकूद उत्सव 2026
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>पिता का नाम</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>{player.father_name}</div>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>मोबाइल नंबर</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>{player.mobile}</div>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>ग्राम / पता</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>{player.village}</div>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>जन्म तिथि व लिंग</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px' }}>{player.dob} ({player.gender})</div>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>प्रतियोगिता</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px', color: 'var(--purple-600)' }}>{player.game_name}</div>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)', textTransform: 'uppercase' }}>आधार कार्ड (मास्क्ड)</div>
            <div style={{ fontWeight: 700, fontSize: '1rem', marginTop: '2px', fontFamily: 'monospace' }}>
              XXXX-XXXX-{String(player.aadhaar_no || '').slice(-4)}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px', border: '1px solid var(--slate-200)', fontSize: '0.85rem', color: 'var(--slate-600)' }}>
          <strong>सुरक्षा एवं अखंडता नोट (Security Notice):</strong> Blueprint Section 4.3 के अनुसार खिलाड़ी सत्यापन स्थिति एवं नामांकित खेल को सीधे नहीं बदल सकते। संशोधन हेतु आयोजन समिति से संपर्क करें।
        </div>
      </div>
    </PortalLayout>
  )
}
