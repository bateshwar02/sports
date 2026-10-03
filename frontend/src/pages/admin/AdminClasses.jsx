import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import PortalLayout from '../../layouts/PortalLayout'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import Badge from '../../components/Badge'
import { api } from '../../services/api'

export default function AdminClasses() {
  const [classes, setClasses] = useState([])
  const [addModalOpen, setAddModalOpen] = useState(false)
  const [form, setForm] = useState({
    class_name: '',
    class_code: '',
    description: ''
  })

  useEffect(() => {
    const loadClasses = async () => {
      const res = await api.getClasses()
      if (res?.success) setClasses(res.data || [])
    }
    loadClasses()
  }, [])

  const loadClasses = async () => {
    const res = await api.getClasses()
    if (res?.success) setClasses(res.data || [])
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.class_name || !form.class_code) return
    await api.createClass(form)
    setAddModalOpen(false)
    setForm({ class_name: '', class_code: '', description: '' })
    loadClasses()
  }

  const columns = [
    {
      header: 'क्र.सं. (S.No)',
      accessor: (row, idx) => idx,
      width: '70px',
      align: 'center'
    },
    {
      header: 'वर्ग / श्रेणी का नाम (Class Name)',
      accessor: 'class_name',
      sortable: true,
      render: (row) => <strong>{row.class_name}</strong>
    },
    {
      header: 'वर्ग कोड (Class Code)',
      accessor: 'class_code',
      sortable: true,
      render: (row) => <code style={{ color: 'var(--purple-600)', fontWeight: 700 }}>{row.class_code}</code>
    },
    {
      header: 'पात्रता व विवरण (Eligibility / Description)',
      accessor: 'description',
      sortable: true
    },
    {
      header: 'स्थिति (Status)',
      accessor: 'status',
      sortable: true,
      render: (row) => <Badge status={row.status} />
    }
  ]

  return (
    <PortalLayout
      role="admin"
      title="वर्ग एवं श्रेणी प्रबंधन (Class & Division Management)"
      subtitle="गतिशील शैक्षणिक एवं खेल वर्ग विन्यास (Ensures zero hardcoded dropdown values in UI)"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '0.85rem', color: 'var(--slate-500)' }}>
            Blueprint Section 4.2 Class & Division Management
          </span>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setAddModalOpen(true)}>
          <Plus size={16} /> नया वर्ग जोड़ें (Add Division)
        </button>
      </div>

      <DataTable
        columns={columns}
        data={classes}
        searchPlaceholder="वर्ग का नाम, कोड या विवरण से खोजें..."
        exportFilename="tournament-classes.csv"
      />

      <Modal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        title="नया वर्ग / डिवीजन पंजीकृत करें (Add Class)"
        footer={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setAddModalOpen(false)}>
              रद्द करें
            </button>
            <button type="button" className="btn btn-primary" onClick={handleAdd}>
              सहेजें (Save Division)
            </button>
          </div>
        }
      >
        <form onSubmit={handleAdd}>
          <div className="form-group">
            <label className="form-label">वर्ग का नाम (Class Name) *</label>
            <input
              type="text"
              className="form-input"
              placeholder="उदा. प्राथमिक वर्ग (कक्षा 1 से 5)"
              value={form.class_name}
              onChange={(e) => setForm({ ...form, class_name: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">वर्ग कोड (Unique Code) *</label>
            <input
              type="text"
              className="form-input"
              placeholder="उदा. CLS_PRIMARY_BOYS"
              value={form.class_code}
              onChange={(e) => setForm({ ...form, class_code: e.target.value.toUpperCase() })}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">पात्रता एवं विवरण (Eligibility & Guidelines)</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="आयु सीमा, शैक्षणिक स्तर एवं पात्रता नियम..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </PortalLayout>
  )
}
