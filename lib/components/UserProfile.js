"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const functions_1 = require("firebase/functions");
const config_1 = require("../firebase/config");
const UserProfile = ({ userEmail, onClose }) => {
    const [profile, setProfile] = (0, react_1.useState)(null);
    const [bookings, setBookings] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [activeTab, setActiveTab] = (0, react_1.useState)('profile');
    // Cloud Functions
    const getUserProfileFunction = (0, functions_1.httpsCallable)(config_1.functions, 'getUserProfile');
    const getUserBookingsFunction = (0, functions_1.httpsCallable)(config_1.functions, 'getUserBookings');
    const cancelBookingFunction = (0, functions_1.httpsCallable)(config_1.functions, 'cancelBooking');
    (0, react_1.useEffect)(() => {
        loadUserData();
    }, [userEmail]);
    const loadUserData = async () => {
        try {
            setLoading(true);
            // Load profile and bookings in parallel
            const [profileResult, bookingsResult] = await Promise.all([
                getUserProfileFunction({ userEmail }),
                getUserBookingsFunction({ userEmail })
            ]);
            setProfile(profileResult.data.profile);
            setBookings(bookingsResult.data.bookings);
        }
        catch (error) {
            console.error('Error loading user data:', error);
        }
        finally {
            setLoading(false);
        }
    };
    const handleCancelBooking = async (bookingId) => {
        if (!confirm('Are you sure you want to cancel this booking?'))
            return;
        try {
            await cancelBookingFunction({ bookingId, userEmail });
            await loadUserData(); // Reload data
        }
        catch (error) {
            console.error('Error cancelling booking:', error);
            alert('Failed to cancel booking. Please contact support.');
        }
    };
    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'cancelled': return 'text-red-600 bg-red-100';
            case 'refunded': return 'text-purple-600 bg-purple-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };
    const canCancelBooking = (booking) => {
        const now = new Date();
        const checkIn = new Date(booking.checkIn);
        const hoursUntilCheckIn = (checkIn.getTime() - now.getTime()) / (1000 * 60 * 60);
        return booking.paymentStatus === 'completed' && hoursUntilCheckIn > 0;
    };
    if (loading) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-xl p-8", children: [(0, jsx_runtime_1.jsx)("div", { className: "animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto" }), (0, jsx_runtime_1.jsx)("p", { className: "mt-4 text-gray-600", children: "Loading profile..." })] }) }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, className: "bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-8 w-8" }) }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold", children: (profile === null || profile === void 0 ? void 0 : profile.name) || 'User Profile' }), (0, jsx_runtime_1.jsx)("p", { className: "opacity-90", children: userEmail })] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-white hover:text-gray-200 text-2xl", children: "\u00D7" })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("nav", { className: "flex space-x-8 px-6", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setActiveTab('profile'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'profile'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: "Profile" }), (0, jsx_runtime_1.jsxs)("button", { onClick: () => setActiveTab('bookings'), className: `py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'bookings'
                                    ? 'border-blue-500 text-blue-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'}`, children: ["Bookings (", bookings.length, ")"] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 overflow-y-auto max-h-[60vh]", children: [activeTab === 'profile' && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-6", children: profile ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-5 w-5 text-gray-400" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Email" }), (0, jsx_runtime_1.jsx)("p", { className: "font-medium", children: profile.email })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-5 w-5 text-gray-400" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Full Name" }), (0, jsx_runtime_1.jsx)("p", { className: "font-medium", children: profile.name })] })] }), profile.phone && ((0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Phone, { className: "h-5 w-5 text-gray-400" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Phone" }), (0, jsx_runtime_1.jsx)("p", { className: "font-medium", children: profile.phone })] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-5 w-5 text-gray-400" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Member Since" }), (0, jsx_runtime_1.jsx)("p", { className: "font-medium", children: profile.createdAt.toLocaleDateString() })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center space-x-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "h-5 w-5 text-gray-400" }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Total Bookings" }), (0, jsx_runtime_1.jsx)("p", { className: "font-medium", children: profile.totalBookings })] })] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "bg-blue-50 p-4 rounded-lg", children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-medium text-blue-900 mb-2", children: "Loyalty Status" }), (0, jsx_runtime_1.jsx)("p", { className: "text-blue-700", children: profile.totalBookings >= 5 ? 'VIP Guest' :
                                                    profile.totalBookings >= 3 ? 'Preferred Guest' :
                                                        'Welcome Guest' })] })] })) : ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500", children: "No profile information available" })] })) })), activeTab === 'bookings' && ((0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: bookings.length > 0 ? (bookings.map((booking) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-start mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-lg", children: "Villa Altona" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600 font-mono text-sm", children: booking.confirmationCode })] }), (0, jsx_runtime_1.jsx)("span", { className: `px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.paymentStatus)}`, children: booking.paymentStatus })] }), (0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-4 mb-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Check-in" }), (0, jsx_runtime_1.jsx)("p", { className: "font-medium", children: booking.checkIn.toLocaleDateString() })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Check-out" }), (0, jsx_runtime_1.jsx)("p", { className: "font-medium", children: booking.checkOut.toLocaleDateString() })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Guests" }), (0, jsx_runtime_1.jsxs)("p", { className: "font-medium", children: [booking.adults, " Adults", booking.children > 0 && `, ${booking.children} Children`] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-500", children: "Total" }), (0, jsx_runtime_1.jsxs)("p", { className: "font-bold text-green-600", children: ["\u20B9", booking.totalAmount.toLocaleString()] })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center pt-4 border-t border-gray-100", children: [(0, jsx_runtime_1.jsxs)("p", { className: "text-sm text-gray-500", children: ["Booked on ", booking.createdAt.toLocaleDateString()] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex space-x-2", children: [canCancelBooking(booking) && ((0, jsx_runtime_1.jsx)("button", { onClick: () => handleCancelBooking(booking.id), className: "px-4 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 text-sm", children: "Cancel Booking" })), (0, jsx_runtime_1.jsxs)("button", { className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm flex items-center space-x-1", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Download, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { children: "Receipt" })] })] })] })] }, booking.id)))) : ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-8", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-12 w-12 text-gray-400 mx-auto mb-4" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-500", children: "No bookings found" }), (0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700", children: "Make Your First Booking" })] })) }))] })] }) }));
};
exports.default = UserProfile;
