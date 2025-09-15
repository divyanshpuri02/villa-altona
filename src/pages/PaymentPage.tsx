import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { createPaymentIntent, confirmPayment } from '../services/bookingService';

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

function CheckoutForm({ bookingId }: { bookingId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!stripe || !elements) return;
    setSubmitting(true);
    try {
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {},
        redirect: 'if_required',
      });

      if (stripeError) {
        setError(stripeError.message || 'Payment failed');
        setSubmitting(false);
        return;
      }

      if (paymentIntent && paymentIntent.status === 'succeeded') {
        await confirmPayment(bookingId, paymentIntent.id);
        navigate('/profile');
        return;
      }

      setError('Payment could not be completed. Please try again.');
    } catch (err: any) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 border rounded-md bg-white shadow-sm">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && <div className="text-red-600 text-sm mt-3">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || submitting}
        className="mt-4 w-full py-2 px-4 rounded bg-black text-white disabled:opacity-60"
      >
        {submitting ? 'Processing…' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function PaymentPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!bookingId) {
          setPageError('Missing booking ID');
          return;
        }
        const { clientSecret } = await createPaymentIntent(bookingId);
        setClientSecret(clientSecret);
      } catch (err: any) {
        setPageError(err?.message || 'Failed to initialize payment');
      }
    })();
  }, [bookingId]);

  const stripePromise = useMemo(() => {
    if (!publishableKey) return null;
    return loadStripe(publishableKey);
  }, []);

  if (pageError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-red-600">{pageError}</div>
      </div>
    );
  }

  if (!stripePromise || !clientSecret) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-neutral-600">Loading payment…</div>
    );
  }

  return (
    <div className="min-h-[60vh] py-10 px-4">
      <h1 className="text-2xl font-semibold text-center mb-6">Complete Your Payment</h1>
      <Elements
        stripe={stripePromise}
        options={{ clientSecret, appearance: { theme: 'stripe' } }}
      >
        <CheckoutForm bookingId={bookingId!} />
      </Elements>
    </div>
  );
}
