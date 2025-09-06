# Villa Altona API Endpoints Documentation

## 🌐 Base URL
**Production**: `https://asia-south1-villa-altona-goa.cloudfunctions.net/`

---

## 📋 API Endpoints Overview

### **1. CUSTOMER BOOKING ENDPOINTS**

#### **1.1 Check Villa Availability**
- **Endpoint**: `checkVillaAvailability`
- **Type**: Callable Function (onCall)
- **URL**: `https://asia-south1-villa-altona-goa.cloudfunctions.net/checkVillaAvailability`
- **Method**: POST (Firebase Callable)
- **Authentication**: None required

**Functionality:**
- Checks if the villa is available for specific dates
- Validates check-in and check-out dates
- Calculates total amount and price per night
- Returns availability status with pricing details

**Request Parameters:**
```json
{
  "checkIn": "2024-08-15",
  "checkOut": "2024-08-18"
}
```

**Response:**
```json
{
  "success": true,
  "available": true,
  "totalAmount": 300000,
  "pricePerNight": 100000,
  "nights": 3
}
```

---

#### **1.2 Create Booking**
- **Endpoint**: `createBooking`
- **Type**: Callable Function (onCall)
- **URL**: `https://asia-south1-villa-altona-goa.cloudfunctions.net/createBooking`
- **Method**: POST (Firebase Callable)
- **Authentication**: None required

**Functionality:**
- Creates a new villa booking
- Validates availability before booking
- Generates unique confirmation code
- Stores booking in Firestore database

**Request Parameters:**
```json
{
  "checkIn": "2024-08-15",
  "checkOut": "2024-08-18",
  "adults": 4,
  "children": 2,
  "userEmail": "customer@email.com",
  "userName": "John Doe",
  "userPhone": "+91-9876543210",
  "specialRequests": "Early check-in requested",
  "guestDetails": [
    {
      "name": "John Doe",
      "type": "adult",
      "age": 35
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "bookingId": "booking_123",
  "confirmationCode": "VA2024-ABC123-XYZ89",
  "totalAmount": 300000
}
```

---

#### **1.3 Create Payment Intent**
- **Endpoint**: `createPaymentIntent`
- **Type**: Callable Function (onCall)
- **URL**: `https://asia-south1-villa-altona-goa.cloudfunctions.net/createPaymentIntent`
- **Method**: POST (Firebase Callable)
- **Authentication**: None required
- **Security**: Uses Stripe Secret Key

**Functionality:**
- Creates Stripe payment intent for booking
- Integrates with Stripe payment processing
- Links payment to specific booking
- Handles payment method attachment

**Request Parameters:**
```json
{
  "bookingId": "booking_123",
  "paymentMethodId": "pm_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "paymentIntent": {
    "id": "pi_1234567890",
    "status": "requires_confirmation",
    "client_secret": "pi_1234567890_secret_abc123"
  }
}
```

---

#### **1.4 Confirm Payment**
- **Endpoint**: `confirmPayment`
- **Type**: Callable Function (onCall)
- **URL**: `https://asia-south1-villa-altona-goa.cloudfunctions.net/confirmPayment`
- **Method**: POST (Firebase Callable)
- **Authentication**: None required
- **Security**: Uses Stripe Secret Key

**Functionality:**
- Confirms successful payment with Stripe
- Updates booking status to 'completed'
- Triggers confirmation email sending
- Updates payment timestamps

**Request Parameters:**
```json
{
  "bookingId": "booking_123",
  "paymentIntentId": "pi_1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment confirmed successfully"
}
```

---

#### **1.5 Cancel Booking**
- **Endpoint**: `cancelBooking`
- **Type**: Callable Function (onCall)
- **URL**: `https://asia-south1-villa-altona-goa.cloudfunctions.net/cancelBooking`
- **Method**: POST (Firebase Callable)
- **Authentication**: User email verification required
- **Security**: Uses Stripe Secret Key for refunds

**Functionality:**
- Cancels existing booking
- Processes refunds based on cancellation policy
- Updates booking status to 'cancelled'
- Calculates refund amount based on timing

**Refund Policy:**
- 7+ days before: 100% refund
- 3-6 days before: 50% refund
- <3 days before: No refund

**Request Parameters:**
```json
{
  "bookingId": "booking_123",
  "userEmail": "customer@email.com"
}
```

**Response:**
```json
{
  "success": true,
  "refundAmount": 150000,
  "message": "Booking cancelled successfully"
}
```

---

