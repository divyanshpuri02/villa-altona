#!/bin/bash

# filepath: /Users/karan.bhirani/Downloads/bolt project running frontend checkpoint 1/fix-booking-functions.sh
# Set your project directory
PROJECT_DIR="/Users/karan.bhirani/Downloads/bolt project running frontend checkpoint 1"
FUNCTIONS_DIR="$PROJECT_DIR/functions"
SRC_DIR="$FUNCTIONS_DIR/src"

# Ensure src directory exists
mkdir -p "$SRC_DIR"

# Backup existing index.ts if it exists
if [ -f "$SRC_DIR/index.ts" ]; then
  echo "Backing up existing index.ts to index.ts.bak"
  cp "$SRC_DIR/index.ts" "$SRC_DIR/index.ts.bak"
fi

# Install necessary dependencies
cd "$FUNCTIONS_DIR"
echo "Installing dependencies..."
npm install firebase-admin firebase-functions nodemailer stripe
npm install -D @types/nodemailer typescript ts-node @typescript-eslint/eslint-plugin @typescript-eslint/parser

# Create tsconfig.json if it doesn't exist
if [ ! -f "$FUNCTIONS_DIR/tsconfig.json" ]; then
  echo "Creating tsconfig.json..."
  cat > "$FUNCTIONS_DIR/tsconfig.json" << 'EOL'
{
  "compilerOptions": {
    "module": "commonjs",
    "noImplicitReturns": true,
    "noUnusedLocals": true,
    "outDir": "lib",
    "sourceMap": true,
    "strict": true,
    "target": "es2017",
    "esModuleInterop": true
  },
  "compileOnSave": true,
  "include": [
    "src"
  ]
}
EOL
fi

# Create .eslintrc.js for TypeScript linting
cat > "$FUNCTIONS_DIR/.eslintrc.js" << 'EOL'
module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json"],
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "off",
  },
};
EOL

# Create package.json with proper TypeScript scripts if it doesn't exist
if [ ! -f "$FUNCTIONS_DIR/package.json" ]; then
  echo "Creating package.json with TypeScript scripts..."
  cat > "$FUNCTIONS_DIR/package.json" << 'EOL'
{
  "name": "functions",
  "scripts": {
    "lint": "eslint --ext .js,.ts .",
    "build": "tsc",
    "build:watch": "tsc --watch",
    "serve": "npm run build && firebase emulators:start --only functions",
    "shell": "npm run build && firebase functions:shell",
    "start": "npm run shell",
    "deploy": "firebase deploy --only functions",
    "logs": "firebase functions:log"
  },
  "engines": {
    "node": "20"
  },
  "main": "lib/index.js",
  "dependencies": {
    "firebase-admin": "^11.8.0",
    "firebase-functions": "^4.3.1",
    "nodemailer": "^6.9.1",
    "stripe": "^13.0.0"
  },
  "devDependencies": {
    "@typescript-eslint/eslint-plugin": "^5.12.0",
    "@typescript-eslint/parser": "^5.12.0",
    "eslint": "^8.9.0",
    "typescript": "^4.9.0",
    "@types/nodemailer": "^6.4.8"
  },
  "private": true
}
EOL
fi

# Create the new index.ts with improved TypeScript typing
echo "Creating new index.ts with all required functions and proper TypeScript types..."
cat > "$SRC_DIR/index.ts" << 'EOL'
import { initializeApp } from "firebase-admin/app";
import { getFirestore, FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAuth } from "firebase-admin/auth";
import { 
  onCall, 
  onRequest, 
  HttpsError,
  Request,
  Response,
  CallableRequest
} from "firebase-functions/v2/https";
import { 
  onDocumentCreated, 
  onDocumentUpdated,
  DocumentSnapshot,
  Change
} from "firebase-functions/v2/firestore";
import { defineSecret } from "firebase-functions/params";
import * as logger from "firebase-functions/logger";
import * as nodemailer from "nodemailer";
import Stripe from "stripe";

// Initialize Firebase
initializeApp();
const db = getFirestore();
const auth = getAuth();

// Define secrets for secure values
const stripeSecretKey = defineSecret("STRIPE_SECRET_KEY");
const stripeWebhookSecret = defineSecret("STRIPE_WEBHOOK_SECRET");
const emailUser = defineSecret("EMAIL_USER");
const emailPassword = defineSecret("EMAIL_PASSWORD");

