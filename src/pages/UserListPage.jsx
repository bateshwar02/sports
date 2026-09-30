import React, { useState, useEffect } from 'react'

const API_BASE = 'http://localhost:8000/index.php'

export default function UserListPage() {
  const [users, setUsers] = useState([])
  const [filter, setFilter] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    try {
      setLoading(true)
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'list-users' }),
      }).then((r) => r.json())

      if (res?.success && Array.isArray(res.users)) {
        setUsers(res.users.map((x) => ({ id: Number(x.id), name: x.name, username: x.username, role: x.role })))
      }
    } catch (error) {
      console.error('Load users error', error)
    } finally {
      setLoading(false)
    }
  }

  const filtered = users.filter((u) => {
    const matchName = u.name.toLowerCase().includes(filter.toLowerCase()) ||
                      u.username.toLowerCase().includes(filter.toLowerCase())
    const matchRole = !roleFilter || u.role === roleFilter
    return matchName && matchRole
  })

  return (
    <div className="page-shell">
      <div className="page-header">
        <h1>Users</h1>
        <p className="helper">Manage players and volunteers</p>
      </div>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="Search by name or username..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="filter-input"
        />
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Roles</option>
          <option value="admin">Admin</option>
          <option value="volunteer">Volunteer</option>
          <option value="user">User</option>
        </select>
      </div>

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <div className="panel wide-panel">
          <h2>User List</h2>
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Username</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((user) => (
                  <tr key={user.id}>
                    <td className="bold">{user.name}</td>
                    <td>{user.username}</td>
                    <td>
                      <span className="role-badge" style={{ background: user.role === 'admin' ? '#feccb8' : user.role === 'volunteer' ? '#c8d9f4' : '#d1f4d1' }}>
                        {user.role}
                      </span>
                    </td>
                    <td>
                      <button className="small-btn">View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="center">
                    No users found
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
