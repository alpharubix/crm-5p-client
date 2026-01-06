import { useAuth } from '@/context/auth-context'
import { Navigate, Outlet } from 'react-router-dom'

export default function PublicRoute() {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (user) {
    return <Navigate to='/accounts' replace />
  }

  return <Outlet />
}
