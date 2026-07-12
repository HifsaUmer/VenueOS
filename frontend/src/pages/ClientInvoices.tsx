import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { FileText, Download, Eye, Sparkles, ChevronRight, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function ClientInvoices() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await api.get('/invoices');
        setInvoices(response.data || []);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading invoices...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Invoices"
      subtitle="View and manage your invoices"
      icon={Sparkles}
    >
      <div className="grid grid-cols-1 gap-6">
        {invoices.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-12 text-center">
            <FileText className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No Invoices Yet</h3>
            <p className="text-slate-500 text-sm mt-1">Your invoices will appear here</p>
          </div>
        ) : (
          invoices.map((invoice, index) => (
            <div 
              key={invoice.id}
              className="group bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl">
                    <FileText className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-slate-900">#{invoice.number || invoice.id.slice(0, 8)}</h3>
                    <p className="text-sm text-slate-500">Due: {invoice.dueDate || 'TBD'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-slate-900">${invoice.total?.toLocaleString() || '0'}</span>
                  <span className={`flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
                    invoice.status === 'PAID' ? 'bg-green-100 text-green-700' :
                    invoice.status === 'OVERDUE' ? 'bg-red-100 text-red-700' :
                    'bg-yellow-100 text-yellow-700'
                  }`}>
                    {invoice.status === 'PAID' ? <CheckCircle className="w-3 h-3" /> :
                     invoice.status === 'OVERDUE' ? <AlertCircle className="w-3 h-3" /> :
                     <Clock className="w-3 h-3" />}
                    {invoice.status || 'PENDING'}
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