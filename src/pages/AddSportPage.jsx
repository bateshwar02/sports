import React, { useState } from 'react'

export default function AddSportPage({ addToast }) {
  const [form, setForm] = useState({ name: '', description: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) {
      addToast?.('Please enter a sport name')
      return
    }
    setLoading(true)
    try {
      const res = await fetch('/index.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create-game', name: form.name, description: form.description })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        addToast?.('Sport created')
        setForm({ name: '', description: '' })
      } else {
        addToast?.(data.error || 'Failed to create sport')
      }
    } catch (err) {
      addToast?.('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-shell">
      <div className="landing-container auth-layout">
        <aside className="auth-hero-panel">
          <div className="eyebrow">Games</div>
          <h1>Add Sport</h1>
          <p>Create a new sport/event for registrations.</p>
        </aside>

        <main>
          <section className="panel">
            <form onSubmit={handleSubmit} className="stack-form">
              <label>
                Sport Name
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Cricket" />
              </label>

              <label>
                Description
                <textarea rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Optional description" />
              </label>

              <button className="primary-btn" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Create Sport'}
              </button>
            </form>
          </section>
        </main>
      </div>
    </div>
  )
}
