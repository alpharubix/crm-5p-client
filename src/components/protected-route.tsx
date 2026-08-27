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

  const userRole = String(user?.role || '')
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '_')
  const isSuperAdmin =
    ['super_admin', 'superadmin'].includes(userRole) ||
    userRole.includes('super_admin') ||
    userRole.includes('superadmin')

  if (!isSuperAdmin) {
    return <Navigate to='/accounts' replace />
  }

  return children ? <>{children}</> : <Outlet />
}