import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { sendContactEmail, ContactFormData } from '../services/emailService';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await sendContactEmail(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };


  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-5xl lg:text-6xl font-bold text-black mb-6 font-serif">
            Connect With <span className="text-gray-600">Excellence</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Ready to experience Villa Altona? Our luxury concierge team is available 
            24/7 to craft your perfect escape.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <div className="glass-effect rounded-2xl p-8 luxury-shadow border border-gray-200">
              <h3 className="text-3xl font-bold text-black mb-8 font-serif">Contact Information</h3>
              
              <div className="space-y-6">
                <motion.div 
                  className="flex items-start space-x-4"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <Phone className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">24/7 Concierge</h4>
                    <p className="text-gray-700">+62 361 123 4567</p>
                    <p className="text-gray-700">+1 (555) 123-4567</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Email</h4>
                    <p className="text-gray-700">reservations@villaroyale.com</p>
                    <p className="text-gray-700">concierge@villaroyale.com</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Address</h4>
                    <p className="text-gray-700">Jalan Pantai Suluban<br />Uluwatu, Goa 80361<br />India</p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start space-x-4"
                  whileHover={{ x: 10 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-blue-500/20 p-3 rounded-full">
                    <Clock className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-black mb-1">Service Hours</h4>
                    <p className="text-gray-700">24/7 Guest Services</p>
                    <p className="text-gray-700">Check-in: 3:00 PM</p>
                    <p className="text-gray-700">Check-out: 11:00 AM</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            className="glass-effect rounded-2xl p-8 luxury-shadow border border-gray-200"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-bold text-black mb-8 font-serif">Send us a Message</h3>
            
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12"
              >
                <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                <h4 className="text-2xl font-bold text-black mb-2">Message Sent!</h4>
                <p className="text-gray-700">We'll get back to you within 24 hours.</p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-6 text-blue-500 hover:text-blue-400 transition-colors duration-200"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full p-4 bg-black/10 border border-gray-300 rounded-lg text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-black mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full p-4 bg-black/10 border border-gray-300 rounded-lg text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-4 bg-black/10 border border-gray-300 rounded-lg text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    rows={6}
                    className="w-full p-4 bg-black/10 border border-gray-300 rounded-lg text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300"
                    placeholder="Tell us about your ideal stay at Villa Altona ..."
                  ></textarea>
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full blue-gradient text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 text-lg flex items-center justify-center disabled:opacity-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"
                    />
                  ) : (
                    <Send className="h-5 w-5 mr-2" />
                  )}
                  {loading ? 'Sending...' : 'Send Message'}
                </motion.button>

                {success && <p className="text-green-600">Message sent successfully!</p>}
                {error && <p className="text-red-600">{error}</p>}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;