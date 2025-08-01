import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowLeft } from 'lucide-react';

interface HeaderProps {
  userEmail?: string;
  onLogout?: () => void;
}

export default function Header({ userEmail, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const menuItems = [
    { label: 'About', sectionId: 'about' },
    { label: 'Amenities', sectionId: 'amenities' },
    { label: 'Gallery', sectionId: 'gallery' },
    { label: 'Reviews', sectionId: 'testimonials' },
    { label: 'Contact', sectionId: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    if (isMenuOpen) {
      setIsMenuOpen(false);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const yOffset = -80;
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 400);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -80;
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-neutral-50/95 backdrop-blur-lg border-b border-gray-200' : 'bg-neutral-50'
      }`}
    >
      <div className="flex items-center justify-center p-4 pb-2">
        {/* VA Logo */}
        <div className="flex items-center justify-center">
          <svg 
            width="60" 
            height="40" 
            viewBox="0 0 200 120" 
            className="text-[#141414]"
          >
            {/* V Letter */}
            <path 
              d="M20 20 L60 100 L80 20 L100 20 L70 120 L50 120 L20 20 Z" 
              fill="currentColor"
            />
            {/* A Letter */}
            <path 
              d="M120 20 L140 120 L160 120 L180 20 L165 20 L160 40 L140 40 L135 20 L120 20 Z M145 55 L155 55 L150 35 L145 55 Z" 
              fill="currentColor"
            />
            {/* Small decorative triangles */}
            <path d="M90 25 L95 35 L85 35 Z" fill="currentColor" opacity="0.7" />
            <path d="M110 85 L115 95 L105 95 Z" fill="currentColor" opacity="0.7" />
          </svg>
        </div>
        
        {/* User Menu */}
        {userEmail && (
          <div className="hidden md:flex items-center gap-2">
            <span className="text-sm text-neutral-500" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
              {userEmail}
            </span>
            <button
              onClick={onLogout}
              className="text-sm text-[#141414] hover:text-neutral-600 transition-colors duration-200"
              style={{ fontFamily: '"Noto Sans", sans-serif' }}
            >
              Logout
            </button>
          </div>
        )}

        {/* Mobile Menu Button */}
        <motion.button
          className="md:hidden p-2 text-[#141414]"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          whileTap={{ scale: 0.95 }}
        >
          <AnimatePresence mode="wait">
            {isMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Menu className="h-6 w-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-neutral-50 border-t border-gray-200"
          >
            <div className="py-4">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.sectionId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.sectionId)}
                  className="block w-full text-left px-4 py-3 text-[#141414] hover:bg-gray-100 transition-all duration-300"
                >
                  {item.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}