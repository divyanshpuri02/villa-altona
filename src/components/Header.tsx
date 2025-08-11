import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut } from 'lucide-react';

interface HeaderProps {
  userEmail?: string;
  onLogout?: () => void;
  onShowAuth?: () => void;
}

const Header: React.FC<HeaderProps> = ({ userEmail, onLogout, onShowAuth }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  
  // Check if user is authenticated
  const isAuthenticated = !!userEmail;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    // Map navigation items to actual section IDs
    const sectionMap: { [key: string]: string } = {
      'reviews': 'testimonials',
      'about': 'about',
      'amenities': 'amenities',
      'gallery': 'gallery',
      'booking': 'booking',
      'contact': 'contact'
    };
    
    const actualSectionId = sectionMap[sectionId] || sectionId;
    const element = document.getElementById(actualSectionId);
    if (element) {
      const headerHeight = 120; // Account for fixed header height
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition - headerHeight;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  const handleSignOut = () => {
    if (onLogout) {
      onLogout();
    }
    setIsUserMenuOpen(false);
  };

  const handleSignIn = () => {
    if (onShowAuth) {
      onShowAuth();
    }
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/100 backdrop-blur-md shadow-lg' : 'bg-white/100 backdrop-blur-sm'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 relative">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-black hover:bg-white/20 transition-colors duration-200"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo - Left on desktop, centered on mobile */}
          <div className="md:relative md:left-0 md:top-0 md:transform-none absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-black tracking-tight" style={{ fontFamily: '"Noto Serif", serif' }}>
                <img
                  src="/file1.svg" 
                  alt="Villa Altona" 
                  className="h-20 w-auto"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    (e.currentTarget.nextElementSibling as HTMLElement)!.style.display = 'inline';
                  }}
                />
                <span style={{ display: 'none' }}>Villa Altona</span>
              </h1>
              <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-black to-transparent opacity-60 mt-1"></div>
            </div>
          </div>

          {/* User menu - Always on the right */}
          {isAuthenticated ? (
            <div className="relative ml-auto">
              <div className="relative flex flex-col items-center">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-md text-black hover:text-gray-300 transition-colors duration-200"
                  aria-label="User menu"
                >
                  <User size={20} />
                  <span className="hidden sm:block text-sm truncate max-w-32">
                    {userEmail}
                  </span>
                </button>
                {isUserMenuOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg p-3 z-50 w-56">
                    <div className="text-sm text-gray-600 max-w-[220px] truncate text-center" title={userEmail}>
                      {userEmail}
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-2 mt-2 text-gray-700 hover:text-red-600 transition-colors duration-200 group"
                    >
                      <LogOut size={16} className="mr-3 group-hover:text-red-600 transition-colors duration-200" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="relative ml-auto">
              <button
                onClick={handleSignIn}
                className="flex items-center space-x-2 p-2 rounded-md text-black hover:text-gray-300 transition-colors duration-200"
                aria-label="Sign in"
              >
                <User size={20} />
                <span className="hidden sm:block text-sm">
                  Sign In
                </span>
              </button>
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
                className="text-black hover:text-gray-600 transition-colors duration-200 text-sm font-medium relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
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
                  className="block w-full text-left px-3 py-2 text-black hover:bg-white/20 hover:text-gray-600 transition-colors duration-200 text-sm font-medium rounded-md relative group"
                >
                  {item}
                  <span className="absolute bottom-1 left-3 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-[calc(100%-1.5rem)]"></span>
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