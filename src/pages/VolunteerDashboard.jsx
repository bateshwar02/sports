import React, { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:8000/index.php'

export default function VolunteerDashboard({ session, addToast, logout }) {
  const [games, setGames] = useState([])
  const [registrations, setRegistrations] = useState([])
  const [users, setUsers] = useState([])
  const [registrationForm, setRegistrationForm] = useState({ gameId: '1', name: '', fatherName: '', village: '', aadhaar: '', image: '' })
  const [userForm, setUserForm] = useState({ name: '', username: '', password: '' })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [g, r, u] = await Promise.all([
        fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list-games' }),
        }).then((r) => r.json()),
        fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list-registrations' }),
        }).then((r) => r.json()),
        fetch(API_BASE, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'list-users' }),
        }).then((r) => r.json()),
      ])

      if (g?.success && Array.isArray(g.games)) {
        setGames(g.games.map((x) => ({ id: Number(x.id), name: x.name, description: x.description })))
        if (g.games.length > 0) {
          setRegistrationForm((prev) => ({ ...prev, gameId: String(g.games[0].id) }))
        }
      }
      if (r?.success && Array.isArray(r.registrations)) {
        setRegistrations(
          r.registrations.map((x) => ({
            id: Number(x.id),
            gameId: Number(x.game_id),
            gameName: x.game_name || '',
            name: x.name,
            fatherName: x.father_name,
            village: x.village,
            aadhaar: x.aadhaar,
            image: x.image_url,
          }))
        )
      }
      if (u?.success && Array.isArray(u.users)) {
        setUsers(u.users.filter((x) => x.role === 'user').map((x) => ({ id: Number(x.id), name: x.name, username: x.username })))
      }
    } catch (error) {
      console.error('Load data error', error)
    }
  }

  const handleRegisterPlayer = async (e) => {
    e.preventDefault()
    if (!registrationForm.name.trim() || !registrationForm.fatherName.trim()) return

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'register',
          participant: {
            ...registrationForm,
            gameId: Number(registrationForm.gameId),
            image: registrationForm.image || 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80',
          },
        }),
      }).then((r) => r.json())

      if (res?.success) {
        addToast('Player registered', 'success')
        setRegistrationForm({ gameId: registrationForm.gameId, name: '', fatherName: '', village: '', aadhaar: '', image: '' })
        loadData()
      } else {
        addToast(res?.message || 'Registration failed', 'error')
      }
    } catch (error) {
      addToast('Registration failed', 'error')
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
        body: JSON.stringify({ action: 'create-user', user: { name: userForm.name, username: userForm.username, password: userForm.password || 'changeme', role: 'user' } }),
      }).then((r) => r.json())

      if (res?.success) {
        addToast('User created', 'success')
        setUserForm({ name: '', username: '', password: '' })
        loadData()
      } else {
        addToast(res?.message || 'Create user failed', 'error')
      }
    } catch (error) {
      addToast('Create user failed', 'error')
      console.error(error)
    }
  }

  return (
    <div className="premium-dashboard">
      <aside className="dashboard-sidebar">
        <div className="brand-wrap">
          <div className="brand-mark">V</div>
          <div>
            <div className="eyebrow light">Volunteer</div>
            <h2>Portal</h2>
          </div>
        </div>

        <div className="nav-stack">
          <button className="nav-item active">Players</button>
          <button className="nav-item">Games</button>
          <button className="nav-item">Users</button>
        </div>

        <div className="sidebar-footer">
          <div className="user-pill">
            <span>{session?.name || 'Volunteer'}</span>
            <small>{session?.role || 'volunteer'}</small>
          </div>
          <button className="ghost-btn dark" onClick={logout}>Logout</button>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <div className="eyebrow">Volunteer Dashboard</div>
            <h1>Participant Center</h1>
          </div>
          <div className="topbar-meta">
            <span className="meta-chip">Live</span>
            <span className="meta-chip muted">{new Date().toLocaleDateString()}</span>
          </div>
        </header>

        <section className="summary-grid">
          <article className="stat-card blue">
            <span>Games</span>
            <strong>{games.length}</strong>
          </article>
          <article className="stat-card violet">
            <span>Players</span>
            <strong>{registrations.length}</strong>
          </article>
          <article className="stat-card green">
            <span>Users</span>
            <strong>{users.length}</strong>
          </article>
          <article className="stat-card orange">
            <span>Live</span>
            <strong>Open</strong>
          </article>
        </section>

        <section className="dashboard-workbench">
          <div className="content-panel">
            <div className="panel-header">
              <div>
                <p className="panel-kicker">Overview</p>
                <h3>Registrations</h3>
              </div>
              <div className="search-box">Filter results</div>
            </div>

            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Game</th>
                  <th>Village</th>
                  <th>Aadhaar</th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((r) => (
                  <tr key={r.id}>
                    <td className="text-emphasis">{r.name}</td>
                    <td>{r.gameName}</td>
                    <td>{r.village}</td>
                    <td>{r.aadhaar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="quick-panel">
            <form onSubmit={handleRegisterPlayer} className="stack-form">
              <h3>Register Player</h3>
              <label>
                Game
                <select value={registrationForm.gameId} onChange={(e) => setRegistrationForm({ ...registrationForm, gameId: e.target.value })}>
                  {games.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </label>
              <label>
                Name
                <input value={registrationForm.name} onChange={(e) => setRegistrationForm({ ...registrationForm, name: e.target.value })} placeholder="Player name" />
              </label>
              <label>
                Father Name
                <input value={registrationForm.fatherName} onChange={(e) => setRegistrationForm({ ...registrationForm, fatherName: e.target.value })} placeholder="Father name" />
              </label>
              <label>
                Village
                <input value={registrationForm.village} onChange={(e) => setRegistrationForm({ ...registrationForm, village: e.target.value })} placeholder="Village" />
              </label>
              <label>
                Aadhaar
                <input value={registrationForm.aadhaar} onChange={(e) => setRegistrationForm({ ...registrationForm, aadhaar: e.target.value })} placeholder="12-digit aadhaar" />
              </label>
              <label>
                Image URL
                <input value={registrationForm.image} onChange={(e) => setRegistrationForm({ ...registrationForm, image: e.target.value })} placeholder="https://..." />
              </label>
              <button className="primary-btn" type="submit">Register</button>
            </form>

            <form onSubmit={handleAddUser} className="stack-form" style={{ marginTop: 22 }}>
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
              <button className="primary-btn" type="submit">Create User</button>
            </form>
          </div>
        </section>
      </main>
    </div>
  )
}
