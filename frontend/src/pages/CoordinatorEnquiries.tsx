import { useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Sparkles, MessageSquare, Plus, Eye, Edit } from 'lucide-react';

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
];

export default function CoordinatorEnquiries() {
  const [enquiries] = useState(mockEnquiries);
  const [filter, setFilter] = useState('All');

  const filteredEnquiries = filter === 'All' 
    ? enquiries 
    : enquiries.filter(e => e.status === filter);

  return (
    <PageLayout
      title="Enquiries"
      subtitle="Review incoming customer event enquiries and coordinate proposals"
      icon={MessageSquare}
      actions={
        <div className="flex items-center gap-3">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Received">Received</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Proposal Accepted">Proposal Accepted</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300">
            <Plus className="w-4 h-4" />
            New Enquiry
          </button>
        </div>
      }
    >
      <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Event Type</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-transparent">
              {filteredEnquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900">{enquiry.clientName}</div>
                    <div className="text-xs text-slate-500">{enquiry.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{enquiry.eventType}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{enquiry.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{enquiry.guests}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                      enquiry.status === 'Received' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : 
                      enquiry.status === 'Proposal Sent' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                      'bg-green-50 text-green-700 border border-green-100'
                    }`}>
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-3">
                    <button className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors">
                      <Eye className="w-4 h-4" /> View
                    </button>
                    <button className="flex items-center gap-1 text-slate-600 hover:text-slate-800 font-medium transition-colors">
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  );
}