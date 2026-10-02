import React, { useState, useEffect } from 'react'
import PortalLayout from '../../layouts/PortalLayout'
import DataTable from '../../components/DataTable'
import { api } from '../../services/api'

export default function VolunteerWinners() {
  const [winners, setWinners] = useState([])

  useEffect(() => {
    async function load() {
      const res = await api.getWinners()
      if (res.success) setWinners(res.data || [])
    }
    load()
  }, [])

  const columns = [
    { header: 'क्र.सं.', accessor: (r, idx) => idx, width: '70px', align: 'center' },
    { header: 'प्रतियोगिता', accessor: 'game_name', sortable: true },
    {
      header: 'स्थान (Position)',
      accessor: 'position',
      sortable: true,
      render: (r) => (
        <strong>
          {r.position === '1st' ? '🥇 1st Place' : r.position === '2nd' ? '🥈 2nd Place' : '🥉 3rd Place'}
        </strong>
      )
    },
    { header: 'विजेता खिलाड़ी', accessor: 'player_name', sortable: true },
    { header: 'ग्राम', accessor: 'village' },
    { header: 'पुरस्कार', accessor: 'prize_title' },
    { header: 'टिप्पणी', accessor: 'remarks' }
  ]

  return (
    <PortalLayout
      role="volunteer"
      title="प्रकाशित विजेता परिणाम (Official Winner Standings)"
      subtitle="खेल समिति द्वारा सत्यापित पोडियम परिणाम"
    >
      <DataTable
        columns={columns}
        data={winners}
        searchPlaceholder="प्रतियोगिता या खिलाड़ी का नाम..."
        exportFilename="winners-standings.csv"
      />
    </PortalLayout>
  )
}
