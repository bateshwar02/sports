import React, { useState } from 'react'
import Modal from './Modal'
import Badge from './Badge'
import { CheckCircle, XCircle, Eye, EyeOff, ShieldCheck, User, Calendar, MapPin, Phone } from 'lucide-react'

export default function AadhaarViewerModal({
  isOpen,
  onClose,
  player,
  onApprove,
  onReject,
  canAction = true
}) {
  const [showFullAadhaar, setShowFullAadhaar] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [isRejecting, setIsRejecting] = useState(false)

  if (!player) return null

  // Mask Aadhaar: XXXX-XXXX-1234
  const cleanAadhaar = String(player.aadhaar_no || '').replace(/\D/g, '')
  const maskedAadhaar = cleanAadhaar.length === 12
    ? `XXXX-XXXX-${cleanAadhaar.slice(8)}`
    : player.aadhaar_no || 'N/A'

  const handleApprove = () => {
    onApprove(player.id)
    onClose()
  }

  const handleRejectSubmit = (e) => {
    e.preventDefault()
    if (!rejectReason.trim()) return
    onReject(player.id, rejectReason.trim())
    setIsRejecting(false)
    setRejectReason('')
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="खिलाड़ी प्रोफाइल एवं आधार सत्यापन (Athlete Inspection Workstation)"
      maxWidth="720px"
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
          <div>
            <Badge status={player.status} />
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              बंद करें (Close)
            </button>
            {canAction && player.status !== 'Approved' && (
              <>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => setIsRejecting(true)}
                >
                  <XCircle size={16} /> अस्वीकृत करें (Reject)
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleApprove}
                >
                  <CheckCircle size={16} /> स्वीकृत करें (Approve)
                </button>
              </>
            )}
          </div>
        </div>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Left column: Photo & Details */}
        <div>
          <div style={{ textAlign: 'center', marginBottom: '16px' }}>
            <img
              src={player.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
              alt={player.name}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid var(--purple-500)',
                margin: '0 auto',
                boxShadow: 'var(--shadow-card)'
              }}
            />
            <h4 style={{ margin: '10px 0 2px', fontSize: '1.2rem' }}>{player.name}</h4>
            <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
              आत्मज/आत्मजा: {player.father_name}
            </span>
          </div>

          <div style={{ background: 'var(--slate-50)', padding: '14px', borderRadius: 'var(--radius-md)', fontSize: '0.88rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Calendar size={16} color="var(--purple-600)" />
              <span>जन्म तिथि: <strong>{player.dob}</strong> ({player.gender})</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <MapPin size={16} color="var(--purple-600)" />
              <span>ग्राम: <strong>{player.village}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Phone size={16} color="var(--purple-600)" />
              <span>संपर्क नंबर: <strong>{player.mobile}</strong></span>
            </div>
            <div style={{ marginTop: '10px', paddingTop: '10px', borderTop: '1px solid var(--slate-200)' }}>
              <div>खेल: <strong>{player.game_name}</strong></div>
              <div>वर्ग: <span style={{ color: 'var(--slate-600)' }}>{player.class_name}</span></div>
              {player.slot_name && (
                <div style={{ marginTop: '4px', color: 'var(--purple-600)', fontWeight: 600 }}>
                  आवंटित स्लॉट: {player.slot_name}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right column: Aadhaar Document Inspection */}
        <div>
          <div style={{ border: '2px dashed var(--slate-300)', padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <ShieldCheck size={18} color="var(--emerald-600)" /> आधार दस्तावेज़ (Aadhaar ID)
              </span>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={() => setShowFullAadhaar(!showFullAadhaar)}
                style={{ padding: '2px 8px', fontSize: '0.75rem' }}
              >
                {showFullAadhaar ? <><EyeOff size={14} /> छिपाएं</> : <><Eye size={14} /> देखें</>}
              </button>
            </div>

            <div style={{ marginBottom: '10px', fontFamily: 'monospace', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.08em', color: 'var(--slate-800)' }}>
              {showFullAadhaar ? (player.aadhaar_no || 'N/A') : maskedAadhaar}
            </div>

            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--slate-200)', background: '#000' }}>
              <img
                src={player.aadhaar_url || 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=400&q=80'}
                alt="Aadhaar ID Document"
                style={{ width: '100%', height: '170px', objectFit: 'cover' }}
              />
            </div>
            <small style={{ color: 'var(--slate-500)', display: 'block', marginTop: '6px' }}>
              उच्च रिज़ॉल्यूशन पहचान पत्र सत्यापन (256-bit Secure Vault)
            </small>
          </div>

          {player.rejection_reason && (
            <div style={{ marginTop: '14px', padding: '12px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '8px', color: '#9f1239', fontSize: '0.84rem' }}>
              <strong>अस्वीकृति कारण (Rejection Audit):</strong> {player.rejection_reason}
            </div>
          )}
        </div>
      </div>

      {/* Reject with Rationale Submodal */}
      {isRejecting && (
        <div style={{ marginTop: '20px', padding: '16px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: 'var(--radius-md)' }}>
          <h4 style={{ color: '#9f1239', margin: '0 0 8px' }}>
            अस्वीकृति का कारण दर्ज करें (Mandatory Audit Rationale)
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#9f1239', margin: '0 0 10px' }}>
            Blueprint Section 4.2: Field review requires structured justification for auditing purposes.
          </p>
          <form onSubmit={handleRejectSubmit}>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="उदाहरण: आधार कार्ड अस्पष्ट है अथवा जन्म तिथि वर्ग नियमों के अनुसार मान्य नहीं है..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              required
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setIsRejecting(false)}
              >
                रद्द करें
              </button>
              <button
                type="submit"
                className="btn btn-danger btn-sm"
                disabled={!rejectReason.trim()}
              >
                पुष्टि करें और अस्वीकृत करें
              </button>
            </div>
          </form>
        </div>
      )}
    </Modal>
  )
}
