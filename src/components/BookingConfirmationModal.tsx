import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, CreditCard, FileText, Download, Shield, Clock, CheckCircle } from 'lucide-react';
import { createBooking } from '../services/bookingService';
import { auth } from '../firebase/config';
import { processPayment } from '../services/paymentService';
import StripeCardForm from './payments/StripeCardForm';
import StripePaymentElement from './payments/StripePaymentElement';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    checkIn: string;
    checkOut: string;
    adults: number;
    children: number;
  };
}

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({ isOpen, onClose, bookingData }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [reservationData, setReservationData] = useState({
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
  useEffect(() => {
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
    try {
      setProcessing(true);
      // Create a booking first
      const currentUser = auth.currentUser;
      if (!currentUser) {
        window.dispatchEvent(new Event('OPEN_AUTH_MODAL'));
        setProcessing(false);
        return;
      }
      const email = currentUser.email || '';
      const name = currentUser.displayName || email || 'Guest';
      const result = await createBooking({
        checkIn: new Date(bookingData.checkIn),
        checkOut: new Date(bookingData.checkOut),
        adults: bookingData.adults,
        children: bookingData.children,
        guestDetails: [{ name, email }],
        userEmail: email,
        userName: name,
        userPhone: undefined,
        specialRequests: undefined,
      } as any);
      setBookingId(result.bookingId);
      setConfirmationCode(result.confirmationCode);
      // Navigate to the checkout page for payment
      try {
        // Close the modal before navigating
        onClose();
      } catch {}
      window.location.href = `/checkout/${result.bookingId}`;
    } catch (e: any) {
      console.error('Failed to create booking', e);
      alert(e?.message || 'Could not create booking. Please try again.');
    } finally {
      setProcessing(false);
    }
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
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-neutral-50 rounded-xl p-8 max-w-md w-full text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-[#141414] text-2xl font-bold mb-2">
              Booking Confirmed!
            </h3>
            <p className="text-neutral-500 mb-4">
              Your reservation has been successfully confirmed. You'll receive a confirmation email shortly.
            </p>
            <p className="text-[#141414] font-bold">
              Confirmation Code: {reservationData.confirmationCode}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  if (showPayment && bookingId) {
    return <PaymentModal bookingId={bookingId} onSuccess={handlePaymentSuccess} onFailure={handlePaymentFailure} onClose={() => setShowPayment(false)} />;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            className="bg-neutral-50 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center bg-neutral-50 p-4 pb-2 justify-between border-b border-[#ededed]">
              <button
                onClick={onClose}
                aria-label="Close reservation details"
                className="text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-[#ededed] rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
                Reservation Details
              </h2>
            </div>

            <div className="p-4">
              {/* Check-in Details */}
              <div className="flex items-center gap-4 bg-neutral-50 px-0 min-h-[72px] py-2 justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">
                      Check-in
                    </p>
                    <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">
                      {reservationData.checkIn.date}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <p className="text-[#141414] text-base font-normal leading-normal">
                    {reservationData.checkIn.time}
                  </p>
                </div>
              </div>

              {/* Check-out Details */}
              <div className="flex items-center gap-4 bg-neutral-50 px-0 min-h-[72px] py-2 justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12">
                    <Calendar className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">
                      Checkout
                    </p>
                    <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">
                      {reservationData.checkOut.date}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <p className="text-[#141414] text-base font-normal leading-normal">
                    {reservationData.checkOut.time}
                  </p>
                </div>
              </div>

              {/* Guest Information */}
              <div className="flex items-center gap-4 bg-neutral-50 px-0 min-h-14 justify-between">
                <div className="flex items-center gap-4">
                  <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12">
                    <Users className="h-6 w-6" />
                  </div>
                  <p className="text-[#141414] text-base font-normal leading-normal flex-1 truncate">
                    Who's coming
                  </p>
                </div>
                <div className="shrink-0">
                  <p className="text-[#141414] text-base font-normal leading-normal">
                    {reservationData.totalGuests} guests
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <h3 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5">
                Payment Info
              </h3>

              <div className="flex items-center gap-4 bg-neutral-50 px-0 min-h-[72px] py-2">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">
                      Total cost
                    </p>
                    <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">
                      {reservationData.totalCost} INR for {reservationData.nights} nights
                    </p>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="flex items-center gap-4 bg-neutral-50 px-0 min-h-[72px] py-2">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col justify-center flex-1">
                    <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1">
                      Cancellation policy
                    </p>
                    <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2">
                      Free cancellation before 4:00 PM on {reservationData.checkIn.date}. Cancel before check-in at 4:00 PM.
                    </p>
                  </div>
                </div>
              </div>

              {/* Confirm Booking Button */}
              <div className="flex px-0 py-3 mt-4">
                <motion.button
                  type="button"
                  disabled={processing}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 flex-1 bg-[#141414] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 font-sans"
                  onClick={handleConfirmBooking}
                >
                  {processing ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                  ) : (
                    <span className="truncate">Confirm & Pay</span>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Payment Modal Component
const PaymentModal: React.FC<{
  bookingId: string;
  onSuccess: () => void;
  onFailure: () => void;
  onClose: () => void;
}> = ({ bookingId, onSuccess, onFailure, onClose }) => {
  const [selectedPayment, setSelectedPayment] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showFailure, setShowFailure] = useState(false);

  const paymentMethods = [
    { id: 'stripe', name: 'Credit/Debit Card', icon: '💳' },
    { id: 'razorpay', name: 'Razorpay', icon: '💰' },
    { id: 'paypal', name: 'PayPal', icon: '🅿️' },
    { id: 'upi', name: 'UPI Payment', icon: '📱' },
  ];

  const handlePayment = async () => {
    if (!selectedPayment) return;
    
    setProcessing(true);
    try {
      const result = await processPayment(
        selectedPayment === 'stripe' ? 'card' : selectedPayment,
        {
          bookingId,
          amount: 0,
          currency: 'INR',
          customerEmail: '',
          customerName: ''
        }
      );
      setProcessing(false);
      if (result.success) {
        onSuccess();
      } else {
        setShowFailure(true);
        setTimeout(() => {
          setShowFailure(false);
          onFailure();
        }, 3000);
      }
    } catch (e) {
      setProcessing(false);
      setShowFailure(true);
      setTimeout(() => {
        setShowFailure(false);
        onFailure();
      }, 3000);
    }
  };

  if (showFailure) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-neutral-50 rounded-xl p-8 max-w-md w-full text-center"
        >
          <div className="h-16 w-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✕</span>
          </div>
          <h3 className="text-[#141414] text-2xl font-bold mb-2">
            Payment Failed
          </h3>
          <p className="text-neutral-500 mb-4">
            Your payment could not be processed. Please try again with a different payment method.
          </p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="bg-neutral-50 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center bg-neutral-50 p-4 pb-2 justify-between border-b border-[#ededed]">
          <button
            onClick={onClose}
            aria-label="Close payment options"
            className="text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-[#ededed] rounded-lg transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>
          <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">
            Payment Options
          </h2>
        </div>

        <div className="p-4">
          <h3 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-2">
            Choose Payment Method
          </h3>

          <div className="space-y-3 mb-6">
            {paymentMethods.map((method) => (
              <motion.button
                key={method.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedPayment(method.id)}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                  selectedPayment === method.id 
                    ? 'border-[#141414] bg-gray-100' 
                    : 'border-[#dbdbdb] bg-neutral-50 hover:bg-gray-50'
                }`}
              >
                <span className="text-2xl">{method.icon}</span>
                <span className="text-[#141414] font-medium">
                  {method.name}
                </span>
                {selectedPayment === method.id && (
                  <div className="ml-auto w-5 h-5 bg-[#141414] rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </motion.button>
            ))}
          </div>

          {selectedPayment === 'stripe' && (
            <div className="mb-6">
              <StripePaymentElement
                bookingId={bookingId}
                onSuccess={onSuccess}
                onFailure={() => setShowFailure(true)}
              />
            </div>
          )}

          {selectedPayment !== 'stripe' && (
          <motion.button
            type="button"
            disabled={!selectedPayment || processing}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handlePayment}
            className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 bg-[#141414] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 font-sans"
          >
            {processing ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                />
                Processing Payment...
              </>
            ) : (
              <span className="truncate">Pay Now</span>
            )}
          </motion.button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BookingConfirmationModal;