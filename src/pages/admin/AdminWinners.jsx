import React, { useState, useEffect } from 'react'
import { Trophy, Award, Plus, Trash2, Printer, Eye, CheckCircle2 } from 'lucide-react'
import PortalLayout from '../../layouts/PortalLayout'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import CertificateModal from '../../components/CertificateModal'
import { api } from '../../services/api'

export default function AdminWinners() {
  const [winners, setWinners] = useState([])
  const [games, setGames] = useState([])
  const [approvedPlayers, setApprovedPlayers] = useState([])
  const [mapModalOpen, setMapModalOpen] = useState(false)
  const [certModalOpen, setCertModalOpen] = useState(false)
  const [selectedWinner, setSelectedWinner] = useState(null)

  const [mapForm, setMapForm] = useState({
    game_id: '',
    player_id: '',
    position: '1st',
    prize_title: '',
    remarks: ''
  })

  const loadData = async () => {
    const wRes = await api.getWinners()
    if (wRes.success) setWinners(wRes.data || [])

    const gRes = await api.getGames()
    if (gRes.success) {
      setGames(gRes.data || [])
      if (gRes.data?.length > 0 && !mapForm.game_id) {
        setMapForm((prev) => ({ ...prev, game_id: String(gRes.data[0].id) }))
      }
    }

    const pRes = await api.getPlayers({ status: 'Approved' })
    if (pRes.success) {
      const verified = (pRes.data.players || []).filter((p) => p.status === 'Approved')
      setApprovedPlayers(verified)
      if (verified.length > 0 && !mapForm.player_id) {
        setMapForm((prev) => ({ ...prev, player_id: String(verified[0].id) }))
      }
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleSaveMapping = async (e) => {
    e.preventDefault()
    if (!mapForm.game_id || !mapForm.player_id || !mapForm.position) return
    await api.mapWinner(mapForm)
    setMapModalOpen(false)
    setMapForm({
      game_id: games[0]?.id ? String(games[0].id) : '',
      player_id: approvedPlayers[0]?.id ? String(approvedPlayers[0].id) : '',
      position: '1st',
      prize_title: '',
      remarks: ''
    })
    loadData()
  }

  const handleDeleteWinner = async (id) => {
    if (window.confirm('क्या आप इस पोडियम मैपिंग को हटाना चाहते हैं?')) {
      await api.deleteWinner(id)
      loadData()
    }
  }

  const handlePrintCert = (winner) => {
    setSelectedWinner(winner)
    setCertModalOpen(true)
  }

  // Filter players for selected game in modal
  const eligiblePlayers = approvedPlayers.filter((p) => String(p.game_id) === String(mapForm.game_id))

  // Columns per Blueprint Section 7.4
  const columns = [
    {
      header: 'क्र.सं. (S.No)',
      accessor: (row, idx) => idx,
      width: '70px',
      align: 'center'
    },
    {
      header: 'प्रतियोगिता (Competitive Game)',
      accessor: 'game_name',
      sortable: true,
      render: (row) => (
        <div>
          <strong style={{ color: 'var(--slate-900)' }}>{row.game_name}</strong>
          <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>{row.game_category}</div>
        </div>
      )
    },
    {
      header: 'पोडियम स्थान (Podium Position)',
      accessor: 'position',
      sortable: true,
      render: (row) => {
        const isFirst = row.position === '1st'
        const isSecond = row.position === '2nd'
        return (
          <span style={{ fontWeight: 800, color: isFirst ? '#b45309' : isSecond ? '#475569' : '#92400e' }}>
            {isFirst ? '🥇 1st Place Champion' : isSecond ? '🥈 2nd Place Runner-Up' : '🥉 3rd Place Bronze'}
          </span>
        )
      }
    },
    {
      header: 'विजेता खिलाड़ी (Winner Athlete)',
      accessor: 'player_name',
      sortable: true,
      render: (row) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img
            src={row.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
            alt={row.player_name}
            style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <strong>{row.player_name}</strong>
            <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>ग्राम: {row.village}</div>
          </div>
        </div>
      )
    },
    {
      header: 'पुरस्कार व ट्रॉफी (Trophy / Prize Award)',
      accessor: 'prize_title',
      sortable: true
    },
    {
      header: 'सार्वजनिक स्थिति (Publish State)',
      accessor: (row) => 'प्रकाशित (Live)',
      render: () => <span className="badge-pill badge-approved">प्रकाशित (Live)</span>
    },
    {
      header: 'क्रियाएं (Row Actions)',
      hideExport: true,
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handlePrintCert(row)}
            title="प्रमाण पत्र प्रिंट करें (Print Certificate)"
          >
            <Printer size={14} /> प्रमाण-पत्र
          </button>
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => handleDeleteWinner(row.id)}
            title="हटाएं (Remove)"
          >
            <Trash2 size={14} />
          </button>
        </div>
      )
    }
  ]

  return (
    <PortalLayout
      role="admin"
      title="आधिकारिक विजेता मैपिंग इंजन (Winner & Podium Engine)"
      subtitle="सत्यापित खिलाड़ियों को पोडियम स्थान (1st, 2nd, 3rd) आबंटित करें एवं परिणाम प्रकाशित करें"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            Blueprint Section 7.4 Winner & Podium DataTable
          </span>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setMapModalOpen(true)}>
          <Plus size={16} /> नया विजेता जोड़ें (Map Winner to Podium)
        </button>
      </div>

      <DataTable
        columns={columns}
        data={winners}
        searchPlaceholder="प्रतियोगिता, खिलाड़ी का नाम, या पुरस्कार से खोजें..."
        exportFilename="official-podium-winners.csv"
      />

      {/* Map Winner Modal */}
      <Modal
        isOpen={mapModalOpen}
        onClose={() => setMapModalOpen(false)}
        title="पोडियम विजेता मैपिंग (Official Winner Mapping Engine)"
        footer={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setMapModalOpen(false)}>
              रद्द करें
            </button>
            <button type="button" className="btn btn-primary" onClick={handleSaveMapping}>
              पोडियम पर प्रकाशित करें (Publish Winner)
            </button>
          </div>
        }
      >
        <form onSubmit={handleSaveMapping}>
          {/* Game Selection */}
          <div className="form-group">
            <label className="form-label">प्रतियोगिता चुनें (Select Game) *</label>
            <select
              className="form-select"
              value={mapForm.game_id}
              onChange={(e) => {
                const gid = e.target.value
                setMapForm({ ...mapForm, game_id: gid, player_id: '' })
              }}
              required
            >
              {games.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.name} ({g.category})
                </option>
              ))}
            </select>
          </div>

          {/* Position Select */}
          <div className="form-group">
            <label className="form-label">पोडियम स्थान (Podium Position) *</label>
            <select
              className="form-select"
              value={mapForm.position}
              onChange={(e) => setMapForm({ ...mapForm, position: e.target.value })}
              required
            >
              <option value="1st">🥇 प्रथम स्थान — 1st Place Champion</option>
              <option value="2nd">🥈 द्वितीय स्थान — 2nd Place Runner-Up</option>
              <option value="3rd">🥉 तृतीय स्थान — 3rd Place Bronze</option>
            </select>
          </div>

          {/* Verified Player Select */}
          <div className="form-group">
            <label className="form-label">सत्यापित खिलाड़ी चुनें (Verified Athletes Only) *</label>
            <select
              className="form-select"
              value={mapForm.player_id}
              onChange={(e) => setMapForm({ ...mapForm, player_id: e.target.value })}
              required
            >
              <option value="">-- खिलाड़ी चुनें --</option>
              {(eligiblePlayers.length > 0 ? eligiblePlayers : approvedPlayers).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (पिता: {p.father_name} • ग्राम: {p.village})
                </option>
              ))}
            </select>
            <small style={{ color: 'var(--slate-500)', marginTop: '4px', display: 'block' }}>
              Blueprint Section 4.1: Only verified (Approved) athletes can be mapped to podium finishes.
            </small>
          </div>

          {/* Prize Title */}
          <div className="form-group">
            <label className="form-label">पुरस्कार एवं ट्रॉफी विवरण (Prize Title) *</label>
            <input
              type="text"
              className="form-input"
              placeholder="उदा. स्वर्ण पदक एवं ₹5,100 नकद (Gold Medal + Cash Award)"
              value={mapForm.prize_title}
              onChange={(e) => setMapForm({ ...mapForm, prize_title: e.target.value })}
              required
            />
          </div>

          {/* Remarks */}
          <div className="form-group">
            <label className="form-label">आधिकारिक टिप्पणी (Official Remarks / Timing Record)</label>
            <input
              type="text"
              className="form-input"
              placeholder="उदा. शानदार समय रिकॉर्ड 4:32 मिनट"
              value={mapForm.remarks}
              onChange={(e) => setMapForm({ ...mapForm, remarks: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={certModalOpen}
        onClose={() => setCertModalOpen(false)}
        winner={selectedWinner}
      />
    </PortalLayout>
  )
}
