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