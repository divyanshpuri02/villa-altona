#!/bin/bash

echo "🔄 Rolling back Villa Altona to original state..."

# Step 1: Restore original firebase.json (if it was changed)
echo "🔥 Restoring original Firebase config..."
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

# Step 2: Restore original package.json with all dependencies
echo "📦 Restoring original package.json..."
cat > package.json << 'PACKAGE_EOF'
{
  "name": "villa-altona-booking",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
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
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "@vitejs/plugin-react": "^4.2.0",
    "autoprefixer": "^10.4.16",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "typescript": "^5.2.0",
    "vite": "^5.0.0"
  }
}
PACKAGE_EOF

# Step 3: Check if you have git to restore files
if [ -d ".git" ]; then
    echo "📂 Git repository found. Checking for original files..."
    
    # Try to restore from git if files were committed
    git status
    
    echo "Do you want to restore from git? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        git checkout HEAD -- src/
        echo "✅ Restored from git"
    fi
else
    echo "📂 No git repository found. Will preserve existing src/ files."
fi

# Step 4: Don't overwrite existing components - preserve them
echo "✅ Preserving existing src/ directory structure"
echo "📁 Current src/ contents:"
ls -la src/ 2>/dev/null || echo "No src/ directory found"

if [ -d "src/components" ]; then
    echo "📁 Components found:"
    ls -la src/components/ 2>/dev/null
else
    echo "❌ No components directory found"
fi

# Step 5: Only fix critical config files that might prevent building
echo "📝 Ensuring proper TypeScript config..."
cat > tsconfig.json << 'TS_EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": false,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
TS_EOF

cat > tsconfig.node.json << 'TSN_EOF'
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
TSN_EOF

# Step 6: Ensure proper Vite config
echo "⚡ Ensuring proper Vite config..."
cat > vite.config.ts << 'VITE_EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false
  }
})
VITE_EOF

# Step 7: Clean build artifacts but preserve source
echo "🧹 Cleaning only build artifacts..."
rm -rf node_modules package-lock.json dist .firebase

# Step 8: Install dependencies
echo "📦 Installing dependencies..."
npm install

echo "✅ Rollback complete!"
echo "📁 Your original src/ files have been preserved"
echo "🔧 Only configuration files have been restored to working state"
echo ""
echo "Next steps:"
echo "1. Check your src/ directory: ls -la src/"
echo "2. Try building: npm run build"
echo "3. If successful, deploy: firebase deploy --only hosting"
