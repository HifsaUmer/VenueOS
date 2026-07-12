import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function CoordinatorDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="dashboard" />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Coordinator Dashboard</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Enquiries</h3>
            <p className="text-3xl font-bold text-blue-600">0</p>
            <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">View all →</Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Upcoming Events</h3>
            <p className="text-3xl font-bold text-yellow-600">0</p>
            <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">View calendar →</Link>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-medium mb-2">Active Bookings</h3>
            <p className="text-3xl font-bold text-green-600">0</p>
            <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">Manage bookings →</Link>
          </div>
        </div>
      </main>
    </div>
  )
}
