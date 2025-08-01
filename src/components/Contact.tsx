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
    <section id="contact" className="bg-neutral-50 py-8">
      <div className="px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="luxury-heading text-[#141414] text-[32px] md:text-[38px] font-bold leading-tight tracking-[-0.02em] pb-4 pt-6"
        >
          Contact Information
        </motion.h2>

        <div className="space-y-6">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex gap-4 rounded-lg border border-[#dbdbdb] bg-gradient-to-br from-neutral-50 to-neutral-100 p-5 items-center hover:shadow-lg transition-all duration-300"
            >
              <Phone className="h-7 w-7 text-[#141414]" />
              <div>
                <h3 className="luxury-text text-[#141414] text-base font-bold leading-tight">24/7 Concierge</h3>
                <p className="luxury-text text-neutral-500 text-sm font-medium">+91 361 123 4567</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex gap-4 rounded-lg border border-[#dbdbdb] bg-gradient-to-br from-neutral-50 to-neutral-100 p-5 items-center hover:shadow-lg transition-all duration-300"
            >
              <Mail className="h-7 w-7 text-[#141414]" />
              <div>
                <h3 className="luxury-text text-[#141414] text-base font-bold leading-tight">Email</h3>
                <p className="luxury-text text-neutral-500 text-sm font-medium">reservations@villaaltona.com</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex gap-4 rounded-lg border border-[#dbdbdb] bg-gradient-to-br from-neutral-50 to-neutral-100 p-5 items-center hover:shadow-lg transition-all duration-300"
            >
              <MapPin className="h-7 w-7 text-[#141414]" />
              <div>
                <h3 className="luxury-text text-[#141414] text-base font-bold leading-tight">Address</h3>
                <p className="luxury-text text-neutral-500 text-sm font-medium">Candolim Beach, Goa 403515</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex gap-4 rounded-lg border border-[#dbdbdb] bg-gradient-to-br from-neutral-50 to-neutral-100 p-5 items-center hover:shadow-lg transition-all duration-300"
            >
              <Clock className="h-7 w-7 text-[#141414]" />
              <div>
                <h3 className="luxury-text text-[#141414] text-base font-bold leading-tight">Service Hours</h3>
                <p className="luxury-text text-neutral-500 text-sm font-medium">24/7 Guest Services</p>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-neutral-50 to-neutral-100 rounded-lg border border-[#dbdbdb] p-8 luxury-shadow"
          >
            <h3 className="luxury-heading text-[#141414] text-2xl font-bold leading-tight mb-8">Send us a Message</h3>
            
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h4 className="luxury-heading text-xl font-bold text-[#141414] mb-2">Message Sent!</h4>
                <p className="luxury-text text-neutral-500">We'll get back to you within 24 hours.</p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="luxury-text mt-4 text-[#141414] hover:text-neutral-600 transition-colors duration-200"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="luxury-text block text-[#141414] text-sm font-semibold mb-3">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="luxury-text w-full p-4 border border-[#dbdbdb] rounded-lg text-[#141414] bg-white focus:ring-2 focus:ring-[#141414] focus:border-transparent transition-all duration-300"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="luxury-text block text-[#141414] text-sm font-semibold mb-3">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="luxury-text w-full p-4 border border-[#dbdbdb] rounded-lg text-[#141414] bg-white focus:ring-2 focus:ring-[#141414] focus:border-transparent transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="luxury-text block text-[#141414] text-sm font-semibold mb-3">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="luxury-text w-full p-4 border border-[#dbdbdb] rounded-lg text-[#141414] bg-white focus:ring-2 focus:ring-[#141414] focus:border-transparent transition-all duration-300"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="luxury-text block text-[#141414] text-sm font-semibold mb-3">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    rows={4}
                    className="luxury-text w-full p-4 border border-[#dbdbdb] rounded-lg text-[#141414] bg-white focus:ring-2 focus:ring-[#141414] focus:border-transparent resize-none transition-all duration-300"
                    placeholder="Tell us about your ideal stay at Villa Altona..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="luxury-text w-full bg-[#141414] text-white font-bold py-5 px-6 rounded-lg transition-all duration-300 text-base flex items-center justify-center disabled:opacity-50 hover:bg-gray-800 luxury-shadow"
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}
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

                {error && <p className="luxury-text text-red-600 text-sm font-medium">{error}</p>}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;