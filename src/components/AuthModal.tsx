<<<<<<< HEAD
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
=======
// TypeScript
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db, functions } from '../firebase/config';
import { doc, setDoc } from 'firebase/firestore';
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage';
import { httpsCallable } from 'firebase/functions';
export { AuthModal }
>>>>>>> 831823ff4cf216945a2d47443ab0d851e1d3047c

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
<<<<<<< HEAD

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
=======
  // State for demo image upload
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  // User info and Firestore data
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [userImages, setUserImages] = useState<string[]>([]);

  // Fetch user info and Firestore data
  useEffect(() => {
    if (auth.currentUser) {
      setUser(auth.currentUser);
      // Fetch Firestore user data
      import('firebase/firestore').then(({ getDoc, doc }) => {
        getDoc(doc(db, 'users', auth.currentUser.uid)).then(snapshot => {
          setUserData(snapshot.exists() ? snapshot.data() : null);
        });
      });
      // Fetch uploaded images from Storage
      import('firebase/storage').then(({ getStorage, ref, listAll, getDownloadURL }) => {
        const storage = getStorage();
        const imagesRef = ref(storage, `user-images/${auth.currentUser.uid}`);
        listAll(imagesRef).then(res => {
          Promise.all(res.items.map(itemRef => getDownloadURL(itemRef))).then(urls => {
            setUserImages(urls);
          });
        });
      });
    } else {
      setUser(null);
      setUserData(null);
      setUserImages([]);
    }
  }, [isOpen, imageUrl]);

  // Sign out handler
  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
    setUserData(null);
    setUserImages([]);
    setSuccess('Signed out successfully!');
    onClose();
  };

  // Handler for image upload
  const handleImageUpload = async () => {
    if (!selectedImage) {
      setError('Please select an image file first.');
      return;
    }
    if (!auth.currentUser) {
      setError('You must be logged in to upload an image.');
      return;
    }
    const url = await uploadImageToStorage(selectedImage, auth.currentUser.uid);
    if (url) setImageUrl(url);
  };

  // Handler for custom function call
  const handleFunctionCall = async () => {
    const result = await callCustomFunction({ message: 'Hello from client!' });
    // You can use result as needed
  };
  // Firebase Auth signup
  const firebaseSignup = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      setSuccess('Signup successful!');
      // Save user profile to Firestore
      await saveUserToFirestore(userCredential.user.uid, formData.name, email);
      onLogin(email);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Firebase Auth login
  const firebaseLogin = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setSuccess('Login successful!');
      onLogin(email);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
>>>>>>> 831823ff4cf216945a2d47443ab0d851e1d3047c
  };

  const validatePassword = (password: string) => {
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasCapital = /[A-Z]/.test(password);
    const hasMinLength = password.length >= 8;
    const isValid = hasSpecial && hasCapital && hasMinLength;
<<<<<<< HEAD

=======
>>>>>>> 831823ff4cf216945a2d47443ab0d851e1d3047c
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
<<<<<<< HEAD
      
=======
>>>>>>> 831823ff4cf216945a2d47443ab0d851e1d3047c
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
<<<<<<< HEAD
      
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
    
=======
    } else {
      // Login validation
      if (!formData.email || !formData.password) {
        setError('Please enter email and password');
        return false;
      }
    }
>>>>>>> 831823ff4cf216945a2d47443ab0d851e1d3047c
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
<<<<<<< HEAD
    
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
=======
    setError(null);
    if (!validateForm()) {
      return;
    }
    if (isLogin) {
      await firebaseLogin(formData.email, formData.password);
    } else {
      await firebaseSignup(formData.email, formData.password);
    }
    if (!error) {
      onClose();
    }
  };

  // Google login using Firebase Auth (popup)
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setSuccess('Google login successful!');
      onLogin(user.email || '');
      onClose();
    } catch (error: any) {
      setError(error.message || 'Google login failed. Please try again.');
>>>>>>> 831823ff4cf216945a2d47443ab0d851e1d3047c
    }
    setGoogleLoading(false);
  };

<<<<<<< HEAD
  // Forgot Password Functions
=======
  // Forgot Password using Firebase Auth
>>>>>>> 831823ff4cf216945a2d47443ab0d851e1d3047c
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
<<<<<<< HEAD
    
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
=======
    if (!formData.email) {
      setError('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setSuccess(`Password reset email sent to ${formData.email}. Check your inbox.`);
      setIsForgotPassword(false);
    } catch (error: any) {
      setError(error.message || 'Failed to send password reset email.');
    }
    setLoading(false);
  };
  
  // Remove OTP and local password reset logic, as Firebase handles password reset via email
>>>>>>> 831823ff4cf216945a2d47443ab0d851e1d3047c
  
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

