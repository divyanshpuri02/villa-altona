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

        {/* Map Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex px-0 py-3"
        >
          <div
            className="w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
            style={{
              backgroundImage: 'url("https://images.pexels.com/photos/2901209/pexels-photo-2901209.jpeg?auto=compress&cs=tinysrgb&w=800&h=450&fit=crop")'
            }}
            onClick={() => window.open('https://maps.google.com/?q=Candolim+Beach+Goa', '_blank')}
          />
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