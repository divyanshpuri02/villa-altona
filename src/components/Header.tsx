import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User } from 'lucide-react';

interface HeaderProps {
  userEmail?: string;
  onLogout?: () => void;
}

export default function Header({ userEmail, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const menuItems = [
    { label: 'About', sectionId: 'about' },
    { label: 'Amenities', sectionId: 'amenities' },
    { label: 'Gallery', sectionId: 'gallery' },
    { label: 'Booking', sectionId: 'booking' },
    { label: 'Reviews', sectionId: 'testimonials' },
    { label: 'Contact', sectionId: 'contact' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Update active section based on scroll position
      const sections = menuItems.map(item => item.sectionId);
      const currentSection = sections.find(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [menuItems]);

  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'hero') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setIsMenuOpen(false);
      return;
    }
    
    if (isMenuOpen) {
      setIsMenuOpen(false);
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          const yOffset = -100;
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 400);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -100;
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-white/45 backdrop-blur-md shadow-lg' : 'bg-white/10 backdrop-blur-sm'
        }`}
      >
        {/* Main Container Div - Contains Logo and User Menu */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Mobile Menu Button - Left */}
            <motion.button
              className="lg:hidden p-2 text-black hover:bg-white/20 rounded-lg transition-colors duration-200"
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

            {/* Centered Logo - Now in main div */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <div className="text-center">
               
                  <img height="150" width="150" transform="scale(20)"
                    src="/public/file1.svg" 
                    srcset="/public/file1.svg"></img>
                
                 
                <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-60 mt-1"></div>
              </div>
            </div>

            {/* User Menu - Right - Now in main div */}
            {userEmail && (
              <div className="relative">
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 text-sm text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-white/20"
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User className="h-4 w-4 text-white" />
                  <span className="max-w-[120px] truncate hidden sm:block">{userEmail}</span>
                  <motion.div
                    animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4 text-white" />
                  </motion.div>
                </motion.button>
                
                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                    >
                      <motion.button
                        onClick={() => {
                          onLogout?.();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                        style={{ fontFamily: '"Noto Sans", sans-serif' }}
                        whileHover={{ x: 4 }}
                      >
                        Sign out
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Desktop Navigation - Separate nav section below main div */}
          <div className="hidden lg:block border-t border-white/20">
            <nav className="flex items-center justify-center py-4">
              <div className="flex items-center space-x-8">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.sectionId}
                    onClick={() => scrollToSection(item.sectionId)}
                    className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${
                      activeSection === item.sectionId 
                        ? 'text-white' 
                        : 'text-gray-300 hover:text-white'
                    }`}
                    style={{ fontFamily: '"Noto Sans", sans-serif' }}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    {item.label}
                    {activeSection === item.sectionId && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-white"
                        layoutId="activeSection"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </nav>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-black/95 backdrop-blur-md border-t border-white/20"
            >
              <div className="py-4 px-4 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.sectionId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => scrollToSection(item.sectionId)}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium tracking-wide transition-all duration-300 rounded-lg ${
                      activeSection === item.sectionId 
                        ? 'text-white bg-white/20 border-l-4 border-white' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                    style={{ fontFamily: '"Noto Sans", sans-serif' }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-blue-800 z-50 origin-left"
        style={{
          scaleX: scrolled ? Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1) : 0
        }}
        initial={{ scaleX: 0 }}
        animate={{ 
          scaleX: scrolled ? Math.min(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight), 1) : 0 
        }}
        transition={{ duration: 0.1 }}
      />
    </>
  );
}