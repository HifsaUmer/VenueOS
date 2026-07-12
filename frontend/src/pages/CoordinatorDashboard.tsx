import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import StatsCard from '../components/StatsCard';
import { Calendar, MapPin, Users, Clock, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../services/api';

export default function CoordinatorDashboard() {
  const [bookings, setBookings] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, spacesRes] = await Promise.all([
          api.get('/bookings'),
          api.get('/spaces'),
        ]);
        setBookings(bookingsRes.data || []);
        setSpaces(spacesRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length;
  const confirmedBookings = bookings.filter(b => b.status === 'CONFIRMED').length;

  return (
    <PageLayout 
      title="Coordinator Dashboard" 
      subtitle="Manage events, spaces, and vendors seamlessly"
      icon={Sparkles}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard label="Total Bookings" value={bookings.length} icon={Calendar} color="blue" />
        <StatsCard label="Total Spaces" value={spaces.length} icon={MapPin} color="purple" />
        <StatsCard label="Pending" value={pendingBookings} icon={Clock} color="orange" />
        <StatsCard label="Confirmed" value={confirmedBookings} icon={CheckCircle} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Bookings</h3>
          {bookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No bookings yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.slice(0, 5).map((booking) => (
                <div key={booking.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-700">{booking.event?.title || 'Event'}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{booking.date}</span>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {booking.status || 'DRAFT'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Spaces Overview</h3>
          {spaces.length === 0 ? (
            <div className="text-center py-8">
              <MapPin className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500">No spaces configured</p>
            </div>
          ) : (
            <div className="space-y-3">
              {spaces.map((space) => (
                <div key={space.id} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <span className="text-sm text-slate-700">{space.name}</span>
                  <span className="text-xs text-slate-500">Capacity: {space.capacity}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        {[
          { title: 'Create Booking', icon: Calendar, color: 'blue' },
          { title: 'Manage Vendors', icon: Users, color: 'purple' },
          { title: 'View Calendar', icon: MapPin, color: 'green' },
        ].map((item, index) => (
          <div 
            key={item.title}
            className="group bg-white/60 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 cursor-pointer animate-fade-in-up"
            style={{ animationDelay: `${400 + index * 100}ms` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 bg-${item.color}-50 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                  <item.icon className={`w-5 h-5 text-${item.color}-600`} />
                </div>
                <span className="font-medium text-slate-700">{item.title}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </PageLayout>
  );
}