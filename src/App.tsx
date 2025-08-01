import React, { useState, useEffect } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Amenities from './components/Amenities'
import Gallery from './components/Gallery'
import Booking from './components/Booking'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import MapLocation from './components/MapLocation'
import AuthModal from './components/AuthModal'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [modalTimer, setModalTimer] = useState<NodeJS.Timeout | null>(null);
  const [hasShownInitialModal, setHasShownInitialModal] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const savedAuth = localStorage.getItem('villa_auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUserEmail(authData.email);
      setHasShownInitialModal(true); // Don't show modal if already authenticated
    } else {
      // Start timer to show modal after 10 seconds
      const timer = setTimeout(() => {
        setShowAuthModal(true);
        setHasShownInitialModal(true);
      }, 10000);
      setModalTimer(timer);
    }

    // Cleanup timer on unmount
    return () => {
      if (modalTimer) {
        clearTimeout(modalTimer);
      }
    };
  }, []);

  // Handle modal close - restart timer if user is not authenticated
  const handleModalClose = () => {
    setShowAuthModal(false);
    
    if (!isAuthenticated) {
      // Start new timer to show modal again after 10 seconds
      const timer = setTimeout(() => {
        setShowAuthModal(true);
      }, 10000);
      setModalTimer(timer);
    }
  };

  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('villa_auth', JSON.stringify({ email, loginTime: Date.now() }));
    setShowAuthModal(false);
    // Clear any existing timer since user is now authenticated
    if (modalTimer) {
      clearTimeout(modalTimer);
      setModalTimer(null);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    localStorage.removeItem('villa_auth');
    setHasShownInitialModal(false);
    // Start timer to show modal after 10 seconds
    const timer = setTimeout(() => {
      setShowAuthModal(true);
      setHasShownInitialModal(true);
    }, 10000);
    setModalTimer(timer);
  };

  if (!isAuthenticated && !hasShownInitialModal) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center" style={{ fontFamily: '"Inter", "Noto Sans", sans-serif' }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#141414] mb-4" style={{ fontFamily: '"Noto Serif", serif' }}>
            Villa Altona
          </h1>
          <p className="text-neutral-500" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
            Welcome to Villa Altona
          </p>
        </div>
        <AuthModal 
          isOpen={showAuthModal}
          onClose={handleModalClose}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50" style={{ fontFamily: '"Inter", "Noto Sans", sans-serif' }}>
      <Header userEmail={userEmail} onLogout={handleLogout} />
      <Hero />
      <About />
      <Amenities />
      <Gallery />
      <Booking isAuthenticated={isAuthenticated} onShowAuth={() => setShowAuthModal(true)} />
      <Testimonials />
      <MapLocation />
      <Contact />
      <Footer />
      <WhatsAppFloat />
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={handleModalClose}
        onLogin={handleLogin}
      />
    </div>
  )
}

export default App