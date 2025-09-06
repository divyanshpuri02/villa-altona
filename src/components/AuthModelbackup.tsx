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
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isOtpVerification, setIsOtpVerification] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(0);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [showDemoOtp, setShowDemoOtp] = useState(false);
  const [failedLoginAttempts, setFailedLoginAttempts] = useState(0);
  const [showForgotPasswordOption, setShowForgotPasswordOption] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    hasSpecial: false,
    hasCapital: false,
    hasMinLength: false,
    isValid: false
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: ''
  });

  // Simple user database simulation
  const getUserDatabase = () => {
    const users = localStorage.getItem('villa_users');
    return users ? JSON.parse(users) : [];
  };

  const saveUserToDatabase = (userData: { name: string; email: string; password: string }) => {
    const users = getUserDatabase();
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In real app, this would be hashed
      createdAt: new Date().toISOString()
    };
    users.push(newUser);
    localStorage.setItem('villa_users', JSON.stringify(users));
    return newUser;
  };

  const findUserByEmail = (email: string) => {
    const users = getUserDatabase();
    return users.find((user: any) => user.email === email);
  };

  const validatePassword = (password: string) => {
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasCapital = /[A-Z]/.test(password);
    const hasMinLength = password.length >= 8;
    const isValid = hasSpecial && hasCapital && hasMinLength;
    setPasswordStrength({
      hasSpecial,
      hasCapital,
      hasMinLength,
      isValid
    });
  };

  const handlePasswordChange = (password: string) => {
    setFormData({...formData, password});
    if (!isLogin) validatePassword(password);
  };

  const validateForm = () => {
    if (!isLogin) {
      // Signup validation
      if (!passwordStrength.isValid) {
        setError('Password does not meet requirements');
        return false;
      }
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
      
      // Check if user already exists
      const existingUser = findUserByEmail(formData.email);
      if (existingUser) {
        setError('User with this email already exists');
        return false;
      }
    } else {
      // Login validation
      const user = findUserByEmail(formData.email);
      if (!user) {
        setError('No account found with this email address');
        setFailedLoginAttempts(prev => {
          const newCount = prev + 1;
          if (newCount >= 2) {
            setShowForgotPasswordOption(true);
          }
          return newCount;
        });
        return false;
      }
      
      if (user.password !== formData.password) {
        setError('Incorrect password');
        setFailedLoginAttempts(prev => {
          const newCount = prev + 1;
          if (newCount >= 2) {
            setShowForgotPasswordOption(true);
          }
          return newCount;
        });
        return false;
      }
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setError(null);
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    try {
      if (!isLogin) {
        // Signup - save user to database
        saveUserToDatabase({
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
      }
      
      setLoading(false);
      onLogin(formData.email);
      onClose();
    } catch (err) {
      setLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    
    try {
      // Simulate Google OAuth redirect
      window.open('https://accounts.google.com/oauth/authorize?client_id=demo&redirect_uri=demo&scope=email%20profile', '_blank', 'width=500,height=600');
      
      // Simulate successful OAuth return
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate getting user data from Google
      const googleUser = {
        name: 'Google User',
        email: 'user@gmail.com',
        password: 'google_oauth_' + Date.now()
      };
      
      // Check if user exists, if not create them
      let existingUser = findUserByEmail(googleUser.email);
      if (!existingUser) {
        saveUserToDatabase(googleUser);
      }
      
      onLogin(googleUser.email);
      onClose();
    } catch (error) {
      console.error('Google login failed:', error);
      setError('Google login failed. Please try again.');
    }
    setGoogleLoading(false);
  };

  // Forgot Password Functions
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    // Check if user exists
    const user = findUserByEmail(formData.email);
    if (!user) {
      setError('No account found with this email address');
      return;
    }
    
    setLoading(true);
    
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    
    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setLoading(false);
    setSuccess(`OTP sent to ${formData.email}. Check your email.`);
    
    // Show OTP in UI for demo purposes
    setShowDemoOtp(true);
    
    // Start OTP timer
    setOtpTimer(300); // 5 minutes
    const timer = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    setIsForgotPassword(false);
    setIsOtpVerification(true);
  };
  
  const handleOtpVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (formData.otp !== generatedOtp) {
      setError('Invalid OTP. Please check and try again.');
      return;
    }
    
    if (otpTimer <= 0) {
      setError('OTP has expired. Please request a new one.');
      return;
    }
    
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
    
    setSuccess('OTP verified successfully!');
    setIsOtpVerification(false);
    setIsResetPassword(true);
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validation is already handled by isFormValid()
    
    setLoading(true);
    
    // Update user password in database
    const users = getUserDatabase();
    const userIndex = users.findIndex((user: any) => user.email === formData.email);
    if (userIndex !== -1) {
      users[userIndex].password = formData.password;
      localStorage.setItem('villa_users', JSON.stringify(users));
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    
    setSuccess('Password reset successfully! You can now sign in with your new password.');
    
    // Reset to login form after 2 seconds
    setTimeout(() => {
      setIsResetPassword(false);
      setIsLogin(true);
      setFormData({ name: '', email: formData.email, password: '', confirmPassword: '', otp: '' });
      setSuccess(null);
    }, 2000);
  };
  
  const handleResendOtp = async () => {
    setError(null);
    setLoading(true);
    
    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(otp);
    
    // Simulate sending email
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setSuccess('New OTP sent to your email!');
    
    // Show new OTP in UI for demo purposes
    setShowDemoOtp(true);
    
    // Reset timer
    setOtpTimer(300);
    const timer = setInterval(() => {
      setOtpTimer(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccess(null);
    resetAllStates();
  };

  const resetAllStates = () => {
    setIsForgotPassword(false);
    setIsOtpVerification(false);
    setIsResetPassword(false);
    setFormData({ name: '', email: '', password: '', confirmPassword: '', otp: '' });
    setPasswordStrength({ hasSpecial: false, hasCapital: false, hasMinLength: false, isValid: false });
    setFailedLoginAttempts(0);
    setShowForgotPasswordOption(false);
    setOtpTimer(0);
    setGeneratedOtp('');
    setShowDemoOtp(false);
  };

  const handleModalClose = () => {
    resetAllStates();
    setError(null);
    setSuccess(null);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setError(null); // Clear error when user starts typing
    setSuccess(null); // Clear success when user starts typing
    setFormData({...formData, [field]: value});
    
    // Reset failed attempts when user starts typing in email or password field
    if (field === 'email' || field === 'password') {
      setFailedLoginAttempts(0);
      setShowForgotPasswordOption(false);
    }
  };

  const handlePasswordInputChange = (password: string) => {
    setError(null); // Clear error when user starts typing
    setSuccess(null); // Clear success when user starts typing
    setFormData({...formData, password});
    if (!isLogin || isResetPassword) validatePassword(password);
    
    // Reset failed attempts when user starts typing password
    setFailedLoginAttempts(0);
    setShowForgotPasswordOption(false);
  };

  const isFormValid = () => {
    if (isForgotPassword) {
      return formData.email;
    }
    if (isOtpVerification) {
      return formData.otp && formData.otp.length === 6;
    }
    if (isResetPassword) {
      return formData.password && 
             formData.confirmPassword && 
             passwordStrength.isValid && 
             formData.password === formData.confirmPassword;
    }
    if (isLogin) {
      return formData.email && formData.password;
    } else {
      return formData.name && formData.email && formData.password && formData.confirmPassword && passwordStrength.isValid && formData.password === formData.confirmPassword;
    }
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
                onClick={handleModalClose}
                className="text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-[#ededed] rounded-lg transition-colors duration-200"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <h3 className="text-[#141414] text-2xl font-bold mb-2" style={{ fontFamily: '"Noto Serif", serif' }}>
                  Villa Altona
                </h3>
                <p className="text-neutral-500 text-sm" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                  {isForgotPassword ? 'Reset your password' : 
                   isOtpVerification ? 'Enter verification code' :
                   isResetPassword ? 'Create new password' :
                   isLogin ? 'Sign in to your account' : 'Create your account to continue'}
                </p>
              </div>

              {/* Google Login Button */}
              {!isForgotPassword && !isOtpVerification && !isResetPassword && (
                <motion.button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading || googleLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full mb-4 bg-white border border-[#dbdbdb] text-[#141414] rounded-xl h-12 px-4 font-medium text-sm flex items-center justify-center gap-3 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50 relative"
                  style={{ fontFamily: '"Noto Sans", sans-serif' }}
                >
                  {googleLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-[#141414] border-t-transparent rounded-full"
                      />
                      Connecting to Google...
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    </>
                  )}
                </motion.button>
              )}

              {!isForgotPassword && !isOtpVerification && !isResetPassword && (
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
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <p className="text-red-600 text-sm font-medium" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                    {error}
                  </p>
                  {/* Show forgot password option after 2 failed attempts */}
                  {showForgotPasswordOption && isLogin && (
                    <motion.button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-2 text-blue-600 text-sm font-medium hover:text-blue-800 underline"
                      style={{ fontFamily: '"Noto Sans", sans-serif' }}
                    >
                      Forgot your password? Reset it here
                    </motion.button>
                  )}
                </motion.div>
              )}

              {/* Success Message */}
              {success && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <p className="text-green-600 text-sm font-medium" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                    {success}
                  </p>
                </motion.div>
              )}

              {/* Demo OTP Display */}
              {showDemoOtp && isOtpVerification && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <p className="text-blue-700 text-sm font-medium" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                      Demo Mode - Your OTP Code:
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-blue-200">
                    <p className="text-2xl font-bold text-blue-800 text-center tracking-widest" style={{ fontFamily: '"Noto Sans", monospace' }}>
                      {generatedOtp}
                    </p>
                  </div>
                  <p className="text-blue-600 text-xs mt-2" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                    In a real application, this would be sent to your email address.
                  </p>
                </motion.div>
              )}

            

              {/* Form */}
              <form onSubmit={
                isForgotPassword ? handleForgotPassword :
                isOtpVerification ? handleOtpVerification :
                isResetPassword ? handleResetPassword :
                handleSubmit
              } className="space-y-4">
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

                {/* Email Field - Show for login, signup, and forgot password */}
                {(!isOtpVerification && !isResetPassword) && (
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#ededed] border-none rounded-xl text-[#141414] placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#141414] text-sm"
                      style={{ fontFamily: '"Noto Sans", sans-serif' }}
                    />
                  </div>
                )}

                {/* OTP Field - Show only during OTP verification */}
                {isOtpVerification && (
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500 flex items-center justify-center">
                      <span className="text-sm font-bold">#</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Enter 6-digit OTP"
                      value={formData.otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        handleInputChange('otp', value);
                      }}
                      maxLength={6}
                      required
                      className="w-full pl-10 pr-4 py-3 bg-[#ededed] border-none rounded-xl text-[#141414] placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#141414] text-sm text-center tracking-widest font-mono"
                      style={{ fontFamily: '"Noto Sans", monospace' }}
                    />
                    {otpTimer > 0 && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 text-xs">
                        {formatTime(otpTimer)}
                      </div>
                    )}
                  </div>
                )}

                {/* Password Field - Show for login, signup, and reset password */}
                {(!isForgotPassword && !isOtpVerification) && (
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={formData.password}
                      onChange={(e) => {
                        const password = e.target.value;
                        setError(null);
                        setSuccess(null);
                        setFormData({...formData, password});
                        if (!isLogin || isResetPassword) validatePassword(password);
                        setFailedLoginAttempts(0);
                        setShowForgotPasswordOption(false);
                      }}
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
                )}

                {/* Confirm Password Field - Show for signup and reset password */}
                {((!isLogin && !isForgotPassword && !isOtpVerification) || isResetPassword) && (
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      required={!isLogin || isResetPassword}
                      className={`w-full pl-10 pr-4 py-3 bg-[#ededed] border-none rounded-xl text-[#141414] placeholder:text-neutral-500 focus:outline-none focus:ring-2 text-sm ${
                        formData.confirmPassword && formData.password !== formData.confirmPassword 
                          ? 'focus:ring-red-500 ring-2 ring-red-500' 
                          : 'focus:ring-[#141414]'
                      }`}
                      style={{ fontFamily: '"Noto Sans", sans-serif' }}
                    />
                    {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
                        <span className="text-xs">✗</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Password Requirements - Show during reset password */}
                {(isResetPassword || (!isLogin && !isForgotPassword && !isOtpVerification)) && formData.password && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                    <p className="font-medium text-gray-700 mb-2">Password Requirements:</p>
                    <div className="space-y-1">
                      <div className={`flex items-center gap-2 ${passwordStrength.hasMinLength ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{passwordStrength.hasMinLength ? '✓' : '✗'}</span>
                        <span>At least 8 characters</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordStrength.hasCapital ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{passwordStrength.hasCapital ? '✓' : '✗'}</span>
                        <span>One uppercase letter</span>
                      </div>
                      <div className={`flex items-center gap-2 ${passwordStrength.hasSpecial ? 'text-green-600' : 'text-red-600'}`}>
                        <span>{passwordStrength.hasSpecial ? '✓' : '✗'}</span>
                        <span>One special character</span>
                      </div>
                    </div>
                    {(isResetPassword || !isLogin) && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                      <div className="flex items-center gap-2 text-red-600 mt-2">
                        <span>✗</span>
                        <span>Passwords must match</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Resend OTP Button */}
                {isOtpVerification && otpTimer === 0 && (
                  <motion.button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-gray-100 text-[#141414] rounded-xl h-10 px-4 font-medium text-sm hover:bg-gray-200 transition-all duration-300 disabled:opacity-50"
                    style={{ fontFamily: '"Noto Sans", sans-serif' }}
                  >
                    {loading ? 'Sending...' : 'Resend OTP'}
                  </motion.button>
                )}

                <motion.button
                  type="submit"
                  disabled={loading || !isFormValid()}
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
                      {isForgotPassword ? 'Sending OTP...' :
                       isOtpVerification ? 'Verifying...' :
                       isResetPassword ? 'Resetting...' :
                       isLogin ? 'Signing In...' : 'Creating Account...'}
                    </>
                  ) : (
                    <span>
                      {isForgotPassword ? 'Send OTP' :
                       isOtpVerification ? 'Verify OTP' :
                       isResetPassword ? 'Reset Password' :
                       isLogin ? 'Sign In' : 'Create Account'}
                    </span>
                  )}
                </motion.button>
              </form>

              {/* Toggle between Login and Signup */}
              {!isForgotPassword && !isOtpVerification && !isResetPassword && (
                <div className="mt-6 text-center">
                  <p className="text-neutral-500 text-sm" style={{ fontFamily: '"Noto Sans", sans-serif' }}>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                  </p>
                  <motion.button
                    type="button"
                    onClick={switchMode}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-2 text-[#141414] font-medium text-sm hover:text-gray-600 transition-colors duration-200 underline"
                    style={{ fontFamily: '"Noto Sans", sans-serif' }}
                  >
                    {isLogin ? 'Sign up here' : 'Sign in here'}
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
