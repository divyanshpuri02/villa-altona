import { onRequest, onCall, HttpsError } from 'firebase-functions/v2/https';
import { onDocumentCreated, onDocumentUpdated } from 'firebase-functions/v2/firestore';
import { setGlobalOptions } from 'firebase-functions/v2';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import * as logger from 'firebase-functions/logger';
import Stripe from 'stripe';
import * as nodemailer from 'nodemailer';
import { defineSecret } from 'firebase-functions/params';

// Initialize Firebase Admin
initializeApp();
const db = getFirestore();

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

// Utility Functions
const initializeServices = (context: any) => {
  if (!stripe) {
    stripe = new Stripe(stripeSecretKey.value(), {
      apiVersion: '2025-07-30.basil'
    });
  }
  
  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser.value(),
        pass: emailPassword.value()
      }
    });
  }
};

const initializeEmailService = (context: any) => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
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

const calculateStayAmount = (checkIn: Date, checkOut: Date): number => {
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  const pricePerNight = 100000; // ₹1,00,000 per night
  return nights * pricePerNight;
};

// Email Templates
const sendBookingConfirmationEmail = async (booking: any, bookingId: string) => {
  const mailOptions = {
    from: emailUser.value(),
    to: booking.userEmail,
    subject: `Villa Altona Booking Confirmation - ${booking.confirmationCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">Booking Confirmed!</h2>
        <p>Dear ${booking.userName},</p>
        <p>Your booking at Villa Altona has been confirmed. Here are your booking details:</p>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Booking Details</h3>
          <p><strong>Confirmation Code:</strong> ${booking.confirmationCode}</p>
          <p><strong>Check-in:</strong> ${new Date(booking.checkIn.seconds * 1000).toLocaleDateString()}</p>
          <p><strong>Check-out:</strong> ${new Date(booking.checkOut.seconds * 1000).toLocaleDateString()}</p>
          <p><strong>Guests:</strong> ${booking.adults} Adults${booking.children > 0 ? `, ${booking.children} Children` : ''}</p>
          <p><strong>Total Amount:</strong> ₹${booking.totalAmount.toLocaleString()}</p>
        </div>
        
        <p>We look forward to hosting you at Villa Altona!</p>
        <p>If you have any questions, please contact us at info@villa-altona.com</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">Villa Altona - Luxury Villa Rental in Goa</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

const sendContactFormEmail = async (contactData: ContactFormData) => {
  const mailOptions = {
    from: emailUser.value(),
    to: 'info@villa-altona.com',
    subject: `New Contact Form Submission from ${contactData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2c3e50;">New Contact Form Submission</h2>
        
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Name:</strong> ${contactData.name}</p>
          <p><strong>Email:</strong> ${contactData.email}</p>
          ${contactData.phone ? `<p><strong>Phone:</strong> ${contactData.phone}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${contactData.message}</p>
        </div>
        
        <p><small>Submitted on: ${contactData.createdAt.toLocaleString()}</small></p>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

// Cloud Functions

// Check Villa Availability
export const checkVillaAvailability = onCall(async (request) => {
  try {
    const { checkIn, checkOut } = request.data;

    if (!checkIn || !checkOut) {
      throw new HttpsError('invalid-argument', 'Check-in and check-out dates are required');
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      throw new HttpsError('invalid-argument', 'Check-out date must be after check-in date');
    }

    // Check for existing bookings that overlap
    const bookingsRef = db.collection('bookings');
    const overlappingBookings = await bookingsRef
      .where('paymentStatus', 'in', ['completed', 'pending'])
      .where('checkIn', '<', Timestamp.fromDate(checkOutDate))
      .where('checkOut', '>', Timestamp.fromDate(checkInDate))
      .get();

    const available = overlappingBookings.empty;
    const totalAmount = calculateStayAmount(checkInDate, checkOutDate);
    const nights = Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));
    const pricePerNight = totalAmount / nights;

    return {
      success: true,
      available,
      totalAmount,
      pricePerNight,
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

// Create Booking
export const createBooking = onCall(async (request) => {
  try {
    const {
      checkIn,
      checkOut,
      adults,
      children,
      guestDetails,
      userEmail,
      userName,
      userPhone,
      specialRequests
    } = request.data;

    if (!checkIn || !checkOut || !adults || !userEmail || !userName) {
      throw new HttpsError('invalid-argument', 'Missing required booking information');
    }

    // Check availability again
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      throw new HttpsError('invalid-argument', 'Check-out date must be after check-in date');
    }

    // Check for existing bookings that overlap
    const bookingsRef = db.collection('bookings');
    const overlappingBookings = await bookingsRef
      .where('paymentStatus', 'in', ['completed', 'pending'])
      .where('checkIn', '<', Timestamp.fromDate(checkOutDate))
      .where('checkOut', '>', Timestamp.fromDate(checkInDate))
      .get();

    const available = overlappingBookings.empty;
    if (!available) {
      throw new HttpsError('failed-precondition', 'Villa is not available for the selected dates');
    }

    const totalAmount = calculateStayAmount(checkInDate, checkOutDate);
    const confirmationCode = generateConfirmationCode();

    // Create booking document
    const bookingData: BookingData = {
      checkIn: checkInDate,
      checkOut: checkOutDate,
      adults,
      children: children || 0,
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

    return {
      success: true,
      bookingId: bookingRef.id,
      confirmationCode,
      totalAmount
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
    if (booking?.userEmail !== userEmail) {
      throw new HttpsError('permission-denied', 'Not authorized to cancel this booking');
    }

    if (booking?.paymentStatus === 'cancelled') {
      throw new HttpsError('failed-precondition', 'Booking already cancelled');
    }

    let refundAmount = 0;

    // Process refund if payment was completed
    if (booking?.paymentStatus === 'completed' && booking?.paymentIntentId) {
      try {
        const checkInDate = booking.checkIn.toDate();
        const now = new Date();
        const daysDifference = Math.ceil((checkInDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

        // Refund policy: Full refund if cancelled 7+ days before, 50% if 3-6 days, no refund if < 3 days
        let refundPercentage = 0;
        if (daysDifference >= 7) {
          refundPercentage = 1.0;
        } else if (daysDifference >= 3) {
          refundPercentage = 0.5;
        }

        if (refundPercentage > 0) {
          refundAmount = Math.floor(booking.totalAmount * refundPercentage);
          await stripe.refunds.create({
            payment_intent: booking.paymentIntentId,
            amount: refundAmount * 100 // Convert to paise
          });
        }
      } catch (refundError) {
        logger.error('Error processing refund:', refundError);
        // Continue with cancellation even if refund fails
      }
    }

    // Update booking status
    await db.collection('bookings').doc(bookingId).update({
      paymentStatus: 'cancelled',
      cancelledAt: Timestamp.now(),
      refundAmount,
      updatedAt: Timestamp.now()
    });

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

    const bookingsRef = db.collection('bookings');
    const querySnapshot = await bookingsRef
      .where('userEmail', '==', userEmail)
      .orderBy('createdAt', 'desc')
      .get();

    const bookings = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      bookings
    };

  } catch (error) {
    logger.error('Error fetching user bookings:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to fetch bookings');
  }
});

// Send Contact Form
export const sendContactForm = onCall({ secrets: [emailUser, emailPassword] }, async (request) => {
  try {
    initializeEmailService(request);
    
    const { name, email, phone, message } = request.data;

    if (!name || !email || !message) {
      throw new HttpsError('invalid-argument', 'Name, email, and message are required');
    }

    const contactData: ContactFormData = {
      name,
      email,
      phone,
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
    await sendContactFormEmail(contactData);

    return {
      success: true,
      message: 'Contact form submitted successfully'
    };

  } catch (error) {
    logger.error('Error processing contact form:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to process contact form');
  }
});

// Admin Functions
export const getAdminStats = onCall({ secrets: [adminToken] }, async (request) => {
  try {
    const { adminToken: providedToken } = request.data;

    if (providedToken !== adminToken.value()) {
      throw new HttpsError('permission-denied', 'Invalid admin token');
    }

    // Get booking statistics
    const bookingsRef = db.collection('bookings');
    const totalBookingsSnapshot = await bookingsRef.get();
    const completedBookingsSnapshot = await bookingsRef.where('paymentStatus', '==', 'completed').get();
    
    let totalRevenue = 0;
    completedBookingsSnapshot.forEach(doc => {
      const data = doc.data();
      totalRevenue += data.totalAmount || 0;
    });

    // Get contacts count (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const contactsSnapshot = await db.collection('contacts')
      .where('createdAt', '>=', Timestamp.fromDate(thirtyDaysAgo))
      .get();

    const stats = {
      totalBookings: totalBookingsSnapshot.size,
      recentBookings: completedBookingsSnapshot.size,
      totalRevenue,
      newContacts: contactsSnapshot.size,
      occupancyRate: 85 // This would be calculated based on actual occupancy
    };

    return {
      success: true,
      stats
    };

  } catch (error) {
    logger.error('Error fetching admin stats:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to fetch admin statistics');
  }
});

export const getAdminBookings = onCall({ secrets: [adminToken] }, async (request) => {
  try {
    const { adminToken: providedToken, status } = request.data;

    if (providedToken !== adminToken.value()) {
      throw new HttpsError('permission-denied', 'Invalid admin token');
    }

    let query = db.collection('bookings').orderBy('createdAt', 'desc');
    
    if (status && status !== 'all') {
      query = query.where('paymentStatus', '==', status) as any;
    }

    const querySnapshot = await query.get();
    const bookings = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return {
      success: true,
      bookings
    };

  } catch (error) {
    logger.error('Error fetching admin bookings:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to fetch bookings');
  }
});

export const updateBookingStatus = onCall({ secrets: [adminToken] }, async (request) => {
  try {
    const { adminToken: providedToken, bookingId, status } = request.data;

    if (providedToken !== adminToken.value()) {
      throw new HttpsError('permission-denied', 'Invalid admin token');
    }

    if (!bookingId || !status) {
      throw new HttpsError('invalid-argument', 'Booking ID and status are required');
    }

    await db.collection('bookings').doc(bookingId).update({
      paymentStatus: status,
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

// Get User Profile
export const getUserProfile = onCall(async (request) => {
  try {
    const { userEmail } = request.data;

    if (!userEmail) {
      throw new HttpsError('invalid-argument', 'User email is required');
    }

    // Get user document
    const userDoc = await db.collection('users').doc(userEmail).get();
    
    let userData;
    if (userDoc.exists) {
      userData = userDoc.data();
    } else {
      // Create user profile if it doesn't exist
      userData = {
        email: userEmail,
        name: userEmail.split('@')[0],
        totalBookings: 0,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      await db.collection('users').doc(userEmail).set(userData);
    }

    return {
      success: true,
      profile: userData
    };

  } catch (error) {
    logger.error('Error fetching user profile:', error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError('internal', 'Failed to fetch user profile');
  }
});

// Webhooks and Triggers

// Stripe Webhook
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
  initializeEmailService(event);
  
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

// Update user booking count when booking is created
export const onBookingCreated = onDocumentCreated('bookings/{bookingId}', async (event) => {
  const booking = event.data?.data();
  
  if (booking?.userEmail) {
    const userRef = db.collection('users').doc(booking.userEmail);
    
    try {
      await db.runTransaction(async (transaction) => {
        const userDoc = await transaction.get(userRef);
        
        if (userDoc.exists) {
          const currentCount = userDoc.data()?.totalBookings || 0;
          transaction.update(userRef, {
            totalBookings: currentCount + 1,
            updatedAt: Timestamp.now()
          });
        } else {
          transaction.set(userRef, {
            email: booking.userEmail,
            name: booking.userName || booking.userEmail.split('@')[0],
            totalBookings: 1,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          });
        }
      });
      
      logger.info(`Updated booking count for user: ${booking.userEmail}`);
    } catch (error) {
      logger.error('Error updating user booking count:', error);
    }
  }
});
