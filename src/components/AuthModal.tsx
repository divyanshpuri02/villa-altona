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
  };

  const validatePassword = (password: string) => {
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasCapital = /[A-Z]/.test(password);
    const hasMinLength = password.length >= 8;
    
    setPasswordStrength({
      hasSpecial,
      hasCapital,
      hasMinLength,
      isValid: hasSpecial && hasCapital && hasMinLength
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
    } else {
      // Login validation
      if (!formData.email || !formData.password) {
        setError('Please enter email and password');
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
    }
    setGoogleLoading(false);
  };

  // Forgot Password using Firebase Auth
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        >
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
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
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
            {/* Header */}
            <div className="flex items-center bg-neutral-50 p-4 pb-2 justify-between border-b border-[#ededed]">
              <button
                onClick={handleModalClose}
                className="text-[#141414] flex size-12 shrink-0 items-center justify-center hover:bg-[#ededed] rounded-lg transition-colors duration-200"
                title="Close"
                aria-label="Close modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
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
                  </div>
                </div>
              )}

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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
