import React from 'react'
import Hero from './components/Hero'
import About from './components/About'
import Amenities from './components/Amenities'
import Gallery from './components/Gallery'
import Booking from './components/Booking'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="min-h-screen bg-black">
      <Hero />
      <About />
      <Amenities />
      <Gallery />
      <Booking />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  )
}

export default App
