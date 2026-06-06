import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB914Uh9sPwRTXo595nn19lggEyz9TdjFs",
  authDomain: "aura-events-960dc.firebaseapp.com",
  projectId: "aura-events-960dc",
  storageBucket: "aura-events-960dc.firebasestorage.app",
  messagingSenderId: "305714152084",
  appId: "1:305714152084:web:5b62156915ef1f62cf6a81",
  measurementId: "G-RB7PQVSCWW"
};

// Initialize Firebase (SSR Safe)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
