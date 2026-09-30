import React, { useState } from 'react'

export default function LoginPage({ loginForm, setLoginForm, handleLogin, errors, addToast }) {
  return (
    <div className="page-shell auth-page-shell">
      <div className="landing-container auth-layout">
        <div className="auth-hero-panel">
          <div className="eyebrow">Welcome back</div>
          <h1>Access your dashboard</h1>
          <p>
            Sign in to manage games, registrations, volunteers, and awards from one unified sports management system.
          </p>

          <div className="mini-info-grid">
            <div>
              <strong>Admin</strong>
              <span>Full control</span>
            </div>
            <div>
              <strong>Volunteer</strong>
              <span>Entry management</span>
            </div>
            <div>
              <strong>User</strong>
              <span>Player access</span>
            </div>
          </div>
        </div>

        <div className="auth-card register-card">
          <span className="eyebrow">Login</span>
          <h2>Sign in</h2>

          <form onSubmit={handleLogin} className="stack-form">
            <label>
              Role
              <select
                value={loginForm.role}
                onChange={(e) => setLoginForm({ ...loginForm, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="volunteer">Volunteer</option>
                <option value="user">User</option>
              </select>
            </label>

            <label>
              Username
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                placeholder="Enter username"
                className={errors.login?.username ? 'input-invalid' : ''}
              />
              {errors.login?.username && <span className="field-error">{errors.login.username}</span>}
            </label>

            <label>
              Password
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter password"
                className={errors.login?.password ? 'input-invalid' : ''}
              />
              {errors.login?.password && <span className="field-error">{errors.login.password}</span>}
            </label>

            {errors.login?.general && <span className="field-error">{errors.login.general}</span>}

            <button className="primary-btn" type="submit">
              Login
            </button>
          </form>

          <div className="demo-box">
            <strong>Demo Accounts</strong>
            <p>Admin: admin / admin123</p>
            <p>Volunteer: volunteer / vol123</p>
            <p>User: user / user123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
