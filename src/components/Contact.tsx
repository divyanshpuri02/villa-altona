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
          className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5"
        >
          Contact Information
        </motion.h2>

        <div className="space-y-6">
          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex gap-3 rounded-lg border border-[#dbdbdb] bg-neutral-50 p-4 items-center"
            >
              <Phone className="h-6 w-6 text-[#141414]" />
              <div>
                <h3 className="text-[#141414] text-base font-bold leading-tight">24/7 Concierge</h3>
                <p className="text-neutral-500 text-sm">+91 361 123 4567</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex gap-3 rounded-lg border border-[#dbdbdb] bg-neutral-50 p-4 items-center"
            >
              <Mail className="h-6 w-6 text-[#141414]" />
              <div>
                <h3 className="text-[#141414] text-base font-bold leading-tight">Email</h3>
                <p className="text-neutral-500 text-sm">reservations@villaaltona.com</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex gap-3 rounded-lg border border-[#dbdbdb] bg-neutral-50 p-4 items-center"
            >
              <MapPin className="h-6 w-6 text-[#141414]" />
              <div>
                <h3 className="text-[#141414] text-base font-bold leading-tight">Address</h3>
                <p className="text-neutral-500 text-sm">Candolim Beach, Goa 403515</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex gap-3 rounded-lg border border-[#dbdbdb] bg-neutral-50 p-4 items-center"
            >
              <Clock className="h-6 w-6 text-[#141414]" />
              <div>
                <h3 className="text-[#141414] text-base font-bold leading-tight">Service Hours</h3>
                <p className="text-neutral-500 text-sm">24/7 Guest Services</p>
              </div>
            </motion.div>
          </div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            className="bg-neutral-50 rounded-lg border border-[#dbdbdb] p-6"
          >
            <h3 className="text-[#141414] text-lg font-bold leading-tight mb-6">Send us a Message</h3>
            
            {success ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-[#141414] mb-2">Message Sent!</h4>
                <p className="text-neutral-500">We'll get back to you within 24 hours.</p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-4 text-[#141414] hover:text-neutral-600 transition-colors duration-200"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#141414] text-sm font-medium mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full p-3 border border-[#dbdbdb] rounded-lg text-[#141414] bg-neutral-50 focus:ring-2 focus:ring-[#141414] focus:border-transparent"
                      placeholder="Your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-[#141414] text-sm font-medium mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full p-3 border border-[#dbdbdb] rounded-lg text-[#141414] bg-neutral-50 focus:ring-2 focus:ring-[#141414] focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#141414] text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-3 border border-[#dbdbdb] rounded-lg text-[#141414] bg-neutral-50 focus:ring-2 focus:ring-[#141414] focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>

                <div>
                  <label className="block text-[#141414] text-sm font-medium mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    required
                    rows={4}
                    className="w-full p-3 border border-[#dbdbdb] rounded-lg text-[#141414] bg-neutral-50 focus:ring-2 focus:ring-[#141414] focus:border-transparent resize-none"
                    placeholder="Tell us about your ideal stay at Villa Altona..."
                  />
                </div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#141414] text-white font-bold py-4 px-6 rounded-lg transition-all duration-300 text-base flex items-center justify-center disabled:opacity-50 hover:bg-gray-800"
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

                {error && <p className="text-red-600 text-sm">{error}</p>}
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Contact;