/**
 * Firebase Admin Initialization
 * --------------------------------------------------
 * Purpose:
 * - Verify Firebase ID tokens from frontend
 * - Extract authenticated user UID securely
 */

import admin from "firebase-admin";
import dotenv from "dotenv";

dotenv.config();

/**
 * Initialize Firebase Admin SDK
 * --------------------------------------------------
 * Uses service account credentials (stored in .env)
 */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      /**
       * Important:
       * Replace escaped newlines in private key
       */
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    }),
  });
}

export default admin;