// Types for our booking data
interface BookingData {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  checkIn: Timestamp;
  checkOut: Timestamp;
  adults: number;
  children?: number;
  guestDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
  };
  specialRequests?: string;
  totalAmount: number;
  confirmationCode: string;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded' | 'no-show';
  paymentIntentId?: string;
  refundAmount?: number;
  refundId?: string;
  adminNotes?: string;
  paymentError?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  cancelledAt?: Timestamp;
}

// Initialize services (null initially, will be set in initializeServices)
let stripe: Stripe | null = null;
let transporter: nodemailer.Transporter | null = null;

// Helper function to initialize services
const initializeServices = (context: any): void => {
  // Initialize Stripe if not already initialized
  if (!stripe) {
    stripe = new Stripe(stripeSecretKey.value(), { 
      apiVersion: '2025-08-27.basil' // Update this as needed
    });
  }

  // Initialize nodemailer if not already initialized
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser.value(),
        pass: emailPassword.value(),
      },
    });
  }
};

// Helper function to require auth
const requireAuth = async (context: CallableRequest): Promise<string> => {
  if (!context.auth) {
    throw new HttpsError("unauthenticated", "Authentication required");
  }
  return context.auth.uid;
};

// Helper function to require admin
const requireAdmin = async (context: CallableRequest): Promise<string> => {
  if (!context.auth) {
    throw new HttpsError("unauthenticated", "Authentication required");
  }
  
  const uid = context.auth.uid;
  const userDoc = await db.collection("users").doc(uid).get();
  
  if (!userDoc.exists || !userDoc.data()?.isAdmin) {
    throw new HttpsError("permission-denied", "Admin privileges required");
  }
  
  return uid;
};

// Helper to get Stripe (throws if not initialized)
const requireStripe = (): Stripe => {
  if (!stripe) throw new Error('Stripe is not initialized');
  return stripe;
};

// Helper to generate confirmation code
const generateConfirmationCode = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `VA2024-${timestamp.toUpperCase()}-${random.toUpperCase()}`;
};

