const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

/**
 * Fetch subscriptions for a specific user
 * @param {string} userId - Firebase UID of logged-in user
 */
export const getSubscriptions = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const url = `${BASE_URL}/subscriptions?userId=${userId}`;
    console.log("Fetching:", url); // debug

    const res = await fetch(url);

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
