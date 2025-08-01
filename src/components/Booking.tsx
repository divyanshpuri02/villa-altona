import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Booking = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(2);
  const [loading, setLoading] = useState(false);

  const handleCheckAvailability = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    alert('Booking system is being set up!');
  };

  return (
    <section id="booking" className="bg-neutral-50 py-8">
      <div className="px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5"
          style={{ fontFamily: '"Noto Serif", serif' }}
        >
          Reserve Your Stay
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg border border-[#dbdbdb] p-8 luxury-shadow"
        >
          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[#141414] text-sm font-semibold mb-3" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full p-4 border border-[#dbdbdb] rounded-lg text-[#141414] bg-white focus:ring-2 focus:ring-[#141414] focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                />
              </div>
              <div>
                <label className="block text-[#141414] text-sm font-semibold mb-3" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full p-4 border border-[#dbdbdb] rounded-lg text-[#141414] bg-white focus:ring-2 focus:ring-[#141414] focus:border-transparent transition-all duration-300"
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                />
              </div>
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