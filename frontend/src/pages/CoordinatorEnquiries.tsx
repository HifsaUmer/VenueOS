import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { MessageSquare, Plus, Eye, Edit, X } from 'lucide-react';
import api from '../services/api';

interface EnquiryData {
  id: string;
  title: string;
  description?: string;
  briefText?: string;
  status: string;
  client?: {
    name?: string;
    email?: string;
  };
  createdAt?: string;
}

export default function CoordinatorEnquiries() {
  const [enquiries, setEnquiries] = useState<EnquiryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  
  // Modal toggle states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  // Active selected tracking records
  const [selectedEnquiry, setSelectedEnquiry] = useState<EnquiryData | null>(null);
  
  // Form input field states
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    briefText: '',
  });

  const [editFormData, setEditFormData] = useState({
    title: '',
    description: '',
    briefText: '',
  });

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const response = await api.get('/enquiries');
      setEnquiries(response.data || []);
    } catch (error) {
      console.error('Error fetching enquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleCreateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description || undefined,
        briefText: formData.briefText || undefined,
      };

      await api.post('/enquiries', payload);
      
      setIsCreateOpen(false);
      setFormData({ title: '', description: '', briefText: '' });
      fetchEnquiries();
    } catch (error: any) {
      console.error('Failed to create enquiry:', error);
      alert(`Error creating enquiry: ${error.response?.data?.message || 'Check connection.'}`);
    }
  };

  const handleOpenEdit = (enquiry: EnquiryData) => {
    setSelectedEnquiry(enquiry);
    setEditFormData({
      title: enquiry.title,
      description: enquiry.description || '',
      briefText: enquiry.briefText || '',
    });
    setIsEditOpen(true);
  };

  const handleUpdateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;
    try {
      const payload = {
        title: editFormData.title,
        description: editFormData.description || undefined,
        briefText: editFormData.briefText || undefined,
      };

      await api.patch(`/enquiries/${selectedEnquiry.id}`, payload);
      
      setIsEditOpen(false);
      setSelectedEnquiry(null);
      fetchEnquiries();
    } catch (error: any) {
      console.error('Failed to update enquiry:', error);
      alert(`Error updating enquiry: ${error.response?.data?.message || 'Check connection details.'}`);
    }
  };

  const handleOpenView = (enquiry: EnquiryData) => {
    setSelectedEnquiry(enquiry);
    setIsViewOpen(true);
  };

  const filteredEnquiries = filter === 'All' 
    ? enquiries 
    : enquiries.filter(e => e.status === filter.toUpperCase());

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">Loading enquiries...</p>
      </div>
    );
  }

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
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300"
          >
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
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Title / Client</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Brief Context</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-transparent">
              {filteredEnquiries.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center p-8 text-slate-400 text-sm">
                    No enquiries match this configuration.
                  </td>
                </tr>
              ) : (
                filteredEnquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{enquiry.title}</div>
                      <div className="text-xs text-slate-500">
                        {enquiry.client?.name || 'Assigned Client'} ({enquiry.client?.email || 'N/A'})
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-700 max-w-xs truncate">
                      {enquiry.briefText || enquiry.description || 'No summary text listed.'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        enquiry.status === 'RECEIVED' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : 
                        enquiry.status === 'PROPOSAL_SENT' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                        'bg-green-50 text-green-700 border border-green-100'
                      }`}>
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm flex items-center gap-3">
                      <button 
                        onClick={() => handleOpenView(enquiry)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium transition-colors"
                      >
                        <Eye className="w-4 h-4" /> View
                      </button>
                      <button 
                        onClick={() => handleOpenEdit(enquiry)}
                        className="flex items-center gap-1 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                      >
                        <Edit className="w-4 h-4" /> Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 relative">
            <button onClick={() => setIsCreateOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Create New Enquiry</h3>
            
            <form onSubmit={handleCreateEnquiry} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Enquiry Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Wedding Reception Proposal Request"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Brief Summary</label>
                <input 
                  type="text" 
                  value={formData.briefText}
                  onChange={(e) => setFormData({ ...formData, briefText: e.target.value })}
                  placeholder="e.g. 150 guests, setup required"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed layout or requirements description..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all h-24 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                >
                  Save Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DETAILS MODAL */}
      {isViewOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 relative">
            <button onClick={() => { setIsViewOpen(false); setSelectedEnquiry(null); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Enquiry Details</h3>
            <p className="text-xs text-slate-400 mb-4">ID: {selectedEnquiry.id}</p>
            
            <div className="space-y-4">
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Title</span>
                <p className="text-sm font-semibold text-slate-800">{selectedEnquiry.title}</p>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Client Context</span>
                <p className="text-sm font-medium text-slate-800">
                  {selectedEnquiry.client?.name || 'Unknown'} ({selectedEnquiry.client?.email || 'N/A'})
                </p>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Brief Context Summary</span>
                <p className="text-sm text-slate-700">{selectedEnquiry.briefText || 'No summary text listed.'}</p>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Full Detailed Description</span>
                <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {selectedEnquiry.description || 'No long description provided.'}
                </p>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider">Current Pipeline Status</span>
                <span className={`inline-block mt-1 px-2.5 py-1 text-xs font-semibold rounded-full ${
                  selectedEnquiry.status === 'RECEIVED' ? 'bg-yellow-50 text-yellow-700 border border-yellow-100' : 
                  selectedEnquiry.status === 'PROPOSAL_SENT' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 
                  'bg-green-50 text-green-700 border border-green-100'
                }`}>
                  {selectedEnquiry.status}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                type="button" 
                onClick={() => { setIsViewOpen(false); setSelectedEnquiry(null); }}
                className="px-5 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 relative">
            <button onClick={() => { setIsEditOpen(false); setSelectedEnquiry(null); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Edit Enquiry</h3>
            
            <form onSubmit={handleUpdateEnquiry} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Enquiry Title</label>
                <input 
                  type="text" 
                  required
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Brief Summary</label>
                <input 
                  type="text" 
                  value={editFormData.briefText}
                  onChange={(e) => setEditFormData({ ...editFormData, briefText: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Full Description</label>
                <textarea 
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all h-24 resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => { setIsEditOpen(false); setSelectedEnquiry(null); }}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                >
                  Update Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageLayout>
  );
}