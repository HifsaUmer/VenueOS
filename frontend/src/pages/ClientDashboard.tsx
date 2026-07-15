import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Import useNavigate
import PageLayout from '../components/PageLayout';
import StatsCard from '../components/StatsCard';
import { Calendar, FileText, CreditCard, Bell, Sparkles, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import api from '../services/api';

export default function ClientDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate(); // 2. Initialize useNavigate
  const [events, setEvents] = useState<any[]>([]);
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

  // 3. Define the quick action mapping using your App.tsx routes
  const quickActions = [
    { label: 'Book a Venue / Event', icon: Calendar, path: '/client/events' }, // Typically events route
    { label: 'View Proposals', icon: FileText, path: '/client/proposals' },
    { label: 'Pay Invoices', icon: CreditCard, path: '/client/invoices' },
  ];

  // 4. Temporary placeholder action for event creation
  const handleCreateEventClick = () => {
    // Once you share ClientEvents.tsx or let me know if a modal is used, 
    // we can update this handler to open a modal or navigate to a form page.
    navigate('/client/events'); 
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout 
      title={`Welcome back, ${user?.fullName || 'Client'}!`}
      subtitle="Here's your event summary and updates"
      icon={Sparkles}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard label="Total Events" value={events.length} icon={Calendar} color="blue" />
        <StatsCard label="Active Bookings" value="0" icon={Calendar} color="green" />
        <StatsCard label="Invoices" value="0" icon={FileText} color="purple" />
        <StatsCard label="Notifications" value="0" icon={Bell} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Your Events List / State */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Events</h3>
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No events yet</p>
              <button 
                onClick={handleCreateEventClick} // Hooked up the click handler
                className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
              >
                Create Your First Event
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-medium text-slate-900">{event.title}</p>
                    <p className="text-sm text-slate-500">{event.type}</p>
                  </div>
                  <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                    {event.status || 'Active'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {quickActions.map((action) => (
              <button 
                key={action.label} 
                onClick={() => navigate(action.path)} // Configured navigation handler here
                className="w-full flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-100 rounded-xl transition-all group"
              >
                <span className="flex items-center gap-3 text-slate-700">
                  <action.icon className="w-4 h-4 text-slate-400" />
                  {action.label}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}