import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

const WhatsAppFloat: React.FC = () => {
  const handleWhatsAppClick = () => {
    const phoneNumber = '+919876543210'; // Replace with actual WhatsApp number
    const message = encodeURIComponent('Hi! I\'m interested in booking Villa Altona. Could you please provide more information?');
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <motion.button
      onClick={handleWhatsAppClick}
      className="whatsapp-float bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      <MessageCircle className="h-6 w-6" />
      <span className="sr-only">Contact us on WhatsApp</span>
      
      {/* Pulse animation */}
      <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
    </motion.button>
  );
};

export default WhatsAppFloat;