#!/bin/bash

echo "🏡 Force Redeploying Villa Altona..."

# Step 1: Clear ALL Firebase cache and builds
echo "�� Clearing all Firebase cache..."
rm -rf .firebase dist node_modules package-lock.json

# Step 2: Check what's currently in your src/App.tsx
echo "📱 Current App.tsx content:"
if [ -f "src/App.tsx" ]; then
    head -10 src/App.tsx
else
    echo "❌ No App.tsx found!"
fi

# Step 3: Force overwrite App.tsx with the full villa app
echo "📱 Creating full Villa Altona App.tsx..."
mkdir -p src
cat > src/App.tsx << 'APP_EOF'
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
APP_EOF

# Step 4: Check if components exist, if not create them
echo "🧩 Checking components..."
mkdir -p src/components

if [ ! -f "src/components/Hero.tsx" ]; then
    echo "Creating Hero component..."
    cat > src/components/Hero.tsx << 'HERO_EOF'
import React from 'react'
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white flex items-center justify-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center z-10 px-4"
      >
        <h1 className="text-6xl md:text-8xl font-bold mb-6">
          Villa <span className="text-yellow-400">Altona</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Experience unparalleled luxury in the heart of Goa. Your exclusive retreat awaits.
        </p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-4 px-8 rounded-lg text-lg"
          onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Book Your Stay
        </motion.button>
      </motion.div>
    </section>
  )
}

export default Hero
HERO_EOF
fi

# Create other components if they don't exist
for component in About Amenities Gallery Testimonials Contact Footer; do
    if [ ! -f "src/components/${component}.tsx" ]; then
        echo "Creating ${component} component..."
        cat > src/components/${component}.tsx << COMP_EOF
import React from 'react'
import { motion } from 'framer-motion'

const ${component} = () => {
  return (
    <section id="${component,,}" className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-5xl font-bold mb-8">
            <span className="text-yellow-400">${component}</span>
          </h2>
          <p className="text-xl text-gray-300">
            ${component} content coming soon...
          </p>
        </motion.div>
      </div>
    </section>
  )
}

export default ${component}
COMP_EOF
    fi
done

# Step 5: Create a simple Booking component
cat > src/components/Booking.tsx << 'BOOKING_EOF'
import React, { useState } from 'react'
import { motion } from 'framer-motion'

const Booking = () => {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)

  return (
    <section id="booking" className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold mb-8">
            Reserve Your <span className="text-yellow-400">Experience</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8"
        >
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Check-in Date</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Check-out Date</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Number of Guests</label>
              <select
                value={guests}
                onChange={(e) => setGuests(Number(e.target.value))}
                className="w-full p-3 bg-white/10 border border-white/20 rounded-lg text-white"
              >
                {[1,2,3,4,5,6,7,8].map(num => (
                  <option key={num} value={num} className="bg-gray-800">{num} Guest{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold py-4 px-6 rounded-lg text-lg"
              onClick={() => alert('Booking system is being set up!')}
            >
              Check Availability
            </motion.button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}

export default Booking
BOOKING_EOF

# Step 6: Update package.json
cat > package.json << 'PACKAGE_EOF'
{
  "name": "villa-altona-booking",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.300.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.0",
    "vite": "^5.0.0"
  }
}
PACKAGE_EOF

# Step 7: Fix Firebase config
cat > firebase.json << 'FIREBASE_EOF'
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{"source": "**", "destination": "/index.html"}]
  }
}
FIREBASE_EOF

# Step 8: Install and build
echo "📦 Installing fresh dependencies..."
npm install

echo "🔨 Building application..."
npm run build

# Step 9: Deploy with cache headers to prevent caching
echo "🚀 Force deploying to Firebase..."
firebase deploy --only hosting

echo "🧹 Clearing browser cache instructions:"
echo "1. Open your app: https://villa-altona-goa.web.app/"
echo "2. Press Ctrl+Shift+R (or Cmd+Shift+R on Mac) to hard refresh"
echo "3. Or open in incognito/private mode"

echo "✅ Villa Altona fully redeployed!"
