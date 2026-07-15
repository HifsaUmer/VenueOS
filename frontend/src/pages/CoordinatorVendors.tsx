import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Plus, Search, Star, Phone, Mail, Sparkles, ChevronRight, X, MapPin, FileText } from 'lucide-react';
import api from '../services/api';

interface VendorData {
  id: string;
  name: string;
  category: string;
  email: string;
  phone: string;
  address?: string;
  description?: string;
  rating?: number;
}

export default function CoordinatorVendors() {
  const [vendors, setVendors] = useState<VendorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal Control States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Active Target Selection
  const [selectedVendor, setSelectedVendor] = useState<VendorData | null>(null);

  // Form State for Creating a Vendor
  const [formData, setFormData] = useState({
    name: '',
    category: 'Catering',
    email: '',
    phone: '',
    address: '',
    description: '',
    rating: 0,
  });

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

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        email: formData.email,
        phone: formData.phone,
        address: formData.address || undefined,
        description: formData.description || undefined,
        rating: formData.rating ? Number(formData.rating) : 0,
      };

      await api.post('/vendors', payload);

      setIsAddOpen(false);
      setFormData({ name: '', category: 'Catering', email: '', phone: '', address: '', description: '', rating: 0 });
      fetchVendors();
    } catch (error: any) {
      console.error('Failed to create vendor:', error);
      alert(`Error creating vendor: ${error.response?.data?.message || 'Check network configurations.'}`);
    }
  };

  const handleUpdateRating = async (vendorId: string, newRating: number) => {
    try {
      await api.patch(`/vendors/${vendorId}/rate`, { rating: newRating });
      
      // Sync local updates safely
      if (selectedVendor && selectedVendor.id === vendorId) {
        setSelectedVendor({ ...selectedVendor, rating: newRating });
      }
      setVendors(prev => prev.map(v => v.id === vendorId ? { ...v, rating: newRating } : v));
    } catch (error) {
      console.error('Failed to update rating:', error);
    }
  };

  const handleOpenDetails = (vendor: VendorData) => {
    setSelectedVendor(vendor);
    setIsDetailsOpen(true);
  };

  // Safe lower-case filtering tracking logic
  const filteredVendors = vendors.filter(vendor => 
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      subtitle="Manage preferred vendors and partnership directories"
      icon={Sparkles}
      actions={
        <button 
          onClick={() => setIsAddOpen(true)}
          className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
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
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vendors by name or category..."
            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVendors.length === 0 ? (
          <div className="col-span-full bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-12 text-center">
            <Star className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No Vendors Found</h3>
            <p className="text-slate-500 text-sm mt-1 font-normal">Start configuring preferred vendors to display them here</p>
          </div>
        ) : (
          filteredVendors.map((vendor, index) => (
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
                  <span className="text-xs font-medium text-amber-600">{vendor.rating || '0'}</span>
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
                <button 
                  onClick={() => handleOpenDetails(vendor)}
                  className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
                >
                  View Details
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ADD VENDOR MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 relative">
            <button onClick={() => setIsAddOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Add Partner Vendor</h3>
            
            <form onSubmit={handleAddVendor} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Company Name</label>
                  <input 
                    type="text" required value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Grand Feast Catering"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm bg-white"
                  >
                    <option value="Catering">Catering</option>
                    <option value="Florist">Florist</option>
                    <option value="Photographer">Photographer</option>
                    <option value="AV">Audio / Visual</option>
                    <option value="Decorations">Decorations</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Email Address</label>
                <input 
                  type="email" required value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="contact@vendor.com"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Phone Number</label>
                <input 
                  type="text" required value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="e.g. +923001234567"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Address (Optional)</label>
                <input 
                  type="text" value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Office layout address details..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Description</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Services provided, operational details, package details..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm h-20 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Initial Rating (0 - 5)</label>
                <input 
                  type="number" min="0" max="5" step="0.1" value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED MODAL VIEW */}
      {isDetailsOpen && selectedVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 relative">
            <button onClick={() => { setIsDetailsOpen(false); setSelectedVendor(null); }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-blue-50 text-blue-700">
                {selectedVendor.category}
              </span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-4">{selectedVendor.name}</h3>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span>{selectedVendor.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-700">
                <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="break-all">{selectedVendor.email}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <span>{selectedVendor.address || 'No physical directory address specified.'}</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-slate-700">
                <FileText className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex-1 max-h-24 overflow-y-auto text-xs whitespace-pre-wrap">
                  {selectedVendor.description || 'No detailed service logs configured.'}
                </p>
              </div>

              {/* RATING ADJUSTMENT PANEL */}
              <div className="pt-2 border-t border-slate-100">
                <span className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Update Directory Rating: ({selectedVendor.rating || 0} / 5)
                </span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <button
                      type="button"
                      key={starValue}
                      onClick={() => handleUpdateRating(selectedVendor.id, starValue)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star 
                        className={`w-6 h-6 ${
                          starValue <= Math.round(selectedVendor.rating || 0) 
                            ? 'fill-amber-400 text-amber-400' 
                            : 'text-slate-200'
                        }`} 
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button 
                type="button" 
                onClick={() => { setIsDetailsOpen(false); setSelectedVendor(null); }}
                className="px-5 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}