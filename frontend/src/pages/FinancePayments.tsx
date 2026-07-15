import Navbar from '../components/Navbar'

const mockPayments = [
  { id: 'PAY-001', invoice: 'INV-2025-015', client: 'Acme Corp', amount: 8500, method: 'Credit Card', date: '2025-07-10', status: 'Completed' },
  { id: 'PAY-002', invoice: 'INV-2025-012', client: 'Local Community', amount: 5000, method: 'Bank Transfer', date: '2025-06-20', status: 'Completed' },
  { id: 'PAY-003', invoice: 'INV-2025-011', client: 'Green Events', amount: 7000, method: 'Check', date: '2025-06-15', status: 'Pending' },
]

export default function FinancePayments() {
  const payments = mockPayments

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="payments" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Payments</h2>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Payment #</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Invoice</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Client</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Method</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{payment.invoice}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{payment.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">${payment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{payment.method}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{payment.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full
                      ${payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
