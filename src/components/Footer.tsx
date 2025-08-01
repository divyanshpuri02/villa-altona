import React from 'react';
import { motion } from 'framer-motion';
import { Home, Calendar, FileText, MessageSquare } from 'lucide-react';

export default function Footer() {
  const navItems = [
    { icon: Home, label: 'Home', active: false },
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: FileText, label: 'Details', active: true },
    { icon: MessageSquare, label: 'Contact', active: false },
  ];

  return (
    <footer className="bg-neutral-50">
      {/* Bottom Navigation */}
      <div className="flex gap-2 border-t border-[#ededed] bg-neutral-50 px-4 pb-3 pt-2">
        {navItems.map((item, index) => (
          <motion.a
            key={index}
            href="#"
            className={`flex flex-1 flex-col items-center justify-end gap-1 ${
              item.active ? 'text-[#141414]' : 'text-neutral-500'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex h-8 items-center justify-center">
              <item.icon className="w-6 h-6" />
            </div>
            <p className="text-xs font-medium leading-normal tracking-[0.015em]">{item.label}</p>
          </motion.a>
        ))}
      </div>
      
      <div className="h-5 bg-neutral-50"></div>
      
      {/* Copyright */}
      <div className="px-4 py-4 border-t border-[#ededed]">
        <p className="text-neutral-500 text-sm text-center">
          © 2025 Villa Altona. All rights reserved.
        </p>
      </div>
    </footer>
  );
}