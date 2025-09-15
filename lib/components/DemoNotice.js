"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const DemoNotice = () => {
    const [isVisible, setIsVisible] = (0, react_1.useState)(true);
    if (!isVisible)
        return null;
    return ((0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, y: -100 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -100 }, className: "fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 shadow-lg", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-7xl mx-auto flex items-center justify-between", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Info, { className: "h-5 w-5 flex-shrink-0" }), (0, jsx_runtime_1.jsxs)("div", { className: "text-sm", children: [(0, jsx_runtime_1.jsx)("span", { className: "font-semibold", children: "Demo Mode:" }), " This is a fully functional villa booking system.", (0, jsx_runtime_1.jsx)("span", { className: "hidden sm:inline", children: " All features are working including payments, bookings, and admin dashboard." })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2", children: [(0, jsx_runtime_1.jsxs)("a", { href: "https://github.com/your-repo/villa-altona", target: "_blank", rel: "noopener noreferrer", className: "hidden sm:flex items-center gap-1 text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full transition-colors duration-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ExternalLink, { className: "h-3 w-3" }), "View Code"] }), (0, jsx_runtime_1.jsx)("button", { onClick: () => setIsVisible(false), className: "p-1 hover:bg-white/20 rounded-full transition-colors duration-200", "aria-label": "Close notice", children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-4 w-4" }) })] })] }) }) }));
};
exports.default = DemoNotice;
