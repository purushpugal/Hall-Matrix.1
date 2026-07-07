import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading…</span>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/" replace />
  if (role) {
    const allowedRoles = Array.isArray(role) ? role : [role]
    if (allowedRoles.includes('college_admin')) {
      allowedRoles.push('admin_employee')
    }
    if (!allowedRoles.includes(user.role)) return <Navigate to="/" replace />
  }

  return children
}
