import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../config/firebase";

// SIGN UP
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// LOGIN
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// FORGOT PASSWORD
export const resetPassword = (email) => {
  return sendPasswordResetEmail(auth, email);
};

