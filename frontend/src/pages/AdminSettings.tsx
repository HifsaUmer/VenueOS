import Navbar from '../components/Navbar'

export default function AdminSettings() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="settings" />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">System Settings</h2>
        
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">General Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input type="text" defaultValue="VenueOS" className="w-full px-3 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input type="email" defaultValue="contact@venueos.com" className="w-full px-3 py-2 border rounded-lg" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">Notification Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span>Email notifications for new bookings</span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" />
                <span>Email notifications for invoice payments</span>
              </label>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Save Changes
            </button>
            <button className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-200">
              Cancel
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
