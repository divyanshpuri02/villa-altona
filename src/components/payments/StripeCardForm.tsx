import React, { useEffect, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { createPaymentIntent, confirmPayment } from '../../services/bookingService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

type InnerProps = {
  bookingId: string;
  onSuccess: () => void;
  onFailure: (message?: string) => void;
};

const CardCheckoutInner: React.FC<InnerProps> = ({ bookingId, onSuccess, onFailure }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { clientSecret } = await createPaymentIntent(bookingId);
        setClientSecret(clientSecret);
      } catch (e: any) {
        setError(e?.message || 'Failed to initialize payment');
      }
    })();
  }, [bookingId]);

  const handlePay = async () => {
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);
    setError(null);
    try {
      const card = elements.getElement(CardElement);
      if (!card) throw new Error('Card element not found');

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card,
        },
      });

      if (error) {
        setError(error.message || 'Payment failed');
        setLoading(false);
        onFailure(error.message);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        await confirmPayment(bookingId, paymentIntent.id);
        setLoading(false);
        onSuccess();
        return;
      }

      setLoading(false);
      setError('Payment was not successful');
      onFailure('Payment was not successful');
    } catch (e: any) {
      setLoading(false);
      setError(e?.message || 'Payment failed');
      onFailure(e?.message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="p-4 border border-[#dbdbdb] rounded-xl bg-white">
        <CardElement options={{ hidePostalCode: true }} />
      </div>
      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}
      <button
        type="button"
        onClick={handlePay}
        disabled={loading || !stripe || !elements || !clientSecret}
        className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[#141414] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-800 transition-all duration-300 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
};

type Props = {
  bookingId: string;
  onSuccess: () => void;
  onFailure: (message?: string) => void;
};

export const StripeCardForm: React.FC<Props> = ({ bookingId, onSuccess, onFailure }) => {
  return (
    <Elements stripe={stripePromise}>
      <CardCheckoutInner bookingId={bookingId} onSuccess={onSuccess} onFailure={onFailure} />
    </Elements>
  );
};

export default StripeCardForm;
