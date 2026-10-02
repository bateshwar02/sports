import React, { useState, useEffect } from 'react'
import { UserCheck, Plus, Edit, ToggleLeft, ToggleRight, Trash2, MapPin, Phone, Mail } from 'lucide-react'
import PortalLayout from '../../layouts/PortalLayout'
import DataTable from '../../components/DataTable'
import Badge from '../../components/Badge'
import Modal from '../../components/Modal'
import { api } from '../../services/api'

export default function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState([])
  const [filters, setFilters] = useState({ status: 'all' })
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [regionModalOpen, setRegionModalOpen] = useState(false)
  const [selectedVol, setSelectedVol] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    village: '',
    district: 'आजमगढ़ (Azamgarh)'
  })

  const [regionData, setRegionData] = useState({
    village: '',
    district: ''
  })

  const loadVolunteers = async () => {
    const res = await api.getVolunteers()
    if (res.success) setVolunteers(res.data || [])
  }

  useEffect(() => {
    loadVolunteers()
  }, [])

  const handleToggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'inactive' : 'active'
    await api.toggleVolunteerStatus(id, nextStatus)
    loadVolunteers()
  }

  const handleOpenRegion = (vol) => {
    setSelectedVol(vol)
    setRegionData({ village: vol.village, district: vol.district })
    setRegionModalOpen(true)
  }

  const handleSaveRegion = async (e) => {
    e.preventDefault()
    if (selectedVol) {
      await api.updateVolunteerRegion(selectedVol.id, regionData.village, regionData.district)
      setRegionModalOpen(false)
      loadVolunteers()
    }
  }

  const handleAddVolunteer = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.mobile || !formData.village) return
    await api.createVolunteer(formData)
    setAddModalOpen(false)
    setFormData({ name: '', mobile: '', email: '', village: '', district: 'आजमगढ़ (Azamgarh)' })
    loadVolunteers()
  }

  const columns = [
    {
      header: 'क्र.सं. (S.No)',
      accessor: (row, idx) => idx,
      width: '70px',
      align: 'center'
    },
    {
      header: 'स्वयंसेवक नाम (Volunteer Name)',
      accessor: 'name',
      sortable: true,
      render: (row) => (
        <div>
          <strong style={{ color: 'var(--slate-900)' }}>{row.name}</strong>
          <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>Portal ID: #{row.id}</div>
        </div>
      )
    },
    {
      header: 'पंजीकृत मोबाइल (Mobile)',
      accessor: 'mobile',
      sortable: true
    },
    {
      header: 'ईमेल आईडी (Email ID)',
      accessor: 'email',
      sortable: true
    },
    {
      header: 'आवंटित ग्राम / क्षेत्र (Assigned Village)',
      accessor: 'village',
      sortable: true,
      render: (row) => (
        <div>
          <span>{row.village}</span>
          <div style={{ fontSize: '0.74rem', color: 'var(--slate-500)' }}>{row.district}</div>
        </div>
      )
    },
    {
      header: 'कार्य स्थिति (Operational Status)',
      accessor: 'status',
      sortable: true,
      render: (row) => <Badge status={row.status} />
    },
    {
      header: 'क्रिया (Row Actions)',
      hideExport: true,
      align: 'right',
      render: (row) => (
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={() => handleOpenRegion(row)}
            title="क्षेत्र पुनर्आवंटन (Reassign Region)"
          >
            <MapPin size={14} /> क्षेत्र
          </button>
          <button
            type="button"
            className={`btn btn-sm ${row.status === 'active' ? 'btn-secondary' : 'btn-success'}`}
            onClick={() => handleToggleStatus(row.id, row.status)}
            title="ड्यूटी स्थिति टॉगल करें (Toggle Duty Status)"
          >
            {row.status === 'active' ? 'निष्क्रिय करें' : 'सक्रिय करें'}
          </button>
        </div>
      )
    }
  ]

  const filterOptions = [
    {
      key: 'status',
      label: 'स्थिति: सभी',
      options: [
        { value: 'active', label: 'सक्रिय (Active)' },
        { value: 'inactive', label: 'निष्क्रिय (Inactive)' }
      ]
    }
  ]

  return (
    <PortalLayout
      role="admin"
      title="स्वयंसेवक दल प्रबंधन (Volunteer Staffing Roster)"
      subtitle="कार्यक्षेत्र सत्यापन दल, क्रेडेंशियल असाइनमेंट एवं क्षेत्रीय निगरानी"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            Blueprint Section 7.2 Volunteer Roster DataTable
          </span>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
          <Plus size={16} /> नया स्वयंसेवक जोड़ें (Register Volunteer)
        </button>
      </div>

      <DataTable
        columns={columns}
        data={volunteers}
        filterOptions={filterOptions}
        filters={filters}
        onFilterChange={(key, val) => setFilters((prev) => ({ ...prev, [key]: val }))}
        searchPlaceholder="स्वयंसेवक नाम, मोबाइल, ईमेल या ग्राम से खोजें..."
        exportFilename="volunteers-roster.csv"
      />

      {/* Add Volunteer Modal */}
      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="नया स्वयंसेवक पंजीकृत करें (Staff Volunteer)"
        footer={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>
              रद्द करें
            </button>
            <button type="button" className="btn btn-primary" onClick={handleAddVolunteer}>
              क्रेडेंशियल्स बनाएं (Provision Access)
            </button>
          </div>
        }
      >
        <form onSubmit={handleAddVolunteer}>
          <div className="form-group">
            <label className="form-label">स्वयंसेवक का पूरा नाम *</label>
            <input
              type="text"
              className="form-input"
              placeholder="उदा. राहुल कुमार वर्मा"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">मोबाइल नंबर *</label>
              <input
                type="tel"
                className="form-input"
                placeholder="9876500004"
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">ईमेल आईडी</label>
              <input
                type="email"
                className="form-input"
                placeholder="volunteer@saripatti.org"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">आवंटित ग्राम (Assigned Village) *</label>
              <input
                type="text"
                className="form-input"
                placeholder="सारीपट्टी / बटेश्वर"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">जनपद (District)</label>
              <input
                type="text"
                className="form-input"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* Reassign Region Modal */}
      {selectedVol && (
        <Modal
          isOpen={regionModalOpen}
          onClose={() => setRegionModalOpen(false)}
          title={`कार्यक्षेत्र पुनर्आवंटन — ${selectedVol.name}`}
          footer={
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setRegionModalOpen(false)}>
                रद्द करें
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSaveRegion}>
                क्षेत्र अपडेट करें (Reassign)
              </button>
            </div>
          }
        >
          <div className="form-group">
            <label className="form-label">नया ग्राम / कार्यक्षेत्र</label>
            <input
              type="text"
              className="form-input"
              value={regionData.village}
              onChange={(e) => setRegionData({ ...regionData, village: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">जनपद</label>
            <input
              type="text"
              className="form-input"
              value={regionData.district}
              onChange={(e) => setRegionData({ ...regionData, district: e.target.value })}
            />
          </div>
        </Modal>
      )}
    </PortalLayout>
  )
}
