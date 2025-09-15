"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const functions_1 = require("firebase/functions");
const config_1 = require("../firebase/config");
const AdminDashboard = () => {
    const [stats, setStats] = (0, react_1.useState)(null);
    const [bookings, setBookings] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [adminToken, setAdminToken] = (0, react_1.useState)('');
    const [isAuthenticated, setIsAuthenticated] = (0, react_1.useState)(false);
    const [selectedBooking, setSelectedBooking] = (0, react_1.useState)(null);
    const [filterStatus, setFilterStatus] = (0, react_1.useState)('all');
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    // Cloud Functions
    const getAdminStatsFunction = (0, functions_1.httpsCallable)(config_1.functions, 'getAdminStats');
    const getAdminBookingsFunction = (0, functions_1.httpsCallable)(config_1.functions, 'getAdminBookings');
    const updateBookingStatusFunction = (0, functions_1.httpsCallable)(config_1.functions, 'updateBookingStatus');
    const handleLogin = async () => {
        if (!adminToken)
            return;
        try {
            setLoading(true);
            const result = await getAdminStatsFunction({ adminToken });
            setStats(result.data.stats);
            setIsAuthenticated(true);
            await loadBookings();
        }
        catch (error) {
            console.error('Admin login failed:', error);
            alert('Invalid admin token');
        }
        finally {
            setLoading(false);
        }
    };
    const loadBookings = async () => {
        try {
            const result = await getAdminBookingsFunction({
                adminToken,
                status: filterStatus === 'all' ? undefined : filterStatus
            });
            setBookings(result.data.bookings);
        }
        catch (error) {
            console.error('Error loading bookings:', error);
        }
    };
    const updateBookingStatus = async (bookingId, newStatus) => {
        try {
            await updateBookingStatusFunction({
                adminToken,
                bookingId,
                status: newStatus
            });
            await loadBookings();
            setSelectedBooking(null);
        }
        catch (error) {
            console.error('Error updating booking status:', error);
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
    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.confirmationCode.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });
    if (!isAuthenticated) {
        return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gray-50 flex items-center justify-center", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white p-8 rounded-xl shadow-lg max-w-md w-full", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-gray-800 mb-6 text-center", children: "Admin Login" }), (0, jsx_runtime_1.jsxs)("div", { className: "space-y-4", children: [(0, jsx_runtime_1.jsx)("input", { type: "password", placeholder: "Admin Token", value: adminToken, onChange: (e) => setAdminToken(e.target.value), className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" }), (0, jsx_runtime_1.jsx)("button", { onClick: handleLogin, disabled: loading || !adminToken, className: "w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50", children: loading ? 'Authenticating...' : 'Login' })] })] }) }));
    }
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gray-50", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto px-4 py-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-3xl font-bold text-gray-800 mb-2", children: "Villa Altona Admin Dashboard" }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-600", children: "Manage bookings and monitor performance" })] }), stats && ((0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, className: "bg-white p-6 rounded-xl shadow-sm border border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Recent Bookings" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-gray-800", children: stats.recentBookings })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-8 w-8 text-blue-600" })] }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.1 }, className: "bg-white p-6 rounded-xl shadow-sm border border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Total Revenue" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-2xl font-bold text-gray-800", children: ["\u20B9", stats.totalRevenue.toLocaleString()] })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.DollarSign, { className: "h-8 w-8 text-green-600" })] }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.2 }, className: "bg-white p-6 rounded-xl shadow-sm border border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "New Contacts" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-gray-800", children: stats.newContacts })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Mail, { className: "h-8 w-8 text-purple-600" })] }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.3 }, className: "bg-white p-6 rounded-xl shadow-sm border border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Occupancy Rate" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-2xl font-bold text-gray-800", children: [stats.occupancyRate, "%"] })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.TrendingUp, { className: "h-8 w-8 text-orange-600" })] }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.4 }, className: "bg-white p-6 rounded-xl shadow-sm border border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-sm text-gray-600", children: "Total Bookings" }), (0, jsx_runtime_1.jsx)("p", { className: "text-2xl font-bold text-gray-800", children: stats.totalBookings })] }), (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-8 w-8 text-indigo-600" })] }) })] })), (0, jsx_runtime_1.jsxs)("div", { className: "bg-white rounded-xl shadow-sm border border-gray-200", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-6 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-xl font-semibold text-gray-800", children: "Recent Bookings" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col sm:flex-row gap-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" }), (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search bookings...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }), (0, jsx_runtime_1.jsxs)("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent", children: [(0, jsx_runtime_1.jsx)("option", { value: "all", children: "All Status" }), (0, jsx_runtime_1.jsx)("option", { value: "pending", children: "Pending" }), (0, jsx_runtime_1.jsx)("option", { value: "completed", children: "Completed" }), (0, jsx_runtime_1.jsx)("option", { value: "cancelled", children: "Cancelled" }), (0, jsx_runtime_1.jsx)("option", { value: "refunded", children: "Refunded" })] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "overflow-x-auto", children: (0, jsx_runtime_1.jsxs)("table", { className: "w-full", children: [(0, jsx_runtime_1.jsx)("thead", { className: "bg-gray-50", children: (0, jsx_runtime_1.jsxs)("tr", { children: [(0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Guest" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Dates" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Guests" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Amount" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Status" }), (0, jsx_runtime_1.jsx)("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Actions" })] }) }), (0, jsx_runtime_1.jsx)("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredBookings.map((booking) => ((0, jsx_runtime_1.jsxs)("tr", { className: "hover:bg-gray-50", children: [(0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("div", { className: "text-sm font-medium text-gray-900", children: booking.userName }), (0, jsx_runtime_1.jsx)("div", { className: "text-sm text-gray-500", children: booking.userEmail }), (0, jsx_runtime_1.jsx)("div", { className: "text-xs text-gray-400 font-mono", children: booking.confirmationCode })] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-900", children: [booking.checkIn.toLocaleDateString(), " - ", booking.checkOut.toLocaleDateString()] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm text-gray-900", children: [booking.adults, " Adults", booking.children > 0 && `, ${booking.children} Children`] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-sm font-medium text-gray-900", children: ["\u20B9", booking.totalAmount.toLocaleString()] }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap", children: (0, jsx_runtime_1.jsx)("span", { className: `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.paymentStatus)}`, children: booking.paymentStatus }) }), (0, jsx_runtime_1.jsx)("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: (0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedBooking(booking), className: "text-blue-600 hover:text-blue-900 mr-3", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-4 w-4" }) }) })] }, booking.id))) })] }) })] }), selectedBooking && ((0, jsx_runtime_1.jsx)("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.9 }, animate: { opacity: 1, scale: 1 }, className: "bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsx)("div", { className: "p-6 border-b border-gray-200", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex justify-between items-center", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold", children: "Booking Details" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setSelectedBooking(null), className: "text-gray-400 hover:text-gray-600", children: (0, jsx_runtime_1.jsx)(lucide_react_1.XCircle, { className: "h-6 w-6" }) })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "p-6 space-y-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "grid grid-cols-2 gap-4", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-500", children: "Guest Name" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg font-medium", children: selectedBooking.userName })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-500", children: "Email" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg", children: selectedBooking.userEmail })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-500", children: "Check-in" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg", children: selectedBooking.checkIn.toLocaleDateString() })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-500", children: "Check-out" }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg", children: selectedBooking.checkOut.toLocaleDateString() })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-500", children: "Total Amount" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-lg font-bold text-green-600", children: ["\u20B9", selectedBooking.totalAmount.toLocaleString()] })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-500", children: "Current Status" }), (0, jsx_runtime_1.jsx)("span", { className: `inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedBooking.paymentStatus)}`, children: selectedBooking.paymentStatus })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "border-t pt-4", children: [(0, jsx_runtime_1.jsx)("label", { className: "text-sm font-medium text-gray-500 block mb-2", children: "Update Status" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-2", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => updateBookingStatus(selectedBooking.id, 'completed'), className: "px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700", children: "Mark Completed" }), (0, jsx_runtime_1.jsx)("button", { onClick: () => updateBookingStatus(selectedBooking.id, 'cancelled'), className: "px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700", children: "Cancel" })] })] })] })] }) }))] }) }));
};
exports.default = AdminDashboard;
