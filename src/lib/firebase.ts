import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBKZqR3VSnG3jxamGtZDrRySBdcxHgKgyg",
  authDomain: "saloon-booking-system-895e6.firebaseapp.com",
  projectId: "saloon-booking-system-895e6",
  storageBucket: "saloon-booking-system-895e6.firebasestorage.app",
  messagingSenderId: "1072527108944",
  appId: "1:1072527108944:web:b4175126e24ea499855a55",
  measurementId: "G-PVXC62ZBVQ"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Secondary instance for creating staff accounts without logging out admin
export const createSecondaryAuth = () => {
  const secondaryApp = initializeApp(firebaseConfig, "SecondaryAuth");
  return getAuth(secondaryApp);
};

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
