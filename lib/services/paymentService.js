"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processPayment = exports.processWalletPayment = exports.processNetBankingPayment = exports.processUPIPayment = exports.processStripePayment = exports.paymentMethods = void 0;
const stripe_js_1 = require("@stripe/stripe-js");
const bookingService_1 = require("./bookingService");
// Initialize Stripe
const stripePromise = (0, stripe_js_1.loadStripe)(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');
exports.paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', type: 'card', icon: '💳' },
    { id: 'upi', name: 'UPI Payment', type: 'upi', icon: '📱' },
    { id: 'netbanking', name: 'Net Banking', type: 'netbanking', icon: '🏦' },
    { id: 'wallet', name: 'Digital Wallet', type: 'wallet', icon: '💰' },
];
// Process Stripe Card Payment
const processStripePayment = async (paymentData) => {
    try {
        const stripe = await stripePromise;
        if (!stripe) {
            throw new Error('Stripe failed to load');
        }
        // Create payment intent via cloud function
        const { paymentIntent } = await (0, bookingService_1.createPaymentIntent)(paymentData.bookingId);
        // Confirm payment with Stripe
        const { error, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(paymentIntent.client_secret, {
            payment_method: {
                card: {
                    token: 'mock-card-token'
                    // This would be populated by Stripe Elements in a real implementation
                },
                billing_details: {
                    name: paymentData.customerName,
                    email: paymentData.customerEmail,
                },
            },
        });
        if (error) {
            console.error('Stripe payment error:', error);
            return {
                success: false,
                error: error.message
            };
        }
        if ((confirmedPayment === null || confirmedPayment === void 0 ? void 0 : confirmedPayment.status) === 'succeeded') {
            // Confirm payment in our backend
            await (0, bookingService_1.confirmPayment)(paymentData.bookingId, confirmedPayment.id);
            return {
                success: true,
                paymentIntentId: confirmedPayment.id
            };
        }
        return {
            success: false,
            error: 'Payment was not successful'
        };
    }
    catch (error) {
        console.error('Payment processing error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Payment failed'
        };
    }
};
exports.processStripePayment = processStripePayment;
// Simulate UPI Payment
const processUPIPayment = async (paymentData) => {
    try {
        // In a real implementation, this would integrate with UPI payment gateways
        console.log('Processing UPI payment:', paymentData);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 3000));
        // Simulate 90% success rate
        const success = Math.random() > 0.1;
        if (success) {
            // Create and confirm payment intent
            const { paymentIntent } = await (0, bookingService_1.createPaymentIntent)(paymentData.bookingId);
            await (0, bookingService_1.confirmPayment)(paymentData.bookingId, paymentIntent.id);
            return {
                success: true,
                paymentIntentId: paymentIntent.id
            };
        }
        else {
            return {
                success: false,
                error: 'UPI payment failed. Please try again.'
            };
        }
    }
    catch (error) {
        console.error('UPI payment error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'UPI payment failed'
        };
    }
};
exports.processUPIPayment = processUPIPayment;
// Simulate Net Banking Payment
const processNetBankingPayment = async (paymentData) => {
    try {
        console.log('Processing Net Banking payment:', paymentData);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 4000));
        // Simulate 85% success rate
        const success = Math.random() > 0.15;
        if (success) {
            const { paymentIntent } = await (0, bookingService_1.createPaymentIntent)(paymentData.bookingId);
            await (0, bookingService_1.confirmPayment)(paymentData.bookingId, paymentIntent.id);
            return {
                success: true,
                paymentIntentId: paymentIntent.id
            };
        }
        else {
            return {
                success: false,
                error: 'Net Banking payment failed. Please try again.'
            };
        }
    }
    catch (error) {
        console.error('Net Banking payment error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Net Banking payment failed'
        };
    }
};
exports.processNetBankingPayment = processNetBankingPayment;
// Simulate Wallet Payment
const processWalletPayment = async (paymentData) => {
    try {
        console.log('Processing Wallet payment:', paymentData);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        // Simulate 95% success rate
        const success = Math.random() > 0.05;
        if (success) {
            const { paymentIntent } = await (0, bookingService_1.createPaymentIntent)(paymentData.bookingId);
            await (0, bookingService_1.confirmPayment)(paymentData.bookingId, paymentIntent.id);
            return {
                success: true,
                paymentIntentId: paymentIntent.id
            };
        }
        else {
            return {
                success: false,
                error: 'Wallet payment failed. Please try again.'
            };
        }
    }
    catch (error) {
        console.error('Wallet payment error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Wallet payment failed'
        };
    }
};
exports.processWalletPayment = processWalletPayment;
// Main payment processor
const processPayment = async (paymentMethod, paymentData) => {
    switch (paymentMethod) {
        case 'card':
            return (0, exports.processStripePayment)(paymentData);
        case 'upi':
            return (0, exports.processUPIPayment)(paymentData);
        case 'netbanking':
            return (0, exports.processNetBankingPayment)(paymentData);
        case 'wallet':
            return (0, exports.processWalletPayment)(paymentData);
        default:
            return {
                success: false,
                error: 'Invalid payment method'
            };
    }
};
exports.processPayment = processPayment;
