<<<<<<< Updated upstream
import Navbar from '../components/Navbar'
=======
import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

interface AnalyticsOverview {
  totalRevenue: number;
  totalBookings: number;
  totalEvents: number;
  totalUsers: number;
}
>>>>>>> Stashed changes

interface RevenueChartData {
  month: string;
  amount: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function AdminAnalytics() {
<<<<<<< Updated upstream
=======
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueChartData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [overviewRes, revenueRes] = await Promise.all([
          api.get('/analytics/overview'),
          api.get('/analytics/revenue'),
        ]);
        setOverview(overviewRes.data);
        setRevenueData(revenueRes.data);
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

>>>>>>> Stashed changes
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="analytics" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-6">Analytics Dashboard</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">Revenue Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: any) => [`$${(value as number).toLocaleString()}`, 'Revenue']} />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">Event Bookings</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[
                  { name: 'Jan', count: 12 },
                  { name: 'Feb', count: 19 },
                  { name: 'Mar', count: 15 },
                  { name: 'Apr', count: 22 },
                  { name: 'May', count: 28 },
                  { name: 'Jun', count: 25 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">Space Utilization</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Grand Ballroom', value: 400 },
                      { name: 'Garden Terrace', value: 300 },
                      { name: 'Conference Hall', value: 300 },
                      { name: 'Meeting Rooms', value: 200 },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {COLORS.map((color, index) => (
                      <Cell key={`cell-${index}`} fill={color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} bookings`, '']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h3 className="text-lg font-medium mb-4">User Growth</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={[
                  { month: 'Jan', users: 40 },
                  { month: 'Feb', users: 80 },
                  { month: 'Mar', users: 120 },
                  { month: 'Apr', users: 180 },
                  { month: 'May', users: 220 },
                  { month: 'Jun', users: 280 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="users" stroke="#00C49F" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
