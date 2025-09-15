"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.populateDatabase = exports.sampleBookings = void 0;
// Sample data service for populating the database
const firestore_1 = require("firebase/firestore");
const config_1 = require("../firebase/config");
exports.sampleBookings = [
    {
        checkIn: new Date('2024-03-15'),
        checkOut: new Date('2024-03-18'),
        adults: 4,
        children: 2,
        totalAmount: 300000,
        paymentStatus: 'completed',
        userEmail: 'priya.sharma@email.com',
        userName: 'Priya Sharma',
        userPhone: '+91 98765 43210',
        confirmationCode: 'VA2024-ABC123DEF',
        createdAt: new Date('2024-02-15'),
        updatedAt: new Date('2024-02-15')
    },
    {
        checkIn: new Date('2024-04-10'),
        checkOut: new Date('2024-04-14'),
        adults: 6,
        children: 0,
        totalAmount: 400000,
        paymentStatus: 'completed',
        userEmail: 'rajesh.patel@email.com',
        userName: 'Rajesh Patel',
        userPhone: '+91 87654 32109',
        confirmationCode: 'VA2024-XYZ789GHI',
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-10')
    },
    {
        checkIn: new Date('2024-05-20'),
        checkOut: new Date('2024-05-25'),
        adults: 8,
        children: 4,
        totalAmount: 500000,
        paymentStatus: 'pending',
        userEmail: 'amit.kumar@email.com',
        userName: 'Amit Kumar',
        userPhone: '+91 76543 21098',
        confirmationCode: 'VA2024-PQR456STU',
        createdAt: new Date('2024-04-20'),
        updatedAt: new Date('2024-04-20')
    }
];
const populateDatabase = async () => {
    try {
        console.log('Populating database with sample data...');
        // Add sample bookings
        for (const booking of exports.sampleBookings) {
            await (0, firestore_1.addDoc)((0, firestore_1.collection)(config_1.db, 'bookings'), Object.assign(Object.assign({}, booking), { checkIn: firestore_1.Timestamp.fromDate(booking.checkIn), checkOut: firestore_1.Timestamp.fromDate(booking.checkOut), createdAt: firestore_1.Timestamp.fromDate(booking.createdAt), updatedAt: firestore_1.Timestamp.fromDate(booking.updatedAt) }));
        }
        // Add sample users
        const sampleUsers = [
            {
                email: 'priya.sharma@email.com',
                name: 'Priya Sharma',
                phone: '+91 98765 43210',
                totalBookings: 1,
                bookingHistory: [],
                createdAt: firestore_1.Timestamp.now(),
                updatedAt: firestore_1.Timestamp.now()
            },
            {
                email: 'rajesh.patel@email.com',
                name: 'Rajesh Patel',
                phone: '+91 87654 32109',
                totalBookings: 1,
                bookingHistory: [],
                createdAt: firestore_1.Timestamp.now(),
                updatedAt: firestore_1.Timestamp.now()
            }
        ];
        for (const user of sampleUsers) {
            await (0, firestore_1.addDoc)((0, firestore_1.collection)(config_1.db, 'users'), user);
        }
        // Add sample contact forms
        const sampleContacts = [
            {
                name: 'Sarah Johnson',
                email: 'sarah.j@email.com',
                phone: '+91 99887 76655',
                message: 'Hi, I would like to know more about the villa amenities and availability for December.',
                status: 'new',
                createdAt: firestore_1.Timestamp.now()
            },
            {
                name: 'Michael Chen',
                email: 'michael.chen@email.com',
                phone: '+91 88776 65544',
                message: 'Interested in booking for a corporate retreat. Can you provide group rates?',
                status: 'responded',
                createdAt: firestore_1.Timestamp.now()
            }
        ];
        for (const contact of sampleContacts) {
            await (0, firestore_1.addDoc)((0, firestore_1.collection)(config_1.db, 'contacts'), contact);
        }
        console.log('✅ Database populated successfully with sample data!');
        return true;
    }
    catch (error) {
        console.error('❌ Error populating database:', error);
        return false;
    }
};
exports.populateDatabase = populateDatabase;
