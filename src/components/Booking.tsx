import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Booking = () => {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  return (
    <section id="booking" className="py-20 bg-white text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-8">
            Reserve Your <span className="text-gray-600">Experience</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-black/10 backdrop-blur-lg rounded-2xl p-8 border border-gray-200"
        >
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-black">Check-in Date</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  placeholder="Select check-in date"
                  className="w-full p-3 bg-black/10 border border-gray-300 rounded-lg text-black"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-black">Check-out Date</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  placeholder="Select check-out date"
                  className="w-full p-3 bg-black/10 border border-gray-300 rounded-lg text-black"
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="guests-select" className="block text-sm font-semibold mb-2 text-black">Number of Guests</label>
              <select
                id="guests-select"
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full p-3 bg-black/10 border border-gray-300 rounded-lg text-black"
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num} className="bg-gray-800">{num} Guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full blue-gradient text-white font-bold py-4 px-6 rounded-lg text-lg"
              onClick={() => alert('Booking system is being set up!')}
            >
              Check Availability
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

export default Booking
