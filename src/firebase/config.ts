import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "demo-key",
  authDomain: "villa-altona-goa.firebaseapp.com",
  projectId: "villa-altona-goa",
  storageBucket: "villa-altona-goa.appspot.com",
  messagingSenderId: "686251298348",
  appId: "1:686251298348:web:d6a0c708b19556fd18cb89"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
