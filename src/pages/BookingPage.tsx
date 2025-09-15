import React from 'react';
import Booking from '../components/Booking';

interface BookingPageProps {
  isAuthenticated: boolean;
  onShowAuth: () => void;
}

const BookingPage: React.FC<BookingPageProps> = ({ isAuthenticated, onShowAuth }) => {
  return <Booking isAuthenticated={isAuthenticated} onShowAuth={onShowAuth} />;
};

export default BookingPage;
