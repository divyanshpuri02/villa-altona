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