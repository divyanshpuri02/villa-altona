import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { functions, db } from '../firebase/config';

export interface BookingData {
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  // Backend expects a single guestDetails object; keep array for UI but map when calling backend
  guestDetails: GuestDetail[];
  totalAmount: number;
  paymentStatus: string;
  userEmail: string;
  userName: string;
  userPhone?: string;
  specialRequests?: string;
}

export interface GuestDetail {
  name: string;
  email?: string;
  phone?: string;
  age?: number;
  type: 'adult' | 'child';
  idType?: string;
  idNumber?: string;
}

export interface BookedDateRange {
  checkIn: Date;
  checkOut: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
}

export interface BookingRecord {
  id: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  totalAmount?: number;
  paymentStatus?: string;
  userEmail?: string;
  userName?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Cloud Functions
const createBookingFunction = httpsCallable(functions, 'createBooking');
const createPaymentIntentFunction = httpsCallable(functions, 'createPaymentIntent');
const confirmPaymentFunction = httpsCallable(functions, 'confirmPayment');
const cancelBookingFunction = httpsCallable(functions, 'cancelBooking');
const getUserBookingsFunction = httpsCallable(functions, 'getUserBookings');
const checkVillaAvailabilityFunction = httpsCallable(functions, 'checkVillaAvailability');
const sendContactFormFunction = httpsCallable(functions, 'sendContactForm');
// const createRazorpayOrderFunction = httpsCallable(functions, 'createRazorpayOrder');
// const verifyRazorpaySignatureFunction = httpsCallable(functions, 'verifyRazorpaySignature');

// Get all booked dates from the database
export const getBookedDates = async (): Promise<Date[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('paymentStatus', 'in', ['completed', 'pending'])
    );
    
