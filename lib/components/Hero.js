"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Hero;
const jsx_runtime_1 = require("react/jsx-runtime");
const framer_motion_1 = require("framer-motion");
const react_1 = require("react");
const lucide_react_1 = require("lucide-react");
function Hero() {
    const [currentImageIndex, setCurrentImageIndex] = (0, react_1.useState)(0);
    const propertyImages = [
        {
            url: "https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop",
            title: "Villa Exterior"
        },
        {
            url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop",
            title: "Living Room"
        },
        {
            url: "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop",
            title: "Private Pool"
        },
        {
            url: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop",
            title: "Master Bedroom"
        },
        {
            url: "https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&fit=crop",
            title: "Kitchen"
        }
    ];
    const scrollToBooking = () => {
        const element = document.getElementById('booking');
        element === null || element === void 0 ? void 0 : element.scrollIntoView({ behavior: 'smooth' });
    };
    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % propertyImages.length);
    };
    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + propertyImages.length) % propertyImages.length);
    };
    return ((0, jsx_runtime_1.jsxs)("section", { id: "hero", className: "bg-neutral-50 pt-32", children: [(0, jsx_runtime_1.jsx)("div", { className: "@container", children: (0, jsx_runtime_1.jsx)("div", { className: "@[480px]:px-4 @[480px]:py-3", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 1 }, className: "bg-cover bg-center flex flex-col justify-end overflow-hidden bg-neutral-50 @[480px]:rounded-xl min-h-80 relative", style: {
                            backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0) 25%), url("${propertyImages[currentImageIndex].url}")`
                        }, children: [(0, jsx_runtime_1.jsx)("button", { onClick: prevImage, className: "absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-all duration-200", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "h-6 w-6" }) }), (0, jsx_runtime_1.jsx)("button", { onClick: nextImage, className: "absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-white/30 transition-all duration-200", children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-6 w-6" }) }), (0, jsx_runtime_1.jsx)("div", { className: "absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1", children: (0, jsx_runtime_1.jsx)("p", { className: "text-white text-sm font-medium", style: { fontFamily: '"Noto Sans", sans-serif' }, children: propertyImages[currentImageIndex].title }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex justify-center gap-2 p-5", children: propertyImages.map((_, i) => ((0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { onClick: () => setCurrentImageIndex(i), initial: { opacity: 0, scale: 0 }, animate: { opacity: i === currentImageIndex ? 1 : 0.5, scale: 1 }, transition: { delay: i * 0.1 }, className: "size-1.5 rounded-full bg-neutral-50 hover:opacity-100 transition-opacity duration-200" }, i))) })] }) }) }), (0, jsx_runtime_1.jsxs)("div", { className: "px-4 py-6", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.h2, { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.3 }, className: "text-[#141414] text-[28px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5", style: { fontFamily: '"Noto Serif", serif' }, children: "About this place" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.p, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.5 }, className: "text-[#141414] text-base font-normal leading-normal mb-8", style: { fontFamily: '"Noto Sans", sans-serif' }, children: "Experience unparalleled luxury in our exclusive villa nestled in the heart of Goa. This spacious retreat features six bedrooms, each with an en-suite bathroom, a fully equipped gourmet kitchen, a private infinity pool, and sprawling tropical gardens. Perfect for families or groups seeking an extraordinary escape." }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.7 }, className: "flex gap-3", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { whileHover: { scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }, whileTap: { scale: 0.95 }, onClick: scrollToBooking, className: "flex-1 bg-[#141414] text-white rounded-lg h-14 px-6 font-bold text-base tracking-[0.015em] hover:bg-gray-800 transition-all duration-300", style: { fontFamily: '"Noto Sans", sans-serif' }, children: "Book Now" }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { whileHover: { scale: 1.05, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }, whileTap: { scale: 0.95 }, onClick: () => { var _a; return (_a = document.getElementById('contact')) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ behavior: 'smooth' }); }, className: "flex-1 bg-[#ededed] text-[#141414] rounded-lg h-14 px-6 font-bold text-base tracking-[0.015em] hover:bg-gray-300 transition-all duration-300", style: { fontFamily: '"Noto Sans", sans-serif' }, children: "Contact Host" })] })] })] }));
}
