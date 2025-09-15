import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './components/Layout'
import Home from './pages/Home'
import AdminDashboardPage from './pages/AdminDashboardPage'
import UserProfilePage from './pages/UserProfilePage'
import DatabaseSetupPage from './pages/DatabaseSetupPage'
import BookingPage from './pages/BookingPage'
import NotFound from './pages/NotFound'
import PaymentPage from './pages/PaymentPage'
import CheckoutPage from './pages/CheckoutPage'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthModal } from './components/AuthModal'
import { getAuth, connectAuthEmulator, GoogleAuthProvider, signInWithPopup, signInAnonymously } from 'firebase/auth';

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
  
  
  const auth = getAuth(app);
  if (import.meta.env.DEV) {
    // Suppress emulator domain warnings
    connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
  }
  // Check if user is already logged in
    const savedAuth = localStorage.getItem('villa_auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      setIsAuthenticated(true);
      setUserEmail(authData.email);
      setHasShownInitialModal(true); // Don't show modal if already authenticated
      // Ensure Firebase has an auth user for callables
      if (!auth.currentUser) {
        signInAnonymously(auth).catch(() => {/* noop */});
      }
    } else {
      // Start timer to show modal after 4 seconds
      const timer = setTimeout(() => {
        setShowAuthModal(true);
        setHasShownInitialModal(true);
      }, 2000);
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
      // Start new timer to show modal again after 4 seconds
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
    // Ensure Firebase auth user exists (for callables auth context)
    const auth = getAuth(app);
    if (!auth.currentUser) {
      signInAnonymously(auth).catch(() => {/* noop */});
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

  // Auto-open auth modal on global request (e.g., booking flow)
  useEffect(() => {
    const openAuth = () => setShowAuthModal(true);
    window.addEventListener('OPEN_AUTH_MODAL', openAuth as EventListener);
    return () => window.removeEventListener('OPEN_AUTH_MODAL', openAuth as EventListener);
  }, []);

  // Only show auth modal if user is not authenticated
  const shouldShowAuthModal = showAuthModal && !isAuthenticated;

  if (!isAuthenticated && !hasShownInitialModal) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center font-sans">
        <div className="text-center">
          <h1 className="text-4xl text-[#141414] mb-4">
            Villa Altona
          </h1>
          <p className="text-neutral-500">
            Welcome to Villa Altona
          </p>
        </div>
        <AuthModal 
          isOpen={shouldShowAuthModal}
          onClose={handleModalClose}
          onLogin={handleLogin}
          onGoogleLogin={handleGoogleLogin}
        />
      </div>
    );
  }


  async function handleGoogleLogin(): Promise<void> {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      // Extract the user's email
      const userEmail = result.user.email;
      
      // Call the handleLogin function with the user's email
      if (userEmail) {
        handleLogin(userEmail);
      } else {
        console.error("No email found in Google authentication result");
      }
    } catch (error) {
      console.error("Google login error:", error);
      // You could also show a user-friendly error message here
    }
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Layout userEmail={userEmail} onLogout={handleLogout} onShowAuth={handleShowAuth} />}
        >
          <Route index element={<Home isAuthenticated={isAuthenticated} onShowAuth={() => setShowAuthModal(true)} />} />
          <Route
            path="/booking"
            element={<BookingPage isAuthenticated={isAuthenticated} onShowAuth={() => setShowAuthModal(true)} />}
          />
          <Route path="/pay/:bookingId" element={<PaymentPage />} />
          <Route path="/checkout/:bookingId" element={<CheckoutPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/setup" element={<DatabaseSetupPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
      <AuthModal 
        isOpen={shouldShowAuthModal}
        onClose={handleModalClose}
        onLogin={handleLogin}
        onGoogleLogin={handleGoogleLogin}
      />
    </BrowserRouter>
  )
}

export default App