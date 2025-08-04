import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyDpY1J38Mf5V-XC3U3CgwlBT_mNexdYM2o",
  authDomain: "villa-altona-goa.firebaseapp.com",
  databaseURL: "https://villa-altona-goa-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "villa-altona-goa",
  storageBucket: "villa-altona-goa.firebasestorage.app",
  messagingSenderId: "686251298348",
  appId: "1:686251298348:web:d801992f8c1bbc1918cb89",
  measurementId: "G-XY8PM1G620"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, 'asia-south1');
export default app;