// Helper to send booking confirmation email
const sendBookingConfirmationEmail = async (booking: BookingData): Promise<void> => {
  if (!transporter) throw new Error('Email transport not initialized');
  
  const mailOptions = {
    from: emailUser.value(),
    to: booking.userEmail,
    subject: `Villa Altona Booking Confirmation - ${booking.confirmationCode}`,
    html: `
      <h1>Your Booking is Confirmed!</h1>
      <p>Dear ${booking.userName},</p>
      <p>Thank you for booking Villa Altona. Your stay has been confirmed.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li>Confirmation Code: ${booking.confirmationCode}</li>
        <li>Check-in: ${new Date(booking.checkIn.toDate()).toLocaleDateString()}</li>
        <li>Check-out: ${new Date(booking.checkOut.toDate()).toLocaleDateString()}</li>
        <li>Guests: ${booking.adults} adults, ${booking.children || 0} children</li>
        <li>Total Amount: ₹${booking.totalAmount}</li>
      </ul>
      <p>If you have any questions, please contact us.</p>
      <p>We look forward to welcoming you to Villa Altona!</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

// Helper to send booking cancellation email
const sendBookingCancellationEmail = async (booking: BookingData, refundAmount: number): Promise<void> => {
  if (!transporter) throw new Error('Email transport not initialized');
  
  const mailOptions = {
    from: emailUser.value(),
    to: booking.userEmail,
    subject: `Villa Altona Booking Cancellation - ${booking.confirmationCode}`,
    html: `
      <h1>Your Booking has been Cancelled</h1>
      <p>Dear ${booking.userName},</p>
      <p>Your booking at Villa Altona has been cancelled as requested.</p>
      <p><strong>Booking Details:</strong></p>
      <ul>
        <li>Confirmation Code: ${booking.confirmationCode}</li>
        <li>Check-in: ${new Date(booking.checkIn.toDate()).toLocaleDateString()}</li>
        <li>Check-out: ${new Date(booking.checkOut.toDate()).toLocaleDateString()}</li>
      </ul>
      <p><strong>Refund Information:</strong></p>
      <p>Refund Amount: ₹${refundAmount}</p>
      <p>The refund has been initiated and will be credited to your original payment method within 5-7 business days.</p>
      <p>If you have any questions, please contact us.</p>
    `
  };
  
  await transporter.sendMail(mailOptions);
};

// Availability Check Function
export const checkVillaAvailability = onCall({ 
  region: "asia-south1",
  secrets: [stripeSecretKey]
}, async (request: CallableRequest) => {
  try {
    initializeServices(request);
    
    const { checkIn, checkOut } = request.data;
    
    if (!checkIn || !checkOut) {
      throw new HttpsError("invalid-argument", "Check-in and check-out dates are required");
    }
    
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
      throw new HttpsError("invalid-argument", "Invalid date format");
    }
    
    if (checkInDate >= checkOutDate) {
      throw new HttpsError("invalid-argument", "Check-out date must be after check-in date");
    }
    
    // Check for overlapping bookings
    const bookingsRef = db.collection("bookings");
    const overlappingBookings = await bookingsRef
      .where("checkOut", ">", checkInDate)
      .where("checkIn", "<", checkOutDate)
      .where("paymentStatus", "in", ["completed", "pending"])
      .get();
    
    if (!overlappingBookings.empty) {
      return { available: false, message: "Selected dates are not available" };
    }
    
    return { available: true, message: "Villa is available for the selected dates" };
  } catch (error: any) {
    logger.error("Error checking availability:", error);
    throw new HttpsError("internal", error.message);
  }
});

// Create Booking Function
export const createBooking = onCall({ 
  region: "asia-south1", 
  secrets: [stripeSecretKey]
}, async (request: CallableRequest) => {
  try {
    initializeServices(request);
    const userId = await requireAuth(request);
    
    const bookingData = request.data;
    
    // Validate booking data
    if (!bookingData.checkIn || !bookingData.checkOut || 
        !bookingData.adults || !bookingData.guestDetails || 
        !bookingData.totalAmount) {
      throw new HttpsError("invalid-argument", "Missing required booking information");
    }
    
    // Check availability again
    const checkInDate = new Date(bookingData.checkIn);
    const checkOutDate = new Date(bookingData.checkOut);
    
    const bookingsRef = db.collection("bookings");
    const overlappingBookings = await bookingsRef
      .where("checkOut", ">", checkInDate)
      .where("checkIn", "<", checkOutDate)
      .where("paymentStatus", "in", ["completed", "pending"])
      .get();
    
    if (!overlappingBookings.empty) {
      throw new HttpsError("failed-precondition", "Selected dates are no longer available");
    }
    
    // Get user info
    const userRecord = await auth.getUser(userId);
    
    // Create booking with pending status
    const confirmationCode = generateConfirmationCode();
    
    const newBooking = {
      ...bookingData,
      userId,
      userEmail: userRecord.email || bookingData.userEmail,
      userName: userRecord.displayName || bookingData.userName,
      confirmationCode,
      paymentStatus: "pending",
      createdAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    };
    
    const bookingRef = await bookingsRef.add(newBooking);
    
    return { 
      success: true, 
      bookingId: bookingRef.id,
      confirmationCode
    };
  } catch (error: any) {
    logger.error("Error creating booking:", error);
    throw new HttpsError("internal", error.message);
  }
});

// Create Payment Intent Function
export const createPaymentIntent = onCall({ 
  region: "asia-south1", 
  secrets: [stripeSecretKey]
}, async (request: CallableRequest) => {
  try {
    initializeServices(request);
    const userId = await requireAuth(request);
    
    const { bookingId } = request.data;
    if (!bookingId) {
      throw new HttpsError("invalid-argument", "Booking ID is required");
    }
    
    // Get booking
    const bookingRef = db.collection("bookings").doc(bookingId);
    const booking = await bookingRef.get();
    
    if (!booking.exists) {
      throw new HttpsError("not-found", "Booking not found");
    }
    
    const bookingData = booking.data() as BookingData;
    
    // Verify the booking belongs to this user
    if (bookingData?.userId !== userId) {
      throw new HttpsError("permission-denied", "Not authorized to create payment for this booking");
    }
    
    if (bookingData?.paymentStatus === "completed") {
      throw new HttpsError("already-exists", "Payment already completed for this booking");
    }
    
    // Create payment intent
    const paymentIntent = await requireStripe().paymentIntents.create({
      amount: Math.round(bookingData?.totalAmount * 100), // Stripe uses cents
      currency: "inr",
      metadata: {
        bookingId,
        userId,
        confirmationCode: bookingData?.confirmationCode
      },
      description: `Booking ${bookingData?.confirmationCode} for Villa Altona`,
      receipt_email: bookingData?.userEmail
    });
    
    // Update booking with payment intent ID
    await bookingRef.update({
      paymentIntentId: paymentIntent.id,
      updatedAt: FieldValue.serverTimestamp()
    });
    
    return {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    };
  } catch (error: any) {
    logger.error("Error creating payment intent:", error);
    throw new HttpsError("internal", error.message);
  }
});

// Confirm Payment Function
export const confirmPayment = onCall({ 
  region: "asia-south1", 
  secrets: [stripeSecretKey, emailUser, emailPassword]
}, async (request: CallableRequest) => {
  try {
    initializeServices(request);
    const userId = await requireAuth(request);
    
    const { bookingId, paymentIntentId } = request.data;
    
    if (!bookingId || !paymentIntentId) {
      throw new HttpsError("invalid-argument", "Booking ID and Payment Intent ID are required");
    }
    
    // Verify booking exists and belongs to this user
    const bookingRef = db.collection("bookings").doc(bookingId);
    const booking = await bookingRef.get();
    
    if (!booking.exists) {
      throw new HttpsError("not-found", "Booking not found");
    }
    
    const bookingData = booking.data() as BookingData;
    
    if (bookingData?.userId !== userId) {
      throw new HttpsError("permission-denied", "Not authorized to confirm payment for this booking");
    }
    
    if (bookingData?.paymentStatus === "completed") {
      return { success: true, message: "Payment already completed" };
    }
    
    // Verify payment intent
    const paymentIntent = await requireStripe().paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== "succeeded") {
      throw new HttpsError("failed-precondition", `Payment not successful. Status: ${paymentIntent.status}`);
    }
    
    // Update booking status
    await bookingRef.update({
      paymentStatus: "completed",
      updatedAt: FieldValue.serverTimestamp()
    });
    
    // Send confirmation email
    await sendBookingConfirmationEmail(bookingData);
    
    return { success: true };
  } catch (error: any) {
    logger.error("Error confirming payment:", error);
    throw new HttpsError("internal", error.message);
  }
});

// Cancel Booking Function
export const cancelBooking = onCall({ 
  region: "asia-south1", 
  secrets: [stripeSecretKey, emailUser, emailPassword]
}, async (request: CallableRequest) => {
  try {
    initializeServices(request);
    const userId = await requireAuth(request);
    
    const { bookingId } = request.data;
    
    if (!bookingId) {
      throw new HttpsError("invalid-argument", "Booking ID is required");
    }
    
    // Verify booking exists and belongs to this user
    const bookingRef = db.collection("bookings").doc(bookingId);
    const booking = await bookingRef.get();
    
    if (!booking.exists) {
      throw new HttpsError("not-found", "Booking not found");
    }
    
    const bookingData = booking.data() as BookingData;
    
    // Only admin or booking owner can cancel
    if (bookingData?.userId !== userId) {
      // Check if admin
      try {
        await requireAdmin(request);
      } catch (error) {
        throw new HttpsError("permission-denied", "Not authorized to cancel this booking");
      }
    }
    
    if (bookingData?.paymentStatus === "cancelled" || bookingData?.paymentStatus === "refunded") {
      return { success: true, message: "Booking already cancelled" };
    }
    
    // Calculate refund amount based on cancellation policy
    // Example: Full refund if cancelled 7+ days before check-in, 50% if 3-7 days, no refund if less than 3 days
    const checkInDate = bookingData?.checkIn.toDate();
    const now = new Date();
    const daysUntilCheckIn = Math.ceil((checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    let refundPercentage = 0;
    if (daysUntilCheckIn >= 7) {
      refundPercentage = 100;
    } else if (daysUntilCheckIn >= 3) {
      refundPercentage = 50;
    }
    
    const refundAmount = (bookingData?.totalAmount * refundPercentage) / 100;
    let refundId = null;
    
    // Process refund if payment was completed and refund amount > 0
    if (bookingData?.paymentStatus === "completed" && bookingData?.paymentIntentId && refundAmount > 0) {
      const refund = await requireStripe().refunds.create({
        payment_intent: bookingData.paymentIntentId,
        amount: Math.round(refundAmount * 100), // Stripe uses cents
        reason: "requested_by_customer"
      });
      refundId = refund.id;
    }
    
    // Update booking status
    await bookingRef.update({
      paymentStatus: refundAmount > 0 ? "refunded" : "cancelled",
      refundAmount: refundAmount,
      refundId: refundId,
      cancelledAt: FieldValue.serverTimestamp(),
      updatedAt: FieldValue.serverTimestamp()
    });
    
    // Send cancellation email
    await sendBookingCancellationEmail(bookingData, refundAmount);
    
    return { 
      success: true, 
      refundAmount: refundAmount,
      refundPercentage: refundPercentage
    };
  } catch (error: any) {
    logger.error("Error cancelling booking:", error);
    throw new HttpsError("internal", error.message);
  }
});

// Get User Bookings Function
export const getUserBookings = onCall({ region: "asia-south1" }, async (request: CallableRequest) => {
  try {
    const userId = await requireAuth(request);
    
    const { status } = request.data || {};
    
    let query = db.collection("bookings").where("userId", "==", userId);
    
    if (status) {
      query = query.where("paymentStatus", "==", status);
    }
    
    const bookingsSnapshot = await query.orderBy("createdAt", "desc").get();
    
    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { bookings };
  } catch (error: any) {
    logger.error("Error fetching user bookings:", error);
    throw new HttpsError("internal", error.message);
  }
});

// Get User Profile Function
export const getUserProfile = onCall({ region: "asia-south1" }, async (request: CallableRequest) => {
  try {
    const userId = await requireAuth(request);
    
    // Get user data from Firestore (if exists)
    const userDoc = await db.collection("users").doc(userId).get();
    
    // Get user auth data
    const userRecord = await auth.getUser(userId);
    
    const profile = {
      uid: userId,
      email: userRecord.email,
      displayName: userRecord.displayName,
      photoURL: userRecord.photoURL,
      phoneNumber: userRecord.phoneNumber,
      // Include any additional profile data from Firestore
      ...userDoc.exists ? userDoc.data() : {}
    };
    
    return { profile };
  } catch (error: any) {
    logger.error("Error fetching user profile:", error);
    throw new HttpsError("internal", error.message);
  }
});

// Admin Functions
export const getAdminBookings = onCall({ region: "asia-south1" }, async (request: CallableRequest) => {
  try {
    await requireAdmin(request);
    
    const { status, limit = 50, startAfter } = request.data || {};
    
    let query = db.collection("bookings");
    
    if (status) {
      query = query.where("paymentStatus", "==", status);
    }
    
    query = query.orderBy("createdAt", "desc");
    
    if (startAfter) {
      const startAfterDoc = await db.collection("bookings").doc(startAfter).get();
      if (startAfterDoc.exists) {
        query = query.startAfter(startAfterDoc);
      }
    }
    
    query = query.limit(limit);
    
    const bookingsSnapshot = await query.get();
    
    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return { 
      bookings,
      lastVisible: bookingsSnapshot.docs.length > 0 ? bookingsSnapshot.docs[bookingsSnapshot.docs.length - 1].id : null
    };
  } catch (error: any) {
    logger.error("Error fetching admin bookings:", error);
    throw new HttpsError("internal", error.message);
  }
});

// Get Admin Stats Function
export const getAdminStats = onCall({ region: "asia-south1" }, async (request: CallableRequest) => {
  try {
    await requireAdmin(request);
    
    // Get counts by status
    const statuses = ["pending", "completed", "cancelled", "refunded"];
    const counts: Record<string, number> = {};
    
    for (const status of statuses) {
      const count = (await db.collection("bookings").where("paymentStatus", "==", status).count().get()).data().count;
      counts[status] = count;
    }
    
    // Get total revenue from completed bookings
    const completedBookings = await db.collection("bookings")
      .where("paymentStatus", "==", "completed")
      .get();
    
    let totalRevenue = 0;
    completedBookings.forEach(doc => {
      const data = doc.data();
      totalRevenue += data.totalAmount || 0;
    });
    
    // Get upcoming bookings (next 7 days)
    const now = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(now.getDate() + 7);
    
    const upcomingBookings = await db.collection("bookings")
      .where("checkIn", ">=", now)
      .where("checkIn", "<=", nextWeek)
      .where("paymentStatus", "==", "completed")
      .get();
    
    return {
      counts,
      totalRevenue,
      upcomingBookingsCount: upcomingBookings.size
    };
  } catch (error: any) {
    logger.error("Error fetching admin stats:", error);
    throw new HttpsError("internal", error.message);
  }
});

// Update Booking Status (Admin)
export const updateBookingStatus = onCall({ region: "asia-south1" }, async (request: CallableRequest) => {
  try {
    await requireAdmin(request);
    
    const { bookingId, status, notes } = request.data;
    
    if (!bookingId || !status) {
      throw new HttpsError("invalid-argument", "Booking ID and status are required");
    }
    
    // Valid statuses
    const validStatuses = ["pending", "completed", "cancelled", "refunded", "no-show"];
    if (!validStatuses.includes(status)) {
      throw new HttpsError("invalid-argument", "Invalid status");
    }
    
    const bookingRef = db.collection("bookings").doc(bookingId);
    const booking = await bookingRef.get();
    
    if (!booking.exists) {
      throw new HttpsError("not-found", "Booking not found");
    }
    
    await bookingRef.update({
      paymentStatus: status,
      adminNotes: notes || FieldValue.delete(),
      updatedAt: FieldValue.serverTimestamp()
    });
    
    return { success: true };
  } catch (error: any) {
    logger.error("Error updating booking status:", error);
    throw new HttpsError("internal", error.message);
  }
});

// Contact Form Submission
export const sendContactForm = onCall({ 
  region: "asia-south1", 
  secrets: [emailUser, emailPassword]
}, async (request: CallableRequest) => {
  try {
    initializeServices(request);
    
    const { name, email, message, subject, phone } = request.data;
    
    if (!name || !email || !message) {
      throw new HttpsError("invalid-argument", "Name, email, and message are required");
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new HttpsError("invalid-argument", "Invalid email format");
    }
    
    // Save to Firestore
    await db.collection("contacts").add({
      name,
      email,
      message,
      subject: subject || "Contact Form Submission",
      phone: phone || null,
      createdAt: FieldValue.serverTimestamp()
    });
    
    // Send email notification
    if (!transporter) throw new Error('Email transport not initialized');
    
    await transporter.sendMail({
      from: emailUser.value(),
      to: emailUser.value(), // Send to yourself
      replyTo: email,
      subject: `Villa Altona Contact: ${subject || "New Message"}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>From:</strong> ${name} (${email})</p>
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });
    
    return { success: true };
  } catch (error: any) {
    logger.error("Error sending contact form:", error);
    throw new HttpsError("internal", error.message);
  }
});

