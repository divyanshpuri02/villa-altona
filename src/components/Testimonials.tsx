import React from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      name: "Sarah Wellington",
      location: "New York, USA",
      title: "CEO, Fortune 500 Company",
      rating: 5,
      text: "Villa Royale redefined luxury for us. The impeccable service, breathtaking architecture, and attention to every detail made our anniversary celebration absolutely extraordinary. This is hospitality at its finest.",
      image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Lord James Mitchell",
      location: "London, UK",
      title: "Investment Banker",
      rating: 5,
      text: "Having stayed at the world's finest hotels, Villa Royale stands in a class of its own. The staff's anticipation of our needs was remarkable, and the villa's elegance is simply unmatched.",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    },
    {
      name: "Dr. Maria Rodriguez",
      location: "Barcelona, Spain",
      title: "Renowned Architect",
      rating: 5,
      text: "As an architect, I appreciate exceptional design. Villa Royale is a masterpiece that seamlessly blends luxury with functionality. Our family retreat here was nothing short of perfection.",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-black mb-6 font-serif">
            Distinguished <span className="text-gray-600">Testimonials</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Discover what makes Villa Royale extraordinary through the experiences 
            of our most discerning guests.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              className="glass-effect rounded-2xl p-8 relative hover:bg-black/10 transition-all duration-500 border border-gray-200 group"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <Quote className="h-12 w-12 text-blue-500 opacity-30 absolute top-6 right-6" />
              
              <div className="flex items-center mb-6">
                <motion.img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-blue-500/30"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
                <div>
                  <h4 className="text-lg font-semibold text-black font-serif">{testimonial.name}</h4>
                  <p className="text-blue-500 text-sm font-medium">{testimonial.title}</p>
                  <p className="text-gray-600 text-sm">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex items-center mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2 + i * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Star className="h-5 w-5 fill-blue-500 text-blue-500" />
                  </motion.div>
                ))}
              </div>

              <p className="text-gray-700 leading-relaxed italic">
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}