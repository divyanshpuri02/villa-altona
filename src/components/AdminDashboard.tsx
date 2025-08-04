import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Users, 
  DollarSign, 
  Mail, 
  TrendingUp, 
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Filter,
  Search,
  Eye,
  Edit
} from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';

interface BookingStats {
  totalBookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
}

interface AdminStats {
  recentBookings: number;
  totalRevenue: number;
  newContacts: number;
  occupancyRate: number;
  totalBookings: number;
}

interface AdminBooking {
  id: string;
  userName: string;
  userEmail: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  totalAmount: number;
  paymentStatus: string;
  confirmationCode: string;
  createdAt: Date;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminToken, setAdminToken] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Cloud Functions
  const getAdminStatsFunction = httpsCallable(functions, 'getAdminStats');
  const getAdminBookingsFunction = httpsCallable(functions, 'getAdminBookings');
  const updateBookingStatusFunction = httpsCallable(functions, 'updateBookingStatus');

  const handleLogin = async () => {
    if (!adminToken) return;
    
    try {
      setLoading(true);
      const result = await getAdminStatsFunction({ adminToken });
      setStats(result.data.stats as AdminStats);
      setIsAuthenticated(true);
      await loadBookings();
    } catch (error) {
      console.error('Admin login failed:', error);
      alert('Invalid admin token');
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      const result = await getAdminBookingsFunction({ 
        adminToken,
        status: filterStatus === 'all' ? undefined : filterStatus
      });
      setBookings(result.data.bookings as AdminBooking[]);
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
    try {
      await updateBookingStatusFunction({
        adminToken,
        bookingId,
        status: newStatus
      });
      await loadBookings();
      setSelectedBooking(null);
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'refunded': return 'text-purple-600 bg-purple-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Login</h2>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Admin Token"
              value={adminToken}
              onChange={(e) => setAdminToken(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleLogin}
              disabled={loading || !adminToken}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Login'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Villa Altona Admin Dashboard</h1>
          <p className="text-gray-600">Manage bookings and monitor performance</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Recent Bookings</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.recentBookings}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-800">₹{stats.totalRevenue.toLocaleString()}</p>
                </div>
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">New Contacts</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.newContacts}</p>
                </div>
                <Mail className="h-8 w-8 text-purple-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Occupancy Rate</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.occupancyRate}%</p>
                </div>
                <TrendingUp className="h-8 w-8 text-orange-600" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-800">{stats.totalBookings}</p>
                </div>
                <Users className="h-8 w-8 text-indigo-600" />
              </div>
            </motion.div>
          </div>
        )}

        {/* Bookings Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-xl font-semibold text-gray-800">Recent Bookings</h2>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                        <div className="text-sm text-gray-500">{booking.userEmail}</div>
                        <div className="text-xs text-gray-400 font-mono">{booking.confirmationCode}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.checkIn.toLocaleDateString()} - {booking.checkOut.toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {booking.adults} Adults{booking.children > 0 && `, ${booking.children} Children`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">₹{booking.totalAmount.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Booking Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">Booking Details</h3>
                  <button
                    onClick={() => setSelectedBooking(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Guest Name</label>
                    <p className="text-lg font-medium">{selectedBooking.userName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-lg">{selectedBooking.userEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Check-in</label>
                    <p className="text-lg">{selectedBooking.checkIn.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Check-out</label>
                    <p className="text-lg">{selectedBooking.checkOut.toLocaleDateString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Total Amount</label>
                    <p className="text-lg font-bold text-green-600">₹{selectedBooking.totalAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Current Status</label>
                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedBooking.paymentStatus)}`}>
                      {selectedBooking.paymentStatus}
                    </span>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-gray-500 block mb-2">Update Status</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateBookingStatus(selectedBooking.id, 'completed')}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Mark Completed
                    </button>
                    <button
                      onClick={() => updateBookingStatus(selectedBooking.id, 'cancelled')}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;