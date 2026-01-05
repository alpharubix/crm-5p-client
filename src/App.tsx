// import LeadsPage from './pages/leads-page'
// import EditLeads from '@/components/accounts/edit-leads'
import SidebarComponent from './components/sidebar-component'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import AccountPage from './pages/accounts-page'
import NotFoundPage from './pages/not-found-page'
import ContactPage from './pages/contact-page'
// import DealsPage from './pages/deals-page'
import DeskPage from './pages/desk-page'
import UpdateContacts from './components/contacts/update-contacts'
import UpdateAccounts from './components/accounts/update-accounts'
// import UpdateDeals from './components/deals/update-deals'
import { SignInPage } from './pages/signin-page'
// import { SignUpPage } from './pages/signup-page'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' replace />} />

        <Route path='/login' element={<SignInPage />} />
        {/* <Route path='/signup' element={<SignUpPage />} /> */}

        <Route element={<SidebarComponent />}>
          {/* Leads */}
          {/* <Route path="/leads" element={<LeadsPage />} /> */}
          {/* <Route path="/leads/:id" element={<EditLeads />} /> */}

          {/* Accounts */}
          <Route path='/accounts' element={<AccountPage />} />
          <Route path='/accounts/:id' element={<UpdateAccounts />} />

          {/* Contacts */}
          <Route path='/contacts' element={<ContactPage />} />
          <Route path='/contacts/:id' element={<UpdateContacts />} />

          {/* Deals */}
          {/* <Route path='/deals' element={<DealsPage />} />
          <Route path='/update-deals' element={<UpdateDeals />} /> */}

          {/* 404 Page */}
          <Route path='*' element={<NotFoundPage />} />

          {/* Desk */}
          <Route path='/desk' element={<DeskPage />} />
        </Route>
      </Routes>
      <Toaster richColors position='top-right' />
    </BrowserRouter>
  )
}
