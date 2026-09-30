import React, { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:8000/index.php'

const menuItems = [
  { key: 'users', label: 'Users' },
  { key: 'games', label: 'Games' },
  { key: 'players', label: 'Players' },
  { key: 'winners', label: 'Winners' },
]

export default function AdminDashboard({ session, addToast, logout }) {
  const [activeTab, setActiveTab] = useState('users')
  const [darkMode, setDarkMode] = useState(false)
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState('id')
  const [sortDir, setSortDir] = useState('desc')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [games, setGames] = useState([])
  const [users, setUsers] = useState([])
  const [players, setPlayers] = useState([])
  const [winners, setWinners] = useState([])
  const [gameForm, setGameForm] = useState({ name: '', description: '' })
  const [userForm, setUserForm] = useState({ name: '', username: '', password: '', role: 'user' })
  const [awardForm, setAwardForm] = useState({ gameId: '1', first: '', second: '', third: '' })

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    setPage(1)
  }, [activeTab, search, sortKey, sortDir])

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(key)
    setSortDir('asc')
  }

  const exportCsv = (rows, filename) => {
    if (!rows.length) {
      addToast('No rows to export', 'info')
      return
    }

    const headers = Object.keys(rows[0])
    const csv = [headers.join(',')]
      .concat(rows.map((row) => headers.map((header) => `"${String(row[header] ?? '').replace(/"/g, '""')}"`).join(',')))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    addToast('CSV exported', 'success')
  }

  const getCurrentRows = (rows) => {
    const totalPages = Math.max(1, Math.ceil(rows.length / pageSize))
    const safePage = Math.min(page, totalPages)
    const start = (safePage - 1) * pageSize
    return {
      rows: rows.slice(start, start + pageSize),
      totalPages,
      safePage,
    }
  }

  const applySortAndFilter = (rows) => {
    const q = search.trim().toLowerCase()
    const filtered = q
      ? rows.filter((row) => Object.values(row).some((value) => String(value ?? '').toLowerCase().includes(q)))
      : rows

    return [...filtered].sort((a, b) => {
      const av = a[sortKey] ?? ''
      const bv = b[sortKey] ?? ''
      const comparison = typeof av === 'number' && typeof bv === 'number'
        ? av - bv
        : String(av).localeCompare(String(bv))
      return sortDir === 'asc' ? comparison : -comparison
    })
  }

  const loadData = async () => {
    try {
      const [g, u, p, w] = await Promise.all([
        fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list-games' }),
        }).then((r) => r.json()),
        fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list-users' }),
        }).then((r) => r.json()),
        fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list-registrations' }),
        }).then((r) => r.json()),
        fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list-winners' }),
        }).then((r) => r.json()),
      ])

      if (g?.success && Array.isArray(g.games)) {
        setGames(g.games.map((x) => ({ id: Number(x.id), name: x.name, description: x.description })))
      }
      if (u?.success && Array.isArray(u.users)) {
        setUsers(u.users.map((x) => ({ id: Number(x.id), name: x.name, username: x.username, role: x.role })))
      }
      if (p?.success && Array.isArray(p.registrations)) {
        setPlayers(p.registrations.map((x) => ({
          id: Number(x.id),
          name: x.name,
          father_name: x.father_name,
          village: x.village,
          aadhaar: x.aadhaar,
          game_name: x.game_name || 'Unknown',
          image_url: x.image_url,
          aadhaar_image_url: x.aadhaar_image_url,
        })))
      }
      if (w?.success && Array.isArray(w.winners)) {
        setWinners(w.winners.map((x) => ({
          id: Number(x.id),
          game_name: x.game_name || 'Unknown',
          first_place: x.first_place,
          second_place: x.second_place,
          third_place: x.third_place,
        })))
      }
    } catch (error) {
      console.error('Load data error', error)
    }
  }

  const handleAddGame = async (e) => {
    e.preventDefault()
    if (!gameForm.name.trim()) return

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-game', game: { name: gameForm.name, description: gameForm.description } }),
      }).then((r) => r.json())

      if (res?.success) {
        addToast('Game created', 'success')
        setGameForm({ name: '', description: '' })
        loadData()
      } else {
        addToast(res?.message || 'Create game failed', 'error')
      }
    } catch (error) {
      addToast('Create game failed', 'error')
      console.error(error)
    }
  }

  const handleAddUser = async (e) => {
    e.preventDefault()
    if (!userForm.name.trim() || !userForm.username.trim()) return

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-user', user: { name: userForm.name, username: userForm.username, password: userForm.password || 'changeme', role: userForm.role } }),
      }).then((r) => r.json())

      if (res?.success) {
        addToast('User created', 'success')
        setUserForm({ name: '', username: '', password: '', role: 'user' })
        loadData()
      } else {
        addToast(res?.message || 'Create user failed', 'error')
      }
    } catch (error) {
      addToast('Create user failed', 'error')
      console.error(error)
    }
  }

  const handleAssignWinners = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'assign-winners',
          winners: { gameId: Number(awardForm.gameId), first: awardForm.first, second: awardForm.second, third: awardForm.third },
        }),
      }).then((r) => r.json())

      if (res?.success) {
        addToast('Winners assigned', 'success')
        setAwardForm({ gameId: awardForm.gameId, first: '', second: '', third: '' })
        loadData()
      } else {
        addToast(res?.message || 'Assign winners failed', 'error')
      }
    } catch (error) {
      addToast('Assign winners failed', 'error')
      console.error(error)
    }
  }

  const renderTable = () => {
    switch (activeTab) {
      case 'games': {
        const rows = applySortAndFilter(games)
        const { rows: currentRows, totalPages, safePage } = getCurrentRows(rows)
        return (
          <>
            <div className="table-toolbar">
              <div className="page-size">
                <label>Rows</label>
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <button className="mini-btn primary" onClick={() => exportCsv(rows, 'games.csv')}>Export CSV</button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th><button className="sort-btn" onClick={() => handleSort('id')}>ID</button></th>
                  <th><button className="sort-btn" onClick={() => handleSort('name')}>Game Name</button></th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((game) => (
                  <tr key={game.id}>
                    <td># {game.id}</td>
                    <td className="text-emphasis">{game.name}</td>
                    <td>{game.description || 'No description'}</td>
                    <td>
                      <div className="row-actions">
                        <button className="mini-btn primary" onClick={() => addToast(`Viewing ${game.name}`, 'info')}>View</button>
                        <button className="mini-btn" onClick={() => addToast(`Editing ${game.name}`, 'info')}>Edit</button>
                        <button className="mini-btn danger" onClick={() => addToast(`${game.name} delete requested`, 'error')}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
              <span>Page {safePage} / {totalPages}</span>
              <button disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
            </div>
          </>
        )
      }
      case 'players': {
        const rows = applySortAndFilter(players)
        const { rows: currentRows, totalPages, safePage } = getCurrentRows(rows)
        return (
          <>
            <div className="table-toolbar">
              <div className="page-size">
                <label>Rows</label>
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <button className="mini-btn primary" onClick={() => exportCsv(rows, 'players.csv')}>Export CSV</button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th><button className="sort-btn" onClick={() => handleSort('name')}>Player</button></th>
                  <th><button className="sort-btn" onClick={() => handleSort('game_name')}>Game</button></th>
                  <th><button className="sort-btn" onClick={() => handleSort('village')}>Village</button></th>
                  <th><button className="sort-btn" onClick={() => handleSort('aadhaar')}>Aadhaar</button></th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((player) => (
                  <tr key={player.id}>
                    <td>
                      <div className="player-cell">
                        <div className="player-avatar">{player.name?.charAt(0)?.toUpperCase() || 'P'}</div>
                        <div>
                          <div className="text-emphasis">{player.name}</div>
                          <small>{player.father_name}</small>
                        </div>
                      </div>
                    </td>
                    <td>{player.game_name}</td>
                    <td>{player.village}</td>
                    <td>{player.aadhaar}</td>
                    <td>
                      <div className="row-actions">
                        <button className="mini-btn primary" onClick={() => addToast(`Viewing ${player.name}`, 'info')}>View</button>
                        <button className="mini-btn" onClick={() => addToast(`Editing ${player.name}`, 'info')}>Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
              <span>Page {safePage} / {totalPages}</span>
              <button disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
            </div>
          </>
        )
      }
      case 'winners': {
        const rows = applySortAndFilter(winners)
        const { rows: currentRows, totalPages, safePage } = getCurrentRows(rows)
        return (
          <>
            <div className="table-toolbar">
              <div className="page-size">
                <label>Rows</label>
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <button className="mini-btn primary" onClick={() => exportCsv(rows, 'winners.csv')}>Export CSV</button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th><button className="sort-btn" onClick={() => handleSort('game_name')}>Game</button></th>
                  <th><button className="sort-btn" onClick={() => handleSort('first_place')}>1st Place</button></th>
                  <th><button className="sort-btn" onClick={() => handleSort('second_place')}>2nd Place</button></th>
                  <th><button className="sort-btn" onClick={() => handleSort('third_place')}>3rd Place</button></th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((winner) => (
                  <tr key={winner.id}>
                    <td className="text-emphasis">{winner.game_name}</td>
                    <td>{winner.first_place || '—'}</td>
                    <td>{winner.second_place || '—'}</td>
                    <td>{winner.third_place || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
              <span>Page {safePage} / {totalPages}</span>
              <button disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
            </div>
          </>
        )
      }
      case 'users':
      default: {
        const rows = applySortAndFilter(users)
        const { rows: currentRows, totalPages, safePage } = getCurrentRows(rows)
        return (
          <>
            <div className="table-toolbar">
              <div className="page-size">
                <label>Rows</label>
                <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1) }}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
              <button className="mini-btn primary" onClick={() => exportCsv(rows, 'users.csv')}>Export CSV</button>
            </div>
            <table className="data-table">
              <thead>
                <tr>
                  <th><button className="sort-btn" onClick={() => handleSort('name')}>Name</button></th>
                  <th><button className="sort-btn" onClick={() => handleSort('username')}>Username</button></th>
                  <th><button className="sort-btn" onClick={() => handleSort('role')}>Role</button></th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentRows.map((user) => (
                  <tr key={user.id}>
                    <td className="text-emphasis">{user.name}</td>
                    <td>{user.username}</td>
                    <td>
                      <span className={`status-badge role-${user.role}`}>{user.role}</span>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="mini-btn primary" onClick={() => addToast(`Viewing ${user.name}`, 'info')}>View</button>
                        <button className="mini-btn" onClick={() => addToast(`Editing ${user.name}`, 'info')}>Edit</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button disabled={safePage <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Previous</button>
              <span>Page {safePage} / {totalPages}</span>
              <button disabled={safePage >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
            </div>
          </>
        )
      }
    }
  }

  const stats = [
    { label: 'Users', value: users.length, tone: 'blue' },
    { label: 'Games', value: games.length, tone: 'violet' },
    { label: 'Players', value: players.length, tone: 'green' },
    { label: 'Winners', value: winners.length, tone: 'orange' },
  ]

  const renderQuickAction = () => {
    if (activeTab === 'games') {
      return (
        <form onSubmit={handleAddGame} className="stack-form">
          <h3>Add Game</h3>
          <label>
            Game Name
            <input value={gameForm.name} onChange={(e) => setGameForm({ ...gameForm, name: e.target.value })} placeholder="Cricket" />
          </label>
          <label>
            Description
            <textarea rows="4" value={gameForm.description} onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })} placeholder="Game details" />
          </label>
          <button className="primary-btn" type="submit">Create Game</button>
        </form>
      )
    }

    if (activeTab === 'winners') {
      return (
        <form onSubmit={handleAssignWinners} className="stack-form">
          <h3>Assign Winners</h3>
          <label>
            Game
            <select value={awardForm.gameId} onChange={(e) => setAwardForm({ ...awardForm, gameId: e.target.value })}>
              {games.map((game) => (
                <option key={game.id} value={game.id}>{game.name}</option>
              ))}
            </select>
          </label>
          <label>
            1st Place
            <input value={awardForm.first} onChange={(e) => setAwardForm({ ...awardForm, first: e.target.value })} placeholder="Winner name" />
          </label>
          <label>
            2nd Place
            <input value={awardForm.second} onChange={(e) => setAwardForm({ ...awardForm, second: e.target.value })} placeholder="Runner-up" />
          </label>
          <label>
            3rd Place
            <input value={awardForm.third} onChange={(e) => setAwardForm({ ...awardForm, third: e.target.value })} placeholder="Third place" />
          </label>
          <button className="primary-btn" type="submit">Save Winners</button>
        </form>
      )
    }

    if (activeTab === 'users') {
      return (
        <form onSubmit={handleAddUser} className="stack-form">
          <h3>Add User</h3>
          <label>
            Full Name
            <input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
          </label>
          <label>
            Username
            <input value={userForm.username} onChange={(e) => setUserForm({ ...userForm, username: e.target.value })} />
          </label>
          <label>
            Password
            <input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} />
          </label>
          <label>
            Role
            <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}>
              <option value="user">User</option>
              <option value="volunteer">Volunteer</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <button className="primary-btn" type="submit">Add User</button>
        </form>
      )
    }

    return (
      <div className="info-card">
        <h3>Players Overview</h3>
        <p>Total player registrations recorded in the system.</p>
        <div className="info-figure">{players.length}</div>
        <small>Players are listed from the registrations table.</small>
      </div>
    )
  }

  return (
    <div className={`premium-dashboard ${darkMode ? 'theme-dark' : ''}`}>
      <aside className="dashboard-sidebar">
        <div className="brand-wrap">
          <div className="brand-mark">S</div>
          <div>
            <div className="eyebrow light">Sports</div>
            <h2>Management</h2>
          </div>
        </div>

        <div className="nav-stack">
          {menuItems.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${activeTab === item.key ? 'active' : ''}`}
              onClick={() => setActiveTab(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="user-pill">
            <span>{session?.user?.name || 'Admin'}</span>
            <small>{session?.user?.role || 'admin'}</small>
          </div>
          <button className="ghost-btn dark" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <div className="eyebrow">Premium Dashboard</div>
            <h1>Sports Control Center</h1>
          </div>
          <div className="topbar-meta">
            <button className="theme-toggle" onClick={() => setDarkMode((prev) => !prev)}>
              {darkMode ? 'Light mode' : 'Dark mode'}
            </button>
            <span className="meta-chip">Live</span>
            <span className="meta-chip muted">{new Date().toLocaleDateString()}</span>
          </div>
        </header>

        <section className="summary-grid">
          {stats.map((item) => (
            <article key={item.label} className={`stat-card ${item.tone}`}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
            </article>
          ))}
        </section>

        <section className="dashboard-workbench">
          <div className="content-panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Overview</p>
                <h3>{menuItems.find((item) => item.key === activeTab)?.label}</h3>
              </div>
              <div className="toolbar-actions">
                <input
                  className="toolbar-search"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search records..."
                />
              </div>
            </div>
            {renderTable()}
          </div>

          <div className="quick-panel">
            {renderQuickAction()}
          </div>
        </section>
      </main>
    </div>
  )
}
