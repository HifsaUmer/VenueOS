import Navbar from '../components/Navbar'

const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'CLIENT', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'COORDINATOR', status: 'Active' },
  { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'FINANCE', status: 'Active' },
  { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', role: 'OPERATIONS', status: 'Inactive' },
]

export default function AdminUsers() {
  const users = mockUsers

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="users" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Manage Users</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + Add User
          </button>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Name</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Email</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Role</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Status</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{user.role}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full
                      ${user.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-4">
                      Edit
                    </button>
                    <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                      Delete
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
