const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";
/**
 * Get Firebase Auth Headers
 * --------------------------------------------------
 * - Retrieves current user token
 * - Attaches it as Authorization header
 */
import { auth } from "../config/firebase";

const getAuthHeaders = async () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("User not authenticated");
  }

  const token = await user.getIdToken();

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

/**
 * Fetch subscriptions (authenticated)
 * --------------------------------------------------
 * - Uses Firebase token instead of userId
 * - Backend extracts user from token
 */
export const getSubscriptions = async () => {
  try {
    /**
     * Get auth headers (contains Bearer token)
     */
    const headers = await getAuthHeaders();

    /**
     * Call protected endpoint
     */
    const res = await fetch(`${BASE_URL}/subscriptions`, {
      headers,
    });

    if (!res.ok) {
      throw new Error("Failed to fetch subscriptions");
    }

    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Create new subscription
 * --------------------------------------------------
 * Sends POST request to backend to store subscription
 */
export const createSubscription = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to create subscription");
    }

    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Update subscription
 * --------------------------------------------------
 * Saves edits for one existing subscription.
 */
export const updateSubscription = async (id, data) => {
  try {
    const res = await fetch(`${BASE_URL}/subscriptions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error("Failed to update subscription");
    }

    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Delete subscription
 * --------------------------------------------------
 * Removes one subscription by MongoDB document id.
 */
export const deleteSubscription = async (id) => {
  try {
    const res = await fetch(`${BASE_URL}/subscriptions/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("Failed to delete subscription");
    }

    return await res.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};
