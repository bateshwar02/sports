import React, { useState, useEffect } from 'react'
import { Plus, Clock, Users, MapPin, Calendar, Settings, List, Edit2, CheckCircle2 } from 'lucide-react'
import PortalLayout from '../../layouts/PortalLayout'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import Badge from '../../components/Badge'
import { api } from '../../services/api'

export default function AdminGames() {
  const [games, setGames] = useState([])
  const [players, setPlayers] = useState([])
  const [addGameOpen, setAddGameOpen] = useState(false)
  const [slotModalOpen, setSlotModalOpen] = useState(false)
  const [rosterModalOpen, setRosterModalOpen] = useState(false)
  const [selectedGame, setSelectedGame] = useState(null)

  const [newGameForm, setNewGameForm] = useState({
    name: '',
    category: 'बालक - खुला वर्ग',
    venue: 'मुख्य खेल मैदान, ग्राम सभा सारीपट्टी',
    date: '2026-11-06',
    start_time: '09:00',
    end_time: '10:30',
    max_players: 40
  })

  const [newSlotForm, setNewSlotForm] = useState({
    slot_name: '',
    start_time: '09:00',
    end_time: '09:45',
    allocated_capacity: 20
  })

  const loadData = async () => {
    const gRes = await api.getGames()
    if (gRes.success) setGames(gRes.data || [])

    const pRes = await api.getPlayers()
    if (pRes.success) setPlayers(pRes.data.players || [])
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleCreateGame = async (e) => {
    e.preventDefault()
    if (!newGameForm.name) return
    await api.createGame(newGameForm)
    setAddGameOpen(false)
    setNewGameForm({
      name: '',
      category: 'बालक - खुला वर्ग',
      venue: 'मुख्य खेल मैदान, ग्राम सभा सारीपट्टी',
      date: '2026-11-06',
      start_time: '09:00',
      end_time: '10:30',
      max_players: 40
    })
    loadData()
  }

  const handleOpenSlotConfig = (game) => {
    setSelectedGame(game)
    setNewSlotForm({
      slot_name: `Heat ${((game.slots?.length || 0) + 1)} - ${game.venue}`,
      start_time: game.start_time,
      end_time: game.end_time,
      allocated_capacity: 20
    })
    setSlotModalOpen(true)
  }

  const handleAddSlot = async (e) => {
    e.preventDefault()
    if (selectedGame && newSlotForm.slot_name) {
      await api.addGameSlot(selectedGame.id, newSlotForm)
      setSlotModalOpen(false)
      loadData()
    }
  }

  const handleOpenRoster = (game) => {
    setSelectedGame(game)
    setRosterModalOpen(true)
  }

  const enrolledPlayers = selectedGame
    ? players.filter((p) => p.game_id === selectedGame.id && p.status !== 'Rejected')
    : []

  const columns = [
    {
      header: 'क्र.सं. (S.No)',
      accessor: (row, idx) => idx,
      width: '70px',
      align: 'center'
    },
    {
      header: 'प्रतियोगिता का नाम (Game Title)',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div>
          <strong style={{ color: 'var(--slate-900)' }}>{row.name}</strong>
          <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>ID: #{row.id}</div>
        </div>
      )
    },
    {
      header: 'श्रेणी / वर्ग (Division / Category)',
      accessor: 'category',
      sortable: true
    },
    {
      header: 'खेल स्थल (Arena / Venue)',
      accessor: 'venue',
      sortable: true
    },
    {
      header: 'दिनांक (Date)',
      accessor: 'date',
      sortable: true
    },
    {
      header: 'समय स्लॉट (Time Slot)',
      accessor: (row) => `${row.start_time} - ${row.end_time}`
    },
    {
      header: 'पंजीकृत / अधिकतम (Registered / Max)',
      accessor: (row) => `${row.registered_count || 0} / ${row.max_players}`,
      render: (row) => {
        const count = row.registered_count || 0
        const isFull = count >= row.max_players
        return (
          <div>
            <strong>{count}</strong> / {row.max_players}
            <div style={{ width: '100px', height: '6px', background: 'var(--slate-200)', borderRadius: '3px', marginTop: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.min(100, (count / row.max_players) * 100)}%`, height: '100%', background: isFull ? 'var(--rose-500)' : 'var(--emerald-500)' }} />
            </div>
          </div>
        )
      }
    },
    {
      header: 'उपलब्धता (Availability Indicator)',
      accessor: (row) => ((row.registered_count || 0) < row.max_players ? 'उपलब्ध' : 'पूर्ण'),
      render: (row) => {
        const isFull = (row.registered_count || 0) >= row.max_players
        return isFull ? (
          <span className="badge-pill badge-rejected">पूर्ण (Full)</span>
        ) : (
          <span className="badge-pill badge-approved">खुला (Open)</span>
        )
      }
    },
    {
      header: 'क्रियाएं (Row Actions)',
      hideExport: true,
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleOpenSlotConfig(row)}
            title="स्लॉट कॉन्फ़िगर करें (Slot Configurator)"
          >
            <Clock size={14} /> स्लॉट
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleOpenRoster(row)}
            title="पंजीकृत रोस्टर देखें (Player Roster View)"
          >
            <Users size={14} /> रोस्टर
          </button>
        </div>
      )
    }
  ]

  return (
    <PortalLayout
      role="admin"
      title="खेल एवं स्लॉट प्रबंधन (Game & Tournament DataTable)"
      subtitle="प्रतियोगिता विन्यास, स्लॉट जनरेशन, क्षमता सीमा एवं रोस्टर निगरानी"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            Blueprint Section 7.3 Game & Tournament DataTable
          </span>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setAddGameOpen(true)}>
          <Plus size={16} /> नई प्रतियोगिता जोड़ें (Create Game)
        </button>
      </div>

      <DataTable
        columns={columns}
        data={games}
        searchPlaceholder="खेल का नाम, श्रेणी, स्थान या दिनांक से खोजें..."
        exportFilename="tournament-games.csv"
      />

      {/* Add Game Modal */}
      <Modal
        isOpen={addGameOpen}
        onClose={() => setAddGameOpen(false)}
        title="नई प्रतियोगिता कॉन्फ़िगर करें (Create Game & Dynamic Slots)"
        footer={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setAddGameOpen(false)}>
              रद्द करें
            </button>
            <button type="button" className="btn btn-primary" onClick={handleCreateGame}>
              प्रतियोगिता सहेजें (Save Game)
            </button>
          </div>
        }
      >
        <form onSubmit={handleCreateGame}>
          <div className="form-group">
            <label className="form-label">प्रतियोगिता का नाम (Game Name) *</label>
            <input
              type="text"
              className="form-input"
              placeholder="उदा. 400 मीटर रिले दौड़"
              value={newGameForm.name}
              onChange={(e) => setNewGameForm({ ...newGameForm, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">श्रेणी / आयु वर्ग (Category) *</label>
              <input
                type="text"
                className="form-input"
                placeholder="बालक - कक्षा 9-12 / ओपन"
                value={newGameForm.category}
                onChange={(e) => setNewGameForm({ ...newGameForm, category: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">खेल स्थल (Venue Arena) *</label>
              <input
                type="text"
                className="form-input"
                placeholder="मुख्य ट्रैक / कोर्ट A"
                value={newGameForm.venue}
                onChange={(e) => setNewGameForm({ ...newGameForm, venue: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">दिनांक (Date) *</label>
              <input
                type="date"
                className="form-input"
                value={newGameForm.date}
                onChange={(e) => setNewGameForm({ ...newGameForm, date: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">प्रारंभ समय *</label>
              <input
                type="time"
                className="form-input"
                value={newGameForm.start_time}
                onChange={(e) => setNewGameForm({ ...newGameForm, start_time: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">समाप्ति समय *</label>
              <input
                type="time"
                className="form-input"
                value={newGameForm.end_time}
                onChange={(e) => setNewGameForm({ ...newGameForm, end_time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">अधिकतम खिलाड़ी क्षमता (Max Cap)</label>
            <input
              type="number"
              className="form-input"
              value={newGameForm.max_players}
              onChange={(e) => setNewGameForm({ ...newGameForm, max_players: Number(e.target.value) })}
            />
            <small style={{ color: 'var(--slate-500)', marginTop: '4px', display: 'block' }}>
              सिस्टम स्वचालित रूप से डिफ़ॉल्ट टाइम-स्लॉट जनरेट करेगा। (Auto slot generation).
            </small>
          </div>
        </form>
      </Modal>

      {/* Slot Configurator Modal */}
      {selectedGame && (
        <Modal
          isOpen={slotModalOpen}
          onClose={() => setSlotModalOpen(false)}
          title={`स्लॉट कॉन्फ़िगरेशन — ${selectedGame.name}`}
          footer={
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setSlotModalOpen(false)}>
                रद्द करें
              </button>
              <button type="button" className="btn btn-primary" onClick={handleAddSlot}>
                नया स्लॉट जोड़ें (Add Slot)
              </button>
            </div>
          }
        >
          {/* Current Slots List */}
          <div style={{ marginBottom: '20px' }}>
            <h4 style={{ margin: '0 0 10px', fontSize: '0.95rem' }}>वर्तमान टाइम-स्लॉट्स:</h4>
            {selectedGame.slots && selectedGame.slots.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {selectedGame.slots.map((s) => (
                  <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--slate-50)', borderRadius: '8px', border: '1px solid var(--slate-200)', fontSize: '0.88rem' }}>
                    <strong>{s.slot_name}</strong>
                    <span>{s.start_time} - {s.end_time} (क्षमता: {s.allocated_capacity})</span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: 'var(--slate-500)', fontSize: '0.85rem' }}>कोई अतिरिक्त स्लॉट नहीं है।</p>
            )}
          </div>

          {/* Add New Slot Subform */}
          <div style={{ borderTop: '1px solid var(--slate-200)', paddingTop: '16px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem' }}>नया स्लॉट जोड़ें:</h4>
            <div className="form-group">
              <label className="form-label">स्लॉट का नाम (Slot Name)</label>
              <input
                type="text"
                className="form-input"
                value={newSlotForm.slot_name}
                onChange={(e) => setNewSlotForm({ ...newSlotForm, slot_name: e.target.value })}
                required
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
              <div className="form-group">
                <label className="form-label">प्रारंभ</label>
                <input
                  type="time"
                  className="form-input"
                  value={newSlotForm.start_time}
                  onChange={(e) => setNewSlotForm({ ...newSlotForm, start_time: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">समाप्ति</label>
                <input
                  type="time"
                  className="form-input"
                  value={newSlotForm.end_time}
                  onChange={(e) => setNewSlotForm({ ...newSlotForm, end_time: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">क्षमता</label>
                <input
                  type="number"
                  className="form-input"
                  value={newSlotForm.allocated_capacity}
                  onChange={(e) => setNewSlotForm({ ...newSlotForm, allocated_capacity: Number(e.target.value) })}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Player Roster Modal */}
      {selectedGame && (
        <Modal
          isOpen={rosterModalOpen}
          onClose={() => setRosterModalOpen(false)}
          title={`पंजीकृत खिलाड़ी रोस्टर — ${selectedGame.name}`}
          maxWidth="700px"
          footer={
            <button type="button" className="btn btn-secondary" onClick={() => setRosterModalOpen(false)}>
              बंद करें
            </button>
          }
        >
          {enrolledPlayers.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '30px', color: 'var(--slate-500)' }}>
              इस प्रतियोगिता में अभी कोई खिलाड़ी स्वीकृत/पंजीकृत नहीं है।
            </p>
          ) : (
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              <table className="datatable-table">
                <thead>
                  <tr>
                    <th>खिलाड़ी</th>
                    <th>पिता का नाम</th>
                    <th>ग्राम</th>
                    <th>आवंटित स्लॉट</th>
                    <th>उपस्थिति (Court)</th>
                  </tr>
                </thead>
                <tbody>
                  {enrolledPlayers.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.name}</strong>
                      </td>
                      <td>{p.father_name}</td>
                      <td>{p.village}</td>
                      <td>{p.slot_name}</td>
                      <td>
                        {p.is_present ? (
                          <span className="badge-pill badge-approved">उपस्थित (Present)</span>
                        ) : (
                          <span className="badge-pill badge-inactive">अनुपस्थित</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Modal>
      )}
    </PortalLayout>
  )
}
