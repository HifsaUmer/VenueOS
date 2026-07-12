import Navbar from '../components/Navbar'

const mockEvents = [
  {
    id: 1,
    name: 'John & Jane Wedding',
    date: '2025-12-15',
    venue: 'Grand Ballroom',
    status: 'Confirmed'
  },
  {
    id: 2,
    name: 'Corporate Annual Meeting',
    date: '2025-11-20',
    venue: 'Conference Hall A',
    status: 'Proposal Accepted'
  }
]

export default function ClientEvents() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="events" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">My Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockEvents.map((event) => (
            <div key={event.id} className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="text-lg font-medium mb-2">{event.name}</h3>
              <p className="text-gray-600 mb-1">{event.date}</p>
              <p className="text-gray-600 mb-4">{event.venue}</p>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full
                ${event.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 
                  'bg-yellow-100 text-yellow-800'
                }`}
              >
                {event.status}
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
