import { useAuth } from '@/context/auth-context'
import { Navigate, Outlet } from 'react-router-dom'

export default function ProtectedRoute({ children }: any) {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (!user) {
    return <Navigate to='/login' replace />
  }

  return children ? <>{children}</> : <Outlet />
}


export function ProtectedLogRoute({ children }: any) {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (user?.role !== 'super_admin') {
    return <Navigate to='/accounts' replace />
  }

  return children ? <>{children}</> : <Outlet />
}