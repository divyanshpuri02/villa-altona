import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import BookingConfirmationModal from './BookingConfirmationModal';

interface BookingProps {
  isAuthenticated: boolean;
  onShowAuth: () => void;
}

export default function Booking({ isAuthenticated, onShowAuth }: BookingProps) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errors, setErrors] = useState({
    checkIn: false,
    checkOut: false,
    dateOrder: false
  });

  const validateForm = () => {
    const newErrors = {
      checkIn: !checkIn,
      checkOut: !checkOut,
      dateOrder: false
    };

    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      newErrors.dateOrder = checkOutDate <= checkInDate;
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const isFormValid = () => {
    return checkIn && checkOut && new Date(checkOut) > new Date(checkIn);
  };

  const handleCheckAvailability = async () => {
    if (!isAuthenticated) {
      onShowAuth();
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setShowConfirmation(true);
  };

  return (
    <>
      <section id="booking" className="bg-neutral-50 py-8">
        <div className="w-full max-w-none px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-[#141414] text-[28px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5"
            style={{ fontFamily: '"Noto Serif", serif' }}
          >
            Reserve Your Stay
          </motion.h2>

          <div className="w-full space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex w-full flex-wrap items-end gap-4 px-0 py-3"
            >
              <label className="flex flex-col min-w-40 flex-1">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  placeholder="Check-in Date"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none h-14 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal"
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                />
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex w-full flex-wrap items-end gap-4 px-0 py-3"
            >
              <label className="flex flex-col min-w-40 flex-1">
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  placeholder="Check-out Date"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none h-14 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal"
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                />
              </label>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex w-full flex-wrap items-end gap-4 px-0 py-3"
            >
              <label className="flex flex-col min-w-40 flex-1 mr-2">
                <span className="text-[#141414] text-sm font-medium mb-2" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                  Adults
                </span>
                <select
                  value={adults}
                  onChange={(e) => setAdults(Number(e.target.value))}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none h-14 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal"
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                >
                  {Array.from({length: 12}, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {num} Adult{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </label>
              
              <label className="flex flex-col min-w-40 flex-1">
                <span className="text-[#141414] text-sm font-medium mb-2" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                  Children
                </span>
                <select
                  value={children}
                  onChange={(e) => setChildren(Number(e.target.value))}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none h-14 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal"
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                >
                  {Array.from({length: 7}, (_, i) => i).map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? 'Child' : 'Children'}
                    </option>
                  ))}
                </select>
              </label>
            </motion.div>

            {/* Error Messages */}
            {(errors.checkIn || errors.checkOut || errors.dateOrder) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex w-full px-0 py-2"
              >
                <div className="w-full bg-red-50 border border-red-200 rounded-xl p-3">
                  <div className="flex items-center gap-2 text-red-600">
                    <AlertCircle className="h-4 w-4" />
                    <span className="text-sm font-medium" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                      Please fix the following errors:
                    </span>
                  </div>
                  <ul className="mt-2 text-sm text-red-600 space-y-1" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                    {errors.checkIn && (
                      <li>• Please select a check-in date</li>
                    )}
                    {errors.checkOut && (
                      <li>• Please select a check-out date</li>
                    )}
                    {errors.dateOrder && (
                      <li>• Check-out date must be after check-in date</li>
                    )}
                  </ul>
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex w-full px-0 py-3"
            >
              <motion.button
                type="button"
                disabled={loading || !isFormValid()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-4 text-base font-bold leading-normal tracking-[0.015em] transition-all duration-300 ${
                  isFormValid() 
                    ? 'bg-[#141414] text-white hover:bg-gray-800' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } disabled:opacity-50`}
                style={{ fontFamily: '"Noto Sans", sans-serif' }}
                onClick={handleCheckAvailability}
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Checking Availability...
                  </>
                ) : (
                  <span className="truncate">Check Availability</span>
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </section>

      <BookingConfirmationModal 
        isOpen={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        bookingData={{
          checkIn: checkIn,
          checkOut: checkOut,
          adults: adults,
          children: children,
        }}
      />
    </>
  );
}