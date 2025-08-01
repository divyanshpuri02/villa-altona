import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Facebook, Instagram, Twitter, Youtube, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-3 mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Crown className="h-10 w-10 text-yellow-400" />
              </motion.div>
              <span className="text-3xl font-bold text-white font-serif"></span>
            </div>
            <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
              Villa Altona"
              Experience the pinnacle of luxury accommodation in Goa.  
              offers unparalleled elegance, world-class amenities, and unforgettable moments 
              that define true luxury living.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                <motion.a 
                  key={index}
                  href="#" 
                  className="bg-white/10 hover:bg-yellow-400 hover:text-black p-3 rounded-full transition-all duration-300 group"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-5 w-5 text-white group-hover:text-black transition-colors duration-300" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-semibold mb-6 text-white font-serif">Quick Links</h4>
            <ul className="space-y-3">
              {['About Villa', 'Amenities', 'Gallery', 'Booking', 'Contact'].map((item) => (
                <motion.li key={item}>
                  <motion.a 
                    href={`#${item.toLowerCase().replace(' ', '')}`} 
                    className="text-gray-300 hover:text-yellow-400 transition-colors duration-300 relative group"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-xl font-semibold mb-6 text-white font-serif">Contact</h4>
            <div className="space-y-4">
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ x: 5 }}
              >
                <Phone className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-300">+91 361 123 4567</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ x: 5 }}
              >
                <Mail className="h-5 w-5 text-yellow-400" />
                <span className="text-gray-300">reservations@villaaltona.com</span>
              </motion.div>
            </div>
            
            <div className="mt-6">
              <h5 className="text-lg font-semibold text-white mb-2">Newsletter</h5>
              <p className="text-gray-400 text-sm mb-4">Stay updated with exclusive offers</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 p-3 bg-white/10 border border-white/20 rounded-l-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
                <motion.button
                  className="gold-gradient text-black px-6 py-3 rounded-r-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Subscribe
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="border-t border-white/10 mt-12 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 Villa Altona. All rights reserved. Crafted with excellence.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Privacy Policy', 'Terms of Service', 'Cancellation Policy'].map((item) => (
                <motion.a 
                  key={item}
                  href="#" 
                  className="text-gray-400 hover:text-yellow-400 text-sm transition-colors duration-300"
                  whileHover={{ y: -2 }}
                >
                  {item}
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}