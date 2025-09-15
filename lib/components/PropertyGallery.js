"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const PropertyGallery = () => {
    const [selectedImage, setSelectedImage] = (0, react_1.useState)(null);
    const propertyImages = [
        {
            url: "https://images.pexels.com/photos/1001965/pexels-photo-1001965.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
            title: "Villa Exterior",
            category: "Exterior"
        },
        {
            url: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
            title: "Living Room",
            category: "Interior"
        },
        {
            url: "https://images.pexels.com/photos/1457847/pexels-photo-1457847.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
            title: "Private Pool",
            category: "Amenities"
        },
        {
            url: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
            title: "Master Bedroom",
            category: "Bedrooms"
        },
        {
            url: "https://images.pexels.com/photos/1428348/pexels-photo-1428348.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
            title: "Kitchen",
            category: "Interior"
        },
        {
            url: "https://images.pexels.com/photos/2029667/pexels-photo-2029667.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
            title: "Dining Area",
            category: "Interior"
        },
        {
            url: "https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
            title: "Bathroom",
            category: "Bathrooms"
        },
        {
            url: "https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop",
            title: "Garden View",
            category: "Exterior"
        }
    ];
    const openLightbox = (index) => {
        setSelectedImage(index);
        document.body.style.overflow = 'hidden';
    };
    const closeLightbox = () => {
        setSelectedImage(null);
        document.body.style.overflow = 'unset';
    };
    const goToPrevious = () => {
        setSelectedImage(selectedImage === 0 ? propertyImages.length - 1 : selectedImage - 1);
    };
    const goToNext = () => {
        setSelectedImage(selectedImage === propertyImages.length - 1 ? 0 : selectedImage + 1);
    };
    return ((0, jsx_runtime_1.jsxs)("section", { id: "property-gallery", className: "bg-neutral-50 py-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "px-4", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, viewport: { once: true }, className: "flex items-center justify-between mb-6", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-[#141414] text-[22px] font-bold leading-tight tracking-[-0.015em]", style: { fontFamily: '"Noto Serif", serif' }, children: "Property Gallery" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-2 text-neutral-500", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Camera, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsxs)("span", { className: "text-sm font-medium", style: { fontFamily: '"Noto Sans", sans-serif' }, children: [propertyImages.length, " photos"] })] })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.95 }, whileInView: { opacity: 1, scale: 1 }, transition: { duration: 0.8, delay: 0.2 }, viewport: { once: true }, className: "mb-4", children: (0, jsx_runtime_1.jsxs)("div", { className: "w-full bg-center bg-no-repeat aspect-video bg-cover rounded-xl cursor-pointer hover:scale-105 transition-transform duration-300 relative overflow-hidden", style: { backgroundImage: `url("${propertyImages[0].url}")` }, onClick: () => openLightbox(0), children: [(0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-4 left-4", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-white text-lg font-bold", style: { fontFamily: '"Noto Serif", serif' }, children: propertyImages[0].title }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/80 text-sm", style: { fontFamily: '"Noto Sans", sans-serif' }, children: propertyImages[0].category })] })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "grid grid-cols-2 gap-3", children: propertyImages.slice(1, 5).map((image, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, whileHover: { scale: 1.05, y: -5 }, transition: { duration: 0.6, delay: (index + 1) * 0.1 }, viewport: { once: true }, className: "cursor-pointer relative overflow-hidden rounded-lg", onClick: () => openLightbox(index + 1), children: [(0, jsx_runtime_1.jsx)("div", { className: "w-full bg-center bg-no-repeat aspect-square bg-cover transition-transform duration-300", style: { backgroundImage: `url("${image.url}")` } }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" }), (0, jsx_runtime_1.jsx)("div", { className: "absolute bottom-2 left-2", children: (0, jsx_runtime_1.jsx)("p", { className: "text-white text-sm font-medium", style: { fontFamily: '"Noto Sans", sans-serif' }, children: image.title }) })] }, index + 1))) }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 }, transition: { duration: 0.6, delay: 0.6 }, viewport: { once: true }, onClick: () => openLightbox(0), className: "w-full mt-4 bg-[#ededed] text-[#141414] font-medium py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-300 flex items-center justify-center gap-2", style: { fontFamily: '"Noto Sans", sans-serif' }, children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Camera, { className: "h-4 w-4" }), "View All ", propertyImages.length, " Photos"] })] }), (0, jsx_runtime_1.jsx)(framer_motion_1.AnimatePresence, { children: selectedImage !== null && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 }, className: "fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { onClick: closeLightbox, className: "absolute top-6 right-6 text-white hover:text-gray-300 transition-colors duration-200 z-10", whileHover: { scale: 1.1 }, whileTap: { scale: 0.9 }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-10 w-10" }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { onClick: goToPrevious, className: "absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10", whileHover: { scale: 1.1, x: -5 }, whileTap: { scale: 0.9 }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronLeft, { className: "h-12 w-12" }) }), (0, jsx_runtime_1.jsx)(framer_motion_1.motion.button, { onClick: goToNext, className: "absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 transition-colors duration-200 z-10", whileHover: { scale: 1.1, x: 5 }, whileTap: { scale: 0.9 }, children: (0, jsx_runtime_1.jsx)(lucide_react_1.ChevronRight, { className: "h-12 w-12" }) }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "max-w-4xl max-h-[80vh] flex flex-col items-center", initial: { scale: 0.8, opacity: 0 }, animate: { scale: 1, opacity: 1 }, exit: { scale: 0.8, opacity: 0 }, transition: { duration: 0.3 }, children: [(0, jsx_runtime_1.jsx)("img", { src: propertyImages[selectedImage].url, alt: propertyImages[selectedImage].title, className: "max-w-full max-h-full object-contain rounded-lg" }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { className: "text-center mt-6", initial: { y: 20, opacity: 0 }, animate: { y: 0, opacity: 1 }, transition: { delay: 0.2 }, children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-white text-2xl font-bold mb-2", style: { fontFamily: '"Noto Serif", serif' }, children: propertyImages[selectedImage].title }), (0, jsx_runtime_1.jsx)("p", { className: "text-gray-300 text-lg", style: { fontFamily: '"Noto Sans", sans-serif' }, children: propertyImages[selectedImage].category })] })] })] })) })] }));
};
exports.default = PropertyGallery;
