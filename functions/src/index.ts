import { onRequest, onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentCreated, onDocumentUpdated, onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { setGlobalOptions } from 'firebase-functions/v2';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp, FieldValue } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import * as logger from 'firebase-functions/logger';
import Stripe from 'stripe';
import * as nodemailer from 'nodemailer';
import { defineSecret } from 'firebase-functions/params';

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();
const auth = getAuth();

// Set global options
setGlobalOptions({
  maxInstances: 10,
  region: 'asia-south1'
});

// Define secrets
const stripeSecretKey = defineSecret('STRIPE_SECRET_KEY');
const stripeWebhookSecret = defineSecret('STRIPE_WEBHOOK_SECRET');
const emailUser = defineSecret('EMAIL_USER');
const emailPassword = defineSecret('EMAIL_PASSWORD');
const adminToken = defineSecret('ADMIN_TOKEN');

// Initialize Stripe
let stripe: Stripe;

// Email transporter
let transporter: nodemailer.Transporter;

// Types
interface BookingData {
  id?: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  guestDetails: GuestDetail[];
  totalAmount: number;
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded' | 'cancelled';
  userEmail: string;
  userName: string;
  userPhone?: string;
  specialRequests?: string;
  paymentIntentId?: string;
  confirmationCode?: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt?: Date;
  refundAmount?: number;
}

interface GuestDetail {
  name: string;
  email?: string;
  phone?: string;
  age?: number;
  type: 'adult' | 'child';
  idType?: string;
  idNumber?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'responded' | 'closed';
  createdAt: Date;
}

interface UserProfile {
  uid: string;
  email: string;
  name: string;
  phone?: string;
  bookingHistory: string[];
  totalBookings: number;
  createdAt: Date;
  updatedAt: Date;
}

// Utility Functions
const initializeServices = (context: any) => {
  if (!stripe) {
    stripe = new Stripe(stripeSecretKey.value(), {
      apiVersion: '2023-10-16'
    });
  }
  
  if (!transporter) {
    transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: emailUser.value(),
        pass: emailPassword.value()
      }
    });
  }
};

const generateConfirmationCode = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `VA2024-${timestamp.toUpperCase()}-${random.toUpperCase()}`;
};

const validateBookingDates = (checkIn: Date, checkOut: Date): boolean => {
  const now = new Date();
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  
  // Check if dates are valid
  if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
    return false;
  }
  
  // Check if check-in is in the future
  if (checkInDate <= now) {
    return false;
  }
  
  // Check if check-out is after check-in
  if (checkOutDate <= checkInDate) {
    return false;
  }
  
  return true;
};

const calculateBookingAmount = (checkIn: Date, checkOut: Date): number => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);
  const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
  const pricePerNight = 100000; // ₹100,000 per night
  return nights * pricePerNight;
};

const checkAvailability = async (checkIn: Date, checkOut: Date, excludeBookingId?: string): Promise<boolean> => {
  try {
    const checkInTimestamp = Timestamp.fromDate(checkIn);
    const checkOutTimestamp = Timestamp.fromDate(checkOut);
    
    let query = db.collection('bookings')
      .where('paymentStatus', 'in', ['completed', 'pending'])
      .where('checkIn', '<', checkOutTimestamp)
      .where('checkOut', '>', checkInTimestamp);

    const snapshot = await query.get();
    
    // If excluding a specific booking (for updates), filter it out
    if (excludeBookingId) {
      return snapshot.docs.filter(doc => doc.id !== excludeBookingId).length === 0;
    }
    
    return snapshot.empty;
  } catch (error) {
    logger.error('Error checking availability:', error);
    throw new HttpsError('internal', 'Failed to check availability');
  }
};

