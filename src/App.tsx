import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/auth-context'
import ProtectedRoute from './components/protected-route'

import SidebarComponent from './components/sidebar-component'
import AccountPage from './pages/accounts-page'
import ContactPage from './pages/contact-page'
import UpdateAccounts from './components/accounts/update-accounts'
import UpdateContacts from './components/contacts/update-contacts'
import NotFoundPage from './pages/not-found-page'
import { SignInPage } from './pages/signin-page'
import { Toaster } from './components/ui/sonner'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Navigate to='/login' replace />} />
          <Route path='/login' element={<SignInPage />} />

          <Route
            element={
              <ProtectedRoute>
                <SidebarComponent />
              </ProtectedRoute>
            }
          >
            <Route path='/accounts' element={<AccountPage />} />
            <Route path='/accounts/:id' element={<UpdateAccounts />} />

            <Route path='/contacts' element={<ContactPage />} />
            <Route path='/contacts/:id' element={<UpdateContacts />} />

            <Route path='*' element={<NotFoundPage />} />
          </Route>
        </Routes>

        <Toaster richColors position='top-right' />
      </BrowserRouter>
    </AuthProvider>
  )
}
