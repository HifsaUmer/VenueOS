import Navbar from '../components/Navbar'

const mockInvoices = [
  { id: 'INV-2025-015', client: 'Acme Corp', event: 'Corporate Conference', amount: 8500, status: 'Paid', date: '2025-07-10' },
  { id: 'INV-2025-014', client: 'Smith Family', event: 'Wedding', amount: 15000, status: 'Pending', date: '2025-07-08' },
  { id: 'INV-2025-013', client: 'Tech Startups Inc', event: 'Product Launch', amount: 12000, status: 'Overdue', date: '2025-06-25' },
  { id: 'INV-2025-012', client: 'Local Community', event: 'Annual Gala', amount: 5000, status: 'Paid', date: '2025-06-20' },
]

export default function FinanceInvoices() {
  const invoices = mockInvoices

  const handleGeneratePDF = (invoiceId: string) => {
    alert(`Generating PDF for ${invoiceId}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="invoices" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Invoices</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + Create Invoice
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Invoice #</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Client</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Event</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{invoice.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{invoice.client}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{invoice.event}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">${invoice.amount.toLocaleString()}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full
                      ${invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 
                        invoice.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{invoice.date}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleGeneratePDF(invoice.id)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-4"
                    >
                      Download PDF
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm font-medium">
                      Send
                    </button>
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
