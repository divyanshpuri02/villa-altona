"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Booking;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importStar(require("react"));
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const BookingConfirmationModal_1 = __importDefault(require("./BookingConfirmationModal"));
const bookingService_1 = require("../services/bookingService");
function Booking({ isAuthenticated, onShowAuth }) {
    const [checkIn, setCheckIn] = (0, react_1.useState)('');
    const [checkOut, setCheckOut] = (0, react_1.useState)('');
    const [adults, setAdults] = (0, react_1.useState)(2);
    const [children, setChildren] = (0, react_1.useState)(0);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [showConfirmation, setShowConfirmation] = (0, react_1.useState)(false);
    const [bookedDates, setBookedDates] = (0, react_1.useState)([]);
    const [errors, setErrors] = (0, react_1.useState)({
        checkIn: false,
        checkOut: false,
        dateOrder: false
    });
    // Load booked dates on component mount
    react_1.default.useEffect(() => {
        const loadBookedDates = async () => {
            try {
                const dates = await (0, bookingService_1.getBookedDates)();
                setBookedDates(dates);
            }
            catch (error) {
                console.log('Using offline mode - some dates may not be accurate');
                setBookedDates([]);
            }
        };
        loadBookedDates();
    }, []);
    // Format date for input and check if it's booked
    const formatDateForInput = (date) => {
        return date.toISOString().split('T')[0];
    };
    const getDateInputStyle = (dateString, isBooked) => {
        const baseStyle = "form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none focus:border-none h-14 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal";
        if (isBooked) {
            return `${baseStyle} bg-red-50 text-red-600 line-through`;
        }
        return `${baseStyle} bg-[#ededed]`;
    };
    const validateForm = () => {
        const newErrors = {
            checkIn: !checkIn,
            checkOut: !checkOut,
            dateOrder: false
        };
        if (checkIn && checkOut) {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            newErrors.dateOrder = checkOutDate <= checkInDate;
        }
        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };
    const isFormValid = () => {
        return checkIn && checkOut && new Date(checkOut) > new Date(checkIn);
    };
    const handleCheckAvailability = async () => {
        if (!isAuthenticated) {
            onShowAuth();
            return;
        }
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        setShowConfirmation(true);
    };
    // Check if selected dates are booked
    const checkInDate = checkIn ? new Date(checkIn) : null;
    const checkOutDate = checkOut ? new Date(checkOut) : null;
    const isCheckInBooked = checkInDate ? (0, bookingService_1.isDateBooked)(checkInDate, bookedDates) : false;
    const isCheckOutBooked = checkOutDate ? (0, bookingService_1.isDateBooked)(checkOutDate, bookedDates) : false;
    return ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("section", { id: "booking", className: "bg-neutral-50 py-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "w-full max-w-none px-4", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.h2, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, viewport: { once: true }, className: "text-[#141414] text-[28px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5", style: { fontFamily: '"Noto Serif", serif' }, children: "Reserve Your Stay" }), (0, jsx_runtime_1.jsxs)("div", { className: "w-full space-y-3", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.2 }, viewport: { once: true }, className: "flex w-full flex-wrap items-end gap-4 px-0 py-3", children: (0, jsx_runtime_1.jsxs)("label", { className: "flex flex-col min-w-40 flex-1", children: [isCheckInBooked && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-2 text-red-600 text-sm font-medium flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u26A0\uFE0F" }), (0, jsx_runtime_1.jsx)("span", { children: "This date is already booked" })] })), (0, jsx_runtime_1.jsx)("input", { type: "date", value: checkIn, onChange: (e) => setCheckIn(e.target.value), placeholder: "Check-in Date", className: getDateInputStyle(checkIn, isCheckInBooked), style: { fontFamily: '"Noto Sans", sans-serif' }, min: formatDateForInput(new Date()) })] }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.3 }, viewport: { once: true }, className: "flex w-full flex-wrap items-end gap-4 px-0 py-3", children: (0, jsx_runtime_1.jsxs)("label", { className: "flex flex-col min-w-40 flex-1", children: [isCheckOutBooked && ((0, jsx_runtime_1.jsxs)("div", { className: "mb-2 text-red-600 text-sm font-medium flex items-center gap-1", children: [(0, jsx_runtime_1.jsx)("span", { children: "\u26A0\uFE0F" }), (0, jsx_runtime_1.jsx)("span", { children: "This date is already booked" })] })), (0, jsx_runtime_1.jsx)("input", { type: "date", value: checkOut, onChange: (e) => setCheckOut(e.target.value), placeholder: "Check-out Date", className: getDateInputStyle(checkOut, isCheckOutBooked), style: { fontFamily: '"Noto Sans", sans-serif' }, min: checkIn || formatDateForInput(new Date()) })] }) }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.4 }, viewport: { once: true }, className: "flex w-full flex-wrap items-end gap-4 px-0 py-3", children: [(0, jsx_runtime_1.jsxs)("label", { className: "flex flex-col min-w-40 flex-1 mr-2", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[#141414] text-sm font-medium mb-2", style: { fontFamily: '"Noto Sans", sans-serif' }, children: "Adults" }), (0, jsx_runtime_1.jsx)("select", { value: adults, onChange: (e) => setAdults(Number(e.target.value)), className: "form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none h-14 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal", style: { fontFamily: '"Noto Sans", sans-serif' }, children: Array.from({ length: 12 }, (_, i) => i + 1).map(num => ((0, jsx_runtime_1.jsxs)("option", { value: num, children: [num, " Adult", num > 1 ? 's' : ''] }, num))) })] }), (0, jsx_runtime_1.jsxs)("label", { className: "flex flex-col min-w-40 flex-1", children: [(0, jsx_runtime_1.jsx)("span", { className: "text-[#141414] text-sm font-medium mb-2", style: { fontFamily: '"Noto Sans", sans-serif' }, children: "Children" }), (0, jsx_runtime_1.jsx)("select", { value: children, onChange: (e) => setChildren(Number(e.target.value)), className: "form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none h-14 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal", style: { fontFamily: '"Noto Sans", sans-serif' }, children: Array.from({ length: 7 }, (_, i) => i).map(num => ((0, jsx_runtime_1.jsxs)("option", { value: num, children: [num, " ", num === 1 ? 'Child' : 'Children'] }, num))) })] })] }), (errors.checkIn || errors.checkOut || errors.dateOrder || isCheckInBooked || isCheckOutBooked) && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "flex w-full px-0 py-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "w-full bg-red-50 border border-red-200 rounded-xl p-3", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-red-600", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm font-medium", style: { fontFamily: '"Noto Sans", sans-serif' }, children: "Please fix the following errors:" })] }), (0, jsx_runtime_1.jsxs)("ul", { className: "mt-2 text-sm text-red-600 space-y-1", style: { fontFamily: '"Noto Sans", sans-serif' }, children: [errors.checkIn && ((0, jsx_runtime_1.jsx)("li", { children: "\u2022 Please select a check-in date" })), errors.checkOut && ((0, jsx_runtime_1.jsx)("li", { children: "\u2022 Please select a check-out date" })), errors.dateOrder && ((0, jsx_runtime_1.jsx)("li", { children: "\u2022 Check-out date must be after check-in date" })), isCheckInBooked && ((0, jsx_runtime_1.jsx)("li", { children: "\u2022 Check-in date is already booked. Please select another date." })), isCheckOutBooked && ((0, jsx_runtime_1.jsx)("li", { children: "\u2022 Check-out date is already booked. Please select another date." }))] })] }) })), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.6, delay: 0.5 }, viewport: { once: true }, className: "flex w-full px-0 py-3", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { type: "button", disabled: loading || !isFormValid() || isCheckInBooked || isCheckOutBooked, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, className: `flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 text-base font-bold leading-normal tracking-[0.015em] transition-all duration-300 ${isFormValid() && !isCheckInBooked && !isCheckOutBooked
                                            ? 'bg-[#141414] text-white hover:bg-gray-800'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'} disabled:opacity-50`, style: { fontFamily: '"Noto Sans", sans-serif' }, onClick: handleCheckAvailability, children: loading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "animate-spin h-4 w-4 mr-2" }), "Checking Availability..."] })) : ((0, jsx_runtime_1.jsx)("span", { className: "truncate", children: "Check Availability" })) }) })] })] }) }), (0, jsx_runtime_1.jsx)(BookingConfirmationModal_1.default, { isOpen: showConfirmation, onClose: () => setShowConfirmation(false), bookingData: {
                    checkIn: checkIn,
                    checkOut: checkOut,
                    adults: adults,
                    children: children,
                } })] }));
}
