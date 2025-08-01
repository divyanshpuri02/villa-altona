import React from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  Car, 
  Waves, 
  Trees, 
  ChefHat as Chef, 
  Dumbbell, 
  Wind, 
  Shield, 
  Coffee, 
  Tv, 
  Bath, 
  Flower 
} from 'lucide-react';

export default function Amenities() {
  const amenities = [
    { icon: Waves, title: 'Infinity Pool', description: 'Stunning infinity pool with panoramic ocean views' },
    { icon: Chef, title: 'Private Chef', description: 'Michelin-trained chefs for exquisite dining experiences' },
    { icon: Car, title: 'Luxury Transport', description: 'Premium vehicles with professional chauffeurs' },
    { icon: Dumbbell, title: 'Private Gym', description: 'State-of-the-art fitness center with personal trainer' },
    { icon: Trees, title: 'Tropical Gardens', description: 'Meticulously landscaped botanical paradise' },
    { icon: Bath, title: 'Spa Sanctuary', description: 'World-class spa treatments and wellness therapies' },
    { icon: Wifi, title: 'Ultra-Fast WiFi', description: 'Fiber-optic internet throughout the property' },
    { icon: Wind, title: 'Climate Control', description: 'Advanced climate systems in every room' },
    { icon: Shield, title: 'Concierge Service', description: '24/7 luxury concierge and security services' },
    { icon: Coffee, title: 'Butler Service', description: 'Dedicated personal butler for ultimate comfort' },
    { icon: Tv, title: 'Entertainment', description: 'Premium entertainment systems and private cinema' },
    { icon: Flower, title: 'Daily Service', description: 'Meticulous housekeeping and turndown service' },
  ];

  return (
    <section id="amenities" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-black mb-6 font-serif">
            Unparalleled <span className="text-gray-600">Amenities</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Every luxury amenity imaginable, meticulously curated to create an 
            experience that surpasses the extraordinary.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {amenities.map((amenity, index) => (
            <motion.div 
              key={index}
              className="glass-effect p-8 rounded-xl hover:bg-black/10 transition-all duration-500 transform hover:-translate-y-2 border border-gray-200 group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-blue-500/30 transition-colors duration-300"
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <amenity.icon className="h-8 w-8 text-blue-500" />
              </motion.div>
              <h3 className="text-xl font-semibold text-black mb-3 text-center font-serif">
                {amenity.title}
              </h3>
              <p className="text-gray-700 text-center text-sm leading-relaxed">
                {amenity.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}