import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Phone } from 'lucide-react';

const MapLocation: React.FC = () => {
  return (
    <section id="location" className="bg-neutral-50 py-8">
      <div className="px-4">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5"
          style={{ fontFamily: '"Noto Serif", serif' }}
        >
          Getting there
        </motion.h2>

        {/* Real Google Maps Embed */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex px-0 py-3"
        >
          <div className="w-full aspect-video rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3846.1234567890123!2d73.7519139!3d15.5166667!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bbfba106336b741%3A0x3c12f7681185f869!2sCandolim%20Beach%2C%20Goa!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="rounded-xl"
            />
          </div>
        </motion.div>

        {/* Address Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex items-center gap-4 bg-neutral-50 px-0 min-h-[72px] py-2"
        >
          <div className="text-[#141414] flex items-center justify-center rounded-lg bg-[#ededed] shrink-0 size-12">
            <MapPin className="h-6 w-6" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[#141414] text-base font-medium leading-normal line-clamp-1" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
              Address
            </p>
            <p className="text-neutral-500 text-sm font-normal leading-normal line-clamp-2" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
              Villa Altona, Candolim Beach Road, Candolim, Goa 403515, India
            </p>
          </div>
        </motion.div>

        {/* Location Details */}
        <div className="space-y-4 mt-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 bg-gradient-to-r from-neutral-50 to-neutral-100 p-4 rounded-lg border border-[#dbdbdb]"
          >
            <Navigation className="h-5 w-5 text-[#141414]" />
            <div>
              <p className="text-[#141414] text-sm font-medium" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                Distance to Beach
              </p>
              <p className="text-neutral-500 text-xs" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                2 minutes walk to Candolim Beach
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 bg-gradient-to-r from-neutral-50 to-neutral-100 p-4 rounded-lg border border-[#dbdbdb]"
          >
            <Clock className="h-5 w-5 text-[#141414]" />
            <div>
              <p className="text-[#141414] text-sm font-medium" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                Airport Transfer
              </p>
              <p className="text-neutral-500 text-xs" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                45 minutes from Goa International Airport
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            viewport={{ once: true }}
            className="flex items-center gap-4 bg-gradient-to-r from-neutral-50 to-neutral-100 p-4 rounded-lg border border-[#dbdbdb]"
          >
            <Phone className="h-5 w-5 text-[#141414]" />
            <div>
              <p className="text-[#141414] text-sm font-medium" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                Transportation Service
              </p>
              <p className="text-neutral-500 text-xs" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                Complimentary pickup & drop available
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MapLocation;