"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Testimonials;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = __importDefault(require("react"));
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
function Testimonials() {
    const testimonials = [
        {
            name: "Priya Sharma",
            location: "Mumbai, India",
            time: "2 weeks ago",
            rating: 5,
            text: "Our stay at Villa Altona was nothing short of magical. The villa is beautifully decorated, and the views are simply stunning. The staff was incredibly attentive, and the private chef prepared delicious meals. We can't wait to return!",
            image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
            likes: 15,
            dislikes: 2
        },
        {
            name: "Rajesh Patel",
            location: "Delhi, India",
            time: "1 month ago",
            rating: 4,
            text: "We had a wonderful time at Villa Altona. The villa is spacious and well-maintained, and the pool area is perfect for relaxing. The location is ideal for exploring Goa, and we enjoyed visiting the nearby beaches and markets.",
            image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop",
            likes: 8,
            dislikes: 1
        }
    ];
    const ratingData = [
        { stars: 5, percentage: 70 },
        { stars: 4, percentage: 20 },
        { stars: 3, percentage: 5 },
        { stars: 2, percentage: 3 },
        { stars: 1, percentage: 2 }
    ];
    return ((0, jsx_runtime_1.jsx)("section", { id: "testimonials", className: "bg-neutral-50 py-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "px-4", children: [(0, jsx_runtime_1.jsx)(framer_motion_1.motion.h2, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8 }, viewport: { once: true }, className: "text-[#141414] text-[28px] font-bold leading-tight tracking-[-0.015em] pb-3 pt-5", style: { fontFamily: '"Noto Serif", serif' }, children: "Guest Reviews" }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, transition: { duration: 0.8, delay: 0.2 }, viewport: { once: true }, className: "flex flex-wrap gap-x-8 gap-y-6 mb-8", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex flex-col gap-2", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[#141414] text-4xl font-black leading-tight tracking-[-0.033em]", style: { fontFamily: '"Noto Serif", serif' }, children: "4.8" }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-0.5", children: [[...Array(4)].map((_, i) => ((0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "w-[18px] h-[18px] fill-[#141414] text-[#141414]" }, i))), (0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: "w-[18px] h-[18px] text-[#c2c2c2]" })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-[#141414] text-base font-normal leading-normal", style: { fontFamily: '"Noto Sans", sans-serif' }, children: "125 reviews" })] }), (0, jsx_runtime_1.jsx)("div", { className: "grid min-w-[200px] max-w-[400px] flex-1 grid-cols-[20px_1fr_40px] items-center gap-y-3", children: ratingData.map((rating) => ((0, jsx_runtime_1.jsxs)(react_1.default.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[#141414] text-sm font-normal leading-normal", style: { fontFamily: '"Noto Sans", sans-serif' }, children: rating.stars }), (0, jsx_runtime_1.jsx)("div", { className: "flex h-2 flex-1 overflow-hidden rounded-full bg-[#dbdbdb]", children: (0, jsx_runtime_1.jsx)(framer_motion_1.motion.div, { initial: { width: 0 }, whileInView: { width: `${rating.percentage}%` }, transition: { duration: 1, delay: 0.5 }, viewport: { once: true }, className: "rounded-full bg-[#141414]" }) }), (0, jsx_runtime_1.jsxs)("p", { className: "text-neutral-500 text-sm font-normal leading-normal text-right", style: { fontFamily: '"Noto Sans", sans-serif' }, children: [rating.percentage, "%"] })] }, rating.stars))) })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-col gap-8", children: testimonials.map((testimonial, index) => ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: 30 }, whileInView: { opacity: 1, y: 0 }, whileHover: { scale: 1.02, y: -5 }, transition: { duration: 0.8, delay: index * 0.2 }, viewport: { once: true }, className: "flex flex-col gap-4 bg-gradient-to-br from-neutral-50 to-neutral-100 p-6 rounded-lg border border-[#dbdbdb] hover:shadow-lg transition-all duration-300", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3", children: [(0, jsx_runtime_1.jsx)("div", { className: "bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10", style: { backgroundImage: `url("${testimonial.image}")` } }), (0, jsx_runtime_1.jsxs)("div", { className: "flex-1", children: [(0, jsx_runtime_1.jsx)("p", { className: "text-[#141414] text-base font-medium leading-normal", style: { fontFamily: '"Noto Sans", sans-serif' }, children: testimonial.name }), (0, jsx_runtime_1.jsx)("p", { className: "text-neutral-500 text-sm font-normal leading-normal", style: { fontFamily: '"Noto Sans", sans-serif' }, children: testimonial.time })] })] }), (0, jsx_runtime_1.jsx)("div", { className: "flex gap-0.5", children: [...Array(5)].map((_, i) => ((0, jsx_runtime_1.jsx)(lucide_react_1.Star, { className: `w-5 h-5 ${i < testimonial.rating
                                        ? 'fill-[#141414] text-[#141414]'
                                        : 'text-[#c2c2c2]'}` }, i))) }), (0, jsx_runtime_1.jsx)("p", { className: "text-[#141414] text-base font-normal leading-normal", style: { fontFamily: '"Noto Sans", sans-serif' }, children: testimonial.text }), (0, jsx_runtime_1.jsxs)("div", { className: "flex gap-9 text-neutral-500", children: [(0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.95 }, className: "flex items-center gap-2 hover:text-[#141414] transition-colors duration-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ThumbsUp, { className: "w-5 h-5" }), (0, jsx_runtime_1.jsx)("p", { className: "font-medium", style: { fontFamily: '"Noto Sans", sans-serif' }, children: testimonial.likes })] }), (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.button, { whileHover: { scale: 1.1 }, whileTap: { scale: 0.95 }, className: "flex items-center gap-2 hover:text-[#141414] transition-colors duration-200", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.ThumbsDown, { className: "w-5 h-5" }), (0, jsx_runtime_1.jsx)("p", { className: "font-medium", style: { fontFamily: '"Noto Sans", sans-serif' }, children: testimonial.dislikes })] })] })] }, index))) })] }) }));
}
