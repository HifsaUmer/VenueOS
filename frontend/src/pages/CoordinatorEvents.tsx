import Navbar from '../components/Navbar'

const mockEvents = [
  { id: 1, name: 'Wedding - John & Jane', date: '2025-12-15', venue: 'Grand Ballroom', status: 'Confirmed' },
  { id: 2, name: 'Corporate Conference', date: '2025-11-20', venue: 'Conference Hall A', status: 'Confirmed' },
  { id: 3, name: 'Birthday Party', date: '2025-10-30', venue: 'Rooftop Terrace', status: 'Pending' }
]

export default function CoordinatorEvents() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="events" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">All Events</h2>
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockEvents.map((event) => (
                <tr key={event.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{event.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{event.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{event.venue}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${event.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}
                    >
                      {event.status}
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
