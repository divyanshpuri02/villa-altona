import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Users, CreditCard, FileText, Download, Shield, Clock, CheckCircle } from 'lucide-react';

interface BookingConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingData: {
    checkIn: string;
    checkOut: string;
    guests: number;
  };
}

const BookingConfirmationModal: React.FC<BookingConfirmationModalProps> = ({ isOpen, onClose, bookingData }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  const reservationData = {
    checkIn: { date: 'Sat, Jul 20', time: '4:00 PM' },
    checkOut: { date: 'Tue, Jul 23', time: '11:00 AM' },
    guests: bookingData.guests,
    confirmationCode: 'VA2024-AB12CD34EF',
    totalCost: '₹3,00,000',
    nights: 3
  };

  const handleConfirmBooking = async () => {
    setProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    setProcessing(false);
    setShowSuccess(true);
    
    // Auto close after success
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 3000);
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
            <h3 className="text-[#141414] text-2xl font-bold mb-2" style={{ fontFamily: '"Noto Serif", serif' }}>
              Booking Confirmed!
            </h3>
            <p className="text-neutral-500 mb-4" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
              Your reservation has been successfully confirmed. You'll receive a confirmation email shortly.
            </p>
            <p className="text-[#141414] font-bold" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
              Confirmation Code: {reservationData.confirmationCode}
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
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
                className="text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-[#ededed] rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12" style={{ fontFamily: '"Noto Serif", serif' }}>
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
                    <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                      Check-in
                    </p>
                    <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                      {reservationData.checkIn.date}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <p className="text-[#141414] text-base font-normal leading-normal" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
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
                    <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                      Checkout
                    </p>
                    <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                      {reservationData.checkOut.date}
                    </p>
                  </div>
                </div>
                <div className="shrink-0">
                  <p className="text-[#141414] text-base font-normal leading-normal" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
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
                  <p className="text-[#141414] text-base font-normal leading-normal flex-1 truncate" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                    Who's coming
                  </p>
                </div>
                <div className="shrink-0">
                  <p className="text-[#141414] text-base font-normal leading-normal" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                    {reservationData.guests} guests
                  </p>
                </div>
              </div>

              {/* Payment Information */}
              <h3 className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5" style={{ fontFamily: '"Noto Serif", serif' }}>
                Payment Info
              </h3>

              <div className="flex items-center gap-4 bg-neutral-50 px-0 min-h-[72px] py-2">
                <div className="flex items-center gap-4 flex-1">
                  <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div className="flex flex-col justify-center">
                    <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                      Total cost
                    </p>
                    <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
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
                    <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                      Cancellation policy
                    </p>
                    <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                      Free cancellation before 4:00 PM on Jul 19. Cancel before check-in at 4:00 PM.
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
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 flex-1 bg-[#141414] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-800 transition-all duration-300 disabled:opacity-50"
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                  onClick={handleConfirmBooking}
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
                    <span className="truncate">Confirm & Pay {reservationData.totalCost}</span>
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

export default BookingConfirmationModal;