<<<<<<< HEAD
=======
  // Save user data to Firestore
  const saveUserToFirestore = async (uid: string, name: string, email: string) => {
    try {
      await setDoc(doc(db, 'users', uid), {
        name,
        email,
        createdAt: new Date().toISOString()
      });
      setSuccess('User profile saved to Firestore!');
    } catch (err: any) {
      setError('Failed to save user profile: ' + err.message);
    }
  };

  // Upload image to Firebase Storage
  const uploadImageToStorage = async (file: File, userId: string) => {
    try {
      const storage = getStorage();
      const fileRef = storageRef(storage, `user-images/${userId}/${file.name}`);
      await uploadBytes(fileRef, file);
      const url = await getDownloadURL(fileRef);
      setSuccess('Image uploaded! URL: ' + url);
      return url;
    } catch (err: any) {
      setError('Image upload failed: ' + err.message);
      return null;
    }
  };

  // Call a Firebase Function (example: 'customFunction')
  const callCustomFunction = async (data: any) => {
    try {
      const customFunction = httpsCallable(functions, 'customFunction');
      const result = await customFunction(data);
      setSuccess('Function result: ' + JSON.stringify(result.data));
      return result.data;
    } catch (err: any) {
      setError('Function call failed: ' + err.message);
      return null;
    }
  };

>>>>>>> 831823ff4cf216945a2d47443ab0d851e1d3047c
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
<<<<<<< HEAD
=======
          {/* Loading Spinner Overlay */}
          {(loading || googleLoading) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="h-10 w-10 border-4 border-white border-t-blue-600 rounded-full"
              />
            </div>
          )}
>>>>>>> 831823ff4cf216945a2d47443ab0d851e1d3047c
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
<<<<<<< HEAD
            className="bg-neutral-50 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
