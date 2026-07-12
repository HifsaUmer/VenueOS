import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

interface NavbarProps {
  activePage?: string
}

export default function Navbar({ activePage }: NavbarProps) {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const isClient = user?.role === 'CLIENT'
  const isCoordinator = user?.role === 'COORDINATOR'
  const isAdmin = user?.role === 'ADMIN'
  const isOperations = user?.role === 'OPERATIONS'
  const isFinance = user?.role === 'FINANCE'

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold text-gray-800">
            VenueOS
          </Link>
          
          {isClient && (
            <nav className="hidden md:flex gap-4">
              <Link 
                to="/client" 
                className={`px-3 py-2 rounded-lg ${activePage === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/client/events" 
                className={`px-3 py-2 rounded-lg ${activePage === 'events' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                My Events
              </Link>
              <Link 
                to="/client/proposals" 
                className={`px-3 py-2 rounded-lg ${activePage === 'proposals' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Proposals
              </Link>
              <Link 
                to="/client/invoices" 
                className={`px-3 py-2 rounded-lg ${activePage === 'invoices' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Invoices
              </Link>
            </nav>
          )}

          {isCoordinator && (
            <nav className="hidden md:flex gap-4">
              <Link 
                to="/coordinator" 
                className={`px-3 py-2 rounded-lg ${activePage === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/coordinator/enquiries" 
                className={`px-3 py-2 rounded-lg ${activePage === 'enquiries' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Enquiries
              </Link>
              <Link 
                to="/coordinator/events" 
                className={`px-3 py-2 rounded-lg ${activePage === 'events' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Events
              </Link>
              <Link 
                to="/coordinator/timeline" 
                className={`px-3 py-2 rounded-lg ${activePage === 'timeline' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Timeline Planner
              </Link>
              <Link 
                to="/coordinator/vendors" 
                className={`px-3 py-2 rounded-lg ${activePage === 'vendors' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Vendors
              </Link>
              <Link 
                to="/coordinator/calendar" 
                className={`px-3 py-2 rounded-lg ${activePage === 'calendar' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Calendar
              </Link>
            </nav>
          )}

          {isAdmin && (
            <nav className="hidden md:flex gap-4">
              <Link 
                to="/admin" 
                className={`px-3 py-2 rounded-lg ${activePage === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/analytics" 
                className={`px-3 py-2 rounded-lg ${activePage === 'analytics' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Analytics
              </Link>
              <Link 
                to="/admin/users" 
                className={`px-3 py-2 rounded-lg ${activePage === 'users' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Users
              </Link>
              <Link 
                to="/admin/settings" 
                className={`px-3 py-2 rounded-lg ${activePage === 'settings' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Settings
              </Link>
            </nav>
          )}

          {isOperations && (
            <nav className="hidden md:flex gap-4">
              <Link 
                to="/operations" 
                className={`px-3 py-2 rounded-lg ${activePage === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/operations/tasks" 
                className={`px-3 py-2 rounded-lg ${activePage === 'tasks' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Tasks
              </Link>
              <Link 
                to="/operations/setup" 
                className={`px-3 py-2 rounded-lg ${activePage === 'setup' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Setup Checklists
              </Link>
            </nav>
          )}

          {isFinance && (
            <nav className="hidden md:flex gap-4">
              <Link 
                to="/finance" 
                className={`px-3 py-2 rounded-lg ${activePage === 'dashboard' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/finance/invoices" 
                className={`px-3 py-2 rounded-lg ${activePage === 'invoices' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Invoices
              </Link>
              <Link 
                to="/finance/payments" 
                className={`px-3 py-2 rounded-lg ${activePage === 'payments' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Payments
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-4">
          <span className="text-gray-600 hidden sm:block">
            {user?.name} ({user?.role})
          </span>
          <button
            onClick={handleLogout}
            className="text-red-600 hover:underline"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}
