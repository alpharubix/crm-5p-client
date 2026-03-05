import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/auth-context'
import ProtectedRoute, { ProtectedLogRoute } from './components/protected-route'
import PublicRoute from './components/public-routes'

import SidebarComponent from './components/sidebar-component'
import AccountPage from './pages/accounts-page'
import ContactPage from './pages/contact-page'
import UpdateAccounts from './components/accounts/update-accounts'
import UpdateContacts from './components/contacts/update-contacts'
import NotFoundPage from './pages/not-found-page'
import { SignInPage } from './pages/signin-page'
import { GlobalProgressBar } from './components/global-progress-bar'
import CreateContact from './components/contacts/create-contact'
import AuditLogs from './components/log/audit-log'
import HoliEffect from './components/holi-effect'
import DealsPage from './pages/deals-page'
import UpdateDeals from './components/deals/update-deals'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <HoliEffect />
        <GlobalProgressBar />
        <Routes>
          <Route element={<PublicRoute />}>
            <Route path='/' element={<Navigate to='/login' replace />} />
            <Route path='/login' element={<SignInPage />} />
          </Route>

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
            <Route path='/contacts-create' element={<CreateContact />} />
            <Route path='/deals' element={<DealsPage />} />
            {/* /deals/:id */}
            <Route path='/update-deals' element={<UpdateDeals />} />

            <Route path='*' element={<NotFoundPage />} />
            <Route element={<ProtectedLogRoute />}>
              <Route path='/audit-logs' element={<AuditLogs />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
