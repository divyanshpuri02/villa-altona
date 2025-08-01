import { motion } from 'framer-motion';

export default function Hero() {
  const scrollToBooking = () => {
    const element = document.getElementById('booking');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="bg-neutral-50 pt-20">
      <div className="@container">
        <div className="@[480px]:px-4 @[480px]:py-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="bg-cover bg-center flex flex-col justify-end overflow-hidden bg-neutral-50 @[480px]:rounded-xl min-h-80"
            style={{
              backgroundImage: 'linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop")'
            }}
          >
            <div className="flex justify-center gap-2 p-5">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: i === 0 ? 1 : 0.5, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="size-1.5 rounded-full bg-neutral-50"
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="px-4 py-6">
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.15em] flex-1 text-center pr-12"
          style={{ fontFamily: '"Noto Serif", serif' }}
        >
        Villa Altona - Luxury Retreat
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-[#141414] text-base font-normal leading-normal mb-8"
          style={{ fontFamily: '"Noto Sans", sans-serif' }}
        >
          Experience unparalleled luxury in our exclusive villa nestled in the heart of Goa. 
          This spacious retreat features six bedrooms, each with an en-suite bathroom, a fully 
          equipped gourmet kitchen, a private infinity pool, and sprawling tropical gardens. 
          Perfect for families or groups seeking an extraordinary escape.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex gap-3"
        >
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToBooking}
            className="flex-1 bg-[#141414] text-white rounded-lg h-14 px-6 font-bold text-base tracking-[0.015em] hover:bg-gray-800 transition-all duration-300 luxury-shadow"
          >
            Book Now
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex-1 bg-[#ededed] text-[#141414] rounded-lg h-14 px-6 font-bold text-base tracking-[0.015em] hover:bg-gray-300 transition-all duration-300 luxury-shadow"
          >
            Contact Host
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}