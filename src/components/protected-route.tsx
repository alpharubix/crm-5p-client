import { useAuth } from '@/context/auth-context'
import { Navigate, Outlet, useLocation } from 'react-router-dom'


export default function ProtectedRoute({ children }: any) {
  const { user, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) return null

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (location.pathname === "/" || location.pathname === "/login") {
    return <Navigate to="/accounts" replace />
  }

  return children ? <>{children}</> : <Outlet />
}