// Stripe Webhook Handler
export const stripeWebhook = onRequest({ 
  region: "asia-south1", 
  secrets: [stripeSecretKey, stripeWebhookSecret, emailUser, emailPassword]
}, async (req: Request, res: Response) => {
  try {
    initializeServices(req);
    if (!stripe) throw new Error('Stripe is not initialized');
    
    const sig = req.headers['stripe-signature'] as string;
    
    if (!sig) {
      logger.error("No Stripe signature found");
      res.status(400).send("No signature provided");
      return;
    }
    
    let event;
    
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody || req.body, 
        sig, 
        stripeWebhookSecret.value()
      );
    } catch (err: any) {
      logger.error(`Webhook signature verification failed: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }
    
    // Handle specific events
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        await handlePaymentIntentSucceeded(paymentIntent);
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        await handlePaymentIntentFailed(failedPayment);
        break;
        
      default:
        logger.info(`Unhandled event type ${event.type}`);
    }
    
    res.status(200).send({ received: true });
  } catch (error: any) {
    logger.error("Error processing webhook:", error);
    res.status(500).send(`Webhook Error: ${error.message}`);
  }
});

// Helper function to handle successful payment from webhook
const handlePaymentIntentSucceeded = async (paymentIntent: Stripe.PaymentIntent): Promise<void> => {
  try {
    const { bookingId } = paymentIntent.metadata || {};
    
    if (!bookingId) {
      logger.error("No bookingId in payment intent metadata");
      return;
    }
    
    const bookingRef = db.collection("bookings").doc(bookingId);
    const booking = await bookingRef.get();
    
    if (!booking.exists) {
      logger.error(`Booking ${bookingId} not found`);
      return;
    }
    
    const bookingData = booking.data() as BookingData;
    
    if (bookingData?.paymentStatus === "completed") {
      logger.info(`Booking ${bookingId} already marked as completed`);
      return;
    }
    
    // Update booking
    await bookingRef.update({
      paymentStatus: "completed",
      updatedAt: FieldValue.serverTimestamp()
    });
    
    // Send confirmation email
    await sendBookingConfirmationEmail(bookingData);
    
    logger.info(`Successfully processed payment for booking ${bookingId}`);
  } catch (error: any) {
    logger.error("Error handling successful payment:", error);
  }
};

// Helper function to handle failed payment from webhook
const handlePaymentIntentFailed = async (paymentIntent: Stripe.PaymentIntent): Promise<void> => {
  try {
    const { bookingId } = paymentIntent.metadata || {};
    
    if (!bookingId) {
      logger.error("No bookingId in payment intent metadata");
      return;
    }
    
    const bookingRef = db.collection("bookings").doc(bookingId);
    const booking = await bookingRef.get();
    
    if (!booking.exists) {
      logger.error(`Booking ${bookingId} not found`);
      return;
    }
    
    // Update booking
    await bookingRef.update({
      paymentStatus: "failed",
      paymentError: paymentIntent.last_payment_error?.message || "Payment failed",
      updatedAt: FieldValue.serverTimestamp()
    });
    
    logger.info(`Marked booking ${bookingId} as failed payment`);
  } catch (error: any) {
    logger.error("Error handling failed payment:", error);
  }
};

// Firestore Triggers
export const onBookingCreated = onDocumentCreated("bookings/{bookingId}", async (event) => {
  const snapshot: DocumentSnapshot = event.data!;
  const booking = snapshot.data() as BookingData;
  const bookingId = event.params.bookingId;
  
  if (!booking) return;
  
  logger.info(`New booking created: ${bookingId}`);
  
  try {
    // You could add additional processing here:
    // - Update availability calendar
    // - Send notifications to admins
    // - Log analytics events
    
    await db.collection("bookings").doc(bookingId).update({
      id: bookingId // Add the document ID to the data
    });
  } catch (error: any) {
    logger.error("Error processing new booking:", error);
  }
});

// Firestore trigger for completed bookings
export const onBookingCompleted = onDocumentUpdated("bookings/{bookingId}", async (event) => {
  const change: Change<DocumentSnapshot> = event.data!;
  const beforeData = change.before.data() as BookingData;
  const afterData = change.after.data() as BookingData;
  
  if (!beforeData || !afterData) return;
  
  // Check if payment status was changed to completed
  if (beforeData.paymentStatus !== "completed" && afterData.paymentStatus === "completed") {
    logger.info(`Booking ${event.params.bookingId} payment completed`);
    
    try {
      // Add any post-payment business logic here:
      // - Update availability calendar
      // - Send notification to villa staff
      // - Update analytics and reporting data
    } catch (error: any) {
      logger.error("Error processing completed booking:", error);
    }
  }
});

// Export the original helloWorld function (for backward compatibility)
export const helloWorld = onRequest((request: Request, response: Response) => {
  logger.info("Hello logs!", {structuredData: true});
  response.send("Hello from Firebase!");
});
EOL

# Set execute permissions
chmod +x "$SRC_DIR/index.ts"
echo "Script completed successfully."
echo "New index.ts created with all required functions."
echo ""
echo "Next steps:"
echo "1. Add your Stripe and email secrets in Firebase Console or using Firebase CLI"
echo "2. Build and deploy your functions:"
echo "   cd $FUNCTIONS_DIR"
echo "   npm run build"
echo "   npm run deploy"