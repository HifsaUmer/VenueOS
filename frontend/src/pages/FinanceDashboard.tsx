import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import StatsCard from '../components/StatsCard';
import { DollarSign, FileText, CreditCard, TrendingUp, Sparkles, ArrowUpRight, Clock, ChevronRight } from 'lucide-react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function FinanceDashboard() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + (inv.total || 0), 0);
  const paidInvoices = invoices.filter((inv: any) => inv.status === 'PAID').length;
  const pendingInvoices = invoices.filter((inv: any) => inv.status === 'PENDING').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading financial data...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout 
      title="Finance Dashboard" 
      subtitle="Track revenue, invoices, and payments in real-time"
      icon={Sparkles}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard label="Total Revenue" value={`$${totalRevenue.toLocaleString()}`} icon={DollarSign} color="green" />
        <StatsCard label="Total Invoices" value={invoices.length} icon={FileText} color="blue" />
        <StatsCard label="Paid" value={paidInvoices} icon={CreditCard} color="purple" />
        <StatsCard label="Pending" value={pendingInvoices} icon={Clock} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Recent Invoices</h3>
            <span className="text-xs text-slate-400">Last 5</span>
          </div>
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No invoices yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.slice(0, 5).map((invoice: any) => (
                <div key={invoice.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900 text-sm">#{invoice.invoiceNumber || invoice.id.slice(0, 8)}</p>
                    <p className="text-xs text-slate-500">{invoice.client?.fullName || invoice.client?.name || 'N/A'}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-900">${invoice.total?.toLocaleString() || '0'}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      invoice.status === 'PAID' ? 'bg-green-100 text-green-700' :
                      invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {invoice.status || 'DRAFT'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Financial Summary</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-green-50/50 to-green-100/30 rounded-xl">
              <span className="text-sm text-slate-600">Total Collected</span>
              <span className="text-lg font-bold text-green-600">${totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50/50 to-yellow-100/30 rounded-xl">
              <span className="text-sm text-slate-600">Pending Amount</span>
              <span className="text-lg font-bold text-yellow-600">
                ${invoices.filter((inv: any) => inv.status === 'PENDING').reduce((sum: number, inv: any) => sum + (inv.total || 0), 0).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50/50 to-blue-100/30 rounded-xl">
              <span className="text-sm text-slate-600">Average Invoice</span>
              <span className="text-lg font-bold text-blue-600">
                ${invoices.length > 0 ? (totalRevenue / invoices.length).toFixed(0) : '0'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div 
          onClick={() => alert('Generate Report clicked')}
          className="group bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Generate Report</p>
              <p className="text-lg font-semibold mt-1">Monthly Financial Report</p>
            </div>
            <ArrowUpRight className="w-6 h-6 text-white/70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
          </div>
        </div>
        <div 
          onClick={() => navigate('/finance/invoices')}
          className="group bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Quick Action</p>
              <p className="text-lg font-semibold text-slate-900 mt-1">View All Invoices</p>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </PageLayout>
  );
}