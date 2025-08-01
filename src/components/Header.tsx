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
      <div className="flex items-center justify-between p-4 pb-2 max-w-7xl mx-auto">
        {/* Left spacer for mobile menu */}
        <div className="flex items-center">
          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 text-[#141414] mr-2"
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

        {/* Centered VA Logo */}
        <div className="flex flex-col items-center justify-center flex-1">
          <svg 
            width="80" 
            height="60" 
            viewBox="0 0 300 180" 
            className="text-[#141414]"
          >
            {/* V Letter - More elegant and spaced */}
            <path 
              d="M30 30 L90 140 L120 30 L150 30 L105 170 L75 170 L30 30 Z" 
              fill="currentColor"
            />
            {/* A Letter - More refined */}
            <path 
              d="M180 30 L210 170 L240 170 L270 30 L250 30 L240 60 L210 60 L200 30 L180 30 Z M220 85 L230 85 L225 55 L220 85 Z" 
              fill="currentColor"
            />
          </svg>
          <div className="text-[#141414] text-xs font-light tracking-[0.2em] mt-1" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
            VILLA ALTONA
          </div>
        </div>
        
        {/* Right side - User Menu */}
        {userEmail && (
          <div className="flex items-center gap-3">
            <span className="hidden md:block text-sm text-neutral-500" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
              {userEmail}
            </span>
            <button
              onClick={onLogout}
              className="text-sm text-[#141414] hover:text-neutral-600 transition-colors duration-200 px-3 py-1 rounded-lg hover:bg-gray-100"
              style={{ fontFamily: '"Noto Sans", sans-serif' }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="w-20"></div>
        )}
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
              {userEmail && (
                <div className="px-4 py-3 border-t border-gray-200 mt-2">
                  <p className="text-sm text-neutral-500 mb-2" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                    {userEmail}
                  </p>
                  <button
                    onClick={onLogout}
                    className="text-sm text-[#141414] hover:text-neutral-600 transition-colors duration-200"
                    style={{ fontFamily: '"Noto Sans", sans-serif' }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}