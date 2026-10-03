import { Navigate, useLocation } from 'react-router-dom'
import { api } from '../services/api'

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const location = useLocation()
  const user = api.getCurrentUser();


  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to user's assigned dashboard
    return <Navigate to={`/${user.role}/dashboard`} replace />
  }

  return children
}
