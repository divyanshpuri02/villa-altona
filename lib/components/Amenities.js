"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Amenities;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
function Amenities() {
    const amenities = [
        { icon: lucide_react_1.Waves, title: 'Pool' },
        { icon: lucide_react_1.Wifi, title: 'Wifi' },
        { icon: lucide_react_1.Car, title: 'Parking' },
        { icon: lucide_react_1.Tv, title: 'TV' },
        { icon: lucide_react_1.ChefHat, title: 'Kitchen' },
        { icon: lucide_react_1.Wind, title: 'Air Conditioning' },
    ];
    const services = [
        { icon: lucide_react_1.Bell, title: 'Concierge' },
        { icon: lucide_react_1.Crown, title: 'Private Chef' },
        { icon: lucide_react_1.Mouse, title: 'Housekeeping' },
        { icon: lucide_react_1.Car, title: 'Transportation' },
        { icon: lucide_react_1.Dumbbell, title: 'Fitness Center' },
        { icon: lucide_react_1.Waves, title: 'Spa Services' },
    ];
    return ((0, jsx_runtime_1.jsx)("section", { id: "amenities", className: "bg-neutral-50 py-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "px-4", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.h2, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, viewport: { once: true }, className: "text-[#141414] text-[28px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5", style: { fontFamily: '"Noto Serif", serif' }, children: "Amenities" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3 mb-8", children: amenities.map((amenity, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, whileHover: { scale: 1.05, y: -5 }, transition: { duration: 0.6, delay: index * 0.1 }, viewport: { once: true }, className: "flex flex-1 gap-4 rounded-lg border border-[#dbdbdb] bg-neutral-50 p-5 items-center hover:bg-gray-100 hover:shadow-lg transition-all duration-300", children: [(0, jsx_runtime_1.jsx)(amenity.icon, { className: "h-6 w-6 text-[#141414]" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-[#141414] text-base font-bold leading-tight", style: { fontFamily: '"Noto Sans", sans-serif' }, children: amenity.title })] }, index))) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.h2, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, viewport: { once: true }, className: "text-[#141414] text-[28px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5", style: { fontFamily: '"Noto Serif", serif' }, children: "Services" }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-[repeat(auto-fit,minmax(158px,1fr))] gap-3", children: services.map((service, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, whileHover: { scale: 1.05, y: -5 }, transition: { duration: 0.6, delay: index * 0.1 }, viewport: { once: true }, className: "flex flex-1 gap-4 rounded-lg border border-[#dbdbdb] bg-neutral-50 p-5 items-center hover:bg-gray-100 hover:shadow-lg transition-all duration-300", children: [(0, jsx_runtime_1.jsx)(service.icon, { className: "h-6 w-6 text-[#141414]" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-[#141414] text-base font-bold leading-tight", style: { fontFamily: '"Noto Sans", sans-serif' }, children: service.title })] }, index))) })] }) }));
}
