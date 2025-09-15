"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactForm = exports.getUserBookings = exports.cancelBooking = exports.confirmPayment = exports.createPaymentIntent = exports.createBooking = exports.checkAvailability = exports.isDateBooked = exports.getBookedDates = void 0;
const firestore_1 = require("firebase/firestore");
const functions_1 = require("firebase/functions");
const config_1 = require("../firebase/config");
// Cloud Functions
const createBookingFunction = (0, functions_1.httpsCallable)(config_1.functions, 'createBooking');
const createPaymentIntentFunction = (0, functions_1.httpsCallable)(config_1.functions, 'createPaymentIntent');
const confirmPaymentFunction = (0, functions_1.httpsCallable)(config_1.functions, 'confirmPayment');
const cancelBookingFunction = (0, functions_1.httpsCallable)(config_1.functions, 'cancelBooking');
const getUserBookingsFunction = (0, functions_1.httpsCallable)(config_1.functions, 'getUserBookings');
const checkVillaAvailabilityFunction = (0, functions_1.httpsCallable)(config_1.functions, 'checkVillaAvailability');
const sendContactFormFunction = (0, functions_1.httpsCallable)(config_1.functions, 'sendContactForm');
// Get all booked dates from the database
const getBookedDates = async () => {
    try {
        const bookingsRef = (0, firestore_1.collection)(config_1.db, 'bookings');
        const q = (0, firestore_1.query)(bookingsRef, (0, firestore_1.where)('paymentStatus', 'in', ['completed', 'pending']));
        const querySnapshot = await (0, firestore_1.getDocs)(q);
        const bookedDates = [];
        querySnapshot.forEach((doc) => {
            var _a, _b;
            const data = doc.data();
            const checkIn = ((_a = data.checkIn) === null || _a === void 0 ? void 0 : _a.toDate) ? data.checkIn.toDate() : new Date(data.checkIn);
            const checkOut = ((_b = data.checkOut) === null || _b === void 0 ? void 0 : _b.toDate) ? data.checkOut.toDate() : new Date(data.checkOut);
            // Generate all dates between check-in and check-out
            const currentDate = new Date(checkIn);
            while (currentDate < checkOut) {
                bookedDates.push(new Date(currentDate));
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });
        return bookedDates;
    }
    catch (error) {
        console.error('Error fetching booked dates:', error);
        // Return sample dates if Firebase is not connected
        return [
            new Date('2024-03-15'),
            new Date('2024-03-16'),
            new Date('2024-04-10')
        ];
    }
};
exports.getBookedDates = getBookedDates;
// Check if a specific date is booked
const isDateBooked = (date, bookedDates) => {
    return bookedDates.some(bookedDate => bookedDate.getFullYear() === date.getFullYear() &&
        bookedDate.getMonth() === date.getMonth() &&
        bookedDate.getDate() === date.getDate());
};
exports.isDateBooked = isDateBooked;
// Check availability using cloud function
const checkAvailability = async (checkIn, checkOut) => {
    try {
        const result = await checkVillaAvailabilityFunction({
            checkIn: checkIn.toISOString(),
            checkOut: checkOut.toISOString()
        });
        return {
            available: result.data.available,
            totalAmount: result.data.totalAmount,
            pricePerNight: result.data.pricePerNight
        };
    }
    catch (error) {
        console.error('Error checking availability:', error);
        // Return mock availability if backend is not ready
        return {
            available: true,
            totalAmount: 300000,
            pricePerNight: 100000
        };
    }
};
exports.checkAvailability = checkAvailability;
// Create booking using cloud function
const createBooking = async (bookingData) => {
    try {
        const result = await createBookingFunction({
            checkIn: bookingData.checkIn.toISOString(),
            checkOut: bookingData.checkOut.toISOString(),
            adults: bookingData.adults,
            children: bookingData.children,
            guestDetails: bookingData.guestDetails,
            userEmail: bookingData.userEmail,
            userName: bookingData.userName,
            userPhone: bookingData.userPhone,
            specialRequests: bookingData.specialRequests
        });
        return {
            bookingId: result.data.bookingId,
            totalAmount: result.data.totalAmount
        };
    }
    catch (error) {
        console.error('Error creating booking:', error);
        throw new Error('Failed to create booking');
    }
};
exports.createBooking = createBooking;
// Create payment intent
const createPaymentIntent = async (bookingId, paymentMethodId) => {
    try {
        const result = await createPaymentIntentFunction({
            bookingId,
            paymentMethodId
        });
        return {
            paymentIntent: result.data.paymentIntent
        };
    }
    catch (error) {
        console.error('Error creating payment intent:', error);
        throw new Error('Failed to create payment intent');
    }
};
exports.createPaymentIntent = createPaymentIntent;
// Confirm payment
const confirmPayment = async (bookingId, paymentIntentId) => {
    try {
        await confirmPaymentFunction({
            bookingId,
            paymentIntentId
        });
    }
    catch (error) {
        console.error('Error confirming payment:', error);
        throw new Error('Failed to confirm payment');
    }
};
exports.confirmPayment = confirmPayment;
// Cancel booking
const cancelBooking = async (bookingId, userEmail) => {
    try {
        const result = await cancelBookingFunction({
            bookingId,
            userEmail
        });
        return {
            refundAmount: result.data.refundAmount
        };
    }
    catch (error) {
        console.error('Error cancelling booking:', error);
        throw new Error('Failed to cancel booking');
    }
};
exports.cancelBooking = cancelBooking;
// Get user bookings
const getUserBookings = async (userEmail) => {
    try {
        const result = await getUserBookingsFunction({
            userEmail
        });
        return result.data.bookings.map((booking) => (Object.assign(Object.assign({}, booking), { checkIn: new Date(booking.checkIn), checkOut: new Date(booking.checkOut), createdAt: new Date(booking.createdAt), updatedAt: new Date(booking.updatedAt) })));
    }
    catch (error) {
        console.error('Error getting user bookings:', error);
        throw new Error('Failed to get bookings');
    }
};
exports.getUserBookings = getUserBookings;
// Send contact form
const sendContactForm = async (formData) => {
    try {
        await sendContactFormFunction(formData);
    }
    catch (error) {
        console.error('Error sending contact form:', error);
        throw new Error('Failed to send contact form');
    }
};
exports.sendContactForm = sendContactForm;
