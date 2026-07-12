import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Plus, Search, Star, Phone, Mail, Sparkles, ChevronRight } from 'lucide-react';
import api from '../services/api';

export default function CoordinatorVendors() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await api.get('/vendors');
        setVendors(response.data || []);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVendors();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading vendors...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Vendors"
      subtitle="Manage preferred vendors and partnerships"
      icon={Sparkles}
      actions={
        <button className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5">
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Vendor
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
        </button>
      }
    >
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search vendors by name or category..."
            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {vendors.length === 0 ? (
          <div className="col-span-full bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-12 text-center">
            <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No Vendors Found</h3>
            <p className="text-slate-500 text-sm mt-1">Start adding your preferred vendors</p>
          </div>
        ) : (
          vendors.map((vendor, index) => (
            <div 
              key={vendor.id}
              className="group bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {vendor.name}
                  </h3>
                  <p className="text-sm text-slate-500">{vendor.category}</p>
                </div>
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-full">
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                  <span className="text-xs font-medium text-amber-600">{vendor.rating || 'New'}</span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  {vendor.phone || 'N/A'}
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-slate-400" />
                  {vendor.email || 'N/A'}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  vendor.rating && vendor.rating >= 4 ? 'bg-green-100 text-green-700' :
                  vendor.rating && vendor.rating >= 3 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {vendor.rating && vendor.rating >= 4 ? '⭐ Top Rated' :
                   vendor.rating && vendor.rating >= 3 ? 'Good' : 'New'}
                </span>
                <button className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors">
                  View Details
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
}