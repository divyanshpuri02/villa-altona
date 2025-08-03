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
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 100);
      
      // Update active section based on scroll position
      const sections = menuItems.map(item => item.sectionId);
      const currentSection = sections.find(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 150 && rect.bottom >= 150;
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
          const yOffset = -120;
          const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 300);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        const yOffset = -120;
        const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      {/* Atlantis-Style Navigation Overlay */}
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-xl shadow-2xl border-b border-white/20' 
            : 'bg-gradient-to-b from-black/40 via-black/20'
        }`}
      >
        {/* Main Navigation Container - Atlantis Style */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            
            {/* Mobile Menu Button */}
            <motion.button
              className={`lg:hidden p-3 rounded-xl transition-all duration-300 ${
                scrolled 
                  ? 'text-[#141414] hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
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

            {/* Centered Logo - Atlantis Style */}
            <motion.div
              className="flex-1 flex justify-center lg:flex-none"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.button
                type="button"
                className="group focus:outline-none"
                onClick={() => scrollToSection('hero')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="text-center">
                  <h1 className={`text-2xl lg:text-3xl font-bold tracking-tight transition-all duration-300 ${
                    scrolled ? 'text-[#141414]' : 'text-white drop-shadow-lg'
                  }`} style={{ fontFamily: '"Noto Serif", serif' }}>
                    Villa Altona
                  </h1>
                  <motion.div 
                    className={`h-0.5 w-full bg-gradient-to-r from-transparent via-current to-transparent opacity-60 mt-1 transition-all duration-300 ${
                      scrolled ? 'opacity-40' : 'opacity-80'
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  />
                </div>
              </motion.button>
            </motion.div>

            {/* User Menu - Right Side */}
            {userEmail && (
              <div className="relative">
                <motion.button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className={`flex items-center gap-2 text-sm transition-all duration-300 px-4 py-2 rounded-xl ${
                    scrolled 
                      ? 'text-[#141414] hover:bg-gray-100' 
                      : 'text-white hover:bg-white/10'
                  }`}
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <User className="h-4 w-4" />
                  <span className="max-w-[120px] truncate hidden sm:block">{userEmail}</span>
                  <motion.div
                    animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="h-4 w-4" />
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
                      className="absolute right-0 top-full mt-2 w-48 bg-white/95 backdrop-blur-xl rounded-xl shadow-2xl border border-white/20 py-2 z-50"
                    >
                      <motion.button
                        onClick={() => {
                          onLogout?.();
                          setIsUserMenuOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50/80 transition-colors duration-200 rounded-lg mx-2"
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

          {/* Desktop Navigation - Atlantis Style Overlay */}
          <div className="hidden lg:block">
            <nav className="flex items-center justify-center pb-6">
              <div className="flex items-center space-x-8">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.sectionId}
                    onClick={() => scrollToSection(item.sectionId)}
                    className={`relative px-4 py-2 text-sm font-medium tracking-wide transition-all duration-300 ${
                      activeSection === item.sectionId 
                        ? scrolled ? 'text-[#141414]' : 'text-white' 
                        : scrolled ? 'text-gray-600 hover:text-[#141414]' : 'text-white/80 hover:text-white'
                    }`}
                    style={{ fontFamily: '"Noto Sans", sans-serif' }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.1 }}
                  >
                    {item.label}
                    {activeSection === item.sectionId && (
                      <motion.div
                        className={`absolute bottom-0 left-0 right-0 h-0.5 ${
                          scrolled ? 'bg-[#141414]' : 'bg-white'
                        }`}
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

        {/* Mobile Navigation Menu - Full Screen Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "100vh" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="lg:hidden fixed inset-0 top-20 bg-black/95 backdrop-blur-xl z-40"
            >
              <div className="flex flex-col items-center justify-center h-full space-y-8 px-6">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.sectionId}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    onClick={() => scrollToSection(item.sectionId)}
                    className={`text-2xl font-medium tracking-wide transition-all duration-300 py-4 px-8 rounded-xl ${
                      activeSection === item.sectionId 
                        ? 'text-white bg-white/10 border border-white/20' 
                        : 'text-white/80 hover:text-white hover:bg-white/5'
                    }`}
                    style={{ fontFamily: '"Noto Sans", sans-serif' }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {item.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Scroll Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 z-50 origin-left"
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