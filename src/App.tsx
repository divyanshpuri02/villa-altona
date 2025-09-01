import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { AuthModal } from './components/AuthModal'

import DemoNotice from './components/DemoNotice'
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";
import app from "./firebase/config";

// Use debug token on localhost, reCAPTCHA in production
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

if (isLocalhost) {
  // Set debug token for localhost
  (globalThis as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider("38187e2d-8c85-4053-8d4b-1d228f249d55"),
  isTokenAutoRefreshEnabled: true,
});

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
      // Start timer to show modal after 4 seconds
      const timer = setTimeout(() => {
        setShowAuthModal(true);
        setHasShownInitialModal(true);
      }, 4000);
      setModalTimer(timer);
    }

    // Cleanup timer on unmount
    return () => {
      if (modalTimer) {
        clearTimeout(modalTimer);
      }
    };
  }, [modalTimer]);

  // Handle modal close - restart timer if user is not authenticated
  const handleModalClose = () => {
    setShowAuthModal(false);
    
    if (!isAuthenticated) {
      // Start new timer to show modal again after 4 seconds
      const timer = setTimeout(() => {
        setShowAuthModal(true);
      }, 4000);
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
    // Start timer to show modal after 4 seconds
    const timer = setTimeout(() => {
      setShowAuthModal(true);
      setHasShownInitialModal(true);
    }, 4000);
    setModalTimer(timer);
  };

  const handleShowAuth = () => {
    setShowAuthModal(true);
  };

  // Only show auth modal if user is not authenticated
  const shouldShowAuthModal = showAuthModal && !isAuthenticated;

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
          isOpen={shouldShowAuthModal}
          onClose={handleModalClose}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-50" style={{ fontFamily: '"Inter", "Noto Sans", sans-serif' }}>
        <DemoNotice />
        <Header userEmail={userEmail} onLogout={handleLogout} onShowAuth={handleShowAuth} />
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
          isOpen={shouldShowAuthModal}
          onClose={handleModalClose}
          onLogin={handleLogin}
        />
      </div>
      <Routes>
        {/* Routes can be added here for different pages */}
      </Routes>
    </BrowserRouter>
  )
}

export default App