const sendBookingConfirmationEmail = async (booking: any, bookingId: string) => {
  const nights = Math.ceil((booking.checkOut.toDate().getTime() - booking.checkIn.toDate().getTime()) / (1000 * 60 * 60 * 24));
  
  const mailOptions = {
    from: emailUser.value(),
    to: booking.userEmail,
    subject: 'Villa Altona - Booking Confirmation',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #141414, #333); color: white; padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Villa Altona</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Luxury Redefined</p>
        </div>
        
        <div style="padding: 40px 20px; background: white;">
          <h2 style="color: #141414; margin-bottom: 30px; font-size: 24px;">Booking Confirmed!</h2>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin: 30px 0;">
            <h3 style="color: #141414; margin-top: 0;">Reservation Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;"><strong>Confirmation Code:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef; font-family: monospace; font-weight: bold;">${booking.confirmationCode}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;"><strong>Check-in:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${booking.checkIn.toDate().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at 4:00 PM</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;"><strong>Check-out:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${booking.checkOut.toDate().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} at 11:00 AM</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;"><strong>Guests:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${booking.adults} Adults${booking.children > 0 ? `, ${booking.children} Children` : ''}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;"><strong>Nights:</strong></td>
                <td style="padding: 10px 0; border-bottom: 1px solid #e9ecef;">${nights}</td>
              </tr>
              <tr>
                <td style="padding: 10px 0;"><strong>Total Amount:</strong></td>
                <td style="padding: 10px 0; font-size: 18px; font-weight: bold; color: #28a745;">₹${booking.totalAmount.toLocaleString()}</td>
              </tr>
            </table>
          </div>
          
          <div style="background: #e8f5e8; padding: 25px; border-radius: 12px; margin: 30px 0;">
            <h4 style="color: #2d5a2d; margin-top: 0;">Important Information</h4>
            <ul style="color: #2d5a2d; line-height: 1.6;">
              <li>Check-in time: 4:00 PM onwards</li>
              <li>Check-out time: 11:00 AM</li>
              <li>Free cancellation up to 24 hours before check-in</li>
              <li>Please bring valid government-issued ID for all guests</li>
              <li>Pool and amenities are available 24/7</li>
              <li>Complimentary airport transfer can be arranged</li>
            </ul>
          </div>
          
          <div style="background: #fff3cd; padding: 25px; border-radius: 12px; margin: 30px 0;">
            <h4 style="color: #856404; margin-top: 0;">Contact Information</h4>
            <p style="color: #856404; margin: 5px 0;"><strong>Villa Manager:</strong> +91 98765 43210</p>
            <p style="color: #856404; margin: 5px 0;"><strong>Email:</strong> reservations@villaaltona.com</p>
            <p style="color: #856404; margin: 5px 0;"><strong>WhatsApp:</strong> +91 98765 43210</p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            We're thrilled to host you at Villa Altona! Our team is preparing everything to ensure your stay is nothing short of extraordinary.
          </p>
          
          <div style="text-align: center; margin-top: 40px;">
            <a href="https://villa-altona-goa.web.app" style="background: #141414; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Manage Booking</a>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>Villa Altona | Candolim Beach, Goa 403515 | +91 98765 43210</p>
          <p>© 2025 Villa Altona. All rights reserved.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendBookingCancellationEmail = async (booking: any, bookingId: string) => {
  const mailOptions = {
    from: emailUser.value(),
    to: booking.userEmail,
    subject: 'Villa Altona - Booking Cancellation Confirmation',
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #dc3545, #c82333); color: white; padding: 40px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 32px; font-weight: bold;">Villa Altona</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">Booking Cancellation</p>
        </div>
        
        <div style="padding: 40px 20px; background: white;">
          <h2 style="color: #141414; margin-bottom: 30px;">Booking Cancelled</h2>
          
          <p style="color: #666; line-height: 1.6; margin-bottom: 30px;">
            Your booking has been successfully cancelled. We're sorry to see you go and hope to host you in the future.
          </p>
          
          <div style="background: #f8f9fa; padding: 30px; border-radius: 12px; margin: 30px 0;">
            <p style="margin: 10px 0;"><strong>Confirmation Code:</strong> <span style="font-family: monospace;">${booking.confirmationCode}</span></p>
            <p style="margin: 10px 0;"><strong>Cancellation Date:</strong> ${new Date().toLocaleDateString()}</p>
            ${booking.refundAmount ? `<p style="margin: 10px 0;"><strong>Refund Amount:</strong> ₹${booking.refundAmount.toLocaleString()}</p>` : ''}
            <p style="margin: 10px 0;"><strong>Refund Status:</strong> ${booking.refundAmount > 0 ? 'Your refund will be processed within 5-7 business days' : 'No refund applicable as per cancellation policy'}</p>
          </div>
          
          <p style="color: #666; line-height: 1.6;">
            If you have any questions about your cancellation or refund, please don't hesitate to contact us.
          </p>
          
          <div style="text-align: center; margin-top: 40px;">
            <a href="https://villa-altona-goa.web.app" style="background: #141414; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">Book Again</a>
          </div>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; text-align: center; color: #666; font-size: 14px;">
          <p>Villa Altona | Candolim Beach, Goa 403515 | +91 98765 43210</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendContactFormNotification = async (contactData: ContactFormData) => {
  const mailOptions = {
    from: emailUser.value(),
    to: emailUser.value(), // Send to admin
    subject: 'New Contact Form Submission - Villa Altona',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #141414;">New Contact Form Submission</h2>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          <p><strong>Phone:</strong> ${contactData.phone || 'Not provided'}</p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
            ${contactData.message}
          </div>
          <p><strong>Submitted:</strong> ${contactData.createdAt.toLocaleString()}</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Cloud Functions

// Create Booking
export const createBooking = onCall({ secrets: [stripeSecretKey, emailUser, emailPassword] }, async (request) => {
  try {
    initializeServices(request);
    
    const { checkIn, checkOut, adults, children, guestDetails, userEmail, userName, userPhone, specialRequests } = request.data;

    // Validate input
    if (!checkIn || !checkOut || !adults || !userEmail || !userName) {
      throw new HttpsError('invalid-argument', 'Missing required booking information');
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Validate dates
    if (!validateBookingDates(checkInDate, checkOutDate)) {
      throw new HttpsError('invalid-argument', 'Invalid booking dates');
    }

    // Check availability
    const isAvailable = await checkAvailability(checkInDate, checkOutDate);
    if (!isAvailable) {
      throw new HttpsError('failed-precondition', 'Villa is not available for selected dates');
    }

    // Calculate total amount
    const totalAmount = calculateBookingAmount(checkInDate, checkOutDate);
    const confirmationCode = generateConfirmationCode();

    // Create booking document
    const bookingData: Partial<BookingData> = {
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults,
      children,
      guestDetails: guestDetails || [],
      totalAmount,
      paymentStatus: 'pending',
      userEmail,
      userName,
      userPhone,
      specialRequests,
      confirmationCode,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const bookingRef = await db.collection('bookings').add({
      ...bookingData,
      checkIn: Timestamp.fromDate(checkInDate),
      checkOut: Timestamp.fromDate(checkOutDate),
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    // Update user profile
    await updateUserProfile(userEmail, userName, userPhone);

    logger.info(`Booking created: ${bookingRef.id}`);

    return {
      success: true,
      bookingId: bookingRef.id,
      totalAmount,
      confirmationCode,
      message: 'Booking created successfully'
    };

  } catch (error) {
    logger.error('Error creating booking:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to create booking');
  }
});

// Create Payment Intent
export const createPaymentIntent = onCall({ secrets: [stripeSecretKey] }, async (request) => {
  try {
    initializeServices(request);
    
    const { bookingId, paymentMethodId } = request.data;

    if (!bookingId) {
      throw new HttpsError('invalid-argument', 'Booking ID is required');
    }

    // Get booking details
    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists) {
      throw new HttpsError('not-found', 'Booking not found');
    }

    const booking = bookingDoc.data();
    if (booking?.paymentStatus === 'completed') {
      throw new HttpsError('failed-precondition', 'Booking already paid');
    }

    // Create Stripe payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: booking?.totalAmount * 100, // Convert to paise
      currency: 'inr',
      payment_method: paymentMethodId,
      confirmation_method: 'manual',
      confirm: !!paymentMethodId,
      metadata: {
        bookingId,
        userEmail: booking?.userEmail || '',
        userName: booking?.userName || '',
        confirmationCode: booking?.confirmationCode || ''
      }
    });

    // Update booking with payment intent ID
    await db.collection('bookings').doc(bookingId).update({
      paymentIntentId: paymentIntent.id,
      updatedAt: Timestamp.now()
    });

    return {
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        client_secret: paymentIntent.client_secret
      }
    };

  } catch (error) {
    logger.error('Error creating payment intent:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to create payment intent');
  }
});

// Confirm Payment
export const confirmPayment = onCall({ secrets: [stripeSecretKey] }, async (request) => {
  try {
    initializeServices(request);
    
    const { bookingId, paymentIntentId } = request.data;

    if (!bookingId || !paymentIntentId) {
      throw new HttpsError('invalid-argument', 'Booking ID and Payment Intent ID are required');
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      // Update booking status
      await db.collection('bookings').doc(bookingId).update({
        paymentStatus: 'completed',
        paymentCompletedAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });

      logger.info(`Payment confirmed for booking: ${bookingId}`);

      return {
        success: true,
        message: 'Payment confirmed successfully'
      };
    } else {
      throw new HttpsError('failed-precondition', 'Payment not completed');
    }

  } catch (error) {
    logger.error('Error confirming payment:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to confirm payment');
  }
});

// Cancel Booking
export const cancelBooking = onCall({ secrets: [stripeSecretKey, emailUser, emailPassword] }, async (request) => {
  try {
    initializeServices(request);
    
    const { bookingId, userEmail } = request.data;

    if (!bookingId || !userEmail) {
      throw new HttpsError('invalid-argument', 'Booking ID and user email are required');
    }

    // Get booking
    const bookingDoc = await db.collection('bookings').doc(bookingId).get();
    if (!bookingDoc.exists) {
      throw new HttpsError('not-found', 'Booking not found');
    }

    const booking = bookingDoc.data();
    
    // Verify user owns the booking
    if (booking?.userEmail !== userEmail) {
      throw new HttpsError('permission-denied', 'Not authorized to cancel this booking');
    }

    // Check if booking is already cancelled
    if (booking?.paymentStatus === 'cancelled' || booking?.paymentStatus === 'refunded') {
      throw new HttpsError('failed-precondition', 'Booking is already cancelled');
    }

    // Check if cancellation is allowed (24 hours before check-in)
    const checkInDate = booking?.checkIn.toDate();
    const now = new Date();
    const hoursUntilCheckIn = (checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    let refundAmount = 0;
    if (hoursUntilCheckIn > 24) {
      refundAmount = booking?.totalAmount; // Full refund
    } else if (hoursUntilCheckIn > 0) {
      refundAmount = booking?.totalAmount * 0.5; // 50% refund
    }

    // Process refund if payment was completed
    if (booking?.paymentStatus === 'completed' && refundAmount > 0 && booking?.paymentIntentId) {
      await stripe.refunds.create({
        payment_intent: booking.paymentIntentId,
        amount: refundAmount * 100 // Convert to paise
      });
    }

    // Update booking status
    await db.collection('bookings').doc(bookingId).update({
      paymentStatus: refundAmount > 0 ? 'refunded' : 'cancelled',
      refundAmount,
      cancelledAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    // Send cancellation email
    await sendBookingCancellationEmail({ ...booking, refundAmount }, bookingId);

    return {
      success: true,
      refundAmount,
      message: 'Booking cancelled successfully'
    };

  } catch (error) {
    logger.error('Error cancelling booking:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to cancel booking');
  }
});

// Get User Bookings
export const getUserBookings = onCall(async (request) => {
  try {
    const { userEmail } = request.data;

    if (!userEmail) {
      throw new HttpsError('invalid-argument', 'User email is required');
    }

    const bookingsSnapshot = await db.collection('bookings')
      .where('userEmail', '==', userEmail)
      .orderBy('createdAt', 'desc')
      .get();

    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      checkIn: doc.data().checkIn.toDate(),
      checkOut: doc.data().checkOut.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      cancelledAt: doc.data().cancelledAt?.toDate()
    }));

    return {
      success: true,
      bookings
    };

  } catch (error) {
    logger.error('Error getting user bookings:', error);
    throw new HttpsError('internal', 'Failed to get bookings');
  }
});

// Check Availability
export const checkVillaAvailability = onCall(async (request) => {
  try {
    const { checkIn, checkOut } = request.data;

    if (!checkIn || !checkOut) {
      throw new HttpsError('invalid-argument', 'Check-in and check-out dates are required');
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (!validateBookingDates(checkInDate, checkOutDate)) {
      throw new HttpsError('invalid-argument', 'Invalid booking dates');
    }

    const isAvailable = await checkAvailability(checkInDate, checkOutDate);
    const totalAmount = calculateBookingAmount(checkInDate, checkOutDate);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

    return {
      success: true,
      available: isAvailable,
      totalAmount,
      pricePerNight: 100000,
      nights
    };

  } catch (error) {
    logger.error('Error checking availability:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to check availability');
  }
});

// Send Contact Form
export const sendContactForm = onCall({ secrets: [emailUser, emailPassword] }, async (request) => {
  try {
    initializeServices(request);
    
    const { name, email, phone, message } = request.data;

    if (!name || !email || !message) {
      throw new HttpsError('invalid-argument', 'Name, email, and message are required');
    }

    const contactData: ContactFormData = {
      name,
      email,
      phone: phone || '',
      message,
      status: 'new',
      createdAt: new Date()
    };

    // Save to database
    await db.collection('contacts').add({
      ...contactData,
      createdAt: Timestamp.now()
    });

    // Send email notification
    await sendContactFormNotification(contactData);

    return {
      success: true,
      message: 'Contact form submitted successfully'
    };

  } catch (error) {
    logger.error('Error sending contact form:', error);
    throw new HttpsError('internal', 'Failed to send contact form');
  }
});

// Update User Profile
const updateUserProfile = async (email: string, name: string, phone?: string) => {
  try {
    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      // Update existing user
      await userRef.update({
        name,
        phone: phone || userDoc.data()?.phone,
        totalBookings: FieldValue.increment(1),
        updatedAt: Timestamp.now()
      });
    } else {
      // Create new user profile
      await userRef.set({
        email,
        name,
        phone: phone || '',
        bookingHistory: [],
        totalBookings: 1,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
    }
  } catch (error) {
    logger.error('Error updating user profile:', error);
  }
};

// Get User Profile
export const getUserProfile = onCall(async (request) => {
  try {
    const { userEmail } = request.data;

    if (!userEmail) {
      throw new HttpsError('invalid-argument', 'User email is required');
    }

    const userDoc = await db.collection('users').doc(userEmail).get();
    
    if (!userDoc.exists) {
      return {
        success: true,
        profile: null
      };
    }

    const profile = {
      ...userDoc.data(),
      createdAt: userDoc.data()?.createdAt?.toDate(),
      updatedAt: userDoc.data()?.updatedAt?.toDate()
    };

    return {
      success: true,
      profile
    };

  } catch (error) {
    logger.error('Error getting user profile:', error);
    throw new HttpsError('internal', 'Failed to get user profile');
  }
});

// Webhook for Stripe events
export const stripeWebhook = onRequest({ secrets: [stripeSecretKey, stripeWebhookSecret, emailUser, emailPassword] }, async (req, res) => {
  initializeServices(req);
  
  const sig = req.headers['stripe-signature'] as string;
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, stripeWebhookSecret.value());
  } catch (err) {
    logger.error('Webhook signature verification failed:', err);
    res.status(400).send('Webhook Error');
    return;
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      const bookingId = paymentIntent.metadata.bookingId;
      
      if (bookingId) {
        await db.collection('bookings').doc(bookingId).update({
          paymentStatus: 'completed',
          paymentCompletedAt: Timestamp.now(),
          updatedAt: Timestamp.now()
        });
        
        logger.info(`Payment succeeded for booking: ${bookingId}`);
      }
      break;

    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object;
      const failedBookingId = failedPayment.metadata.bookingId;
      
      if (failedBookingId) {
        await db.collection('bookings').doc(failedBookingId).update({
          paymentStatus: 'failed',
          updatedAt: Timestamp.now()
        });
        
        logger.info(`Payment failed for booking: ${failedBookingId}`);
      }
      break;

    default:
      logger.info(`Unhandled event type: ${event.type}`);
  }

  res.json({ received: true });
});

// Trigger: Send confirmation email when booking is completed
export const onBookingCompleted = onDocumentUpdated({ 
  document: 'bookings/{bookingId}',
  secrets: [emailUser, emailPassword]
}, async (event) => {
  initializeServices(event);
  
  const before = event.data?.before.data();
  const after = event.data?.after.data();
  
  // Check if payment status changed to completed
  if (before?.paymentStatus !== 'completed' && after?.paymentStatus === 'completed') {
    try {
      await sendBookingConfirmationEmail(after, event.params.bookingId);
      logger.info(`Confirmation email sent for booking: ${event.params.bookingId}`);
    } catch (error) {
      logger.error('Error sending confirmation email:', error);
    }
  }
});

// Trigger: Log new bookings
export const onBookingCreated = onDocumentCreated('bookings/{bookingId}', async (event) => {
  const booking = event.data?.data();
  logger.info(`New booking created: ${event.params.bookingId}`, {
    userEmail: booking?.userEmail,
    checkIn: booking?.checkIn,
    checkOut: booking?.checkOut,
    totalAmount: booking?.totalAmount,
    confirmationCode: booking?.confirmationCode
  });

  // Update booking history in user profile
  if (booking?.userEmail) {
    try {
      const userRef = db.collection('users').doc(booking.userEmail);
      await userRef.update({
        bookingHistory: FieldValue.arrayUnion(event.params.bookingId),
        updatedAt: Timestamp.now()
      });
    } catch (error) {
      logger.error('Error updating user booking history:', error);
    }
  }
});

// Admin function to get all bookings (protected)
export const getAdminBookings = onCall({ secrets: [adminToken] }, async (request) => {
  try {
    const { adminToken: providedToken, startDate, endDate, status } = request.data;
    
    if (providedToken !== adminToken.value()) {
      throw new HttpsError('permission-denied', 'Admin access required');
    }

    let query = db.collection('bookings').orderBy('createdAt', 'desc');

    // Apply filters
    if (status && status !== 'all') {
      query = query.where('paymentStatus', '==', status);
    }

    if (startDate) {
      query = query.where('checkIn', '>=', Timestamp.fromDate(new Date(startDate)));
    }

    if (endDate) {
      query = query.where('checkOut', '<=', Timestamp.fromDate(new Date(endDate)));
    }

    const bookingsSnapshot = await query.limit(100).get();

    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      checkIn: doc.data().checkIn.toDate(),
      checkOut: doc.data().checkOut.toDate(),
      createdAt: doc.data().createdAt.toDate(),
      updatedAt: doc.data().updatedAt.toDate(),
      cancelledAt: doc.data().cancelledAt?.toDate()
    }));

    // Calculate statistics
    const totalRevenue = bookings
      .filter(b => b.paymentStatus === 'completed')
      .reduce((sum, b) => sum + b.totalAmount, 0);

    const stats = {
      totalBookings: bookings.length,
      completedBookings: bookings.filter(b => b.paymentStatus === 'completed').length,
      pendingBookings: bookings.filter(b => b.paymentStatus === 'pending').length,
      cancelledBookings: bookings.filter(b => ['cancelled', 'refunded'].includes(b.paymentStatus)).length,
      totalRevenue
    };

    return {
      success: true,
      bookings,
      stats
    };

  } catch (error) {
    logger.error('Error getting admin bookings:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to get admin bookings');
  }
});

// Get Admin Dashboard Stats
export const getAdminStats = onCall({ secrets: [adminToken] }, async (request) => {
  try {
    const { adminToken: providedToken } = request.data;
    
    if (providedToken !== adminToken.value()) {
      throw new HttpsError('permission-denied', 'Admin access required');
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Get recent bookings
    const recentBookingsSnapshot = await db.collection('bookings')
      .where('createdAt', '>=', Timestamp.fromDate(thirtyDaysAgo))
      .get();

    // Get all completed bookings for revenue calculation
    const completedBookingsSnapshot = await db.collection('bookings')
      .where('paymentStatus', '==', 'completed')
      .get();

    // Get contact forms
    const contactsSnapshot = await db.collection('contacts')
      .where('createdAt', '>=', Timestamp.fromDate(thirtyDaysAgo))
      .get();

    const recentBookings = recentBookingsSnapshot.docs.length;
    const totalRevenue = completedBookingsSnapshot.docs.reduce((sum, doc) => {
      return sum + (doc.data().totalAmount || 0);
    }, 0);

    const newContacts = contactsSnapshot.docs.length;

    // Calculate occupancy rate for next 30 days
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const upcomingBookingsSnapshot = await db.collection('bookings')
      .where('paymentStatus', 'in', ['completed', 'pending'])
      .where('checkIn', '>=', Timestamp.fromDate(now))
      .where('checkIn', '<=', Timestamp.fromDate(thirtyDaysFromNow))
      .get();

    const occupiedDays = upcomingBookingsSnapshot.docs.reduce((days, doc) => {
      const checkIn = doc.data().checkIn.toDate();
      const checkOut = doc.data().checkOut.toDate();
      const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return days + nights;
    }, 0);

    const occupancyRate = Math.round((occupiedDays / 30) * 100);

    return {
      success: true,
      stats: {
        recentBookings,
        totalRevenue,
        newContacts,
        occupancyRate,
        totalBookings: completedBookingsSnapshot.docs.length
      }
    };

  } catch (error) {
    logger.error('Error getting admin stats:', error);
    throw new HttpsError('internal', 'Failed to get admin stats');
  }
});

// Update Booking Status (Admin)
export const updateBookingStatus = onCall({ secrets: [adminToken, emailUser, emailPassword] }, async (request) => {
  try {
    initializeServices(request);
    
    const { adminToken: providedToken, bookingId, status, notes } = request.data;
    
    if (providedToken !== adminToken.value()) {
      throw new HttpsError('permission-denied', 'Admin access required');
    }

    if (!bookingId || !status) {
      throw new HttpsError('invalid-argument', 'Booking ID and status are required');
    }

    const validStatuses = ['pending', 'completed', 'cancelled', 'refunded', 'failed'];
    if (!validStatuses.includes(status)) {
      throw new HttpsError('invalid-argument', 'Invalid status');
    }

    await db.collection('bookings').doc(bookingId).update({
      paymentStatus: status,
      adminNotes: notes || '',
      updatedAt: Timestamp.now()
    });

    return {
      success: true,
      message: 'Booking status updated successfully'
    };

  } catch (error) {
    logger.error('Error updating booking status:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to update booking status');
  }
});

// Scheduled function to send reminder emails (runs daily)
export const sendBookingReminders = onRequest({ secrets: [emailUser, emailPassword] }, async (req, res) => {
  try {
    initializeServices(req);
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const dayAfterTomorrow = new Date(tomorrow);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 1);

    // Get bookings checking in tomorrow
    const upcomingBookingsSnapshot = await db.collection('bookings')
      .where('paymentStatus', '==', 'completed')
      .where('checkIn', '>=', Timestamp.fromDate(tomorrow))
      .where('checkIn', '<', Timestamp.fromDate(dayAfterTomorrow))
      .get();

    for (const doc of upcomingBookingsSnapshot.docs) {
      const booking = doc.data();
      
      const reminderEmail = {
        from: emailUser.value(),
        to: booking.userEmail,
        subject: 'Villa Altona - Check-in Reminder',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #141414;">Check-in Reminder</h2>
            <p>Dear ${booking.userName},</p>
            <p>This is a friendly reminder that your check-in at Villa Altona is tomorrow!</p>
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Check-in:</strong> ${booking.checkIn.toDate().toLocaleDateString()} at 4:00 PM</p>
              <p><strong>Confirmation Code:</strong> ${booking.confirmationCode}</p>
            </div>
            <p>We're excited to welcome you to Villa Altona!</p>
          </div>
        `
      };

      await transporter.sendMail(reminderEmail);
    }

    res.json({ success: true, remindersSent: upcomingBookingsSnapshot.docs.length });

  } catch (error) {
    logger.error('Error sending booking reminders:', error);
    res.status(500).json({ error: 'Failed to send reminders' });
  }
});