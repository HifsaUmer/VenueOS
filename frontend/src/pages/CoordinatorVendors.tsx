import { useState } from 'react'
import Navbar from '../components/Navbar'

const mockVendors = [
  { id: 1, name: 'ABC Catering', category: 'Catering', contact: 'John (555-1234)', rating: 4.8, status: 'Active' },
  { id: 2, name: 'Perfect Sound AV', category: 'Audio/Visual', contact: 'Sarah (555-5678)', rating: 4.6, status: 'Active' },
  { id: 3, name: 'Blooming Flowers', category: 'Florist', contact: 'Mike (555-9012)', rating: 4.9, status: 'Active' },
  { id: 4, name: 'Capture Moments', category: 'Photography', contact: 'Lisa (555-3456)', rating: 4.7, status: 'Inactive' }
]

export default function CoordinatorVendors() {
  const [vendors] = useState(mockVendors)

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="vendors" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Vendor Coordination</h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            + Add Vendor
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{vendor.name}</h3>
                  <p className="text-sm text-gray-600">{vendor.category}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full
                  ${vendor.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}
                >
                  {vendor.status}
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <p className="text-sm text-gray-700"><span className="font-medium">Contact:</span> {vendor.contact}</p>
                <p className="text-sm text-gray-700"><span className="font-medium">Rating:</span> ⭐ {vendor.rating}/5</p>
              </div>
              
              <div className="flex gap-2">
                <button className="flex-1 text-blue-600 border border-blue-600 px-3 py-2 rounded-lg hover:bg-blue-50">
                  View
                </button>
                <button className="flex-1 text-gray-600 border border-gray-300 px-3 py-2 rounded-lg hover:bg-gray-50">
                  Assign
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
