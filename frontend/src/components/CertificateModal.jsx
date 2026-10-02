import React from 'react'
import Modal from './Modal'
import { Printer, Award, ShieldCheck, Download } from 'lucide-react'

export default function CertificateModal({ isOpen, onClose, winner, player }) {
  if (!isOpen) return null

  const athlete = player || (winner ? {
    name: winner.player_name,
    father_name: winner.father_name,
    village: winner.village,
    game_name: winner.game_name,
    position: winner.position,
    prize_title: winner.prize_title
  } : null)

  if (!athlete) return null

  const handlePrint = () => {
    window.print()
  }

  const isPodium = Boolean(athlete.position)

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="प्रमाण पत्र पूर्वावलोकन (Certificate of Merit & Participation)"
      maxWidth="780px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            आधिकारिक खेल समिति द्वारा सत्यापित (Officially Certified)
          </span>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              बंद करें
            </button>
            <button type="button" className="btn btn-primary" onClick={handlePrint}>
              <Printer size={16} /> प्रिंट करें (Print Certificate)
            </button>
          </div>
        </div>
      }
    >
      <div
        className="certificate-box"
        style={{
          border: '10px double #1e293b',
          borderRadius: '12px',
          padding: '36px 30px',
          textAlign: 'center',
          background: 'linear-gradient(135deg, #fffdfa 0%, #ffffff 50%, #fbf8f2 100%)',
          color: '#1e293b',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', top: '16px', right: '20px', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', color: 'var(--purple-600)', fontWeight: 600 }}>
          <ShieldCheck size={16} /> SMS-CERT-2026-{athlete.id || 'REG'}
        </div>

        <div style={{ fontSize: '2.5rem', marginBottom: '8px' }}>
          {isPodium ? '🏆' : '🏅'}
        </div>

        <div style={{ textTransform: 'uppercase', letterSpacing: '0.15em', fontSize: '0.85rem', fontWeight: 800, color: 'var(--purple-600)', marginBottom: '4px' }}>
          आरव खेलकूद एवं सामान्य ज्ञान उत्सव • 2026
        </div>
        <h2 style={{ fontSize: '1.9rem', color: '#0f172a', margin: '4px 0 16px', fontWeight: 800 }}>
          {isPodium ? 'उत्कृष्टता एवं योग्यता प्रमाण-पत्र' : 'सहभागिता प्रमाण-पत्र'}
        </h2>
        <div style={{ fontStyle: 'italic', fontSize: '0.95rem', color: 'var(--slate-600)', marginBottom: '20px' }}>
          Certificate of {isPodium ? 'Merit & Achievement' : 'Active Participation'}
        </div>

        <p style={{ fontSize: '1.05rem', lineHeight: '1.8', margin: '0 0 24px', color: '#1e293b' }}>
          प्रमाणित किया जाता है कि <strong>श्री/सुश्री {athlete.name}</strong>, सुपुत्र/सुपुत्री <strong>श्री {athlete.father_name}</strong>,
          निवासी ग्राम <strong>{athlete.village}</strong> ने आरव दो दिवसीय खेलकूद उत्सव (06-07 नवम्बर 2026) के अंतर्गत आयोजित
          <strong> "{athlete.game_name}"</strong> प्रतियोगिता में {isPodium ? (
            <span>सफलतापूर्वक भाग लेकर <strong>{athlete.position} स्थान</strong> प्राप्त किया एवं <strong>{athlete.prize_title || 'पुरस्कार'}</strong> से सम्मानित हुए।</span>
          ) : (
            <span>सराहनीय खेल भावना एवं अनुशासन के साथ सक्रिय सहभागिता दर्ज की।</span>
          )}
        </p>

        <p style={{ fontSize: '0.95rem', color: 'var(--slate-600)', margin: '0 0 32px' }}>
          हम इनके उज्ज्वल भविष्य एवं निरंतर खेल प्रगति की मंगलकामना करते हैं।
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '30px', paddingTop: '20px', borderTop: '1px dashed #cbd5e1', fontSize: '0.85rem' }}>
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>अमित कुमार यादव</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>संयोजक / फील्ड लीड</div>
          </div>
          <div>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '2px solid #cbd5e1', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'var(--purple-600)', fontWeight: 800, textTransform: 'uppercase' }}>
              SEAL
            </div>
            <div style={{ fontSize: '0.75rem', marginTop: '4px', color: 'var(--slate-500)' }}>आयोजन समिति</div>
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>मुख्य निर्णायक</div>
            <div style={{ fontSize: '0.78rem', color: 'var(--slate-500)' }}>ग्राम सभा सारीपट्टी</div>
          </div>
        </div>
      </div>
    </Modal>
  )
}
