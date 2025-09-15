"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = About;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
function About() {
    const features = [
        { icon: lucide_react_1.Users, label: 'Up to 12 Guests', value: '12' },
        { icon: lucide_react_1.Bed, label: 'Bedrooms', value: '6' },
        { icon: lucide_react_1.Bath, label: 'Bathrooms', value: '8' },
        { icon: lucide_react_1.Home, label: 'Square Feet', value: '8,500' },
    ];
    return ((0, jsx_runtime_1.jsx)("section", { id: "about", className: "bg-neutral-50 py-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "px-4", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.h2, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, viewport: { once: true }, className: "text-[#141414] text-[28px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5", style: { fontFamily: '"Noto Serif", serif' }, children: "About this place" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-4", children: features.map((feature, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.9 }, whileInView: { opacity: 1, scale: 1 }, whileHover: { scale: 1.05, y: -5 }, transition: { duration: 0.6, delay: index * 0.1 }, viewport: { once: true }, className: "flex flex-col items-center p-6 rounded-lg border border-[#dbdbdb] bg-neutral-50 hover:shadow-lg transition-all duration-300", children: [(0, jsx_runtime_1.jsx)(feature.icon, { className: "h-10 w-10 text-[#141414] mb-3" }), (0, jsx_runtime_1.jsx)("div", { className: "luxury-heading text-3xl font-bold text-[#141414] mb-2", children: feature.value }), (0, jsx_runtime_1.jsx)("div", { className: "luxury-text text-sm text-neutral-500 text-center font-medium", children: feature.label })] }, index))) }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, whileHover: { scale: 1.02 }, transition: { duration: 0.8, delay: 0.6 }, viewport: { once: true }, className: "mt-8 p-6 rounded-lg border border-[#dbdbdb] bg-gradient-to-br from-neutral-50 to-neutral-100 hover:shadow-lg transition-all duration-300", children: [(0, jsx_runtime_1.jsx)("div", { className: "luxury-text text-sm text-neutral-500 mb-2 font-medium", children: "Starting from" }), (0, jsx_runtime_1.jsx)("div", { className: "luxury-heading text-4xl font-bold text-[#141414] mb-1", children: "\u20B9100,000" }), (0, jsx_runtime_1.jsx)("div", { className: "luxury-text text-sm text-neutral-500 font-medium", children: "per night" })] })] }) }));
}
