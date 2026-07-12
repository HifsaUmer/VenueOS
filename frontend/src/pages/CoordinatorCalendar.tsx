import Navbar from '../components/Navbar'

export default function CoordinatorCalendar() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="calendar" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Event Calendar</h2>
        <div className="bg-white rounded-xl shadow-sm border p-8 flex items-center justify-center">
          <div className="text-center text-gray-500">
            <p className="text-xl mb-2">Calendar View</p>
            <p>(Will integrate with Rafay's calendar component later)</p>
          </div>
        </div>
      </main>
    </div>
  )
}
