import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowLeft, ChevronDown, User } from 'lucide-react';

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
    { label: 'Home', sectionId: 'hero' },
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
    <>
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-neutral-50/80 backdrop-blur-md border-b border-gray-200/50 shadow-lg' : 'bg-neutral-50'
        }`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 pb-2 max-w-7xl mx-auto">
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

          {/* Centered Logo */}
          <motion.div 
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center cursor-pointer group"
            onClick={() => scrollToSection('hero')}
            whileTap={{ scale: 0.92 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-[#141414]/5 to-[#141414]/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ transform: 'scale(1.5)' }}
              />
              <img 
                src="/file1.svg" 
                alt="Villa Altona Logo"
                width="90" 
                height="70" 
                className="relative z-10 filter drop-shadow-sm group-hover:drop-shadow-md group-hover:scale-105 transition-all duration-300"
                style={{ 
                  backgroundColor: 'transparent',
                  filter: 'contrast(1.1) brightness(1.05)'
                }}
              />
            </div>
           
          </motion.div>
          
          {/* Right side - User Dropdown Menu */}
          {userEmail ? (
            <div className="relative ml-auto">
              <motion.button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 text-sm text-[#141414] hover:text-neutral-600 transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-gray-100"
                style={{ fontFamily: '"Noto Sans", sans-serif' }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <User className="h-4 w-4" />
                <span className="max-w-[120px] truncate">{userEmail}</span>
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
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-xs text-neutral-500 uppercase tracking-wide" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                        Signed in as
                      </p>
                      <p className="text-sm font-medium text-[#141414] truncate" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                        {userEmail}
                      </p>
                    </div>
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
          ) : (
            <div className="w-24 ml-auto"></div>
          )}
        </div>

        {/* Desktop Navigation */}
        <motion.nav 
          className={`hidden md:block transition-all duration-300 ${
            scrolled ? 'py-2' : 'py-3'
          }`}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center space-x-8">
              {menuItems.map((item, index) => (
                <motion.button
                  key={item.sectionId}
                  onClick={() => scrollToSection(item.sectionId)}
                  className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    activeSection === item.sectionId 
                      ? 'text-[#141414]' 
                      : 'text-neutral-500 hover:text-[#141414]'
                  }`}
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {item.label}
                  {activeSection === item.sectionId && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#141414]"
                      layoutId="activeSection"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.nav>

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
                    className={`block w-full text-left px-4 py-3 transition-all duration-300 ${
                      activeSection === item.sectionId 
                        ? 'text-[#141414] bg-gray-100 border-l-4 border-[#141414]' 
                        : 'text-neutral-600 hover:bg-gray-50 hover:text-[#141414]'
                    }`}
                    style={{ fontFamily: '"Noto Sans", sans-serif' }}
                  >
                    {item.label}
                  </motion.button>
                ))}
                {userEmail && (
                  <div className="border-t border-gray-200 mt-2">
                    <div className="px-4 py-2">
                      <p className="text-xs text-neutral-500 uppercase tracking-wide mb-1" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                        Signed in as
                      </p>
                      <p className="text-sm font-medium text-[#141414] mb-3" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                        {userEmail}
                      </p>
                    </div>
                    <motion.button
                      onClick={() => {
                        onLogout?.();
                        setIsMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                      style={{ fontFamily: '"Noto Sans", sans-serif' }}
                      whileHover={{ x: 4 }}
                    >
                      Sign out
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Progress Indicator */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#141414] to-gray-600 z-50 origin-left"
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