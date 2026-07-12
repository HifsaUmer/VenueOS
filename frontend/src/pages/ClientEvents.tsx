import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Calendar, MapPin, Users, Sparkles, ChevronRight, Plus } from 'lucide-react';
import api from '../services/api';

export default function ClientEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchEvents();
  }, []);

  if (loading) {
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
        <button className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5">
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