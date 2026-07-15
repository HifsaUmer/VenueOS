import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import PageLayout from '../components/PageLayout';
import StatsCard from '../components/StatsCard';
import {
  Users, Calendar, MapPin, Activity,
  TrendingUp, Award, Sparkles,
  ChevronRight, Zap, Star
} from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    totalSpaces: 0,
    totalBookings: 0,
    revenue: 0,
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eventsRes, spacesRes, bookingsRes] = await Promise.all([
          api.get('/events').catch(() => ({ data: [] })),
          api.get('/spaces').catch(() => ({ data: [] })),
          api.get('/bookings').catch(() => ({ data: [] })),
        ]);

        const events = eventsRes.data || [];
        const spaces = spacesRes.data || [];
        const bookings = bookingsRes.data || [];

        setStats({
          totalUsers: 0,
          totalEvents: events.length,
          totalSpaces: spaces.length,
          totalBookings: bookings.length,
          revenue: bookings.reduce((sum: number, b: any) => sum + (b.total || b.amount || 0), 0),
          occupancyRate: spaces.length > 0 
            ? Math.round((bookings.length / (spaces.length * 30)) * 100) 
            : 0,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const generatePDFReport = async () => {
    setGeneratingReport(true);
    try {
      // Fetch fresh data
      const [bookingsRes, eventsRes, spacesRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/events'),
        api.get('/spaces'),
      ]);

      const bookings = bookingsRes.data || [];
      const events = eventsRes.data || [];
      const spaces = spacesRes.data || [];

      // Create PDF
      const doc = new jsPDF('p', 'mm', 'a4');
      const pageWidth = doc.internal.pageSize.getWidth();

      // Header
      doc.setFillColor(59, 130, 246);
      doc.rect(0, 0, pageWidth, 40, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(22);
      doc.text('VenueOS Report', pageWidth / 2, 25, { align: 'center' });
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, 35, { align: 'center' });

      let y = 55;

      // Summary Section
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(16);
      doc.text('Summary', 14, y);
      y += 10;

      const summaryData = [
        ['Total Events', events.length],
        ['Total Spaces', spaces.length],
        ['Total Bookings', bookings.length],
        ['Total Revenue', `$${stats.revenue.toLocaleString()}`],
        ['Occupancy Rate', `${stats.occupancyRate}%`],
      ];

      autoTable(doc, {
        startY: y,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 10 },
        margin: { left: 14, right: 14 },
      });

      y = (doc as any).lastAutoTable.finalY + 15;

      // Bookings Table
      doc.setFontSize(16);
      doc.text('Recent Bookings', 14, y);
      y += 10;

      if (bookings.length > 0) {
        const bookingRows = bookings.slice(0, 10).map((b: any) => [
          b.id.slice(0, 8),
          b.event?.title || 'N/A',
          b.date || 'N/A',
          `$${b.total || 0}`,
          b.status || 'PENDING',
        ]);

        autoTable(doc, {
          startY: y,
          head: [['ID', 'Event', 'Date', 'Amount', 'Status']],
          body: bookingRows,
          theme: 'striped',
          headStyles: { fillColor: [59, 130, 246] },
          styles: { fontSize: 8 },
          margin: { left: 14, right: 14 },
        });

        y = (doc as any).lastAutoTable.finalY + 15;
      } else {
        doc.setFontSize(12);
        doc.text('No bookings found.', 14, y);
        y += 10;
      }

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
          `Page ${i} of ${totalPages} | VenueOS - ${new Date().getFullYear()}`,
          pageWidth / 2,
          doc.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }

      // Download PDF
      doc.save(`venueos-report-${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setGeneratingReport(false);
    }
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

  const cards = [
    { label: 'Total Events', value: stats.totalEvents, icon: Calendar, color: 'purple' as const, delay: 100 },
    { label: 'Total Spaces', value: stats.totalSpaces, icon: MapPin, color: 'green' as const, delay: 200 },
    { label: 'Total Bookings', value: stats.totalBookings, icon: Activity, color: 'orange' as const, delay: 300 },
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'blue' as const, delay: 0 },
  ];

  const quickActions = [
    { title: 'Manage Users', icon: Users, color: 'blue', count: stats.totalUsers, path: '/admin/users' },
    { title: 'View Analytics', icon: TrendingUp, color: 'purple', count: '📊', path: '/admin/analytics' },
    { title: 'System Settings', icon: Star, color: 'teal', count: '⚙️', path: '/admin/settings' },
  ];

  return (
    <PageLayout
      title="Admin Dashboard"
      subtitle="Welcome back! Here's your venue performance overview"
      icon={Sparkles}
      actions={
        <button
          onClick={generatePDFReport}
          disabled={generatingReport}
          className="group relative px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Zap className="w-4 h-4" />
            {generatingReport ? 'Generating...' : 'Generate Report'}
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity"></div>
        </button>
      }
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card) => (
          <StatsCard key={card.label} {...card} />
        ))}
      </div>

      {/* Bottom Grid - Revenue & Occupancy */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Card */}
        <div className="group bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg shadow-green-500/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Revenue Overview</h3>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-900">${stats.revenue.toLocaleString()}</p>
              <p className="text-sm text-slate-500 mt-1">Total revenue generated</p>
            </div>
            <div className="flex items-center gap-2 bg-green-50 border border-green-100 px-3 py-1.5 rounded-full">
              <span className="text-sm font-medium text-green-600">↑ 12%</span>
              <span className="text-xs text-slate-400">vs last month</span>
            </div>
          </div>
          <div className="mt-4 h-1 w-full bg-gradient-to-r from-green-200 via-green-400 to-green-600 rounded-full opacity-50"></div>
        </div>

        {/* Occupancy Card */}
        <div className="group bg-white/80 backdrop-blur-sm border border-white/40 rounded-2xl p-6 hover:shadow-xl transition-all duration-500 animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg shadow-purple-500/20">
              <Award className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900">Occupancy Rate</h3>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-900">{stats.occupancyRate}%</p>
              <p className="text-sm text-slate-500 mt-1">Overall venue utilization</p>
            </div>
            <div className="relative w-20 h-20">
              <svg className="w-20 h-20 -rotate-90">
                <circle cx="40" cy="40" r="32" fill="none" stroke="#e2e8f0" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="32" fill="none"
                  stroke="url(#grad)" strokeWidth="6"
                  strokeDasharray={`${stats.occupancyRate * 2.01} 201`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-purple-600">{stats.occupancyRate}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
        {quickActions.map((item, index) => (
          <div
            key={item.title}
            onClick={() => navigate(item.path)}
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