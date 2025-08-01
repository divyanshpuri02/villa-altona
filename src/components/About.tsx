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
        >
          About this place
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-[#141414] text-base font-normal leading-normal pb-3 pt-1"
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
          className="text-[#141414] text-base font-normal leading-normal pb-6"
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
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center p-4 rounded-lg border border-[#dbdbdb] bg-neutral-50"
            >
              <feature.icon className="h-8 w-8 text-[#141414] mb-2" />
              <div className="text-2xl font-bold text-[#141414] mb-1">{feature.value}</div>
              <div className="text-sm text-neutral-500 text-center">{feature.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-6 p-4 rounded-lg border border-[#dbdbdb] bg-neutral-50"
        >
          <div className="text-sm text-neutral-500 mb-1">Starting from</div>
          <div className="text-3xl font-bold text-[#141414]">₹100,000</div>
          <div className="text-sm text-neutral-500">per night</div>
        </motion.div>
      </div>
    </section>
  );
}