    const querySnapshot = await getDocs(q);
    const bookedDates: Date[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const checkIn = data.checkIn?.toDate ? data.checkIn.toDate() : new Date(data.checkIn);
      const checkOut = data.checkOut?.toDate ? data.checkOut.toDate() : new Date(data.checkOut);
      
      // Generate all dates between check-in and check-out
      const currentDate = new Date(checkIn);
      while (currentDate < checkOut) {
        bookedDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    return bookedDates;
  } catch (error) {
    console.error('Error fetching booked dates:', error);
    // Return sample dates if Firebase is not connected
    return [
      new Date('2024-03-15'),
      new Date('2024-03-16'),
      new Date('2024-04-10')
    ];
  }
};

// Check if a specific date is booked
export const isDateBooked = (date: Date, bookedDates: Date[]): boolean => {
  return bookedDates.some(bookedDate => 
    bookedDate.getFullYear() === date.getFullYear() &&
    bookedDate.getMonth() === date.getMonth() &&
    bookedDate.getDate() === date.getDate()
  );
};

// Check availability using cloud function
export const checkAvailability = async (checkIn: Date, checkOut: Date): Promise<{
  available: boolean;
  message?: string;
  totalAmount?: number;
  pricePerNight?: number;
}> => {
  try {
    const result = await checkVillaAvailabilityFunction({
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString()
    });

    const data = result.data as any;
    // Backend returns { available, message }
    const available = !!data.available;
    const message = data.message as string | undefined;
    // Optionally compute pricing on client if needed
    const nights = Math.max(1, Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    const pricePerNight = Number(import.meta.env.VITE_PRICE_PER_NIGHT || 100000);
    const totalAmount = nights * pricePerNight;
    return { available, message, totalAmount, pricePerNight };
  } catch (error) {
    console.error('Error checking availability:', error);
    // Return mock availability if backend is not ready
    return {
      available: true,
      totalAmount: 300000,
      pricePerNight: 100000
    };
  }
};

// Create booking using cloud function
export const createBooking = async (bookingData: Omit<BookingData, 'totalAmount' | 'paymentStatus'>): Promise<{
  bookingId: string;
  confirmationCode: string;
}> => {
  try {
    const nights = Math.max(1, Math.ceil((bookingData.checkOut.getTime() - bookingData.checkIn.getTime()) / (1000 * 60 * 60 * 24)));
    const pricePerNight = Number(import.meta.env.VITE_PRICE_PER_NIGHT || 100000);
    const totalAmount = nights * pricePerNight;

    const primaryGuest = bookingData.guestDetails?.[0];
    const result = await createBookingFunction({
      checkIn: bookingData.checkIn.toISOString(),
      checkOut: bookingData.checkOut.toISOString(),
      adults: bookingData.adults,
      children: bookingData.children,
      guestDetails: {
        firstName: primaryGuest?.name?.split(' ')?.[0] || bookingData.userName,
        lastName: primaryGuest?.name?.split(' ')?.slice(1).join(' ') || '',
        email: primaryGuest?.email || bookingData.userEmail,
        phone: primaryGuest?.phone || bookingData.userPhone,
      },
      totalAmount,
      userEmail: bookingData.userEmail,
      userName: bookingData.userName,
      userPhone: bookingData.userPhone,
      specialRequests: bookingData.specialRequests
    });

    return {
      bookingId: (result.data as any).bookingId,
      confirmationCode: (result.data as any).confirmationCode
    };
  } catch (error: any) {
    console.error('Error creating booking:', error);
    const message = error?.message || error?.code || 'Failed to create booking';
    throw new Error(message);
  }
};

// Create payment intent
export const createPaymentIntent = async (bookingId: string, paymentMethodId?: string): Promise<{
  clientSecret: string;
  paymentIntentId: string;
}> => {
  try {
    const result = await createPaymentIntentFunction({
      bookingId,
      paymentMethodId
    });

    return {
      clientSecret: (result.data as any).clientSecret,
      paymentIntentId: (result.data as any).paymentIntentId
    };
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw new Error('Failed to create payment intent');
  }
};

// Confirm payment
export const confirmPayment = async (bookingId: string, paymentIntentId: string): Promise<void> => {
  try {
    await confirmPaymentFunction({
      bookingId,
      paymentIntentId
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    throw new Error('Failed to confirm payment');
  }
};

// Cancel booking
export const cancelBooking = async (bookingId: string): Promise<{
  refundAmount: number;
  refundPercentage: number;
}> => {
  try {
    const result = await cancelBookingFunction({ bookingId });

    return {
      refundAmount: (result.data as any).refundAmount,
      refundPercentage: (result.data as any).refundPercentage
    };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw new Error('Failed to cancel booking');
  }
};

// Get user bookings
export const getUserBookings = async (status?: string): Promise<any[]> => {
  try {
    const result = await getUserBookingsFunction(status ? { status } : {});

    const bookings = (result.data as any).bookings || [];
    return bookings.map((booking: any) => ({
      ...booking,
      checkIn: booking.checkIn?.toDate ? booking.checkIn.toDate() : new Date(booking.checkIn),
      checkOut: booking.checkOut?.toDate ? booking.checkOut.toDate() : new Date(booking.checkOut),
      createdAt: booking.createdAt?.toDate ? booking.createdAt.toDate() : (booking.createdAt ? new Date(booking.createdAt) : undefined),
      updatedAt: booking.updatedAt?.toDate ? booking.updatedAt.toDate() : (booking.updatedAt ? new Date(booking.updatedAt) : undefined)
    }));
  } catch (error) {
    console.error('Error getting user bookings:', error);
    throw new Error('Failed to get bookings');
  }
};

// Send contact form
export const sendContactForm = async (formData: {
  name: string;
  email: string;
  phone?: string;
  message: string;
}): Promise<void> => {
  try {
    await sendContactFormFunction(formData);
  } catch (error) {
    console.error('Error sending contact form:', error);
    throw new Error('Failed to send contact form');
  }
};

// Get single booking by id
export const getBookingById = async (bookingId: string): Promise<BookingRecord | null> => {
  try {
    const ref = doc(db, 'bookings', bookingId);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data() as any;
    const normalize = (v: any) => (v?.toDate ? v.toDate() : (v ? new Date(v) : undefined));
    return {
      id: snap.id,
      checkIn: normalize(data.checkIn) as Date,
      checkOut: normalize(data.checkOut) as Date,
      adults: data.adults ?? 0,
      children: data.children ?? 0,
      totalAmount: data.totalAmount,
      paymentStatus: data.paymentStatus,
      userEmail: data.userEmail,
      userName: data.userName,
      createdAt: normalize(data.createdAt),
      updatedAt: normalize(data.updatedAt)
    };
  } catch (error) {
    console.error('Error fetching booking by id:', error);
    throw new Error('Failed to load booking');
  }
};

// Razorpay: create order (DISABLED - no secret keys yet)
/*
const createRazorpayOrderFunction = httpsCallable(functions, 'createRazorpayOrder');
const verifyRazorpaySignatureFunction = httpsCallable(functions, 'verifyRazorpaySignature');

export const createRazorpayOrder = async (bookingId: string): Promise<{ orderId: string; amount: number; keyId: string }> => {
  try {
    const result = await createRazorpayOrderFunction({ bookingId });
    const data = result.data as any;
    return { orderId: data.orderId, amount: data.amount, keyId: data.keyId };
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw new Error('Failed to create Razorpay order');
  }
};

// Razorpay: verify signature (DISABLED - no secret keys yet)
export const verifyRazorpaySignature = async (params: { orderId: string; paymentId: string; signature: string; bookingId: string }): Promise<void> => {
  try {
    await verifyRazorpaySignatureFunction(params);
  } catch (error) {
    console.error('Error verifying Razorpay signature:', error);
    throw new Error('Failed to verify payment');
  }
};
*/