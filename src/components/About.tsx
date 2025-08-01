import { motion } from 'framer-motion';
import { Users, Home, Bed, Bath, Star, Award } from 'lucide-react';

export default function About() {
  const features = [
    { icon: Users, label: 'Up to 12 Guests', value: '12' },
    { icon: Bed, label: 'Bedrooms', value: '6' },
    { icon: Bath, label: 'Bathrooms', value: '8' },
    { icon: Home, label: 'Square Feet', value: '8,500' },
  ];

  const awards = [
    { icon: Award, title: 'World Luxury Hotel Awards', year: '2024' },
    { icon: Star, title: 'Forbes 5-Star Rating', year: '2025' },
  ];

  return (
    <section id="about" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="text-5xl lg:text-6xl font-bold text-white mb-6 font-serif">
              A Sanctuary of 
              <span className="text-yellow-400"> Excellence</span>
            </h2>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
               Villa Altona stands as the epitome of architectural mastery and refined luxury. 
              Nestled in Goa's most exclusive enclave, our villa represents the pinnacle of 
              sophisticated living where every detail has been crafted to perfection.
            </p>
            <p className="text-lg text-gray-300 mb-10 leading-relaxed">
              Experience unparalleled luxury in our meticulously designed spaces. From the 
              infinity pool that seems to merge with the horizon to our world-class spa 
              amenities, Villa Altona ensures your stay transcends all expectations.
            </p>

            {/* Awards */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-white mb-4">Recognition</h3>
              <div className="flex flex-wrap gap-4">
                {awards.map((award, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center space-x-2 glass-effect px-4 py-2 rounded-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 }}
                    viewport={{ once: true }}
                  >
                    <award.icon className="h-5 w-5 text-yellow-400" />
                    <span className="text-sm text-white">{award.title} {award.year}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="text-center p-6 glass-effect rounded-xl hover:bg-white/10 transition-all duration-300"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                >
                  <feature.icon className="h-10 w-10 text-yellow-400 mx-auto mb-3" />
                  <div className="text-3xl font-bold text-white mb-1">{feature.value}</div>
                  <div className="text-sm text-gray-300">{feature.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop" 
                alt="Villa Interior" 
                className="rounded-2xl luxury-shadow w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
            </div>
            
            <motion.div 
              className="absolute -bottom-8 -right-8 glass-effect p-8 rounded-xl luxury-shadow border border-white/20"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="text-sm text-gray-300 mb-1">Starting from</div>
              <div className="text-4xl font-bold text-yellow-400">₹100000</div>
              <div className="text-sm text-gray-300">per night</div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}