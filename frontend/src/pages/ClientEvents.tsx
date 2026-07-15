import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Calendar, Sparkles, ChevronRight, Plus, X, AlignLeft, Info, Receipt, Clock } from 'lucide-react';
import api from '../services/api';

export default function ClientEvents() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    type: 'General',
    description: '',
  });

  // Details Modal State
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('/events');
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.type) return;

    try {
      setIsSubmitting(true);
      
      await api.post('/events', {
        title: formData.title,
        type: formData.type,
        description: formData.description || undefined,
      });

      setFormData({
        title: '',
        type: 'General',
        description: '',
      });
      setIsCreateModalOpen(false);
      await fetchEvents();
    } catch (error) {
      console.error('Failed to create event:', error);
      alert('An error occurred while creating the event. Please verify your backend server is running.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading your events...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      title="My Events"
      subtitle="View and manage all your events"
      icon={Sparkles}
      actions={
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Event
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No Events Yet</h3>
            <p className="text-slate-500 text-sm mt-1">Start planning your first event</p>
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
            >
              Create Your First Event
            </button>
          </div>
        ) : (
          events.map((event: any, index) => (
            <div 
              key={event.id}
              className="group bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                  event.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                  event.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {event.status || 'DRAFT'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-slate-600 min-h-[60px]">
                {event.description ? (
                  <p className="line-clamp-3 text-slate-500 italic">
                    "{event.description}"
                  </p>
                ) : (
                  <p className="text-slate-400 italic">No description provided.</p>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg">
                  {event.type || 'General'}
                </span>
                <button 
                  onClick={() => setSelectedEvent(event)} // Set current event to trigger the modal
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

      {/* 1. CREATE EVENT MODAL POPUP */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={() => setIsCreateModalOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg mx-4 p-6 overflow-hidden animate-fade-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-slate-900">Create New Event</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g. Annual Tech Symposium"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Type *</label>
                <select
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                >
                  <option value="General">General</option>
                  <option value="Conference">Conference</option>
                  <option value="Wedding">Wedding</option>
                  <option value="Party">Party</option>
                  <option value="Corporate">Corporate</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your event details or special instructions..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={isSubmitting} className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-sm font-medium shadow-md disabled:opacity-50 transition-all">
                  {isSubmitting ? 'Creating...' : 'Create Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. VIEW DETAILS MODAL POPUP */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop overlay */}
          <div 
            className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          />
          
          {/* Modal Container */}
          <div className="relative bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-lg mx-4 overflow-hidden animate-fade-in flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Event Specification</h3>
                  <p className="text-xs text-slate-400">Database ID: {selectedEvent.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body (Scrollable) */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Event Main details */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-md">
                    {selectedEvent.type}
                  </span>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                    selectedEvent.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                    selectedEvent.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-slate-100 text-slate-700'
                  }`}>
                    {selectedEvent.status || 'DRAFT'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{selectedEvent.title}</h2>
              </div>

              {/* Description box */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Description</h4>
                <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                  {selectedEvent.description || "No description provided for this event concept."}
                </p>
              </div>

              {/* Connected Metadata Subsections */}
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-100 rounded-xl p-4 flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs text-slate-400 font-medium">Timelines</h5>
                    <p className="text-sm font-semibold text-slate-800">
                      {selectedEvent.timelines?.length || 0} Scheduled
                    </p>
                  </div>
                </div>

                <div className="border border-slate-100 rounded-xl p-4 flex items-center gap-3">
                  <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                    <Receipt className="w-4 h-4" />
                  </div>
                  <div>
                    <h5 className="text-xs text-slate-400 font-medium">Invoices</h5>
                    <p className="text-sm font-semibold text-slate-800">
                      {selectedEvent.invoices?.length || 0} Generated
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}