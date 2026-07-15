import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

export default function ProtectedRoute() {
  const { user, token } = useAuthStore()

  if (!token || !user) {
    return <Navigate to="/login" replace />
  }

  // Optional: Add role-based redirection here
  // For example, if user is a client and tries to access /coordinator, redirect to /client

  return <Outlet />
}
