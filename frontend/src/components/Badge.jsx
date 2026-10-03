
export default function Badge({ status, text }) {
  const s = String(status || '').toLowerCase()
  let className = 'badge-pill'
  let label = text || status

  if (s === 'approved') {
    className += ' badge-approved'
    label = label || 'स्वीकृत (Approved)'
  } else if (s === 'pending') {
    className += ' badge-pending'
    label = label || 'लंबित (Pending)'
  } else if (s === 'rejected') {
    className += ' badge-rejected'
    label = label || 'अस्वीकृत (Rejected)'
  } else if (s === 'active') {
    className += ' badge-active'
    label = label || 'सक्रिय (Active)'
  } else if (s === 'inactive') {
    className += ' badge-inactive'
    label = label || 'निष्क्रिय (Inactive)'
  } else {
    className += ' badge-inactive'
  }

  return <span className={className}>{label}</span>
}