#### **1.6 Get User Bookings**
- **Endpoint**: `getUserBookings`
- **Type**: Callable Function (onCall)
- **URL**: `https://asia-south1-villa-altona-goa.cloudfunctions.net/getUserBookings`
- **Method**: POST (Firebase Callable)
- **Authentication**: User email required

**Functionality:**
- Retrieves all bookings for a specific user
- Returns booking history with details
- Ordered by creation date (newest first)
- Includes booking status and payment information

**Request Parameters:**
```json
{
  "userEmail": "customer@email.com"
}
```

**Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "id": "booking_123",
      "confirmationCode": "VA2024-ABC123-XYZ89",
      "checkIn": "2024-08-15",
      "checkOut": "2024-08-18",
      "totalAmount": 300000,
      "paymentStatus": "completed",
      "createdAt": "2024-08-01T10:00:00Z"
    }
  ]
}
```

---

#### **1.7 Send Contact Form**
- **Endpoint**: `sendContactForm`
- **Type**: Callable Function (onCall)
- **URL**: `https://asia-south1-villa-altona-goa.cloudfunctions.net/sendContactForm`
- **Method**: POST (Firebase Callable)
- **Authentication**: None required
- **Security**: Uses email credentials

**Functionality:**
- Processes contact form submissions
- Sends email notification to villa management
- Stores inquiry in database
- Returns confirmation to user

**Request Parameters:**
```json
{
  "name": "John Doe",
  "email": "customer@email.com",
  "phone": "+91-9876543210",
  "message": "I would like to inquire about villa amenities."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact form submitted successfully"
}
```

---

#### **1.8 Get User Profile**
- **Endpoint**: `getUserProfile`
- **Type**: Callable Function (onCall)
- **URL**: `https://asia-south1-villa-altona-goa.cloudfunctions.net/getUserProfile`
- **Method**: POST (Firebase Callable)
- **Authentication**: User email required

**Functionality:**
- Retrieves or creates user profile
- Returns user information and booking statistics
- Auto-creates profile if doesn't exist
- Updates user booking counts

**Request Parameters:**
```json
{
  "userEmail": "customer@email.com"
}
```

**Response:**
```json
{
  "success": true,
  "profile": {
    "email": "customer@email.com",
    "name": "John Doe",
    "totalBookings": 3,
    "createdAt": "2024-08-01T10:00:00Z"
  }
}
```

---

### **2. ADMIN MANAGEMENT ENDPOINTS**

#### **2.1 Get Admin Statistics**
- **Endpoint**: `getAdminStats`
- **Type**: Callable Function (onCall)
- **URL**: `https://asia-south1-villa-altona-goa.cloudfunctions.net/getAdminStats`
- **Method**: POST (Firebase Callable)
- **Authentication**: Admin token required
- **Security**: Protected by admin token validation

**Functionality:**
- Provides comprehensive villa statistics
- Returns booking and revenue analytics
- Shows recent activity metrics
- Calculates occupancy rates

**Request Parameters:**
```json
{
  "adminToken": "admin_secret_token"
}
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "totalBookings": 45,
    "recentBookings": 12,
    "totalRevenue": 4500000,
    "newContacts": 8,
    "occupancyRate": 85
  }
}
```

---

#### **2.2 Get Admin Bookings**
- **Endpoint**: `getAdminBookings`
- **Type**: Callable Function (onCall)
- **URL**: `https://asia-south1-villa-altona-goa.cloudfunctions.net/getAdminBookings`
- **Method**: POST (Firebase Callable)
- **Authentication**: Admin token required
- **Security**: Protected by admin token validation

**Functionality:**
- Retrieves all bookings for admin management
- Filters by booking status (optional)
- Returns complete booking details
- Ordered by creation date

**Request Parameters:**
```json
{
  "adminToken": "admin_secret_token",
  "status": "completed" // optional: "all", "pending", "completed", "cancelled"
}
```

**Response:**
```json
{
  "success": true,
  "bookings": [
    {
      "id": "booking_123",
      "userEmail": "customer@email.com",
      "userName": "John Doe",
      "checkIn": "2024-08-15",
      "checkOut": "2024-08-18",
      "adults": 4,
      "children": 2,
      "totalAmount": 300000,
      "paymentStatus": "completed",
      "confirmationCode": "VA2024-ABC123-XYZ89"
    }
  ]
}
```

---

#### **2.3 Update Booking Status**
- **Endpoint**: `updateBookingStatus`
- **Type**: Callable Function (onCall)
- **URL**: `https://asia-south1-villa-altona-goa.cloudfunctions.net/updateBookingStatus`
- **Method**: POST (Firebase Callable)
- **Authentication**: Admin token required
- **Security**: Protected by admin token validation

