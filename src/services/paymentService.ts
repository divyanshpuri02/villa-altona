import { loadStripe } from '@stripe/stripe-js';
import { createPaymentIntent, confirmPayment } from './bookingService';

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
];

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
    const { paymentIntent } = await createPaymentIntent(paymentData.bookingId);

    // Confirm payment with Stripe
    const { error, paymentIntent: confirmedPayment } = await stripe.confirmCardPayment(
      paymentIntent.client_secret,
      {
        payment_method: {
          card: {
            // This would be populated by Stripe Elements in a real implementation
          },
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
        paymentIntentId: confirmedPayment.id
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
      const { paymentIntent } = await createPaymentIntent(paymentData.bookingId);
      await confirmPayment(paymentData.bookingId, paymentIntent.id);
      
      return {
        success: true,
        paymentIntentId: paymentIntent.id
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
      const { paymentIntent } = await createPaymentIntent(paymentData.bookingId);
      await confirmPayment(paymentData.bookingId, paymentIntent.id);
      
      return {
        success: true,
        paymentIntentId: paymentIntent.id
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
      const { paymentIntent } = await createPaymentIntent(paymentData.bookingId);
      await confirmPayment(paymentData.bookingId, paymentIntent.id);
      
      return {
        success: true,
        paymentIntentId: paymentIntent.id
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