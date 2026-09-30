import React, { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:8000/index.php'

export default function UserDashboard({ session, addToast, logout }) {
  const [games, setGames] = useState([])
  const [awards, setAwards] = useState([])

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [g, w] = await Promise.all([
        fetch(API_BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list-games' }) }).then((r) => r.json()),
        fetch(API_BASE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list-winners' }) }).then((r) => r.json()),
      ])

      if (g?.success && Array.isArray(g.games)) {
        setGames(g.games.map((x) => ({ id: Number(x.id), name: x.name, description: x.description })))
      }
      if (w?.success && Array.isArray(w.winners)) {
        setAwards(
          w.winners.map((x) => ({
            id: Number(x.id),
            gameId: Number(x.game_id),
            gameName: x.game_name || '',
            first: x.first_place || '',
            second: x.second_place || '',
            third: x.third_place || '',
          }))
        )
      }
    } catch (error) {
      console.error('Load data error', error)
    }
  }

  return (
    <div className="premium-dashboard">
      <aside className="dashboard-sidebar">
        <div className="brand-wrap">
          <div className="brand-mark">U</div>
          <div>
            <div className="eyebrow light">Athlete</div>
            <h2>Dashboard</h2>
          </div>
        </div>

        <div className="nav-stack">
          <button className="nav-item active">Sports</button>
          <button className="nav-item">Results</button>
        </div>

        <div className="sidebar-footer">
          <div className="user-pill">
            <span>{session?.name || 'Athlete'}</span>
            <small>{session?.role || 'user'}</small>
          </div>
          <button className="ghost-btn dark" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <div className="eyebrow">User Dashboard</div>
            <h1>Sports Insights</h1>
          </div>
          <div className="topbar-meta">
            <span className="meta-chip">Live</span>
            <span className="meta-chip muted">{new Date().toLocaleDateString()}</span>
          </div>
        </header>

        <section className="summary-grid">
          <article className="stat-card blue">
            <span>Sports</span>
            <strong>{games.length}</strong>
          </article>
          <article className="stat-card violet">
            <span>Results</span>
            <strong>{awards.length}</strong>
          </article>
          <article className="stat-card green">
            <span>Status</span>
            <strong>Active</strong>
          </article>
          <article className="stat-card orange">
            <span>Next</span>
            <strong>Events</strong>
          </article>
        </section>

        <section className="dashboard-workbench">
          <div className="content-panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Overview</p>
                <h3>Available Sports</h3>
              </div>
              <div className="search-box">Filter results</div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Sport</th>
                  <th>Description</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {games.map((game) => (
                  <tr key={game.id}>
                    <td className="text-emphasis">{game.name}</td>
                    <td>{game.description || 'No description'}</td>
                    <td><span className="status-badge role-user">Available</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="quick-panel">
            <div className="info-card">
              <h3>Prize Results</h3>
              <p>Current winners and rankings for all sports.</p>
              <div className="info-figure">{awards.length}</div>
              <small>Updated from the database.</small>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
