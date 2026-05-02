import { useEffect, useState } from "react";
import { getSubscriptions } from "../services/api";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import "./Home.css";
import AddSubscriptionModal from "../component/AddSubscriptionModal";

/**
 * Home Page
 * --------------------------------------------------
 * Responsibilities:
 * 1. Listen to Firebase authentication state
 * 2. Fetch user-specific subscriptions from backend
 * 3. Display subscription data
 * 4. Manage UI states (loading, empty, populated)
 * 5. Control modal visibility for adding subscriptions
 */
const Home = ({ onLogout }) => {
  /**
   * State Management
   * --------------------------------------------------
   * subscriptions → stores fetched subscription data
   * loading       → controls loading UI
   * showModal     → controls Add Subscription modal visibility
   */
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  /**
   * Fetch Subscriptions
   * --------------------------------------------------
   * Reusable function to retrieve subscriptions
   * for the currently authenticated user.
   *
   * Why reusable?
   * → Called on initial load
   * → Will also be used after adding a new subscription (Step 6)
   */
  const fetchSubscriptions = async (user) => {
    try {
      const data = await getSubscriptions(user.uid);
      setSubscriptions(data);
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  /**
   * Effect: Authentication Listener
   * --------------------------------------------------
   * Runs once on component mount.
   *
   * Flow:
   * 1. Wait for Firebase to confirm authenticated user
   * 2. If user exists → fetch subscriptions
   * 3. If no user → stop loading
   * 4. Cleanup listener on unmount
   */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setLoading(false);
        return;
      }

      await fetchSubscriptions(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {/* ================= HEADER SECTION ================= */}
      <div className="header">
        <h2>Your Subscriptions</h2>

      {/* ================= + ADD SUBS BUTTON ================= */}
      <div className="headerActions">
        <button className="addBtn" onClick={() => setShowModal(true)}>
          +
        </button>
        
        {/* Logout belongs in header (global action) */}
        <button onClick={onLogout} className="logoutBtn">
          Logout
        </button>
      </div>
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

      {/* ================= MODAL SECTION ================= */}
      {/* 
        Render modal ONLY when showModal = true
        This prevents unnecessary rendering and improves performance
      */}

      {/**
        * Modal Rendering
        * --------------------------------------------------
        * Pass onSuccess callback so modal can trigger
        * a data refresh after successful submission
        */}
        {showModal && (
          <AddSubscriptionModal
            onClose={() => setShowModal(false)}
            onSuccess={() => fetchSubscriptions(auth.currentUser)}
          />
        )}
    </div>
  );
};

export default Home;

