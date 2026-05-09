/**
 * Authentication Middleware
 * --------------------------------------------------
 * Verifies Firebase ID token from request headers
 * and attaches user info to request object
 */

import admin from "../config/firebaseAdmin.js";

export const verifyToken = async (req, res, next) => {
  try {
    /**
     * Extract token from Authorization header
     * Format: "Bearer <token>"
     */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: No token" });
    }

    const token = authHeader.split(" ")[1];

    /**
     * Verify token with Firebase Admin
     */
    const decoded = await admin.auth().verifyIdToken(token);

    /**
     * Attach user to request
     */
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};