import { motion } from 'framer-motion';
import { Users, Home, Bed, Bath } from 'lucide-react';

export default function About() {
  const features = [
    { icon: Users, label: 'Up to 12 Guests', value: '12' },
    { icon: Bed, label: 'Bedrooms', value: '6' },
    { icon: Bath, label: 'Bathrooms', value: '8' },
    { icon: Home, label: 'Square Feet', value: '8,500' },
  ];

  return (
    <section id="about" className="bg-neutral-50 py-8">
      <div className="px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5"
          style={{ fontFamily: '"Noto Serif", serif' }}
        >
          About this place
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-[#141414] text-base font-normal leading-normal pb-3 pt-1"
          style={{ fontFamily: '"Noto Sans", sans-serif' }}
        >
          Villa Altona is a luxurious retreat nestled in the heart of Goa, offering breathtaking 
          views of the Arabian Sea and lush tropical landscapes. This spacious villa features six 
          bedrooms, each with an en-suite bathroom, a fully equipped kitchen, a private infinity pool, 
          and sprawling gardens. Perfect for families or groups seeking a tranquil escape.
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-neutral-500 text-m font-medium leading-normal tracking-[0.015em]"
        >
          Experience unparalleled luxury with world-class amenities including a private spa, 
          state-of-the-art fitness center, and dedicated concierge service. Every detail has 
          been crafted to ensure your stay transcends all expectations.
        </motion.p>

        <div className="grid grid-cols-2 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-6 rounded-lg border border-[#dbdbdb] bg-neutral-50 hover:shadow-lg transition-all duration-300"
            >
              <feature.icon className="h-10 w-10 text-[#141414] mb-3" />
              <div className="luxury-heading text-3xl font-bold text-[#141414] mb-2">{feature.value}</div>
              <div className="luxury-text text-sm text-neutral-500 text-center font-medium">{feature.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-8 p-6 rounded-lg border border-[#dbdbdb] bg-gradient-to-br from-neutral-50 to-neutral-100 hover:shadow-lg transition-all duration-300"
        >
          <div className="luxury-text text-sm text-neutral-500 mb-2 font-medium">Starting from</div>
          <div className="luxury-heading text-4xl font-bold text-[#141414] mb-1">₹100,000</div>
          <div className="luxury-text text-sm text-neutral-500 font-medium">per night</div>
        </motion.div>
      </div>
    </section>
  );
}