**Functionality:**
- Allows admin to modify booking status
- Updates booking records in database
- Logs status change timestamps
- Supports all booking statuses

**Request Parameters:**
```json
{
  "adminToken": "admin_secret_token",
  "bookingId": "booking_123",
  "status": "completed" // "pending", "completed", "failed", "cancelled"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking status updated successfully"
}
```

---

### **3. WEBHOOK ENDPOINTS**

#### **3.1 Stripe Webhook**
- **Endpoint**: `stripeWebhook`
- **Type**: HTTP Request (onRequest)
- **URL**: `https://asia-south1-villa-altona-goa.cloudfunctions.net/stripeWebhook`
- **Method**: POST (HTTP)
- **Authentication**: Stripe signature verification
- **Security**: Validates Stripe webhook signatures

**Functionality:**
- Receives Stripe payment event notifications
- Processes payment success/failure events
- Updates booking status automatically
- Handles webhook security verification

**Events Handled:**
- `payment_intent.succeeded` - Payment completed
- `payment_intent.payment_failed` - Payment failed

**Request**: Stripe webhook payload (handled automatically)

**Response**: 
```json
{
  "received": true
}
```

---

### **4. DATABASE TRIGGERS (Automatic)**

#### **4.1 Booking Completion Trigger**
- **Endpoint**: `onBookingCompleted`
- **Type**: Firestore Trigger (onDocumentUpdated)
- **Trigger**: When booking payment status changes to 'completed'
- **Authentication**: Automatic (system trigger)

**Functionality:**
- Automatically sends confirmation email when booking is completed
- Triggered by booking status changes
- Uses email templates for professional communication
- Includes booking details and confirmation code

---

#### **4.2 Booking Creation Trigger**
- **Endpoint**: `onBookingCreated`
- **Type**: Firestore Trigger (onDocumentCreated)
- **Trigger**: When new booking is created in database
- **Authentication**: Automatic (system trigger)

**Functionality:**
- Updates user booking statistics
- Creates user profile if doesn't exist
- Increments total booking count
- Maintains user relationship data

---

## 🔐 Authentication & Security

### **Public Endpoints** (No authentication required):
- `checkVillaAvailability`
- `createBooking`
- `createPaymentIntent`
- `confirmPayment`
- `sendContactForm`

### **User-Protected Endpoints** (Requires user email verification):
- `getUserBookings`
- `getUserProfile`
- `cancelBooking`

### **Admin-Protected Endpoints** (Requires admin token):
- `getAdminStats`
- `getAdminBookings`
- `updateBookingStatus`

### **System-Protected Endpoints** (Automatic triggers):
- `stripeWebhook` (Stripe signature verification)
- `onBookingCompleted` (System trigger)
- `onBookingCreated` (System trigger)

---

## 💡 Usage Examples

### **Frontend Integration (JavaScript)**
```javascript
import { getFunctions, httpsCallable } from 'firebase/functions';

const functions = getFunctions();

// Check availability
const checkAvailability = httpsCallable(functions, 'checkVillaAvailability');
const result = await checkAvailability({
  checkIn: '2024-08-15',
  checkOut: '2024-08-18'
});

// Create booking
const createBooking = httpsCallable(functions, 'createBooking');
const booking = await createBooking({
  checkIn: '2024-08-15',
  checkOut: '2024-08-18',
  adults: 4,
  children: 2,
  userEmail: 'customer@email.com',
  userName: 'John Doe'
});
```

### **Admin Dashboard Integration**
```javascript
// Get admin statistics
const getStats = httpsCallable(functions, 'getAdminStats');
const stats = await getStats({
  adminToken: 'your_admin_token'
});

// Get all bookings
const getBookings = httpsCallable(functions, 'getAdminBookings');
const bookings = await getBookings({
  adminToken: 'your_admin_token',
  status: 'all'
});
```

---

## 📊 Response Formats

All endpoints return responses in the following format:

**Success Response:**
```json
{
  "success": true,
  "data": { /* endpoint-specific data */ },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "error": {
    "code": "invalid-argument",
    "message": "Detailed error description"
  }
}
```

---

## 🌍 Production Environment

- **Region**: asia-south1 (Mumbai, India)
- **Runtime**: Node.js 22
- **Scaling**: Auto-scaling up to 10 instances per function
- **Security**: Firebase Security Rules + Custom validation
- **Monitoring**: Firebase Functions logs + Performance monitoring

All endpoints are **live and ready for production use** with real payment processing and customer management capabilities.
