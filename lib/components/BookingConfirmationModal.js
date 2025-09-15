"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const BookingConfirmationModal = ({ isOpen, onClose, bookingData }) => {
    const [showSuccess, setShowSuccess] = (0, react_1.useState)(false);
    const [processing, setProcessing] = (0, react_1.useState)(false);
    const [showPayment, setShowPayment] = (0, react_1.useState)(false);
    const [reservationData, setReservationData] = (0, react_1.useState)({
        checkIn: { date: '', time: '4:00 PM' },
        checkOut: { date: '', time: '11:00 AM' },
        adults: 0,
        children: 0,
        totalGuests: 0,
        confirmationCode: '',
        totalCost: '',
        nights: 0,
        costPerNight: 100000 // ₹100,000 per night
    });
    // Calculate dynamic reservation data
    (0, react_1.useEffect)(() => {
        if (bookingData.checkIn && bookingData.checkOut) {
            const checkInDate = new Date(bookingData.checkIn);
            const checkOutDate = new Date(bookingData.checkOut);
            // Calculate number of nights
            const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
            const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
            // Calculate total cost
            const totalCost = nights * reservationData.costPerNight;
            // Format dates
            const checkInFormatted = checkInDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
            const checkOutFormatted = checkOutDate.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            });
            // Generate confirmation code
            const confirmationCode = `VA2024-${Math.random().toString(36).substr(2, 10).toUpperCase()}`;
            setReservationData({
                checkIn: { date: checkInFormatted, time: '4:00 PM' },
                checkOut: { date: checkOutFormatted, time: '11:00 AM' },
                adults: bookingData.adults,
                children: bookingData.children,
                totalGuests: bookingData.adults + bookingData.children,
                confirmationCode,
                totalCost: `₹${totalCost.toLocaleString()}`,
                nights,
                costPerNight: reservationData.costPerNight
            });
        }
    }, [bookingData]);
    const handleConfirmBooking = async () => {
        setShowPayment(true);
    };
    const handlePaymentSuccess = () => {
        setShowPayment(false);
        setShowSuccess(true);
        setTimeout(() => {
            setShowSuccess(false);
            onClose();
        }, 3000);
    };
    const handlePaymentFailure = () => {
        setShowPayment(false);
    };
    if (showSuccess) {
        return ((0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.8, opacity: 0 }, className: "bg-neutral-50 rounded-xl p-8 max-w-md w-full text-center", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { scale: 0 }, animate: { scale: 1 }, transition: { delay: 0.2, type: "spring" }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-16 w-16 text-green-500 mx-auto mb-4" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-[#141414] text-2xl font-bold mb-2", style: { fontFamily: '"Noto Serif", serif' }, children: "Booking Confirmed!" }), (0, jsx_runtime_1.jsx)("p", { className: "text-neutral-500 mb-4", style: { fontFamily: '"Noto Sans", sans-serif' }, children: "Your reservation has been successfully confirmed. You'll receive a confirmation email shortly." }), (0, jsx_runtime_1.jsxs)("p", { className: "text-[#141414] font-bold", style: { fontFamily: '"Noto Sans", sans-serif' }, children: ["Confirmation Code: ", reservationData.confirmationCode] })] }) }) }));
    }
    if (showPayment) {
        return (0, jsx_runtime_1.jsx)(PaymentModal, { onSuccess: handlePaymentSuccess, onFailure: handlePaymentFailure, onClose: () => setShowPayment(false) });
    }
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: isOpen && ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { scale: 0.8, opacity: 0, y: 50 }, animate: { scale: 1, opacity: 1, y: 0 }, exit: { scale: 0.8, opacity: 0, y: 50 }, className: "bg-neutral-50 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center bg-neutral-50 p-4 pb-2 justify-between border-b border-[#ededed]", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-[#ededed] rounded-lg transition-colors duration-200", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-6 w-6" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12", style: { fontFamily: '"Noto Serif", serif' }, children: "Reservation Details" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 bg-neutral-50 px-0 min-h-[72px] py-2 justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-6 w-6" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col justify-center", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[#141414] text-base font-medium leading-normal line-clamp-1", style: { fontFamily: '"Noto Sans", sans-serif' }, children: "Check-in" }), (0, jsx_runtime_1.jsx)("p", { className: "text-neutral-500 text-sm font-normal leading-normal line-clamp-2", style: { fontFamily: '"Noto Sans", sans-serif' }, children: reservationData.checkIn.date })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "shrink-0", children: (0, jsx_runtime_1.jsx)("p", { className: "text-[#141414] text-base font-normal leading-normal", style: { fontFamily: '"Noto Sans", sans-serif' }, children: reservationData.checkIn.time }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 bg-neutral-50 px-0 min-h-[72px] py-2 justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Calendar, { className: "h-6 w-6" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col justify-center", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[#141414] text-base font-medium leading-normal line-clamp-1", style: { fontFamily: '"Noto Sans", sans-serif' }, children: "Checkout" }), (0, jsx_runtime_1.jsx)("p", { className: "text-neutral-500 text-sm font-normal leading-normal line-clamp-2", style: { fontFamily: '"Noto Sans", sans-serif' }, children: reservationData.checkOut.date })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "shrink-0", children: (0, jsx_runtime_1.jsx)("p", { className: "text-[#141414] text-base font-normal leading-normal", style: { fontFamily: '"Noto Sans", sans-serif' }, children: reservationData.checkOut.time }) })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 bg-neutral-50 px-0 min-h-14 justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Users, { className: "h-6 w-6" }) }), (0, jsx_runtime_1.jsx)("p", { className: "text-[#141414] text-base font-normal leading-normal flex-1 truncate", style: { fontFamily: '"Noto Sans", sans-serif' }, children: "Who's coming" })] }), (0, jsx_runtime_1.jsx)("div", { className: "shrink-0", children: (0, jsx_runtime_1.jsxs)("p", { className: "text-[#141414] text-base font-normal leading-normal", style: { fontFamily: '"Noto Sans", sans-serif' }, children: [reservationData.totalGuests, " guests"] }) })] }), (0, jsx_runtime_1.jsx)("h3", { className: "text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5", style: { fontFamily: '"Noto Serif", serif' }, children: "Payment Info" }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-4 bg-neutral-50 px-0 min-h-[72px] py-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12", children: (0, jsx_runtime_1.jsx)(lucide_react_1.CreditCard, { className: "h-6 w-6" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col justify-center", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[#141414] text-base font-medium leading-normal line-clamp-1", style: { fontFamily: '"Noto Sans", sans-serif' }, children: "Total cost" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-neutral-500 text-sm font-normal leading-normal line-clamp-2", style: { fontFamily: '"Noto Sans", sans-serif' }, children: [reservationData.totalCost, " INR for ", reservationData.nights, " nights"] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex items-center gap-4 bg-neutral-50 px-0 min-h-[72px] py-2", children: (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-4 flex-1", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12", children: (0, jsx_runtime_1.jsx)(lucide_react_1.Shield, { className: "h-6 w-6" }) }), (0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col justify-center flex-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[#141414] text-base font-medium leading-normal line-clamp-1", style: { fontFamily: '"Noto Sans", sans-serif' }, children: "Cancellation policy" }), (0, jsx_runtime_1.jsxs)("p", { className: "text-neutral-500 text-sm font-normal leading-normal line-clamp-2", style: { fontFamily: '"Noto Sans", sans-serif' }, children: ["Free cancellation before 4:00 PM on ", reservationData.checkIn.date, ". Cancel before check-in at 4:00 PM."] })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex px-0 py-3 mt-4", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { type: "button", disabled: processing, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, className: "flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 flex-1 bg-[#141414] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-800 transition-all duration-300 disabled:opacity-50", style: { fontFamily: '"Noto Sans", sans-serif' }, onClick: handleConfirmBooking, children: processing ? ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: "linear" }, className: "h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" })) : ((0, jsx_runtime_1.jsx)("span", { className: "truncate", children: "Confirm & Pay" })) }) })] })] }) })) }));
};
// Payment Modal Component
const PaymentModal = ({ onSuccess, onFailure, onClose }) => {
    const [selectedPayment, setSelectedPayment] = (0, react_1.useState)('');
    const [processing, setProcessing] = (0, react_1.useState)(false);
    const [showFailure, setShowFailure] = (0, react_1.useState)(false);
    const paymentMethods = [
        { id: 'stripe', name: 'Credit/Debit Card', icon: '💳' },
        { id: 'razorpay', name: 'Razorpay', icon: '💰' },
        { id: 'paypal', name: 'PayPal', icon: '🅿️' },
        { id: 'upi', name: 'UPI Payment', icon: '📱' },
    ];
    const handlePayment = async () => {
        if (!selectedPayment)
            return;
        setProcessing(true);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 3000));
        // 80% success rate for demo
        const success = Math.random() > 0.2;
        setProcessing(false);
        if (success) {
            onSuccess();
        }
        else {
            setShowFailure(true);
            setTimeout(() => {
                setShowFailure(false);
                onFailure();
            }, 3000);
        }
    };
    if (showFailure) {
        return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, className: "bg-neutral-50 rounded-xl p-8 max-w-md w-full text-center", children: [(0, jsx_runtime_1.jsx)("div", { className: "h-16 w-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4", children: (0, jsx_runtime_1.jsx)("span", { className: "text-white text-2xl", children: "\u2715" }) }), (0, jsx_runtime_1.jsx)("h3", { className: "text-[#141414] text-2xl font-bold mb-2", style: { fontFamily: '"Noto Serif", serif' }, children: "Payment Failed" }), (0, jsx_runtime_1.jsx)("p", { className: "text-neutral-500 mb-4", style: { fontFamily: '"Noto Sans", sans-serif' }, children: "Your payment could not be processed. Please try again with a different payment method." })] }) }));
    }
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { scale: 0.8, opacity: 0, y: 50 }, animate: { scale: 1, opacity: 1, y: 0 }, className: "bg-neutral-50 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center bg-neutral-50 p-4 pb-2 justify-between border-b border-[#ededed]", children: [(0, jsx_runtime_1.jsx)("button", { onClick: onClose, className: "text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-[#ededed] rounded-lg transition-colors duration-200", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-6 w-6" }) }), (0, jsx_runtime_1.jsx)("h2", { className: "text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12", style: { fontFamily: '"Noto Serif", serif' }, children: "Payment Options" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "p-4", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-2", style: { fontFamily: '"Noto Serif", serif' }, children: "Choose Payment Method" }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-3 mb-6", children: paymentMethods.map((method) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: () => setSelectedPayment(method.id), className: `w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${selectedPayment === method.id
                                    ? 'border-[#141414] bg-gray-100'
                                    : 'border-[#dbdbdb] bg-neutral-50 hover:bg-gray-50'}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "text-2xl", children: method.icon }), (0, jsx_runtime_1.jsx)("span", { className: "text-[#141414] font-medium", style: { fontFamily: '"Noto Sans", sans-serif' }, children: method.name }), selectedPayment === method.id && ((0, jsx_runtime_1.jsx)("div", { className: "ml-auto w-5 h-5 bg-[#141414] rounded-full flex items-center justify-center", children: (0, jsx_runtime_1.jsx)("span", { className: "text-white text-xs", children: "\u2713" }) }))] }, method.id))) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { type: "button", disabled: !selectedPayment || processing, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, onClick: handlePayment, className: "flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[#141414] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-800 transition-all duration-300 disabled:opacity-50", style: { fontFamily: '"Noto Sans", sans-serif' }, children: processing ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { animate: { rotate: 360 }, transition: { duration: 1, repeat: Infinity, ease: "linear" }, className: "h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" }), "Processing Payment..."] })) : ((0, jsx_runtime_1.jsx)("span", { className: "truncate", children: "Pay Now" })) })] })] }) }));
};
exports.default = BookingConfirmationModal;
