"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
const Header = ({ userEmail, onLogout, onShowAuth }) => {
    const [isScrolled, setIsScrolled] = (0, react_1.useState)(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = (0, react_1.useState)(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = (0, react_1.useState)(false);
    // Check if user is authenticated
    const isAuthenticated = !!userEmail;
    (0, react_1.useEffect)(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const scrollToSection = (sectionId) => {
        // Map navigation items to actual section IDs
        const sectionMap = {
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
    return ((0, jsx_runtime_1.jsx)("header", { className: `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-white/90 backdrop-blur-sm'}`, children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between h-20 relative", children: [(0, jsx_runtime_1.jsx)("button", { onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), className: "md:hidden p-2 rounded-md text-black hover:bg-white/20 transition-colors duration-200", "aria-label": "Toggle mobile menu", children: isMobileMenuOpen ? (0, jsx_runtime_1.jsx)(lucide_react_1.X, { size: 24 }) : (0, jsx_runtime_1.jsx)(lucide_react_1.Menu, { size: 24 }) }), (0, jsx_runtime_1.jsx)("div", { className: "md:relative md:left-0 md:top-0 md:transform-none absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2", children: (0, jsx_runtime_1.jsxs)("div", { className: "text-center", children: [(0, jsx_runtime_1.jsxs)("h1", { className: "text-2xl font-bold text-black tracking-tight", style: { fontFamily: '"Noto Serif", serif' }, children: [(0, jsx_runtime_1.jsx)("img", { src: "/file1.svg", alt: "Villa Altona", className: "h-20 w-auto", onError: (e) => {
                                                    e.currentTarget.style.display = 'none';
                                                    e.currentTarget.nextElementSibling.style.display = 'inline';
                                                } }), (0, jsx_runtime_1.jsx)("span", { style: { display: 'none' }, children: "Villa Altona" })] }), (0, jsx_runtime_1.jsx)("div", { className: "h-0.5 w-full bg-gradient-to-r from-transparent via-black to-transparent opacity-60 mt-1" })] }) }), isAuthenticated ? ((0, jsx_runtime_1.jsxs)("div", { className: "relative ml-auto", children: [(0, jsx_runtime_1.jsxs)("button", { onClick: () => setIsUserMenuOpen(!isUserMenuOpen), className: "flex items-center space-x-2 p-2 rounded-md text-black hover:text-gray-300 transition-colors duration-200", "aria-label": "User menu", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:block text-sm truncate max-w-32", children: userEmail })] }), isUserMenuOpen && ((0, jsx_runtime_1.jsxs)("div", { className: "absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-md shadow-lg py-1 z-50 border border-white/20", children: [(0, jsx_runtime_1.jsx)("div", { className: "px-4 py-2 text-sm text-black-300 border-b border-white/20", children: userEmail }), (0, jsx_runtime_1.jsxs)("button", { onClick: handleSignOut, className: "flex items-center w-full px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200 group", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.LogOut, { size: 16, className: "mr-3 group-hover:text-red-600 transition-colors duration-200" }), "Sign out"] })] }))] })) : ((0, jsx_runtime_1.jsx)("div", { className: "relative ml-auto", children: (0, jsx_runtime_1.jsxs)("button", { onClick: handleSignIn, className: "flex items-center space-x-2 p-2 rounded-md text-black hover:text-gray-300 transition-colors duration-200", "aria-label": "Sign in", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.User, { size: 20 }), (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:block text-sm", children: "Sign In" })] }) }))] }), (0, jsx_runtime_1.jsx)("nav", { className: "hidden md:block border-t border-white/20", children: (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center space-x-8 py-4", children: ['About', 'Amenities', 'Gallery', 'Booking', 'Reviews', 'Contact'].map((item) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => scrollToSection(item.toLowerCase()), className: "text-black hover:text-gray-600 transition-colors duration-200 text-sm font-medium relative group", children: [item, (0, jsx_runtime_1.jsx)("span", { className: "absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full" })] }, item))) }) }), isMobileMenuOpen && ((0, jsx_runtime_1.jsx)("nav", { className: "md:hidden bg-white/95 backdrop-blur-md border-t border-white/20", children: (0, jsx_runtime_1.jsx)("div", { className: "px-2 pt-2 pb-3 space-y-1", children: ['About', 'Amenities', 'Gallery', 'Booking', 'Reviews', 'Contact'].map((item) => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => scrollToSection(item.toLowerCase()), className: "block w-full text-left px-3 py-2 text-black hover:bg-white/20 hover:text-gray-600 transition-colors duration-200 text-sm font-medium rounded-md relative group", children: [item, (0, jsx_runtime_1.jsx)("span", { className: "absolute bottom-1 left-3 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-[calc(100%-1.5rem)]" })] }, item))) }) }))] }) }));
};
exports.default = Header;
