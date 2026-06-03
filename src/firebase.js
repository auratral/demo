import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDtg-pdR-bANTC-uLT4JdUrgufum4GnQrQ",
  authDomain: "auratral-mvp.firebaseapp.com",
  projectId: "auratral-mvp",
  storageBucket: "auratral-mvp.firebasestorage.app",
  messagingSenderId: "557804669925",
  appId: "1:557804669925:web:3fbf43561544d4c9ac3d0c",
  measurementId: "G-0HCT1Y8JN2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Analytics is only supported in browser environments
let analytics = null;
isSupported().then((supported) => {
  if (supported) {
    analytics = getAnalytics(app);
  }
});

export { app, auth, db, storage, analytics };
