import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Facebook, Instagram, Twitter, Youtube, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
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
                <Crown className="h-10 w-10 text-blue-500" />
              </motion.div>
              <span className="text-3xl font-bold text-black font-serif">Villa Altona</span>
            </div>
            <p className="text-gray-700 mb-6 max-w-md leading-relaxed">
              Experience the pinnacle of luxury accommodation in Goa.  
              offers unparalleled elegance, world-class amenities, and unforgettable moments 
              that define true luxury living.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, index) => (
                <motion.a 
                  key={index}
                  href="#" 
                  className="bg-black/10 hover:bg-blue-500 hover:text-white p-3 rounded-full transition-all duration-300 group border border-gray-200"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="h-5 w-5 text-black group-hover:text-white transition-colors duration-300" />
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
            <h4 className="text-xl font-semibold mb-6 text-black font-serif">Quick Links</h4>
            <ul className="space-y-3">
              {['About Villa', 'Amenities', 'Gallery', 'Booking', 'Contact'].map((item) => (
                <motion.li key={item}>
                  <motion.a 
                    href={`#${item.toLowerCase().replace(' ', '')}`} 
                    className="text-gray-700 hover:text-blue-500 transition-colors duration-300 relative group"
                    whileHover={{ x: 5 }}
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 group-hover:w-full transition-all duration-300"></span>
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
            <h4 className="text-xl font-semibold mb-6 text-black font-serif">Contact</h4>
            <div className="space-y-4">
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ x: 5 }}
              >
                <Phone className="h-5 w-5 text-blue-500" />
                <span className="text-gray-700">+91 361 123 4567</span>
              </motion.div>
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ x: 5 }}
              >
                <Mail className="h-5 w-5 text-blue-500" />
                <span className="text-gray-700">reservations@villaaltona.com</span>
              </motion.div>
            </div>
            
            <div className="mt-6">
              <h5 className="text-lg font-semibold text-black mb-2">Newsletter</h5>
              <p className="text-gray-600 text-sm mb-4">Stay updated with exclusive offers</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 p-3 bg-black/10 border border-gray-300 rounded-l-lg text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <motion.button
                  className="blue-gradient text-white px-6 py-3 rounded-r-lg font-semibold"
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
          className="border-t border-gray-200 mt-12 pt-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm">
              © 2025 Villa Altona. All rights reserved. Crafted with excellence.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Privacy Policy', 'Terms of Service', 'Cancellation Policy'].map((item) => (
                <motion.a 
                  key={item}
                  href="#" 
                  className="text-gray-600 hover:text-blue-500 text-sm transition-colors duration-300"
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