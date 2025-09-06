#!/bin/bash

echo "🏡 Fixing Villa Altona Firebase Deployment..."

# Fix Firebase configuration - change from 'public' to 'dist'
echo "🔥 Fixing Firebase hosting configuration..."
cat > firebase.json << 'FIREBASE_EOF'
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  },
  "firestore": {
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
FIREBASE_EOF

# Clean old builds
echo "🧹 Cleaning old build files..."
rm -rf dist .firebase/hosting.*

# Update package.json with correct dependencies
echo "📦 Updating package.json..."
cat > package.json << 'PACKAGE_EOF'
{
  "name": "villa-altona-booking",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "date-fns": "^2.30.0",
    "emailjs-com": "^3.2.0",
    "firebase": "^10.7.0",
    "framer-motion": "^10.16.0",
    "lucide-react": "^0.300.0",
    "react-datepicker": "^4.25.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/react-datepicker": "^4.19.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.0",
    "vite": "^5.0.0"
  }
}
PACKAGE_EOF

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ -d "dist" ]; then
    echo "✅ Build successful! Deploying to Firebase..."
    
    # Deploy to Firebase hosting
    firebase deploy --only hosting
    
    echo "🎉 Villa Altona deployed successfully!"
    echo "🌐 Your app is live at: https://villa-altona-goa.web.app/"
    echo "🌐 Alternative URL: https://villa-altona-goa.firebaseapp.com/"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi
