import { collection, query, where, getDocs } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { functions, db } from '../firebase/config';

export interface BookingData {
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
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

// Cloud Functions
const createBookingFunction = httpsCallable(functions, 'createBooking');
const createPaymentIntentFunction = httpsCallable(functions, 'createPaymentIntent');
const confirmPaymentFunction = httpsCallable(functions, 'confirmPayment');
const cancelBookingFunction = httpsCallable(functions, 'cancelBooking');
const getUserBookingsFunction = httpsCallable(functions, 'getUserBookings');
const checkVillaAvailabilityFunction = httpsCallable(functions, 'checkVillaAvailability');
const sendContactFormFunction = httpsCallable(functions, 'sendContactForm');

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
  totalAmount: number;
  pricePerNight: number;
}> => {
  try {
    const result = await checkVillaAvailabilityFunction({
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString()
    });

    return {
      available: (result.data as any).available,
      totalAmount: (result.data as any).totalAmount,
      pricePerNight: (result.data as any).pricePerNight
    };
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
  totalAmount: number;
}> => {
  try {
    const result = await createBookingFunction({
      checkIn: bookingData.checkIn.toISOString(),
      checkOut: bookingData.checkOut.toISOString(),
      adults: bookingData.adults,
      children: bookingData.children,
      guestDetails: bookingData.guestDetails,
      userEmail: bookingData.userEmail,
      userName: bookingData.userName,
      userPhone: bookingData.userPhone,
      specialRequests: bookingData.specialRequests
    });

    return {
      bookingId: (result.data as any).bookingId,
      totalAmount: (result.data as any).totalAmount
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
};

// Create payment intent
export const createPaymentIntent = async (bookingId: string, paymentMethodId?: string): Promise<{
  paymentIntent: {
    id: string;
    status: string;
    client_secret: string;
  };
}> => {
  try {
    const result = await createPaymentIntentFunction({
      bookingId,
      paymentMethodId
    });

    return {
      paymentIntent: (result.data as any).paymentIntent
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
export const cancelBooking = async (bookingId: string, userEmail: string): Promise<{
  refundAmount: number;
}> => {
  try {
    const result = await cancelBookingFunction({
      bookingId,
      userEmail
    });

    return {
      refundAmount: (result.data as any).refundAmount
    };
  } catch (error) {
    console.error('Error cancelling booking:', error);
    throw new Error('Failed to cancel booking');
  }
};

// Get user bookings
export const getUserBookings = async (userEmail: string): Promise<BookingData[]> => {
  try {
    const result = await getUserBookingsFunction({
      userEmail
    });

    return (result.data as any).bookings.map((booking: any) => ({
      ...booking,
      checkIn: new Date(booking.checkIn),
      checkOut: new Date(booking.checkOut),
      createdAt: new Date(booking.createdAt),
      updatedAt: new Date(booking.updatedAt)
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