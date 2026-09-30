import React, { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:8000/index.php'

export default function GameListPage() {
  const [games, setGames] = useState([])
  const [filter, setFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list-games' }),
      }).then((r) => r.json())

      if (res?.success && Array.isArray(res.games)) {
        setGames(res.games.map((x) => ({ id: Number(x.id), name: x.name, description: x.description })))
      }
    } catch (error) {
      console.error('Load games error', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = games.filter((g) =>
    g.name.toLowerCase().includes(filter.toLowerCase()) ||
    (g.description && g.description.toLowerCase().includes(filter.toLowerCase()))
  )

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1>Games</h1>
        <p className="helper">Available sports and competitions</p>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search games..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
      </div>

      {loading ? (
        <div className="loading">Loading games...</div>
      ) : (
        <div className="panel wide-panel">
          <h2>Game List</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Game Name</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((game) => (
                  <tr key={game.id}>
                    <td className="bold">{game.name}</td>
                    <td>{game.description || 'N/A'}</td>
                    <td>
                      <button className="small-btn">Register</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="center">
                    No games found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
