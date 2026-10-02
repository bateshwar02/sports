import React, { useState, useMemo } from 'react'
import { Search, ChevronDown, ChevronUp, Download, Filter } from 'lucide-react'

export default function DataTable({
  columns = [],
  data = [],
  searchPlaceholder = 'खोजें / Search table...',
  filterOptions = [], // [{ key: 'status', label: 'All Status', options: [{ value: 'Approved', label: 'Approved' }] }]
  filters = {},
  onFilterChange = () => {},
  emptyMessage = 'कोई डेटा उपलब्ध नहीं है (No records found)',
  exportFilename = 'sports-export.csv'
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortKey, setSortKey] = useState(null)
  const [sortOrder, setSortOrder] = useState('asc') // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10) // 10, 25, 50, 100

  // 1. Global Filter + Column Filters
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Global search across visible text
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase()
        const matchesSearch = Object.values(item).some((val) => {
          if (val === null || val === undefined) return false
          return String(val).toLowerCase().includes(query)
        })
        if (!matchesSearch) return false
      }

      // Applied column filters
      for (const [key, val] of Object.entries(filters)) {
        if (!val || val === 'all') continue
        if (String(item[key]).toLowerCase() !== String(val).toLowerCase()) {
          return false
        }
      }

      return true
    })
  }, [data, searchTerm, filters])

  // 2. Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData
    return [...filteredData].sort((a, b) => {
      const aVal = a[sortKey] ?? ''
      const bVal = b[sortKey] ?? ''

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal
      }
      return sortOrder === 'asc'
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal))
    })
  }, [filteredData, sortKey, sortOrder])

  // 3. Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return sortedData.slice(start, start + pageSize)
  }, [sortedData, currentPage, pageSize])

  const handleSort = (key) => {
    if (!key) return
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('asc')
    }
  }

  // 4. Export CSV
  const handleExportCSV = () => {
    if (!sortedData.length) return
    const exportColumns = columns.filter((c) => c.accessor && !c.hideExport)
    const headers = exportColumns.map((c) => `"${c.header}"`).join(',')
    const rows = sortedData.map((row, idx) => {
      return exportColumns
        .map((c) => {
          let val = typeof c.accessor === 'function' ? c.accessor(row, idx) : row[c.accessor]
          if (val === undefined || val === null) val = ''
          return `"${String(val).replace(/"/g, '""')}"`
        })
        .join(',')
    })

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', exportFilename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="datatable-wrapper">
      {/* Toolbar: Global search, filters, export */}
      <div className="datatable-toolbar">
        <div className="datatable-search">
          <Search size={16} className="datatable-search-icon" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
          />
        </div>

        <div className="datatable-filters">
          {filterOptions.map((f) => (
            <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <select
                className="datatable-filter-select"
                value={filters[f.key] || 'all'}
                onChange={(e) => {
                  onFilterChange(f.key, e.target.value)
                  setCurrentPage(1)
                }}
              >
                <option value="all">{f.label}</option>
                {f.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-outline btn-sm"
            onClick={handleExportCSV}
            title="Export CSV"
          >
            <Download size={14} /> CSV
          </button>
        </div>
      </div>

      {/* High-density Data Table */}
      <div className="datatable-table-scroll">
        <table className="datatable-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  onClick={() => col.sortable && handleSort(col.sortKey || col.accessor)}
                  style={{
                    cursor: col.sortable ? 'pointer' : 'default',
                    width: col.width || 'auto',
                    textAlign: col.align || 'left'
                  }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span>{col.header}</span>
                    {col.sortable && sortKey === (col.sortKey || col.accessor) && (
                      sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} style={{ textAlign: 'center', padding: '36px', color: 'var(--slate-500)' }}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => {
                const globalIndex = (currentPage - 1) * pageSize + rowIdx + 1
                return (
                  <tr key={row.id || rowIdx}>
                    {columns.map((col, cIdx) => (
                      <td
                        key={cIdx}
                        style={{
                          textAlign: col.align || 'left',
                          width: col.width || 'auto'
                        }}
                      >
                        {col.render
                          ? col.render(row, globalIndex)
                          : typeof col.accessor === 'function'
                          ? col.accessor(row, globalIndex)
                          : row[col.accessor]}
                      </td>
                    ))}
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="datatable-footer">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>प्रति पृष्ठ (Per page):</span>
          <select
            className="datatable-filter-select"
            style={{ padding: '3px 8px' }}
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value))
              setCurrentPage(1)
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
          <span style={{ marginLeft: '12px' }}>
            कुल (Total): <strong>{sortedData.length}</strong> रिकॉर्ड
          </span>
        </div>

        <div className="datatable-pagination">
          <button
            type="button"
            className="pagination-btn"
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            पिछला (Prev)
          </button>
          
          <span style={{ padding: '0 8px', fontWeight: 600 }}>
            {currentPage} / {totalPages}
          </span>

          <button
            type="button"
            className="pagination-btn"
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            अगला (Next)
          </button>
        </div>
      </div>
    </div>
  )
}
