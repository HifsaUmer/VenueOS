import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { FileText, Download, Eye, Sparkles, ChevronRight, CheckCircle, Clock } from 'lucide-react';
import api from '../services/api';

export default function ClientProposals() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await api.get('/proposals');
        setProposals(response.data || []);
      } catch (error) {
        console.error('Error fetching proposals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading proposals...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Proposals"
      subtitle="Review and manage your event proposals"
      icon={Sparkles}
    >
      <div className="grid grid-cols-1 gap-6">
        {proposals.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No Proposals Yet</h3>
            <p className="text-slate-500 text-sm mt-1">Your proposals will appear here</p>
          </div>
        ) : (
          proposals.map((proposal, index) => (
            <div 
              key={proposal.id}
              className="group bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">{proposal.title}</h3>
                    <p className="text-sm text-slate-500">Event: {proposal.eventType || 'General'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                    proposal.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                    proposal.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {proposal.status === 'APPROVED' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {proposal.status || 'DRAFT'}
                  </span>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                    <Eye className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
                    <Download className="w-4 h-4 text-slate-400" />
                  </button>
                  <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                    View
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
}