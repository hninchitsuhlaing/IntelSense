import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyDxTL9q57NjSpzAX9KUC_NSk6tfU5NMyu4",
  authDomain: "hospitisense.firebaseapp.com",
  projectId: "hospitisense",
  storageBucket: "hospitisense.firebasestorage.app",
  messagingSenderId: "321168543966",
  appId: "1:321168543966:web:8768a86a040330bc1ef24f",
  measurementId: "G-12Q23VNQTP"
};

const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export default app;