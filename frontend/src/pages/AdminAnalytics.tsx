import Navbar from '../components/Navbar'

export default function AdminAnalytics() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="analytics" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Analytics Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">Revenue Overview</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Revenue Chart Placeholder</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">Event Bookings</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Bookings Chart Placeholder</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">Space Utilization</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Utilization Chart Placeholder</p>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">User Growth</h3>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">User Growth Chart Placeholder</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
