import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, CreditCard, FileText, Download, Shield, Clock } from 'lucide-react';

const ReservationDetails: React.FC = () => {
  const [showCancellation, setShowCancellation] = useState(false);

  const reservationData = {
    checkIn: { date: 'Sat, Jul 20', time: '4:00 PM' },
    checkOut: { date: 'Tue, Jul 23', time: '11:00 AM' },
    guests: 4,
    confirmationCode: 'VA2024-AB12CD34EF',
    totalCost: '₹3,00,000',
    nights: 3
  };

  return (
    <section id="reservation" className="bg-neutral-50 py-8">
      <div className="px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5"
          style={{ fontFamily: '"Noto Serif", serif' }}
        >
          Reservation Details
        </motion.h2>

        {/* Check-in Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 bg-neutral-50 px-0 min-h-[72px] py-2 justify-between"
        >
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
        </motion.div>

        {/* Check-out Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 bg-neutral-50 px-0 min-h-[72px] py-2 justify-between"
        >
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
        </motion.div>

        {/* Guest Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 bg-neutral-50 px-0 min-h-14 justify-between"
        >
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
        </motion.div>

        {/* Confirmation Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 bg-neutral-50 px-0 min-h-14 justify-between"
        >
          <div className="flex items-center gap-4">
            <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12">
              <FileText className="h-6 w-6" />
            </div>
            <p className="text-[#141414] text-base font-normal leading-normal flex-1 truncate" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
              Confirmation code
            </p>
          </div>
          <div className="shrink-0">
            <p className="text-[#141414] text-base font-normal leading-normal font-mono" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
              {reservationData.confirmationCode}
            </p>
          </div>
        </motion.div>

        {/* Cancellation Policy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 bg-neutral-50 px-0 min-h-[72px] py-2"
        >
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCancellation(!showCancellation)}
            className="text-[#141414] text-sm underline"
            style={{ fontFamily: '"Noto Sans", sans-serif' }}
          >
            {showCancellation ? 'Hide' : 'Details'}
          </motion.button>
        </motion.div>

        {/* Expanded Cancellation Details */}
        {showCancellation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gradient-to-r from-neutral-50 to-neutral-100 p-4 rounded-lg border border-[#dbdbdb] mb-4"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <p className="text-sm font-medium text-green-600" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                  Free Cancellation Period
                </p>
              </div>
              <p className="text-sm text-neutral-600" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                • Cancel up to 24 hours before check-in for a full refund
              </p>
              <p className="text-sm text-neutral-600" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                • Partial refund (50%) if cancelled within 24 hours
              </p>
              <p className="text-sm text-neutral-600" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                • No refund for no-shows or early departures
              </p>
            </div>
          </motion.div>
        )}

        {/* Payment Information */}
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5"
          style={{ fontFamily: '"Noto Serif", serif' }}
        >
          Payment Info
        </motion.h3>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 bg-neutral-50 px-0 min-h-[72px] py-2"
        >
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
        </motion.div>

        {/* Get Receipt */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 bg-neutral-50 px-0 min-h-14 justify-between cursor-pointer hover:bg-gray-50 rounded-lg p-2 transition-colors duration-200"
          onClick={() => alert('Receipt download feature coming soon!')}
        >
          <div className="flex items-center gap-4">
            <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12">
              <Download className="h-6 w-6" />
            </div>
            <p className="text-[#141414] text-base font-normal leading-normal flex-1 truncate" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
              Get receipt
            </p>
          </div>
          <div className="shrink-0">
            <div className="text-[#141414] flex size-7 items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"></path>
              </svg>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ReservationDetails;