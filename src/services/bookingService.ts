import { collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export interface BookingData {
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  guestDetails: GuestDetail[];
  totalAmount: number;
  paymentStatus: string;
}

export interface GuestDetail {
  name: string;
  email?: string;
  phone?: string;
  age?: number;
  type?: string;
  idType?: string;
  idNumber?: string;
}

export interface BookedDateRange {
  checkIn: Date;
  checkOut: Date;
  status: 'confirmed' | 'pending' | 'cancelled';
}

// Get all booked dates from the database
export const getBookedDates = async (): Promise<Date[]> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('status', 'in', ['confirmed', 'pending'])
    );
    
    const querySnapshot = await getDocs(q);
    const bookedDates: Date[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const checkIn = data.checkIn.toDate();
      const checkOut = data.checkOut.toDate();
      
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
    // Return some demo booked dates for testing
    const today = new Date();
    const demoBookedDates = [
      new Date(today.getFullYear(), today.getMonth(), 21),
      new Date(today.getFullYear(), today.getMonth(), 22),
      new Date(today.getFullYear(), today.getMonth(), 23),
      new Date(today.getFullYear(), today.getMonth() + 1, 15),
      new Date(today.getFullYear(), today.getMonth() + 1, 16),
    ];
    return demoBookedDates;
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
export const checkAvailability = async (checkIn: Date, checkOut: Date): Promise<boolean> => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(
      bookingsRef,
      where('checkIn', '<=', Timestamp.fromDate(checkOut)),
      where('checkOut', '>=', Timestamp.fromDate(checkIn))
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  } catch (error) {
    console.error('Error checking availability:', error);
    return true;
  }
};

export const createBooking = async (bookingData: BookingData): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, 'bookings'), {
      ...bookingData,
      checkIn: Timestamp.fromDate(bookingData.checkIn),
      checkOut: Timestamp.fromDate(bookingData.checkOut),
      createdAt: Timestamp.now(),
      status: 'pending'
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw new Error('Failed to create booking');
  }
};