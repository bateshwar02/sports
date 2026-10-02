import React, { useState, useEffect } from 'react'
import { Eye, CheckCircle, XCircle, ShieldCheck } from 'lucide-react'
import PortalLayout from '../../layouts/PortalLayout'
import DataTable from '../../components/DataTable'
import Badge from '../../components/Badge'
import AadhaarViewerModal from '../../components/AadhaarViewerModal'
import { api } from '../../services/api'

export default function VolunteerPlayers() {
  const [players, setPlayers] = useState([])
  const [games, setGames] = useState([])
  const [filters, setFilters] = useState({ status: 'all', game_id: 'all' })
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [inspectModalOpen, setInspectModalOpen] = useState(false)

  const loadData = async () => {
    const pRes = await api.getPlayers(filters)
    if (pRes.success) setPlayers(pRes.data.players || [])

    const gRes = await api.getGames()
    if (gRes.success) setGames(gRes.data || [])
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

  const filterOptions = [
    {
      key: 'status',
      label: 'स्थिति: सभी',
      options: [
        { value: 'Pending', label: 'लंबित (Pending)' },
        { value: 'Approved', label: 'स्वीकृत (Approved)' },
        { value: 'Rejected', label: 'अस्वीकृत (Rejected)' }
      ]
    },
    {
      key: 'game_id',
      label: 'खेल: सभी',
      options: games.map((g) => ({ value: String(g.id), label: g.name }))
    }
  ]

  const columns = [
    {
      header: 'क्र.सं.',
      accessor: (row, idx) => idx,
      width: '60px',
      align: 'center'
    },
    {
      header: 'फोटो',
      width: '50px',
      align: 'center',
      hideExport: true,
      render: (row) => (
        <img
          src={row.image_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
          alt={row.name}
          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
        />
      )
    },
    {
      header: 'खिलाड़ी का नाम',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div>
          <strong style={{ color: 'var(--slate-900)' }}>{row.name}</strong>
          <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>पिता: {row.father_name}</div>
        </div>
      )
    },
    {
      header: 'प्रतियोगिता',
      accessor: 'game_name',
      sortable: true
    },
    {
      header: 'ग्राम',
      accessor: 'village',
      sortable: true
    },
    {
      header: 'मोबाइल',
      accessor: 'mobile',
      sortable: true
    },
    {
      header: 'आधार (मास्क्ड)',
      accessor: (row) => {
        const c = String(row.aadhaar_no || '').replace(/\D/g, '')
        return c.length === 12 ? `XXXX-XXXX-${c.slice(8)}` : (row.aadhaar_no || 'N/A')
      }
    },
    {
      header: 'स्थिति',
      accessor: 'status',
      sortable: true,
      render: (row) => <Badge status={row.status} />
    },
    {
      header: 'सत्यापन कार्य (Workstation Action)',
      hideExport: true,
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => handleInspect(row)}
            title="आधार दस्तावेज़ एवं फोटो जांचें"
          >
            <ShieldCheck size={14} /> जांचें (Inspect)
          </button>
          {row.status !== 'Approved' && (
            <button
              type="button"
              className="btn btn-success btn-sm"
              onClick={() => handleApprove(row.id)}
              title="स्वीकृत करें"
            >
              <CheckCircle size={14} />
            </button>
          )}
        </div>
      )
    }
  ]

  return (
    <PortalLayout
      role="volunteer"
      title="एथलीट सत्यापन एवं दस्तावेज़ निरीक्षण कार्यस्थान"
      subtitle="Blueprint Section 4.2: Field review workstation for photo & Aadhaar verification"
    >
      <div style={{ marginBottom: '16px' }}>
        <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--slate-600)' }}>
          खिलाड़ी के फोटो एवं आधार कार्ड का मिलान कर पात्रता नियमों के आधार पर स्वीकृत या सकारण अस्वीकृत करें।
        </p>
      </div>

      <DataTable
        columns={columns}
        data={players}
        filterOptions={filterOptions}
        filters={filters}
        onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
        searchPlaceholder="खिलाड़ी, पिता का नाम, मोबाइल या आधार से खोजें..."
        exportFilename="volunteer-athlete-verification.csv"
      />

      <AadhaarViewerModal
        isOpen={inspectModalOpen}
        onClose={() => setInspectModalOpen(false)}
        player={selectedPlayer}
        onApprove={handleApprove}
        onReject={handleReject}
        canAction={true}
      />
    </PortalLayout>
  )
}
