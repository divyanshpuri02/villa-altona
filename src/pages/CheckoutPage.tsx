import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { createPaymentIntent, confirmPayment, getBookingById, BookingRecord } from '../services/bookingService';
// import { createRazorpayOrder, verifyRazorpaySignature } from '../services/bookingService';

declare global {
  interface Window { Razorpay?: any }
}

const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string | undefined;

function StripeSection({ bookingId }: { bookingId: string }) {
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
      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({ elements, redirect: 'if_required' });
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: 'tabs' }} />
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <button type="submit" disabled={!stripe || submitting} className="w-full py-2 px-4 rounded bg-black text-white disabled:opacity-60">
        {submitting ? 'Processing…' : 'Pay with Card'}
      </button>
    </form>
  );
}

export default function CheckoutPage() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<BookingRecord | null>(null);

  useEffect(() => {
    (async () => {
      try {
        if (!bookingId) {
          setError('Missing booking ID');
          return;
        }
        const [intent, record] = await Promise.all([
          createPaymentIntent(bookingId),
          getBookingById(bookingId)
        ]);
        const { clientSecret } = intent;
        setClientSecret(clientSecret);
        setBooking(record);
      } catch (e: any) {
        setError(e?.message || 'Failed to initialize checkout');
      } finally {
        setLoading(false);
      }
    })();
  }, [bookingId]);

  const stripePromise = useMemo(() => publishableKey ? loadStripe(publishableKey) : null, []);

  // Razorpay functionality disabled until secret keys are configured
  /*
  const startRazorpay = async () => {
    if (!bookingId) return;
    try {
      const { orderId, amount, keyId } = await createRazorpayOrder(bookingId);
      if (!window.Razorpay) {
        setError('Razorpay SDK not loaded');
        return;
      }
      const rzp = new window.Razorpay({
        key: keyId,
        amount,
        currency: 'INR',
        name: 'Villa Altona',
        description: 'Booking Payment',
        order_id: orderId,
        handler: async function (response: any) {
          try {
            await verifyRazorpaySignature({
              orderId,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              bookingId
            });
            window.location.href = '/profile';
          } catch (e: any) {
            setError(e?.message || 'Failed to verify Razorpay payment');
          }
        },
        theme: { color: '#000000' }
      });
      rzp.open();
    } catch (e: any) {
      setError(e?.message || 'Failed to start Razorpay');
    }
  };
  */

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center">Loading…</div>;
  if (error) return <div className="min-h-[60vh] flex items-center justify-center text-red-600">{error}</div>;
  if (!stripePromise || !clientSecret) return <div className="min-h-[60vh] flex items-center justify-center">Config missing</div>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2 text-center">Choose Payment Method</h1>
      {booking && (
        <div className="mb-6 text-sm text-neutral-700 text-center">
          <div>
            <span className="font-medium">Stay:</span>
            {` ${booking.checkIn.toLocaleDateString()} → ${booking.checkOut.toLocaleDateString()}`}
          </div>
          <div>
            <span className="font-medium">Guests:</span>
            {` ${booking.adults} adult(s)`}{booking.children ? `, ${booking.children} child(ren)` : ''}
            {booking.totalAmount ? ` • Total: ₹${booking.totalAmount.toLocaleString()}` : ''}
          </div>
        </div>
      )}
      <div className="max-w-lg mx-auto">
        <div className="border rounded-md p-4 shadow-sm">
          <h2 className="font-medium mb-3">Card / UPI Payment (Stripe)</h2>
          <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe' } }}>
            <StripeSection bookingId={bookingId!} />
          </Elements>
        </div>
        {/* Razorpay section disabled until secret keys are configured */}
        {/*
        <div className="border rounded-md p-4 shadow-sm">
          <h2 className="font-medium mb-3">Razorpay</h2>
          <p className="text-sm text-neutral-600 mb-3">Pay via UPI, netbanking, or wallets.</p>
          <button onClick={startRazorpay} className="w-full py-2 px-4 rounded bg-indigo-600 text-white">Pay with Razorpay</button>
          <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        </div>
        */}
      </div>
    </div>
  );
}
