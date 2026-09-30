import { useEffect } from 'react'

export default function Toasts({ toasts = [], removeToast }) {
  useEffect(() => {
    // auto-dismiss toasts after 4s
    const timers = toasts.map((t) =>
      setTimeout(() => {
        removeToast(t.id)
      }, 4000),
    )

    return () => timers.forEach((t) => clearTimeout(t))
  }, [toasts])

  if (!toasts.length) return null

  return (
    <div className="toast-wrap" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`toast ${t.type || 'info'}`}>
          <div className="toast-body">{t.message}</div>
        </div>
      ))}
    </div>
  )
}
