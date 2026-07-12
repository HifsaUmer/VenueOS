import Navbar from '../components/Navbar'

const mockTimeline = [
  { id: 1, time: '09:00', task: 'Set up tables and chairs', assignee: 'Operations', status: 'Pending' },
  { id: 2, time: '10:00', task: 'Arrive and set up AV equipment', assignee: 'AV Team', status: 'Pending' },
  { id: 3, time: '12:00', task: 'Catering setup', assignee: 'Catering', status: 'Pending' },
  { id: 4, time: '14:00', task: 'Guest arrival', assignee: '-', status: 'Pending' },
  { id: 5, time: '18:00', task: 'Reception starts', assignee: '-', status: 'Pending' },
  { id: 6, time: '22:00', task: 'Cleanup', assignee: 'Operations', status: 'Pending' }
]

export default function CoordinatorTimeline() {
  const timeline = mockTimeline

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="timeline" />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Event Timeline Planner</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + Add Task
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="relative">
            {/* Vertical timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {timeline.map((item) => (
                <div key={item.id} className="flex items-start gap-6">
                  <div className="relative z-10 flex-shrink-0 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center border-4 border-white">
                    <span className="text-sm font-semibold text-blue-700">{item.time}</span>
                  </div>
                  
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-gray-900">{item.task}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full
                        ${item.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          item.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">Assigned to: {item.assignee}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
