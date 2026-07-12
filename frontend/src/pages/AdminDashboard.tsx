import Navbar from '../components/Navbar'

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="dashboard" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Admin Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-gray-600 text-sm mb-1">Total Users</p>
            <p className="text-3xl font-bold text-gray-900">48</p>
            <p className="text-green-600 text-sm mt-1">+5 this month</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-gray-600 text-sm mb-1">Total Events</p>
            <p className="text-3xl font-bold text-blue-600">120</p>
            <p className="text-green-600 text-sm mt-1">+12 this month</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-gray-600 text-sm mb-1">Active Spaces</p>
            <p className="text-3xl font-bold text-purple-600">8</p>
            <p className="text-gray-600 text-sm mt-1">All operational</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-gray-600 text-sm mb-1">System Health</p>
            <p className="text-3xl font-bold text-green-600">100%</p>
            <p className="text-green-600 text-sm mt-1">All services up</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium">New user registered</p>
                  <p className="text-sm text-gray-600">John Doe (Client)</p>
                </div>
                <span className="text-gray-600 text-sm">2h ago</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <div>
                  <p className="font-medium">Event booked</p>
                  <p className="text-sm text-gray-600">Wedding at Grand Hall</p>
                </div>
                <span className="text-gray-600 text-sm">5h ago</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium">System backup completed</p>
                  <p className="text-sm text-gray-600">Daily backup</p>
                </div>
                <span className="text-gray-600 text-sm">12h ago</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full text-left bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-lg border">
                Manage Users
              </button>
              <button className="w-full text-left bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-lg border">
                View Analytics
              </button>
              <button className="w-full text-left bg-gray-50 hover:bg-gray-100 px-4 py-3 rounded-lg border">
                System Settings
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
