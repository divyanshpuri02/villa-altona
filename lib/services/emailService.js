"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactEmail = void 0;
const bookingService_1 = require("./bookingService");
const sendContactEmail = async (formData) => {
    try {
        await (0, bookingService_1.sendContactForm)(formData);
    }
    catch (error) {
        console.error('Error sending contact email:', error);
        throw new Error('Failed to send contact form');
    }
};
exports.sendContactEmail = sendContactEmail;
