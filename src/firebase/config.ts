import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: "AIzaSyDpY1J38Mf5V-XC3U3CgwlBT_mNexdYM2o",
  authDomain: "villa-altona-goa.firebaseapp.com",
  projectId: "villa-altona-goa",
  storageBucket: "villa-altona-goa.firebasestorage.app",
  messagingSenderId: "686251298348",
  appId: "1:686251298348:web:d6a0c708b19556fd18cb89",
  measurementId: "G-M6B1E4HFGP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, 'asia-south1');
export default app;