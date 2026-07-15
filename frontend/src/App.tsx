import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from './components/AuthLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import ClientDashboard from './pages/ClientDashboard'
import ClientEvents from './pages/ClientEvents'
import ClientProposals from './pages/ClientProposals'
import ClientInvoices from './pages/ClientInvoices'
import CoordinatorDashboard from './pages/CoordinatorDashboard'
import CoordinatorEnquiries from './pages/CoordinatorEnquiries'
import CoordinatorEvents from './pages/CoordinatorEvents'
import CoordinatorCalendar from './pages/CoordinatorCalendar'
import CoordinatorTimeline from './pages/CoordinatorTimeline'
import CoordinatorVendors from './pages/CoordinatorVendors'
import FinanceDashboard from './pages/FinanceDashboard'
import FinanceInvoices from './pages/FinanceInvoices'
import FinancePayments from './pages/FinancePayments'
import AdminDashboard from './pages/AdminDashboard'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminUsers from './pages/AdminUsers'
import AdminSettings from './pages/AdminSettings'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuthStore } from './store/authStore'


function App() {
  const { user } = useAuthStore()

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          user ? (
            user.role === 'CLIENT' ? <Navigate to="/client" replace /> :
            user.role === 'ADMIN' ? <Navigate to="/admin" replace /> :
            user.role === 'OPERATIONS' ? <Navigate to="/operations" replace /> :
            user.role === 'FINANCE' ? <Navigate to="/finance" replace /> :
            <Navigate to="/coordinator" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        } />
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          {/* Client Routes */}
          <Route path="/client" element={<ClientDashboard />} />
          <Route path="/client/events" element={<ClientEvents />} />
          <Route path="/client/proposals" element={<ClientProposals />} />
          <Route path="/client/invoices" element={<ClientInvoices />} />
          
          {/* Coordinator Routes */}
          <Route path="/coordinator" element={<CoordinatorDashboard />} />
          <Route path="/coordinator/enquiries" element={<CoordinatorEnquiries />} />
          <Route path="/coordinator/events" element={<CoordinatorEvents />} />
          <Route path="/coordinator/calendar" element={<CoordinatorCalendar />} />
          <Route path="/coordinator/timeline" element={<CoordinatorTimeline />} />
          <Route path="/coordinator/vendors" element={<CoordinatorVendors />} />
          
          {/* Finance Routes */}
          <Route path="/finance" element={<FinanceDashboard />} />
          <Route path="/finance/invoices" element={<FinanceInvoices />} />
          <Route path="/finance/payments" element={<FinancePayments />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
