import { useEffect, useState, useMemo } from 'react';
import PageLayout from '../components/PageLayout';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import api from '../services/api';

interface Booking {
  id: string;
  title: string;
  start: string;
  end: string;
  space: string;
  status: string;
}

export default function CoordinatorCalendar() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  // Safely format Date object to YYYY-MM-DD locally without UTC shift
  const formatLocalDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Get active month range to fetch data from API dynamically
  const dateRange = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const start = new Date(year, month, 1);
    const end = new Date(year, month + 1, 0);
    return {
      startDate: formatLocalDate(start),
      endDate: formatLocalDate(end),
    };
  }, [currentDate]);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        // Querying /calendar/events matching backend route and params
        const response = await api.get('/calendar/events', {
          params: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
          },
        });
        setBookings(response.data || []);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [dateRange]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const startOffset = firstDay.getDay();
    const totalDays = lastDay.getDate();
    
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading calendar...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Calendar"
      subtitle="View all bookings and events"
      icon={Sparkles}
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl hover:shadow-md transition-all"
          >
            <ChevronLeft className="w-5 h-5 text-slate-600" />
          </button>
          <span className="text-sm font-semibold text-slate-700 min-w-[120px] text-center">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </span>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 bg-white/80 backdrop-blur-sm border border-white/40 rounded-xl hover:shadow-md transition-all"
          >
            <ChevronRight className="w-5 h-5 text-slate-600" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date())}
            className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl transition-all"
          >
            Today
          </button>
        </div>
      }
    >
      <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl overflow-hidden shadow-xl">
        <div className="grid grid-cols-7 gap-0">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-3 text-center text-sm font-semibold text-slate-500 border-b border-slate-200">
              {day}
            </div>
          ))}
          {days.map((day, index) => {
            if (!day) {
              return <div key={`empty-${index}`} className="min-h-[100px] p-2 border-b border-r border-slate-100 bg-slate-50/30"></div>;
            }
            
            const dateStr = formatLocalDate(day);
            // Matches formatted start string returned from calendar service map logic
            const dayBookings = bookings.filter(b => b.start.startsWith(dateStr));
            const hasBooking = dayBookings.length > 0;
            const isToday = day.toDateString() === new Date().toDateString();
            
            return (
              <div
                key={dateStr}
                className={`min-h-[100px] p-2 border-b border-r border-slate-100 hover:bg-slate-50/50 transition-all cursor-pointer ${
                  isToday ? 'bg-gradient-to-br from-blue-50/80 to-purple-50/80' : ''
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-medium ${isToday ? 'text-blue-600' : 'text-slate-600'}`}>
                    {day.getDate()}
                  </span>
                  {hasBooking && (
                    <span className="text-xs text-blue-500 font-medium">
                      {dayBookings.length}
                    </span>
                  )}
                </div>
                {hasBooking && (
                  <div className="mt-1 space-y-1">
                    {dayBookings.slice(0, 2).map((booking) => (
                      <div key={booking.id} className="text-[10px] bg-blue-100/80 text-blue-700 px-1.5 py-0.5 rounded truncate">
                        {booking.title}
                      </div>
                    ))}
                    {dayBookings.length > 2 && (
                      <div className="text-[10px] text-slate-400">+{dayBookings.length - 2} more</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
}