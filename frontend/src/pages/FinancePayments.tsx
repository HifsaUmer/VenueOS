import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../services/api';

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: string;
  status: string;
  transactionId: string | null;
  paidAt: string | null;
  createdAt: string;
  invoice?: { invoiceNumber: string; client?: { fullName: string } };
}

export default function FinancePayments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get('/payments');
        setPayments(res.data);
      } catch (err) {
        console.error('Failed to fetch payments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'FAILED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activePage="payments" />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Payments</h2>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Payment #</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Invoice</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Client</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Amount</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Method</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{payment.id.slice(0, 8)}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{payment.invoice?.invoiceNumber || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{payment.invoice?.client?.fullName || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">${payment.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{payment.method}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(payment.paidAt || payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
