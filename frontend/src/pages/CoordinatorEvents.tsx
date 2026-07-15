import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Plus, Search, Filter, Calendar, MapPin, Users, ChevronRight, Sparkles, X } from 'lucide-react';
import api from '../services/api';

interface EventData {
  id: string;
  title: string;
  description?: string;
  status: string;
  date?: string;
  location?: string;
  guestCount?: number;
  type?: string;
}

export default function CoordinatorEvents() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(true);

  // States for Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventData | null>(null);

  // Form State for creating a new Event
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'General',
  });

  const fetchEvents = async () => {
    try {
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

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Sent exactly what CreateEventDto expects in the body payload without clientId
      const payload = {
        title: formData.title,
        description: formData.description || '',
        type: formData.type,
      };

      await api.post('/events', payload);
      
      setIsCreateOpen(false);
      setFormData({ title: '', description: '', type: 'General' });
      fetchEvents(); 
    } catch (error: any) {
      console.error('Failed to create event:', error);
      alert(`Error creating event: ${error.response?.data?.message || 'Check network panel.'}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Events"
      subtitle="Manage all active events across the venue"
      icon={Sparkles}
      actions={
        <button 
          onClick={() => setIsCreateOpen(true)}
          className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Event
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
            placeholder="Search events by name, type, or date..."
            className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl hover:shadow-md transition-all">
          <Filter className="w-4 h-4 text-slate-500" />
          <span className="text-sm text-slate-600">Filter</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {events.length === 0 ? (
          <div className="col-span-full bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No Events Found</h3>
            <p className="text-slate-500 text-sm mt-1 font-normal">Active client bookings will show up here</p>
          </div>
        ) : (
          events.map((event, index) => (
            <div 
              key={event.id}
              className="group bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  event.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                  event.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                  event.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {event.status || 'DRAFT'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm text-slate-600">
                <p className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {event.date || 'TBD'}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  {event.location || 'TBD'}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-400" />
                  {event.guestCount || 0} guests
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">{event.type || 'General'}</span>
                <button 
                  onClick={() => setSelectedEvent(event)}
                  className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors group"
                >
                  View Details
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE EVENT MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden p-6 relative">
            <button onClick={() => setIsCreateOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold text-slate-900 mb-4">Create New Event</h3>
            
            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Event Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Annual Tech Symposium"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Description (Optional)</label>
                <textarea 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of the event plans..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all h-24 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Event Type</label>
                <input 
                  type="text" 
                  required
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  placeholder="e.g. Conference, Wedding, Exhibition"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
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
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EVENT DETAILS MODAL */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden p-6 relative">
            <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-2 mb-2">
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                selectedEvent.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                selectedEvent.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                selectedEvent.status === 'COMPLETED' ? 'bg-blue-100 text-blue-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {selectedEvent.status || 'DRAFT'}
              </span>
              <span className="text-xs text-slate-400">ID: {selectedEvent.id}</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-900 mb-2">{selectedEvent.title}</h3>
            <p className="text-sm text-slate-500 mb-6">{selectedEvent.description || 'No description provided for this event.'}</p>
            
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl mb-6">
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase">Type</span>
                <span className="text-sm font-semibold text-slate-700">{selectedEvent.type || 'General'}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase">Attendees</span>
                <span className="text-sm font-semibold text-slate-700">{selectedEvent.guestCount || 0} Guests</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase">Scheduled Date</span>
                <span className="text-sm font-semibold text-slate-700">{selectedEvent.date || 'To Be Decided'}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-slate-400 uppercase">Location</span>
                <span className="text-sm font-semibold text-slate-700">{selectedEvent.location || 'To Be Decided'}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button 
                onClick={() => setSelectedEvent(null)}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all"
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