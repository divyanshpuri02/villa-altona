import { motion } from 'framer-motion';
import { Wifi, Car, Waves, Tv, ChefHat, Wind, Bell as CallBell, Crown, Mouse as House, Dumbbell } from 'lucide-react';

export default function Amenities() {
  const amenities = [
    { icon: Waves, title: 'Pool' },
    { icon: Wifi, title: 'Wifi' },
    { icon: Car, title: 'Parking' },
    { icon: Tv, title: 'TV' },
    { icon: ChefHat, title: 'Kitchen' },
    { icon: Wind, title: 'Air Conditioning' },
  ];

  const services = [
    { icon: CallBell, title: 'Concierge' },
    { icon: Crown, title: 'Private Chef' },
    { icon: House, title: 'Housekeeping' },
    { icon: Car, title: 'Transportation' },
    { icon: Dumbbell, title: 'Fitness Center' },
    { icon: Waves, title: 'Spa Services' },
  ];

  return (
    <section id="amenities" className="bg-neutral-50 py-8">
      <div className="px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-[#141414] text-[28px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5"
          style={{ fontFamily: '"Noto Serif", serif' }}
        >
          Amenities
        </motion.h2>
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 mb-8">
          {amenities.map((amenity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-1 gap-4 rounded-lg border border-[#dbdbdb] bg-neutral-50 p-5 items-center hover:bg-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <amenity.icon className="h-6 w-6 text-[#141414]" />
              <h3 className="text-[#141414] text-base font-bold leading-tight" style={{ fontFamily: '"Noto Sans", sans-serif' }}>{amenity.title}</h3>
            </motion.div>
          ))}
        </div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-[#141414] text-[28px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5"
          style={{ fontFamily: '"Noto Serif", serif' }}
        >
          Services
        </motion.h2>
        
        <div className="grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-1 gap-4 rounded-lg border border-[#dbdbdb] bg-neutral-50 p-5 items-center hover:bg-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <service.icon className="h-6 w-6 text-[#141414]" />
              <h3 className="text-[#141414] text-base font-bold leading-tight" style={{ fontFamily: '"Noto Sans", sans-serif' }}>{service.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}