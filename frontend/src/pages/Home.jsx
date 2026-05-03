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

/**
 * Determine urgency styling based on billing date
 * --------------------------------------------------
 * Rules:
 * - Overdue → urgent
 * - Within 7 days → urgent
 */
const getUrgencyClass = (billingDate) => {
  const today = new Date();
  const billDate = new Date(billingDate);

  // Normalize dates (VERY important)
  today.setHours(0, 0, 0, 0);
  billDate.setHours(0, 0, 0, 0);

  const diffTime = billDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 🔴 overdue OR due soon
  if (diffDays <= 7) {
    return "urgent";
  }

  return "";
};

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
          /**
           * Subscription Grid
           * --------------------------------------------------
           * Displays subscriptions in card layout
           */
          <div className="cardGrid">
            {subscriptions.map((sub) => (
              <div
                key={sub._id}
                className={`card ${getUrgencyClass(sub.billingDate)} ${sub.color || "blue"}`}
              >
                {/* ================= CARD HEADER ================= */}
                <div className="cardHeader">
                  <h3>{sub.name}</h3>

                  {/* VALUE BADGE (Great / Fair / Poor) */}
                  <span className={`badge ${sub.value || "fair"}`}>
                    {sub.value || "fair"}
                  </span>
                </div>

                {/* ================= CARD BODY ================= */}
                <p>
                  RM {sub.price} / {sub.cycle === "yearly" ? "yr" : "mo"}
                </p>

                <p>
                  Billing: {new Date(sub.billingDate).toDateString()}
                </p>
              </div>
            ))}
          </div>
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

