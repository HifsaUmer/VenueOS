import Navbar from '../components/Navbar'

const mockProposals = [
  {
    id: 1,
    eventName: 'John & Jane Wedding',
    sentDate: '2025-10-02',
    status: 'Accepted',
    total: '$15,000'
  },
  {
    id: 2,
    eventName: 'Birthday Party',
    sentDate: '2025-09-20',
    status: 'Pending',
    total: '$3,500'
  }
]

export default function ClientProposals() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="proposals" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Proposals</h2>
        <div className="space-y-4">
          {mockProposals.map((proposal) => (
            <div key={proposal.id} className="bg-white rounded-xl shadow-sm border p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{proposal.eventName}</h3>
                <p className="text-gray-600">Sent: {proposal.sentDate}</p>
                <p className="text-gray-800 font-semibold mt-1">{proposal.total}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full
                  ${proposal.status === 'Accepted' ? 'bg-green-100 text-green-800' : 
                    'bg-yellow-100 text-yellow-800'
                  }`}
                >
                  {proposal.status}
                </span>
                <button className="text-blue-600 hover:underline">View</button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
