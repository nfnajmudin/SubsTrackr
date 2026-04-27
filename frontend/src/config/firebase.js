import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBkyCcBcsveXy0Cse0SjqsdQ8bE9FvM3xs",
  authDomain: "substrackr-446b9.firebaseapp.com",
  projectId: "substrackr-446b9",
  storageBucket: "substrackr-446b9.firebasestorage.app",
  messagingSenderId: "281383917046",
  appId: "1:281383917046:web:9c395891b10ec9796863d7",
  measurementId: "G-GB3X7RSQLY",
};

const app = initializeApp(firebaseConfig);

// Auth
export const auth = getAuth(app);

// Google provider
export const googleProvider = new GoogleAuthProvider();