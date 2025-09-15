import React, { useEffect, useMemo, useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { createPaymentIntent, confirmPayment } from '../../services/bookingService';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '');

type InnerProps = {
  bookingId: string;
  onSuccess: () => void;
  onFailure: (message?: string) => void;
};

const Inner: React.FC<InnerProps> = ({ bookingId, onSuccess, onFailure }) => {
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

  const handleSubmit = async () => {
    if (!stripe || !elements || !clientSecret) return;
    setLoading(true);
    setError(null);
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {},
        redirect: 'if_required'
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

      // For methods needing a redirect, Stripe would have redirected already; if not, treat as failure
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
      {clientSecret ? (
        <div className="space-y-4">
          <div className="p-4 border border-[#dbdbdb] rounded-xl bg-white">
            <PaymentElement options={{ layout: 'tabs' }} />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading || !stripe || !elements}
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[#141414] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-800 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      ) : (
        <div className="text-sm text-neutral-600">Initializing payment...</div>
      )}
    </div>
  );
};

type Props = {
  bookingId: string;
  onSuccess: () => void;
  onFailure: (message?: string) => void;
};

const StripePaymentElement: React.FC<Props> = ({ bookingId, onSuccess, onFailure }) => {
  const options = useMemo(() => ({ appearance: { theme: 'stripe' as const } }), []);
  return (
    <Elements stripe={stripePromise} options={options as any}>
      <Inner bookingId={bookingId} onSuccess={onSuccess} onFailure={onFailure} />
    </Elements>
  );
};

export default StripePaymentElement;
