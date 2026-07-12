import { useEffect, useState } from 'react';
import PageLayout from '../components/PageLayout';
import { Clock, CheckCircle, ChevronRight, Sparkles, Plus, Calendar } from 'lucide-react';
import api from '../services/api';

export default function CoordinatorTimeline() {
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTimeline = async () => {
      try {
        const response = await api.get('/timeline');
        setTimeline(response.data || []);
      } catch (error) {
        console.error('Error fetching timeline:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTimeline();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 font-medium animate-pulse">Loading timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <PageLayout
      title="Event Timeline"
      subtitle="Plan and manage event schedules"
      icon={Sparkles}
      actions={
        <button className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5">
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Task
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
        </button>
      }
    >
      <div className="space-y-4">
        {timeline.length === 0 ? (
          <div className="bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-12 text-center">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900">No Timeline Tasks</h3>
            <p className="text-slate-500 text-sm mt-1">Create a timeline for your event</p>
          </div>
        ) : (
          timeline.map((item, index) => (
            <div 
              key={item.id}
              className="group bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-xl ${
                  item.status === 'COMPLETED' ? 'bg-green-100' :
                  item.status === 'IN_PROGRESS' ? 'bg-yellow-100' :
                  'bg-blue-100'
                }`}>
                  {item.status === 'COMPLETED' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <Clock className={`w-5 h-5 ${
                      item.status === 'IN_PROGRESS' ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-slate-900">{item.title}</h4>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      item.status === 'COMPLETED' ? 'bg-green-100 text-green-700' :
                      item.status === 'IN_PROGRESS' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {item.status || 'PENDING'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{item.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {item.startTime} - {item.endTime}
                    </span>
                    {item.assignedTo && (
                      <span>👤 {item.assignedTo}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </PageLayout>
  );
}