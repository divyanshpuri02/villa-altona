import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';

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
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app, 'asia-south1');

// Optional: connect to local emulators when enabled
if (import.meta.env.VITE_USE_EMULATORS === '1' || import.meta.env.VITE_USE_EMULATORS === 'true') {
  try {
    connectAuthEmulator(auth, 'http://localhost:9099');
  } catch {}
  try {
    connectFirestoreEmulator(db, 'localhost', 8080);
  } catch {}
  try {
    connectFunctionsEmulator(functions, 'localhost', 5001);
  } catch {}
}
export default app;