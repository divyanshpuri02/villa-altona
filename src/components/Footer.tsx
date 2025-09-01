import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube, Send, Loader2 } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const quickLinks = [
    { label: 'About Villa', href: '#about' },
    { label: 'Amenities', href: '#amenities' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Reviews', href: '#testimonials' },
    { label: 'Booking', href: '#booking' },
    { label: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'YouTube' },
  ];

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setSubscribed(true);
    setEmail('');
    setTimeout(() => setSubscribed(false), 3000);
  };

  return (
    <footer className="bg-neutral-50">
      {/* Main Footer Content */}
      <div className="px-4 py-12 border-t border-[#ededed]">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Villa Information */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="luxury-heading text-[#141414] text-xl font-bold leading-tight">Villa Altona</h3>
              <p className="luxury-text text-neutral-500 text-sm leading-relaxed">
                Experience unparalleled luxury in our exclusive villa nestled in the heart of Goa. 
                Your extraordinary escape awaits.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-[#141414]" />
                  <span className="luxury-text text-neutral-500 text-sm">+91 361 123 4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-[#141414]" />
                  <span className="luxury-text text-neutral-500 text-sm">reservations@villaaltona.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-[#141414]" />
                  <span className="luxury-text text-neutral-500 text-sm">Candolim Beach, Goa 403515</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="luxury-heading text-[#141414] text-xl font-bold leading-tight">Quick Links</h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <motion.a
                      href={link.href}
                      whileHover={{ x: 5 }}
                      className="luxury-text text-neutral-500 text-sm hover:text-[#141414] transition-colors duration-200"
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(link.href.substring(1))?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      {link.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Services */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="luxury-heading text-[#141414] text-xl font-bold leading-tight">Services</h3>
              <ul className="space-y-3">
                <li className="luxury-text text-neutral-500 text-sm">24/7 Concierge</li>
                <li className="luxury-text text-neutral-500 text-sm">Private Chef</li>
                <li className="luxury-text text-neutral-500 text-sm">Housekeeping</li>
                <li className="luxury-text text-neutral-500 text-sm">Transportation</li>
                <li className="luxury-text text-neutral-500 text-sm">Spa Services</li>
                <li className="luxury-text text-neutral-500 text-sm">Event Planning</li>
              </ul>
            </motion.div>

            {/* Newsletter */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              <h3 className="luxury-heading text-[#141414] text-xl font-bold leading-tight">Stay Updated</h3>
              <p className="luxury-text text-neutral-500 text-sm leading-relaxed">
                Subscribe to our newsletter for exclusive offers and updates.
              </p>
              
              {subscribed ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Send className="h-4 w-4 text-white" />
                  </div>
                  <p className="luxury-text text-green-600 text-sm font-medium">Successfully subscribed!</p>
                </motion.div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="luxury-text w-full p-3 border border-[#dbdbdb] rounded-lg text-[#141414] bg-white focus:ring-2 focus:ring-[#141414] focus:border-transparent text-sm transition-all duration-300"
                  />
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="luxury-text w-full bg-[#141414] text-white font-medium py-3 px-4 rounded-lg text-sm hover:bg-gray-800 transition-all duration-300 flex items-center justify-center disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4 mr-2" />
                        Subscribing...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Subscribe
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>

          {/* Social Media */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
            className="mt-12 pt-8 border-t border-[#ededed]"
          >
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h4 className="luxury-heading text-[#141414] text-lg font-bold mb-3">Follow Us</h4>
                <div className="flex gap-4">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      whileHover={{ scale: 1.2, y: -2 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-10 h-10 bg-[#141414] text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors duration-300"
                      aria-label={social.label}
                    >
                      <social.icon className="h-5 w-5" />
                    </motion.a>
                  ))}
                </div>
              </div>
              
              <div className="text-center md:text-right">
                <p className="luxury-text text-neutral-500 text-sm mb-2">Experience Luxury</p>
                <p className="luxury-heading text-[#141414] text-lg font-bold">Villa Altona</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="h-5 bg-neutral-50"></div>
      
      {/* Copyright */}
      <div className="px-4 py-4 border-t border-[#ededed]">
        <p className="text-neutral-500 text-sm text-center" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
          © 2025 Villa Altona. All rights reserved. | Privacy Policy | Terms of Service
        </p>
      </div>
    </footer>
  );
}