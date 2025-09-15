"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const framer_motion_1 = require("framer-motion");
const lucide_react_1 = require("lucide-react");
const sampleData_1 = require("../services/sampleData");
const DatabaseSetup = () => {
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [success, setSuccess] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    const handlePopulateDatabase = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);
        try {
            const result = await (0, sampleData_1.populateDatabase)();
            if (result) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 5000);
            }
            else {
                setError('Failed to populate database');
            }
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        }
        finally {
            setLoading(false);
        }
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "fixed bottom-4 left-4 z-50", children: (0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, scale: 0.8 }, animate: { opacity: 1, scale: 1 }, className: "bg-white rounded-lg shadow-lg p-4 border border-gray-200 max-w-sm", children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center gap-3 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Database, { className: "h-5 w-5 text-blue-600" }), (0, jsx_runtime_1.jsx)("h3", { className: "font-semibold text-gray-800", children: "Database Setup" })] }), success && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "flex items-center gap-2 text-green-600 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.CheckCircle, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: "Database populated successfully!" })] })), error && ((0, jsx_runtime_1.jsxs)(framer_motion_1.motion.div, { initial: { opacity: 0, y: -10 }, animate: { opacity: 1, y: 0 }, className: "flex items-center gap-2 text-red-600 mb-3", children: [(0, jsx_runtime_1.jsx)(lucide_react_1.AlertCircle, { className: "h-4 w-4" }), (0, jsx_runtime_1.jsx)("span", { className: "text-sm", children: error })] })), (0, jsx_runtime_1.jsx)("button", { onClick: handlePopulateDatabase, disabled: loading, className: "w-full bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2", children: loading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Loader2, { className: "h-4 w-4 animate-spin" }), "Populating..."] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(lucide_react_1.Database, { className: "h-4 w-4" }), "Populate Sample Data"] })) }), (0, jsx_runtime_1.jsx)("p", { className: "text-xs text-gray-500 mt-2", children: "This will add sample bookings, users, and contacts to your database." })] }) }));
};
exports.default = DatabaseSetup;
