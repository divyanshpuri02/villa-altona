import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, CreditCard, Mail, Phone, MapPin, Clock, Download, Star } from 'lucide-react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';

interface UserBooking {
  id: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  totalAmount: number;
  paymentStatus: string;
  confirmationCode: string;
  createdAt: Date;
}

interface UserProfileData {
  email: string;
  name: string;
  phone?: string;
  totalBookings: number;
  createdAt: Date;
  updatedAt: Date;
}

interface UserProfileProps {
  userEmail: string;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ userEmail, onClose }) => {
  const [profile, setProfile] = useState<UserProfileData | null>(null);
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  // Cloud Functions
  const getUserProfileFunction = httpsCallable(functions, 'getUserProfile');
  const getUserBookingsFunction = httpsCallable(functions, 'getUserBookings');
  const cancelBookingFunction = httpsCallable(functions, 'cancelBooking');

  useEffect(() => {
    loadUserData();
  }, [userEmail]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      
      // Load profile and bookings in parallel
      const [profileResult, bookingsResult] = await Promise.all([
        getUserProfileFunction({}),
        getUserBookingsFunction({})
      ]);

      setProfile((profileResult.data as any).profile as UserProfileData);
      const rawBookings = (bookingsResult.data as any).bookings || [];
      setBookings(
        rawBookings.map((b: any) => ({
          id: b.id,
          checkIn: b.checkIn?.toDate ? b.checkIn.toDate() : new Date(b.checkIn),
          checkOut: b.checkOut?.toDate ? b.checkOut.toDate() : new Date(b.checkOut),
          adults: b.adults,
          children: b.children || 0,
          totalAmount: b.totalAmount,
          paymentStatus: b.paymentStatus,
          confirmationCode: b.confirmationCode,
          createdAt: b.createdAt?.toDate ? b.createdAt.toDate() : (b.createdAt ? new Date(b.createdAt) : new Date())
        }))
      );
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking?')) return;

    try {
  await cancelBookingFunction({ bookingId });
      await loadUserData(); // Reload data
    } catch (error) {
      console.error('Error cancelling booking:', error);
      alert('Failed to cancel booking. Please contact support.');
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

  const canCancelBooking = (booking: UserBooking) => {
    const now = new Date();
    const checkIn = new Date(booking.checkIn);
    const hoursUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    return booking.paymentStatus === 'completed' && hoursUntilCheckIn > 0;
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <User className="h-8 w-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{profile?.name || 'User Profile'}</h2>
                <p className="opacity-90">{userEmail}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-200 text-2xl"
            >
              ×
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('profile')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'profile'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab('bookings')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bookings'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Bookings ({bookings.length})
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {profile ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{profile.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Full Name</p>
                          <p className="font-medium">{profile.name}</p>
                        </div>
                      </div>
                      
                      {profile.phone && (
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">{profile.phone}</p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Member Since</p>
                          <p className="font-medium">{profile.createdAt.toLocaleDateString()}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <Star className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm text-gray-500">Total Bookings</p>
                          <p className="font-medium">{profile.totalBookings}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-900 mb-2">Loyalty Status</h3>
                    <p className="text-blue-700">
                      {profile.totalBookings >= 5 ? 'VIP Guest' : 
                       profile.totalBookings >= 3 ? 'Preferred Guest' : 
                       'Welcome Guest'}
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No profile information available</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="space-y-4">
              {bookings.length > 0 ? (
                bookings.map((booking) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">Villa Altona</h3>
                        <p className="text-gray-600 font-mono text-sm">{booking.confirmationCode}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Check-in</p>
                        <p className="font-medium">{booking.checkIn.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Check-out</p>
                        <p className="font-medium">{booking.checkOut.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Guests</p>
                        <p className="font-medium">{booking.adults} Adults{booking.children > 0 && `, ${booking.children} Children`}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-bold text-green-600">₹{booking.totalAmount.toLocaleString()}</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        Booked on {booking.createdAt.toLocaleDateString()}
                      </p>
                      <div className="flex space-x-2">
                        {canCancelBooking(booking) && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            className="px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 text-sm"
                          >
                            Cancel Booking
                          </button>
                        )}
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-1">
                          <Download className="h-4 w-4" />
                          <span>Receipt</span>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No bookings found</p>
                  <button
                    onClick={onClose}
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Make Your First Booking
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UserProfile;