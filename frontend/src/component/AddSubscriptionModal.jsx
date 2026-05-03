import "./AddSubscriptionModal.css";
import { useState } from "react";
import { createSubscription } from "../services/api";
import { auth } from "../config/firebase";

/**
 * AddSubscriptionModal Component
 * --------------------------------------------------
 * Responsible for:
 * 1. Rendering subscription form UI
 * 2. Managing form input state
 * 3. Preparing data for submission (next step)
 */
const AddSubscriptionModal = ({ onClose, onSuccess }) => {
/**
 * Form State
 * --------------------------------------------------
 * Extended to support UI enhancements:
 * - cycle (monthly/yearly)
 * - color (UI styling)
 * - icon (visual identity)
 * - value (worthiness indicator)
 */
const [formData, setFormData] = useState({
  name: "",
  price: "",
  billingDate: "",
  cycle: "monthly",
  color: "blue",
  icon: "default",
  value: "fair",
});

/**
   * Handle Input Changes
   * --------------------------------------------------
   * Updates state dynamically based on input field name
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

/**
 * Handle Form Submit
 * --------------------------------------------------
 * Sends data to backend and triggers UI refresh
 */
const handleSubmit = async (e) => {
  e.preventDefault();

  if (submitting) return; // guard

  try {
    setSubmitting(true);

    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    const payload = {
      ...formData,
      userId,
      price: parseFloat(formData.price),
    };

    await createSubscription(payload);

    // Notify parent (Home) to refresh list
    if (onSuccess) onSuccess();

    // Reset form for next use
    setFormData({
      name: "",
      price: "",
      billingDate: "",
    });

    // Close modal only after success
    onClose();
  } catch (error) {
    console.error("Submit error:", error);
    alert("Failed to save subscription. Please try again.");
  } finally {
    setSubmitting(false);
  }
};

/**
 * Submission State
 * --------------------------------------------------
 * Prevents duplicate submissions and improves UX
 */
const [submitting, setSubmitting] = useState(false);

  /**
   * Debug Log (Temporary)
   * --------------------------------------------------
   * Helps verify form state updates in real-time
   */
  console.log("Form Data:", formData);

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        
        {/* ================= HEADER ================= */}
        <div className="modalHeader">
          <h2>New Subscription</h2>
          <button onClick={onClose} className="closeBtn">✕</button>
        </div>

        {/* ================= FORM ================= */}
        <form className="modalForm" onSubmit={handleSubmit}>
          
          {/* NAME */}
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Netflix, Spotify"
            value={formData.name}
            onChange={handleChange}
          />

          {/* COST */}
          <label>Cost (RM)</label>
          <input
            type="number"
            name="price"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={formData.price}
            onChange={handleChange}
           />

        {/* ================= BILLING CYCLE ================= */}
        <div className="formGroup">
        <label>Cycle</label>
        <select
            value={formData.cycle}
            onChange={(e) =>
            setFormData({ ...formData, cycle: e.target.value })
            }
        >
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
        </select>
        </div>
        
        {/* ================= COLOR PICKER ================= */}
        <div className="formGroup">
        <label>Color</label>
        <div className="colorOptions">
            {["red", "orange", "yellow", "green", "blue", "purple"].map((c) => (
            <div
                key={c}
                className={`colorCircle ${formData.color === c ? "active" : ""}`}
                style={{ background: c }}
                onClick={() => setFormData({ ...formData, color: c })}
            />
            ))}
        </div>
        </div>

        {/* ================= VALUE SELECTOR ================= */}
        <div className="formGroup">
        <label>Worthiness</label>
        <div className="valueOptions">
            {["great", "fair", "poor"].map((v) => (
            <button
                key={v}
                type="button"
                className={`valueBtn ${formData.value === v ? "active" : ""}`}
                onClick={() => setFormData({ ...formData, value: v })}
            >
                {v}
            </button>
            ))}
        </div>
        </div>
        
          {/* BILLING DATE */}
          <label>Billing Date</label>
          <input
            type="date"
            name="billingDate"
            value={formData.billingDate}
            onChange={handleChange}
           />

          {/* ================= ACTION ================= */}
          <button
            type="submit"
            className="saveBtn"
            disabled={submitting}
            >
            {submitting ? "Saving..." : "Save Subscription"}
          </button>

        </form>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;