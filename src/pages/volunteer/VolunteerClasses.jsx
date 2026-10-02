import React, { useState, useEffect } from 'react'
import PortalLayout from '../../layouts/PortalLayout'
import DataTable from '../../components/DataTable'
import Badge from '../../components/Badge'
import { api } from '../../services/api'

export default function VolunteerClasses() {
  const [classes, setClasses] = useState([])

  useEffect(() => {
    async function load() {
      const res = await api.getClasses()
      if (res.success) setClasses(res.data || [])
    }
    load()
  }, [])

  const columns = [
    { header: 'क्र.सं.', accessor: (r, idx) => idx, width: '70px', align: 'center' },
    { header: 'वर्ग का नाम', accessor: 'class_name', sortable: true, render: (r) => <strong>{r.class_name}</strong> },
    { header: 'कोड', accessor: 'class_code', sortable: true, render: (r) => <code>{r.class_code}</code> },
    { header: 'विवरण व पात्रता', accessor: 'description' },
    { header: 'स्थिति', accessor: 'status', render: (r) => <Badge status={r.status} /> }
  ]

  return (
    <PortalLayout
      role="volunteer"
      title="प्रतियोगिता वर्ग एवं आयु सीमा सूची (Class Divisions)"
      subtitle="सत्यापन के दौरान खिलाड़ी की आयु एवं कक्षा पात्रता का मिलान करें"
    >
      <DataTable
        columns={columns}
        data={classes}
        searchPlaceholder="वर्ग का नाम या कोड से खोजें..."
        exportFilename="class-divisions.csv"
      />
    </PortalLayout>
  )
}
