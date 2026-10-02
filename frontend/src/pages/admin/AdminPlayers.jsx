import React, { useState, useEffect } from 'react'
import { Eye, CheckCircle, XCircle, Trash2, Edit2, ShieldAlert, Plus } from 'lucide-react'
import PortalLayout from '../../layouts/PortalLayout'
import DataTable from '../../components/DataTable'
import Badge from '../../components/Badge'
import AadhaarViewerModal from '../../components/AadhaarViewerModal'
import Modal from '../../components/Modal'
import { api } from '../../services/api'

export default function AdminPlayers() {
  const [players, setPlayers] = useState([])
  const [games, setGames] = useState([])
  const [classes, setClasses] = useState([])
  const [filters, setFilters] = useState({ status: 'all', game_id: 'all', class_id: 'all' })
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [inspectModalOpen, setInspectModalOpen] = useState(false)
  const [editPlayer, setEditPlayer] = useState(null)
  const [editModalOpen, setEditModalOpen] = useState(false)

  const loadData = async () => {
    const pRes = await api.getPlayers(filters)
    if (pRes.success) setPlayers(pRes.data.players || [])

    const gRes = await api.getGames()
    if (gRes.success) setGames(gRes.data || [])

    const cRes = await api.getClasses()
    if (cRes.success) setClasses(cRes.data || [])
  }

  useEffect(() => {
    loadData()
  }, [filters])

  const handleApprove = async (id) => {
    await api.approvePlayer(id)
    loadData()
  }

  const handleReject = async (id, reason) => {
    await api.rejectPlayer(id, reason)
    loadData()
  }

  const handleInspect = (player) => {
    setSelectedPlayer(player)
    setInspectModalOpen(true)
  }

  const handleEdit = (player) => {
    setEditPlayer({ ...player })
    setEditModalOpen(true)
  }

  const handleSaveEdit = (e) => {
    e.preventDefault()
    // Update local state and save store
    setPlayers((prev) => prev.map((p) => (p.id === editPlayer.id ? { ...p, ...editPlayer } : p)))
    setEditModalOpen(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('क्या आप वाकई इस खिलाड़ी का पंजीकरण हटाना चाहते हैं? (Soft Delete)')) {
      setPlayers((prev) => prev.filter((p) => p.id !== id))
    }
  }

  // Filter options for DataTable
  const filterOptions = [
    {
      key: 'status',
      label: 'स्थिति: सभी (All Status)',
      options: [
        { value: 'Pending', label: 'लंबित (Pending)' },
        { value: 'Approved', label: 'स्वीकृत (Approved)' },
        { value: 'Rejected', label: 'अस्वीकृत (Rejected)' }
      ]
    },
    {
      key: 'game_id',
      label: 'खेल: सभी (All Games)',
      options: games.map((g) => ({ value: String(g.id), label: g.name }))
    },
    {
      key: 'class_id',
      label: 'वर्ग: सभी (All Classes)',
      options: classes.map((c) => ({ value: String(c.id), label: c.class_name }))
    }
  ]

  // Columns per Blueprint Section 7.1
  const columns = [
    {
      header: 'क्र.सं. (S.No)',
      accessor: (row, idx) => idx,
      width: '70px',
      align: 'center'
    },
    {
      header: 'फोटो (Avatar)',
      width: '60px',
      align: 'center',
      hideExport: true,
      render: (row) => (
        <img
          src={row.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
          alt={row.name}
          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--slate-200)' }}
        />
      )
    },
    {
      header: 'खिलाड़ी का नाम (Player Name)',
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
      header: 'पिता का नाम (Father Name)',
      accessor: 'father_name',
      sortable: true
    },
    {
      header: 'प्रतियोगिता (Enrolled Game)',
      accessor: 'game_name',
      sortable: true,
      render: (row) => (
        <div>
          <div style={{ fontWeight: 600 }}>{row.game_name}</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--slate-500)' }}>{row.slot_name}</div>
        </div>
      )
    },
    {
      header: 'वर्ग (Class)',
      accessor: 'class_name',
      sortable: true
    },
    {
      header: 'ग्राम (Village)',
      accessor: 'village',
      sortable: true
    },
    {
      header: 'संपर्क (Contact No.)',
      accessor: 'mobile',
      sortable: true
    },
    {
      header: 'आधार (Aadhaar Masked)',
      accessor: (row) => {
        const c = String(row.aadhaar_no || '').replace(/\D/g, '')
        return c.length === 12 ? `XXXX-XXXX-${c.slice(8)}` : (row.aadhaar_no || 'N/A')
      }
    },
    {
      header: 'स्थिति (Status)',
      accessor: 'status',
      sortable: true,
      render: (row) => <Badge status={row.status} />
    },
    {
      header: 'कार्य (Row Actions)',
      hideExport: true,
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => handleInspect(row)}
            title="दस्तावेज़ एवं आधार जांचें (Inspect)"
          >
            <Eye size={14} />
          </button>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleEdit(row)}
            title="संपादित करें (Edit)"
          >
            <Edit2 size={14} />
          </button>
          {row.status !== 'Approved' && (
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => handleApprove(row.id)}
              title="स्वीकृत करें (Approve)"
            >
              <CheckCircle size={14} />
            </button>
          )}
          <button
            type="button"
            className="btn btn-danger btn-sm"
            onClick={() => handleDelete(row.id)}
            title="हटाएं (Delete)"
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
      title="खिलाड़ी प्रबंधन (Player Management DataTable)"
      subtitle="खिलाड़ियों की सूची, फ़िल्टर, दस्तावेज़ सत्यापन, अनुमोदन एवं संपादन"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            Blueprint Section 7.1 Universal UI Data-Grid
          </span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={players}
        filterOptions={filterOptions}
        filters={filters}
        onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
        searchPlaceholder="नाम, पिता का नाम, ग्राम, मोबाइल या आधार से खोजें..."
        exportFilename="players-roster.csv"
      />

      {/* Aadhaar Inspection Modal */}
      <AadhaarViewerModal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        player={selectedPlayer}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Edit Player Modal */}
      {editPlayer && (
        <Modal
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          title="खिलाड़ी विवरण संपादित करें (Inline Edit)"
          footer={
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setEditModalOpen(false)}>
                रद्द करें
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSaveEdit}>
                परिवर्तन सहेजें (Save Changes)
              </button>
            </div>
          }
        >
          <div className="form-group">
            <label className="form-label">खिलाड़ी का नाम</label>
            <input
              type="text"
              className="form-input"
              value={editPlayer.name}
              onChange={(e) => setEditPlayer({ ...editPlayer, name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">पिता का नाम</label>
            <input
              type="text"
              className="form-input"
              value={editPlayer.father_name}
              onChange={(e) => setEditPlayer({ ...editPlayer, father_name: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">ग्राम</label>
            <input
              type="text"
              className="form-input"
              value={editPlayer.village}
              onChange={(e) => setEditPlayer({ ...editPlayer, village: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">मोबाइल</label>
            <input
              type="text"
              className="form-input"
              value={editPlayer.mobile}
              onChange={(e) => setEditPlayer({ ...editPlayer, mobile: e.target.value })}
            />
          </div>
        </Modal>
      )}
    </PortalLayout>
  )
}
