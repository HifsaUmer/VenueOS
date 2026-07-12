import { useState } from 'react'
import Navbar from '../components/Navbar'

// Mock data for enquiries
const mockEnquiries = [
  {
    id: 1,
    clientName: 'John Doe',
    email: 'john@example.com',
    eventType: 'Wedding',
    date: '2025-12-15',
    guests: 150,
    status: 'Received',
    createdAt: '2025-10-01'
  },
  {
    id: 2,
    clientName: 'Jane Smith',
    email: 'jane@example.com',
    eventType: 'Corporate Conference',
    date: '2025-11-20',
    guests: 80,
    status: 'Proposal Sent',
    createdAt: '2025-09-25'
  },
  {
    id: 3,
    clientName: 'Bob Johnson',
    email: 'bob@example.com',
    eventType: 'Birthday Party',
    date: '2025-10-30',
    guests: 50,
    status: 'Proposal Accepted',
    createdAt: '2025-09-15'
  }
]

export default function CoordinatorEnquiries() {
  const [enquiries] = useState(mockEnquiries)
  const [filter, setFilter] = useState('All')

  const filteredEnquiries = filter === 'All' 
    ? enquiries 
    : enquiries.filter(e => e.status === filter)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="enquiries" />
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Enquiries</h2>
          <div className="flex items-center gap-3">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-2 border rounded-lg"
            >
              <option value="All">All Statuses</option>
              <option value="Received">Received</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Proposal Accepted">Proposal Accepted</option>
            </select>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              + New Enquiry
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredEnquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{enquiry.clientName}</div>
                    <div className="text-sm text-gray-500">{enquiry.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{enquiry.eventType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{enquiry.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{enquiry.guests}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${enquiry.status === 'Received' ? 'bg-yellow-100 text-yellow-800' : 
                        enquiry.status === 'Proposal Sent' ? 'bg-blue-100 text-blue-800' : 
                        'bg-green-100 text-green-800'
                      }`}
                    >
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                    <button className="text-gray-600 hover:text-gray-900">Edit</button>
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
