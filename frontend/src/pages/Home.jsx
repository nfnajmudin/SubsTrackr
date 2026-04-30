import { useEffect, useState } from "react";
import { getSubscriptions } from "../services/api";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./Home.css";

/**
 * Home Page
 * --------------------------------------------------
 * Responsible for:
 * 1. Listening to Firebase authentication state
 * 2. Fetching user-specific subscriptions from backend
 * 3. Displaying subscription data
 * 4. Handling UI states (loading, empty, data)
 */
const Home = ({ onLogout }) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Effect: Runs once on component mount
   * --------------------------------------------------
   * - Waits for Firebase to confirm authenticated user
   * - Uses UID to fetch subscriptions from backend
   * - Cleans up listener on unmount
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // If no user is logged in, stop loading
      if (!user) {
        console.warn("No authenticated user found.");
        setLoading(false);
        return;
      }

      try {
        console.log("Authenticated UID:", user.uid);

        // Fetch subscriptions tied to this user
        const data = await getSubscriptions(user.uid);

        // Store result in state
        setSubscriptions(data);
      } catch (error) {
        console.error("Failed to fetch subscriptions:", error);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup listener when component unmounts
    return () => unsubscribe();
  }, []);

  return (
    <div>
      {/* ================= HEADER SECTION ================= */}
      <div className="header">
        <h2>Your Subscriptions</h2>

        {/* Logout belongs in header (global action) */}
        <button onClick={onLogout} className="logoutBtn">
          Logout
        </button>
      </div>

      {/* ================= CONTENT SECTION ================= */}
      {loading ? (
        <p>Loading subscriptions...</p>
      ) : subscriptions.length === 0 ? (
        <p>No subscriptions yet</p>
      ) : (
        subscriptions.map((sub) => (
          <div key={sub._id} className="card">
            <h3>{sub.name}</h3>
            <p>Price: ${sub.price}</p>
            <p>
              Billing: {new Date(sub.billingDate).toDateString()}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default Home;

