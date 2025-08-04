import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>({ email: 'user@example.com' });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    setUser(null);
    setIsUserMenuOpen(false);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 relative">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-white hover:bg-white/20 transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo - Centered */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-black tracking-tight" style={{ fontFamily: '"Noto Serif", serif' }}>
                <img
                  src="/file11.svg" 
                  alt="Villa Altona" 
                  className="h-15 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling!.style.display = 'inline';
                  }}
                />
                <span style={{ display: 'none' }}>Villa Altona</span>
              </h1>
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-60 mt-1"></div>
            </div>
          </div>

          {/* User menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-2 p-2 rounded-md text-black hover:text-gray-300 transition-colors duration-200"
                aria-label="User menu"
              >
                <User size={20} />
                <span className="hidden sm:block text-sm truncate max-w-32">
                  {user.email}
                </span>
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-black/95 backdrop-blur-md rounded-md shadow-lg py-1 z-50 border border-white/20">
                  <div className="px-4 py-2 text-sm text-gray-300 border-b border-white/20">
                    {user.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="flex items-center w-full px-4 py-2 text-sm text-black hover:bg-white/20 transition-colors duration-200"
                  >
                    <LogOut size={16} className="mr-2" />
                    Sign out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:block border-t border-white/20">
          <div className="flex justify-center space-x-8 py-4">
            {['About', 'Amenities', 'Gallery', 'Booking', 'Reviews', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-black hover:text-gray-300 transition-colors duration-200 text-sm font-medium relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
          </div>
        </nav>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden bg-white/95 backdrop-blur-md border-t border-white/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {['About', 'Amenities', 'Gallery', 'Booking', 'Reviews', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block w-full text-left px-3 py-2 text-black hover:bg-white/20 transition-colors duration-200 text-sm font-medium rounded-md"
                >
                  {item}
                </button>
              ))}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;