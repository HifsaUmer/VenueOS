import Navbar from '../components/Navbar'

const mockInvoices = [
  {
    id: 1,
    invoiceNumber: 'INV-2025-001',
    eventName: 'John & Jane Wedding',
    date: '2025-10-05',
    amount: '$15,000',
    status: 'Paid'
  },
  {
    id: 2,
    invoiceNumber: 'INV-2025-002',
    eventName: 'Birthday Party',
    date: '2025-09-25',
    amount: '$3,500',
    status: 'Pending'
  }
]

export default function ClientInvoices() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="invoices" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Invoices</h2>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockInvoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">{invoice.invoiceNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{invoice.eventName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{invoice.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700 font-medium">{invoice.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    {invoice.status === 'Pending' && (
                      <button className="text-green-600 hover:text-green-900">Pay</button>
                    )}
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
