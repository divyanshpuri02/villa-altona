import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, ChevronDown } from 'lucide-react';
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
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "How do I book a villa?",
      answer: "You can book directly through our website by selecting your dates and completing the booking form. We'll confirm your reservation within 24 hours."
    },
    {
      question: "What is included in the rental?",
      answer: "The rental includes all amenities listed, housekeeping service, concierge support, and access to all villa facilities including the pool and gardens."
    },
    {
      question: "What is the cancellation policy?",
      answer: "Free cancellation up to 48 hours before check-in. Cancellations within 48 hours are subject to a 50% charge. No-shows are non-refundable."
    }
  ];

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
          style={{ fontFamily: '"Noto Serif", serif' }}
        >
          Contact Us
        </motion.h2>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-[#141414] text-base font-normal leading-normal pb-3 pt-1"
          style={{ fontFamily: '"Noto Sans", sans-serif' }}
        >
          We're here to assist. Reach out with any questions or concerns, and we'll respond promptly.
        </motion.p>

        {/* Contact Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 bg-neutral-50 px-0 min-h-[72px] py-2"
        >
          <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12">
            <Phone className="h-6 w-6" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
              Phone
            </p>
            <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
              Available 24/7
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 bg-neutral-50 px-0 min-h-[72px] py-2"
        >
          <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12">
            <Mail className="h-6 w-6" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
              Email
            </p>
            <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
              Response within 24 hours
            </p>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5"
          style={{ fontFamily: '"Noto Serif", serif' }}
        >
          Contact Form
        </motion.h2>

        {success ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-bold text-[#141414] mb-2" style={{ fontFamily: '"Noto Serif", serif' }}>Message Sent!</h4>
            <p className="text-neutral-500" style={{ fontFamily: '"Noto Sans", sans-serif' }}>We'll get back to you within 24 hours.</p>
            <button
              type="button"
              onClick={() => setSuccess(false)}
              className="mt-4 text-[#141414] hover:text-neutral-600 transition-colors duration-200"
              style={{ fontFamily: '"Noto Sans", sans-serif' }}
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              viewport={{ once: true }}
              className="flex max-w-[480px] flex-wrap items-end gap-4 px-0 py-3"
            >
              <label className="flex flex-col min-w-40 flex-1">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Your Name"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none h-14 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal"
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                />
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="flex max-w-[480px] flex-wrap items-end gap-4 px-0 py-3"
            >
              <label className="flex flex-col min-w-40 flex-1">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  placeholder="Your Email"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none h-14 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal"
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                />
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              viewport={{ once: true }}
              className="flex max-w-[480px] flex-wrap items-end gap-4 px-0 py-3"
            >
              <label className="flex flex-col min-w-40 flex-1">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  placeholder="Subject"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none h-14 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal"
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                />
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="flex max-w-[480px] flex-wrap items-end gap-4 px-0 py-3"
            >
              <label className="flex flex-col min-w-40 flex-1">
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  required
                  placeholder="Your Message"
                  className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#141414] focus:outline-0 focus:ring-0 border-none bg-[#ededed] focus:border-none min-h-36 placeholder:text-neutral-500 p-4 text-base font-normal leading-normal"
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                />
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              viewport={{ once: true }}
              className="flex px-0 py-3"
            >
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-4 flex-1 bg-white text-[#141414] text-sm font-bold leading-normal tracking-[0.015em] border border-[#dbdbdb] hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                style={{ fontFamily: '"Noto Sans", sans-serif' }}
              >
                {loading ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="h-4 w-4 border-2 border-[#141414] border-t-transparent rounded-full mr-2"
                    />
                    Sending...
                  </>
                ) : (
                  <span className="truncate">Send Message</span>
                )}
              </motion.button>
            </motion.div>

            {error && <p className="text-red-600 text-sm font-medium" style={{ fontFamily: '"Noto Sans", sans-serif' }}>{error}</p>}
          </form>
        )}

        {/* FAQ Section */}
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          viewport={{ once: true }}
          className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5"
          style={{ fontFamily: '"Noto Serif", serif' }}
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, index) => (
            <motion.details
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 + index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col rounded-xl border border-[#dbdbdb] bg-neutral-50 px-[15px] py-[7px] group"
              open={openFaq === index}
              onToggle={(e) => setOpenFaq((e.target as HTMLDetailsElement).open ? index : null)}
            >
              <summary className="flex cursor-pointer items-center justify-between gap-6 py-2 list-none">
                <p className="text-[#141414] text-sm font-medium leading-normal" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                  {faq.question}
                </p>
                <motion.div
                  animate={{ rotate: openFaq === index ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-[#141414]"
                >
                  <ChevronDown className="h-5 w-5" />
                </motion.div>
              </summary>
              {openFaq === index && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-neutral-500 text-sm font-normal leading-normal pb-2"
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                >
                  {faq.answer}
                </motion.p>
              )}
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
};
          </div>

export default Contact;