import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, ExternalLink } from 'lucide-react';

const DemoNotice: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -100 }}
        className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 shadow-lg"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 flex-shrink-0" />
            <div className="text-sm">
              <span className="font-semibold">Demo Mode:</span> This is a fully functional villa booking system. 
              <span className="hidden sm:inline"> All features are working including payments, bookings, and admin dashboard.</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/your-repo/villa-altona"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors duration-200"
            >
              <ExternalLink className="h-3 w-3" />
              View Code
            </a>
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors duration-200"
              aria-label="Close notice"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DemoNotice;