=======
            className="bg-neutral-50 rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative"
            aria-modal="true"
            role="dialog"
            tabIndex={-1}
          >
            {/* Toast Notifications */}
            {(error || success) && (
              <div className={`fixed top-6 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg shadow-lg z-50 text-sm font-medium ${error ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}
                role="alert"
                aria-live="assertive"
              >
                {error || success}
              </div>
            )}
>>>>>>> 831823ff4cf216945a2d47443ab0d851e1d3047c
            {/* Header */}
            <div className="flex items-center bg-neutral-50 p-4 pb-2 justify-between border-b border-[#ededed]">
              <button
                onClick={handleModalClose}
                className="text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-[#ededed] rounded-lg transition-colors duration-200"
<<<<<<< HEAD
=======
                title="Close"
                aria-label="Close modal"
>>>>>>> 831823ff4cf216945a2d47443ab0d851e1d3047c
              >
                <X className="h-6 w-6" />
              </button>
            </div>
<<<<<<< HEAD

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
=======
            {/* Modal Content */}
            <div className="p-6">
              {/* User Info & Avatar */}
              {user && (
                <div className="flex flex-col items-center mb-6" aria-label="User Info">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User avatar" className="h-16 w-16 rounded-full mb-2" />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mb-2">
                      <User className="h-8 w-8 text-gray-500" />
                    </div>
                  )}
                  <div className="text-lg font-bold text-[#141414]">{user.displayName || userData?.name || 'No Name'}</div>
                  <div
                    className="text-sm text-gray-600 max-w-[220px] truncate text-center"
                    title={user.email}
                  >
                    {user.email}
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    aria-label="Sign out"
                  >
                    Sign Out
                  </button>
                </div>
              )}

              {/* Firestore User Data */}
              {userData && (
                <div className="mb-6" aria-label="Profile Data">
                  <div className="font-medium text-gray-700 mb-1">Profile Data:</div>
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm">
                    <div><span className="font-bold">Name:</span> {userData.name}</div>
                    <div><span className="font-bold">Email:</span> {userData.email}</div>
                    <div><span className="font-bold">Created At:</span> {userData.createdAt}</div>
>>>>>>> 831823ff4cf216945a2d47443ab0d851e1d3047c
                  </div>
                </div>
              )}

<<<<<<< HEAD
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
=======
              {/* Uploaded Images */}
              {userImages.length > 0 && (
                <div className="mb-6" aria-label="Uploaded Images">
                  <div className="font-medium text-gray-700 mb-1">Uploaded Images:</div>
                  <div className="flex flex-wrap gap-2">
                    {userImages.map((url, idx) => (
                      <a href={url} target="_blank" rel="noopener noreferrer" key={idx} className="block">
                        <img src={url} alt={`User upload ${idx + 1}`} className="h-16 w-16 object-cover rounded-lg border" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Auth Form */}
              <div className="flex flex-col gap-6 items-center">
                {/* Logo/Title */}
                <div className="mb-2 text-center">
                  <div className="text-2xl font-bold">Villa Altona</div>
                  <div className="text-gray-500 text-sm mt-1">
                    {isLogin ? "Sign in to your account" : "Create your account"}
                  </div>
                </div>

                {/* Google Login */}
                <button
                  onClick={handleGoogleLogin}
                  className="flex items-center justify-center gap-2 bg-white border border-gray-300 rounded-lg px-4 py-3 w-full font-medium hover:bg-gray-100 transition"
                  aria-label="Continue with Google"
                  disabled={googleLoading}
                >
                  <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="h-5 w-5" />
                  {googleLoading ? "Loading..." : "Continue with Google"}
                </button>

                {/* Divider */}
                <div className="flex items-center w-full my-2">
                  <hr className="flex-grow border-gray-200" />
                  <span className="mx-2 text-gray-400 text-xs">or</span>
                  <hr className="flex-grow border-gray-200" />
                </div>

                {isForgotPassword ? (
                  <form className="w-full flex flex-col gap-4" onSubmit={handleForgotPassword}>
                    <div className="mb-2 text-center">
                      <div className="text-2xl font-bold">Villa Altona</div>
                      <div className="text-gray-500 text-sm mt-1">Reset your password</div>
                    </div>
                    <div className="w-full relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Mail size={18} />
                      </span>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 pr-3 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black"
                        aria-label="Email Address"
                        required
                      />
                    </div>
                    {(error || success) && (
                      <div className={`w-full text-center text-sm py-2 rounded ${error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {error || success}
                      </div>
                    )}
                    <button
                      type="submit"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-black transition"
                      aria-label="Send Reset Email"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Reset Email"}
                    </button>
                    <button
                      type="button"
                      className="text-black underline font-medium mt-2"
                      onClick={() => { setIsForgotPassword(false); setIsLogin(true); }}
                    >
                      Back to Login
                    </button>
                  </form>
                ) : (
                  <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
                    {/* Name Field (Signup only) */}
                    {!isLogin && (
                      <div className="w-full relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                          <User size={18} />
                        </span>
                        <input
                          type="text"
                          placeholder="Name"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="pl-10 pr-3 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black"
                          aria-label="Name"
                          required
                        />
                      </div>
                    )}

                    {/* Email Field */}
                    <div className="w-full relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Mail size={18} />
                      </span>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="pl-10 pr-3 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black"
                        aria-label="Email Address"
                        required
                      />
                    </div>

                    {/* Password Field */}
                    <div className="w-full relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <Lock size={18} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        className="pl-10 pr-10 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black"
                        aria-label="Password"
                        required
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        tabIndex={0}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    {/* Confirm Password (Signup only) */}
                    {!isLogin && (
                      <div className="w-full relative">
                        <input
                          type="password"
                          placeholder="Confirm Password"
                          value={formData.confirmPassword}
                          onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                          className="pl-3 pr-3 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-black"
                          aria-label="Confirm Password"
                          required
                        />
                      </div>
                    )}

                    {/* Password Strength Meter (Signup only) */}
                    {!isLogin && (
                      <div className="w-full text-xs text-gray-600 mt-1">
                        <div>Password must contain:</div>
                        <ul className="list-disc ml-4">
                          <li className={passwordStrength.hasSpecial ? "text-green-600 font-bold" : "text-red-600"}>
                            Special character
                          </li>
                          <li className={passwordStrength.hasCapital ? "text-green-600 font-bold" : "text-red-600"}>
                            Capital letter
                          </li>
                          <li className={passwordStrength.hasMinLength ? "text-green-600 font-bold" : "text-red-600"}>
                            At least 8 characters
                          </li>
                        </ul>
                      </div>
                    )}

                    {/* Error/Success Message */}
                    {(error || success) && (
                      <div className={`w-full text-center text-sm py-2 rounded ${error ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                        {error || success}
                      </div>
                    )}

                    {/* Sign In / Sign Up Button */}
                    <button
                      type="submit"
                      className="w-full bg-gray-700 text-white px-4 py-3 rounded-lg font-semibold hover:bg-black transition"
                      aria-label={isLogin ? "Sign In" : "Sign Up"}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
                    </button>
                  </form>
                )}

                {/* Signup/Login Link */}
                <div className="text-center w-full text-sm text-gray-600 mt-2">
                  {isLogin ? (
                    <>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        className="text-black underline font-medium"
                        onClick={() => { setIsLogin(false); setError(null); setSuccess(null); }}
                      >
                        Sign up here
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-black underline font-medium"
                        onClick={() => { setIsLogin(true); setError(null); setSuccess(null); }}
                      >
                        Log in here
                      </button>
                    </>
                  )}
                </div>
              </div>
>>>>>>> 831823ff4cf216945a2d47443ab0d851e1d3047c
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
<<<<<<< HEAD

export default AuthModal;
=======
>>>>>>> 831823ff4cf216945a2d47443ab0d851e1d3047c
