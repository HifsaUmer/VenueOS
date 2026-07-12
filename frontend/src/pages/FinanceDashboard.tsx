import Navbar from '../components/Navbar'

export default function FinanceDashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="dashboard" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Finance Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-gray-600 text-sm mb-1">Total Revenue (YTD)</p>
            <p className="text-3xl font-bold text-gray-900">$450,000</p>
            <p className="text-green-600 text-sm mt-1">+12% from last year</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-gray-600 text-sm mb-1">Outstanding Invoices</p>
            <p className="text-3xl font-bold text-yellow-600">$85,000</p>
            <p className="text-gray-600 text-sm mt-1">12 invoices</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-gray-600 text-sm mb-1">Paid This Month</p>
            <p className="text-3xl font-bold text-blue-600">$67,500</p>
            <p className="text-green-600 text-sm mt-1">+8% from last month</p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <p className="text-gray-600 text-sm mb-1">Overdue</p>
            <p className="text-3xl font-bold text-red-600">$12,000</p>
            <p className="text-red-600 text-sm mt-1">4 invoices</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="font-medium">Invoice #INV-2025-015 paid</p>
                <p className="text-sm text-gray-600">Corporate Conference - $8,500</p>
              </div>
              <span className="text-green-600 text-sm font-medium">Today</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="font-medium">Invoice #INV-2025-014 sent</p>
                <p className="text-sm text-gray-600">Wedding - $15,000</p>
              </div>
              <span className="text-gray-600 text-sm">Yesterday</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
