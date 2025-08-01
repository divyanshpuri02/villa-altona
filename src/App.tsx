import React from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Amenities from './components/Amenities'
import Gallery from './components/Gallery'
import Booking from './components/Booking'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import MapLocation from './components/MapLocation'

function App() {
  return (
    <div className="min-h-screen bg-neutral-50" style={{ fontFamily: '"Inter", "Noto Sans", sans-serif' }}>
      <Header />
      <Hero />
      <About />
      <Amenities />
      <Gallery />
      <Booking />
      <Testimonials />
      <MapLocation />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </div>
  )
}

export default App