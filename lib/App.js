"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const Header_1 = __importDefault(require("./components/Header"));
const Hero_1 = __importDefault(require("./components/Hero"));
const About_1 = __importDefault(require("./components/About"));
const Amenities_1 = __importDefault(require("./components/Amenities"));
const Gallery_1 = __importDefault(require("./components/Gallery"));
const Booking_1 = __importDefault(require("./components/Booking"));
const Testimonials_1 = __importDefault(require("./components/Testimonials"));
const Contact_1 = __importDefault(require("./components/Contact"));
const Footer_1 = __importDefault(require("./components/Footer"));
const WhatsAppFloat_1 = __importDefault(require("./components/WhatsAppFloat"));
const MapLocation_1 = __importDefault(require("./components/MapLocation"));
const AuthModal_1 = require("./components/AuthModal");
const auth_1 = require("firebase/auth");
const DemoNotice_1 = __importDefault(require("./components/DemoNotice"));
const app_check_1 = require("firebase/app-check");
const config_1 = __importDefault(require("./firebase/config"));
// Use debug token on localhost, reCAPTCHA in production
const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
if (isLocalhost) {
    // Set debug token for localhost
    globalThis.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
}
(0, app_check_1.initializeAppCheck)(config_1.default, {
    provider: new app_check_1.ReCaptchaV3Provider("38187e2d-8c85-4053-8d4b-1d228f249d55"),
    isTokenAutoRefreshEnabled: true,
});
function App() {
    const [isAuthenticated, setIsAuthenticated] = (0, react_1.useState)(false);
    const [showAuthModal, setShowAuthModal] = (0, react_1.useState)(false);
    const [userEmail, setUserEmail] = (0, react_1.useState)('');
    const [modalTimer, setModalTimer] = (0, react_1.useState)(null);
    const [hasShownInitialModal, setHasShownInitialModal] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const auth = (0, auth_1.getAuth)(config_1.default);
        if (import.meta.env.DEV) {
            // Suppress emulator domain warnings
            (0, auth_1.connectAuthEmulator)(auth, 'http://localhost:9099', { disableWarnings: true });
        }
        // Check if user is already logged in
        const savedAuth = localStorage.getItem('villa_auth');
        if (savedAuth) {
            const authData = JSON.parse(savedAuth);
            setIsAuthenticated(true);
            setUserEmail(authData.email);
            setHasShownInitialModal(true); // Don't show modal if already authenticated
        }
        else {
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
    const handleLogin = (email) => {
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
        return ((0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-neutral-50 flex items-center justify-center", style: { fontFamily: '"Inter", "Noto Sans", sans-serif' }, children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold text-[#141414] mb-4", style: { fontFamily: '"Noto Serif", serif' }, children: "Villa Altona" }), (0, jsx_runtime_1.jsx)("p", { className: "text-neutral-500", style: { fontFamily: '"Noto Sans", sans-serif' }, children: "Welcome to Villa Altona" })] }), (0, jsx_runtime_1.jsx)(AuthModal_1.AuthModal, { isOpen: shouldShowAuthModal, onClose: handleModalClose, onLogin: handleLogin })] }));
    }
    const provider = new auth_1.GoogleAuthProvider();
    // Force redirect to your localhost dev server URL
    provider.setCustomParameters({
        redirect_uri: 'http://localhost:5173' // adjust port if needed
    });
    const auth = (0, auth_1.getAuth)();
    const handleGoogleLogin = async () => {
        try {
            const result = await (0, auth_1.signInWithPopup)(auth, provider);
            // Handle success
            const user = result.user;
            setIsAuthenticated(true);
            setUserEmail(user.email || '');
            localStorage.setItem('villa_auth', JSON.stringify({ email: user.email, loginTime: Date.now() }));
            setShowAuthModal(false);
        }
        catch (error) {
            console.error("Auth error:", error);
        }
    };
    return ((0, jsx_runtime_1.jsxs)(react_router_dom_1.BrowserRouter, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "min-h-screen bg-neutral-50", style: { fontFamily: '"Inter", "Noto Sans", sans-serif' }, children: [(0, jsx_runtime_1.jsx)(DemoNotice_1.default, {}), (0, jsx_runtime_1.jsx)(Header_1.default, { userEmail: userEmail, onLogout: handleLogout, onShowAuth: handleShowAuth }), (0, jsx_runtime_1.jsx)(Hero_1.default, {}), (0, jsx_runtime_1.jsx)(About_1.default, {}), (0, jsx_runtime_1.jsx)(Amenities_1.default, {}), (0, jsx_runtime_1.jsx)(Gallery_1.default, {}), (0, jsx_runtime_1.jsx)(Booking_1.default, { isAuthenticated: isAuthenticated, onShowAuth: () => setShowAuthModal(true) }), (0, jsx_runtime_1.jsx)(Testimonials_1.default, {}), (0, jsx_runtime_1.jsx)(MapLocation_1.default, {}), (0, jsx_runtime_1.jsx)(Contact_1.default, {}), (0, jsx_runtime_1.jsx)(Footer_1.default, {}), (0, jsx_runtime_1.jsx)(WhatsAppFloat_1.default, {}), (0, jsx_runtime_1.jsx)(AuthModal_1.AuthModal, { isOpen: shouldShowAuthModal, onClose: handleModalClose, onLogin: handleLogin })] }), (0, jsx_runtime_1.jsx)(react_router_dom_1.Routes, {})] }));
}
exports.default = App;
