import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth()

  if (!isAuthenticated || !user?.is_admin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminRoute