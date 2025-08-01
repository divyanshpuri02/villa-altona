import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    onLogin(formData.email);
    onClose();
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    
    // Simulate Google OAuth
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    onLogin('user@gmail.com');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            className="bg-neutral-50 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Header */}
            <div className="flex items-center bg-neutral-50 p-4 pb-2 justify-between border-b border-[#ededed]">
              <button
                onClick={onClose}
                className="text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-[#ededed] rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
              <h2 className="text-[#141414] text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12" style={{ fontFamily: '"Noto Serif", serif' }}>
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-[#141414] text-2xl font-bold mb-2" style={{ fontFamily: '"Noto Serif", serif' }}>
                  Villa Altona
                </h3>
                <p className="text-neutral-500 text-sm" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                  {isLogin ? 'Sign in to your account' : 'Create your account to continue'}
                </p>
              </div>

              {/* Google Login Button */}
              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mb-4 bg-white border border-[#dbdbdb] text-[#141414] rounded-xl h-12 px-4 font-medium text-sm flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                style={{ fontFamily: '"Noto Sans", sans-serif' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </motion.button>

              <div className="relative mb-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#dbdbdb]"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-neutral-50 text-neutral-500" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                    or
                  </span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {!isLogin && (
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 bg-[#ededed] border-none rounded-xl text-[#141414] placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#141414] text-sm"
                      style={{ fontFamily: '"Noto Sans", sans-serif' }}
                    />
                  </div>
                )}

                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-[#ededed] border-none rounded-xl text-[#141414] placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#141414] text-sm"
                    style={{ fontFamily: '"Noto Sans", sans-serif' }}
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                    className="w-full pl-10 pr-12 py-3 bg-[#ededed] border-none rounded-xl text-[#141414] placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#141414] text-sm"
                    style={{ fontFamily: '"Noto Sans", sans-serif' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 hover:text-[#141414]"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>

                {!isLogin && (
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      required={!isLogin}
                      className="w-full pl-10 pr-4 py-3 bg-[#ededed] border-none rounded-xl text-[#141414] placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#141414] text-sm"
                      style={{ fontFamily: '"Noto Sans", sans-serif' }}
                    />
                  </div>
                )}

                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#141414] text-white rounded-xl h-12 px-4 font-bold text-sm hover:bg-gray-800 transition-all duration-300 disabled:opacity-50 flex items-center justify-center"
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                >
                  {loading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      {isLogin ? 'Signing In...' : 'Creating Account...'}
                    </>
                  ) : (
                    <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                  )}
                </motion.button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-neutral-500 text-sm" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                  {isLogin ? "Don't have an account?" : "Already have an account?"}
                  <button
                    type="button"
                    onClick={() => setIsLogin(!isLogin)}
                    className="ml-1 text-[#141414] font-medium hover:underline"
                  >
                    {isLogin ? 'Sign Up' : 'Sign In'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;