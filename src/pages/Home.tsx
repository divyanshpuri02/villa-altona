import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Amenities from '../components/Amenities';
import Gallery from '../components/Gallery';
import Booking from '../components/Booking';
import Testimonials from '../components/Testimonials';
import MapLocation from '../components/MapLocation';
import Contact from '../components/Contact';

interface HomeProps {
  isAuthenticated: boolean;
  onShowAuth: () => void;
}

const Home: React.FC<HomeProps> = ({ isAuthenticated, onShowAuth }) => {
  return (
    <>
      <Hero />
      <About />
      <Amenities />
      <Gallery />
      <Booking isAuthenticated={isAuthenticated} onShowAuth={onShowAuth} />
      <Testimonials />
      <MapLocation />
      <Contact />
    </>
  );
};

export default Home;
