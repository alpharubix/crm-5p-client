import { useAuth } from '@/context/auth-context'
import { Navigate, Outlet } from 'react-router-dom'

interface ProtectedRouteProps {
  children?: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()

  // Show nothing or a loading spinner while checking auth status
  if (isLoading) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent' />
      </div>
    )
  }

  // If not authenticated, redirect to login
  if (!user) {
    return <Navigate to='/login' replace />
  }

  // If authenticated, render children or Outlet
  return children ? <>{children}</> : <Outlet />
}
