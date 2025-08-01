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

  useEffect(() => {
    // Check if user is already logged in
    const savedAuth = localStorage.getItem('villa_auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUserEmail(authData.email);
    } else {
      setShowAuthModal(true);
    }
  }, []);

  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
    localStorage.setItem('villa_auth', JSON.stringify({ email, loginTime: Date.now() }));
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
    localStorage.removeItem('villa_auth');
    setShowAuthModal(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center" style={{ fontFamily: '"Inter", "Noto Sans", sans-serif' }}>
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => {}}
          onLogin={handleLogin}
        />
        <div className="text-center">
          <h1 className="text-4xl font-bold text-[#141414] mb-4" style={{ fontFamily: '"Noto Serif", serif' }}>
            Villa Altona
          </h1>
          <p className="text-neutral-500" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
            Please sign in to continue
          </p>
        </div>
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
      <Booking />
      <Testimonials />
      <MapLocation />
      <Contact />
      <Footer />
      <WhatsAppFloat />
      
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
      />
    </div>
  )
}

export default App