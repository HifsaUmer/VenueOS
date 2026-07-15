import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import { Calendar, CheckCircle, Clock, AlertCircle, ListTodo, Wrench, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function OperationsDashboard() {
  const [bookings, setBookings] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const bookingsRes = await api.get(`/bookings/date/${today}`);
        setBookings(bookingsRes.data || []);

        const tasksRes = await api.get('/timeline');
        setTasks(tasksRes.data || []);
      } catch (error) {
        console.error('Error fetching operations data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pendingTasks = tasks.filter((t: any) => t.status !== 'COMPLETED').length;
  const completedTasks = tasks.filter((t: any) => t.status === 'COMPLETED').length;
  const urgentTasks = tasks.filter((t: any) => t.priority === 'HIGH').length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading operations data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      <Navbar activePage="dashboard" />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 rounded-3xl p-6 sm:p-8 mb-8 shadow-xl shadow-blue-500/5">
          <div className="flex items-center gap-4">
            <div className="relative p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl shadow-lg shadow-blue-500/25">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Operations Dashboard
              </h1>
              <p className="text-slate-500 text-sm mt-0.5 font-medium">Manage setup checklists and daily tasks</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard label="Today's Events" value={bookings.length} icon={Calendar} color="blue" />
          <StatsCard label="Completed Tasks" value={completedTasks} icon={CheckCircle} color="green" />
          <StatsCard label="Pending Tasks" value={pendingTasks} icon={Clock} color="orange" />
          <StatsCard label="Urgent Tasks" value={urgentTasks} icon={AlertCircle} color="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Schedule */}
          <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500">
            <div className="flex items-center gap-2 mb-4">
              <ListTodo className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-slate-900">Today's Schedule</h3>
            </div>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <p className="text-slate-500">No events scheduled for today</p>
                <p className="text-xs text-slate-400 mt-1">Enjoy a calm day!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking: any) => (
                  <div key={booking.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                    <div>
                      <p className="font-medium text-slate-900">{booking.event?.title || 'Event'}</p>
                      <p className="text-sm text-slate-500">{booking.startTime} - {booking.endTime}</p>
                    </div>
                    <button className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-all">
                      View Setup
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Setup Checklist */}
          <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500">
            <div className="flex items-center gap-2 mb-4">
              <Wrench className="w-5 h-5 text-purple-600" />
              <h3 className="text-lg font-semibold text-slate-900">Setup Checklist</h3>
            </div>
            {tasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500">No tasks assigned</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tasks.slice(0, 5).map((task: any) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${task.status === 'COMPLETED' ? 'bg-green-500' : task.priority === 'HIGH' ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                      <span className={`text-sm ${task.status === 'COMPLETED' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                        {task.title}
                      </span>
                    </div>
                    <span className="text-xs text-slate-400">{task.assignedTo || 'Unassigned'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}