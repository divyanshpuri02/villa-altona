import { loadStripe } from '@stripe/stripe-js';
import { createPaymentIntent, confirmPayment } from './bookingService';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../firebase/config';

// Initialize Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_...');

export interface PaymentData {
  bookingId: string;
  amount: number;
  currency: string;
  customerEmail: string;
  customerName: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'upi' | 'netbanking' | 'wallet';
  icon: string;
}

export const paymentMethods: PaymentMethod[] = [
  { id: 'card', name: 'Credit/Debit Card', type: 'card', icon: '💳' },
  { id: 'upi', name: 'UPI Payment', type: 'upi', icon: '📱' },
  { id: 'netbanking', name: 'Net Banking', type: 'netbanking', icon: '🏦' },
  { id: 'wallet', name: 'Digital Wallet', type: 'wallet', icon: '💰' },
  { id: 'razorpay', name: 'Razorpay', type: 'upi', icon: '💰' },
];

// Razorpay helpers
const createRazorpayOrderFn = httpsCallable(functions, 'createRazorpayOrder');
const verifyRazorpaySignatureFn = httpsCallable(functions, 'verifyRazorpaySignature');

declare global {
  interface Window { Razorpay?: any }
}

const loadRazorpayScript = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve();
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Razorpay'));
    document.body.appendChild(script);
  });
};

export const processRazorpayPayment = async (paymentData: PaymentData): Promise<{ success: boolean; error?: string } > => {
  try {
    await loadRazorpayScript();
    const orderRes = await createRazorpayOrderFn({ bookingId: paymentData.bookingId });
    const { orderId, amount, keyId } = orderRes.data as any;

    return await new Promise((resolve) => {
      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency: 'INR',
        name: 'Villa Altona',
        order_id: orderId,
        prefill: { name: paymentData.customerName, email: paymentData.customerEmail },
        handler: async (resp: any) => {
          try {
            await verifyRazorpaySignatureFn({ orderId, paymentId: resp.razorpay_payment_id, signature: resp.razorpay_signature, bookingId: paymentData.bookingId });
            resolve({ success: true });
          } catch (e: any) {
            resolve({ success: false, error: e?.message || 'Verification failed' });
          }
        },
        modal: { ondismiss: () => resolve({ success: false, error: 'Payment cancelled' }) },
        theme: { color: '#141414' }
      });
      rzp.open();
    });
  } catch (error) {
    console.error('Razorpay payment error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Razorpay payment failed' };
  }
};

// Process Stripe Card Payment
export const processStripePayment = async (paymentData: PaymentData): Promise<{
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}> => {
  try {
    const stripe = await stripePromise;
    if (!stripe) {
      throw new Error('Stripe failed to load');
    }

    // Create payment intent via cloud function
  const { clientSecret, paymentIntentId } = await createPaymentIntent(paymentData.bookingId);

    // Confirm payment with Stripe
    const { error, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: {
            token: 'mock-card-token'
            // This would be populated by Stripe Elements in a real implementation
          } as any,
          billing_details: {
            name: paymentData.customerName,
            email: paymentData.customerEmail,
          },
        },
      }
    );

    if (error) {
      console.error('Stripe payment error:', error);
      return {
        success: false,
        error: error.message
      };
    }

    if (confirmedPayment?.status === 'succeeded') {
      // Confirm payment in our backend
  await confirmPayment(paymentData.bookingId, confirmedPayment.id);
      
      return {
        success: true,
        paymentIntentId
      };
    }

    return {
      success: false,
      error: 'Payment was not successful'
    };

  } catch (error) {
    console.error('Payment processing error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Payment failed'
    };
  }
};

// Simulate UPI Payment
export const processUPIPayment = async (paymentData: PaymentData): Promise<{
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}> => {
  try {
    // In a real implementation, this would integrate with UPI payment gateways
    console.log('Processing UPI payment:', paymentData);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Simulate 90% success rate
    const success = Math.random() > 0.1;
    
    if (success) {
      // Create and confirm payment intent
  const { paymentIntentId } = await createPaymentIntent(paymentData.bookingId);
  await confirmPayment(paymentData.bookingId, paymentIntentId);
      
      return {
        success: true,
        paymentIntentId
      };
    } else {
      return {
        success: false,
        error: 'UPI payment failed. Please try again.'
      };
    }

  } catch (error) {
    console.error('UPI payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'UPI payment failed'
    };
  }
};

// Simulate Net Banking Payment
export const processNetBankingPayment = async (paymentData: PaymentData): Promise<{
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}> => {
  try {
    console.log('Processing Net Banking payment:', paymentData);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    // Simulate 85% success rate
    const success = Math.random() > 0.15;
    
    if (success) {
      const { paymentIntentId } = await createPaymentIntent(paymentData.bookingId);
      await confirmPayment(paymentData.bookingId, paymentIntentId);
      
      return {
        success: true,
        paymentIntentId
      };
    } else {
      return {
        success: false,
        error: 'Net Banking payment failed. Please try again.'
      };
    }

  } catch (error) {
    console.error('Net Banking payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Net Banking payment failed'
    };
  }
};

// Simulate Wallet Payment
export const processWalletPayment = async (paymentData: PaymentData): Promise<{
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}> => {
  try {
    console.log('Processing Wallet payment:', paymentData);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate 95% success rate
    const success = Math.random() > 0.05;
    
    if (success) {
      const { paymentIntentId } = await createPaymentIntent(paymentData.bookingId);
      await confirmPayment(paymentData.bookingId, paymentIntentId);
      
      return {
        success: true,
        paymentIntentId
      };
    } else {
      return {
        success: false,
        error: 'Wallet payment failed. Please try again.'
      };
    }

  } catch (error) {
    console.error('Wallet payment error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Wallet payment failed'
    };
  }
};

// Main payment processor
export const processPayment = async (
  paymentMethod: string,
  paymentData: PaymentData
): Promise<{
  success: boolean;
  paymentIntentId?: string;
  error?: string;
}> => {
  switch (paymentMethod) {
    case 'card':
      return processStripePayment(paymentData);
    case 'razorpay':
      return processRazorpayPayment(paymentData);
    case 'upi':
      return processUPIPayment(paymentData);
    case 'netbanking':
      return processNetBankingPayment(paymentData);
    case 'wallet':
      return processWalletPayment(paymentData);
    default:
      return {
        success: false,
        error: 'Invalid payment method'
      };
  }
};