import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import BookingConfirmationModal from './BookingConfirmationModal';

const Booking = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleCheckAvailability = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setShowConfirmation(true);
  };

  return (
    <>
      <section id="booking" className="bg-neutral-50 py-8">
        <div className="px-4">
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

          <div className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex max-w-[480px] flex-wrap items-end gap-4 px-0 py-3"
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
              className="flex max-w-[480px] flex-wrap items-end gap-4 px-0 py-3"
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
              className="flex max-w-[480px] flex-wrap items-end gap-4 px-0 py-3"
            >
              <label className="flex flex-col min-w-40 flex-1">
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none h-14 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal"
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                >
                  {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                    <option key={num} value={num}>
                      {num} Guest{num > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex px-0 py-3"
            >
              <motion.button
                type="button"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#141414] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-800 transition-all duration-300 disabled:opacity-50"
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
          guests: guests
        }}
      />
    </>
  );
};

export default Booking;
            </div>
            
            <div>
              <label htmlFor="guests-select" className="block text-[#141414] text-sm font-semibold mb-3" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                Number of Guests
              </label>
              <select
                id="guests-select"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full p-4 border border-[#dbdbdb] rounded-lg text-[#141414] bg-white focus:ring-2 focus:ring-[#141414] focus:border-transparent transition-all duration-300"
                style={{ fontFamily: '"Noto Sans", sans-serif' }}
              >
                {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                  <option key={num} value={num}>
                    {num} Guest{num > 1 ? 's' : ''}
                  </option>
                ))}
              </select>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-[#141414] text-white font-bold py-5 px-6 rounded-lg text-base tracking-[0.015em] hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
              style={{ fontFamily: '"Noto Sans", sans-serif' }}
              onClick={handleCheckAvailability}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Checking Availability...
                </>
              ) : (
                'Check Availability'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

export default Booking;