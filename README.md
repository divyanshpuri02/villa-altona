# Villa Altona - Luxury Villa Booking System

A complete, production-ready villa booking system built with React, TypeScript, Firebase, and modern web technologies.

## 🏡 Features

### Frontend
- **Responsive Design**: Beautiful, mobile-first design with Tailwind CSS
- **Interactive UI**: Smooth animations with Framer Motion
- **Authentication**: Complete user authentication system
- **Booking System**: Real-time availability checking and booking
- **Payment Integration**: Multiple payment methods (Stripe, UPI, etc.)
- **Gallery**: Interactive property gallery with lightbox
- **Reviews**: Guest review system with ratings
- **Contact Forms**: Contact management system

### Backend (Firebase)
- **Cloud Functions**: Serverless backend with Node.js
- **Firestore Database**: Real-time database for bookings and users
- **Authentication**: Firebase Auth integration
- **Email Notifications**: Automated booking confirmations
- **Payment Processing**: Stripe integration for payments
- **Admin Dashboard**: Complete admin panel for managing bookings

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Firebase CLI
- Stripe account (for payments)

### Installation

1. **Clone and Install**
   ```bash
   git clone <repository-url>
   cd villa-altona
   npm install
   ```

2. **Firebase Setup**
   ```bash
   # Install Firebase CLI locally
   npm install -g firebase-tools
   
   # Login to Firebase
   firebase login
   
   # Initialize project (if needed)
   firebase init
   ```

3. **Environment Variables**
   Create `.env` file:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
   ```

4. **Deploy Backend**
   ```bash
   # Deploy functions and Firestore rules
   npm run deploy
   ```

5. **Start Development**
   ```bash
   npm run dev
   ```

## 📱 Usage

### For Guests
1. **Browse**: View villa details, amenities, and gallery
2. **Check Availability**: Select dates to see availability
3. **Book**: Complete booking with guest details
4. **Pay**: Secure payment processing
5. **Manage**: View and manage bookings in user profile

### For Admins
1. **Dashboard**: Access admin dashboard with special token
2. **Manage Bookings**: View, update, and cancel bookings
3. **Analytics**: View booking statistics and revenue
4. **Communications**: Manage contact form submissions

## 🛠 Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool

### Backend
- **Firebase Functions** - Serverless backend
- **Firestore** - NoSQL database
- **Firebase Auth** - Authentication
- **Stripe** - Payment processing
- **Nodemailer** - Email notifications

## 📊 Database Schema

### Collections

**bookings**
```typescript
{
  id: string
  checkIn: Date
  checkOut: Date
  adults: number
  children: number
  totalAmount: number
  paymentStatus: 'pending' | 'completed' | 'cancelled'
  userEmail: string
  userName: string
  confirmationCode: string
  createdAt: Date
}
```

**users**
```typescript
{
  email: string
  name: string
  phone?: string
  totalBookings: number
  createdAt: Date
}
```

**contacts**
```typescript
{
  name: string
  email: string
  message: string
  status: 'new' | 'responded' | 'closed'
  createdAt: Date
}
```

## 🔧 Configuration

### Firebase Functions Secrets
Set up required secrets for production:

```bash
# Stripe
firebase functions:secrets:set STRIPE_SECRET_KEY

# Email
firebase functions:secrets:set EMAIL_USER
firebase functions:secrets:set EMAIL_PASSWORD

# Admin
firebase functions:secrets:set ADMIN_TOKEN
```

### Firestore Security Rules
The app includes comprehensive security rules:
- Public read access for availability checking
- Authenticated write access for bookings
- User-specific data access controls

## 🚀 Deployment

### Frontend (Firebase Hosting)
```bash
npm run build
firebase deploy --only hosting
```

### Backend (Cloud Functions)
```bash
firebase deploy --only functions
```

### Complete Deployment
```bash
npm run deploy
```

## 📈 Features in Detail

### Booking System
- Real-time availability checking
- Date validation and conflict prevention
- Guest information collection
- Special requests handling
- Confirmation code generation

### Payment Processing
- Multiple payment methods
- Secure Stripe integration
- Payment status tracking
- Automatic refund handling
- Receipt generation

### Admin Dashboard
- Booking management
- Revenue analytics
- Guest communication
- Occupancy tracking
- Export capabilities

### Email System
- Booking confirmations
- Cancellation notifications
- Admin alerts
- Custom templates
- Delivery tracking

## 🔒 Security

- Firebase Authentication
- Firestore security rules
- Input validation
- XSS protection
- CSRF protection
- Rate limiting

## 📱 Mobile Responsive

- Mobile-first design
- Touch-friendly interface
- Optimized images
- Fast loading
- Offline capabilities

## 🎨 Customization

### Styling
- Tailwind CSS configuration
- Custom color schemes
- Typography system
- Component variants

### Content
- Easy content updates
- Image management
- Pricing configuration
- Feature toggles

## 📞 Support

For support and questions:
- Email: support@villaaltona.com
- Documentation: [Link to docs]
- Issues: [GitHub Issues]

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Firebase team for excellent backend services
- Stripe for payment processing
- Tailwind CSS for styling system
- Framer Motion for animations
- All contributors and testers

---

**Villa Altona** - Experience luxury redefined. 🏡✨