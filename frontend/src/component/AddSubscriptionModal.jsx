import "./AddSubscriptionModal.css";
import { useState } from "react";
import { createSubscription, updateSubscription } from "../services/api";
import { auth } from "../config/firebase";

const initialFormData = {
  name: "",
  price: "",
  billingDate: "",
  cycle: "monthly",
  color: "red",
  icon: "play",
  value: "great",
};

const colorOptions = [
  { name: "red", value: "#f04444" },
  { name: "orange", value: "#f97316" },
  { name: "yellow", value: "#eab308" },
  { name: "green", value: "#22c55e" },
  { name: "blue", value: "#1fa7e8" },
  { name: "indigo", value: "#3b82f6" },
  { name: "purple", value: "#8759f2" },
  { name: "pink", value: "#d946ef" },
  { name: "teal", value: "#14b8a6" },
  { name: "black", value: "#111827" },
];

const iconOptions = [
  { name: "play", icon: "play_circle", label: "Streaming" },
  { name: "music", icon: "music_note", label: "Music" },
  { name: "cloud", icon: "cloud", label: "Cloud" },
  { name: "card", icon: "credit_card", label: "Card" },
  { name: "game", icon: "sports_esports", label: "Gaming" },
  { name: "tv", icon: "tv", label: "TV" },
  { name: "wifi", icon: "wifi", label: "Internet" },
  { name: "phone", icon: "smartphone", label: "Mobile" },
];

const valueOptions = [
  { name: "great", icon: "\u2B50", label: "Great Value" },
  { name: "fair", icon: "\uD83D\uDC4D", label: "Fair Value" },
  { name: "poor", icon: "\u26A0", label: "Poor Value" },
];

const formatDateForInput = (date) => {
  if (!date) return "";
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return "";

  const year = parsedDate.getFullYear();
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
  const day = String(parsedDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getInitialData = (subscription) => {
  if (!subscription) return initialFormData;

  return {
    name: subscription.name || "",
    price: subscription.price ?? "",
    billingDate: formatDateForInput(subscription.billingDate),
    cycle: subscription.cycle || "monthly",
    color: subscription.color || "blue",
    icon: subscription.icon || "tv",
    value: subscription.value || "fair",
  };
};

const AddSubscriptionModal = ({ subscription, onClose, onSuccess }) => {
  const [formData, setFormData] = useState(() => getInitialData(subscription));
  const [submitting, setSubmitting] = useState(false);
  const isEditing = Boolean(subscription?._id);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return;

    try {
      setSubmitting(true);

      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const payload = {
        ...formData,
        userId,
        price: parseFloat(formData.price),
      };

      if (isEditing) {
        await updateSubscription(subscription._id, payload);
      } else {
        await createSubscription(payload);
      }

      if (onSuccess) await onSuccess();

      setFormData(initialFormData);
      onClose();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Failed to save subscription. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modalOverlay">
      <div className="modalContent">
        <div className="modalHeader">
          <h2>{isEditing ? "Edit Subscription" : "New Subscription"}</h2>
          <button
            type="button"
            onClick={onClose}
            className="closeBtn"
            aria-label="Close modal"
          >
            <span className="material-symbols-rounded">close</span>
          </button>
        </div>

        <form className="modalForm" onSubmit={handleSubmit}>
          <div className="formGroup fullWidth">
            <label htmlFor="subscription-name">Name</label>
            <input
              id="subscription-name"
              type="text"
              name="name"
              placeholder="e.g. Netflix, Spotify"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formRow">
            <div className="formGroup">
              <label htmlFor="subscription-price">Cost</label>
              <input
                id="subscription-price"
                type="number"
                name="price"
                step="0.01"
                min="0"
                placeholder="RM 9.99"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>

            <div className="formGroup">
              <label htmlFor="subscription-cycle">Cycle</label>
              <select
                id="subscription-cycle"
                name="cycle"
                value={formData.cycle}
                onChange={handleChange}
              >
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          </div>

          <div className="formGroup fullWidth">
            <label htmlFor="subscription-date">First Billing Date</label>
            <input
              id="subscription-date"
              type="date"
              name="billingDate"
              value={formData.billingDate}
              onChange={handleChange}
              required
            />
          </div>

          <div className="formGroup fullWidth">
            <label>Color</label>
            <div className="colorOptions">
              {colorOptions.map((color) => (
                <button
                  key={color.name}
                  type="button"
                  className={`colorCircle ${formData.color === color.name ? "active" : ""}`}
                  style={{ background: color.value }}
                  aria-label={`Choose ${color.name}`}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, color: color.name }))
                  }
                />
              ))}
            </div>
          </div>

          <div className="formGroup fullWidth">
            <label>Icon</label>
            <div className="iconOptions">
              {iconOptions.map((icon) => (
                <button
                  key={icon.name}
                  type="button"
                  className={`iconBtn ${formData.icon === icon.name ? "active" : ""}`}
                  title={icon.label}
                  aria-label={icon.label}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, icon: icon.name }))
                  }
                >
                  <span className="material-symbols-rounded">{icon.icon}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="formGroup fullWidth">
            <label>Worthiness</label>
            <div className="valueOptions">
              {valueOptions.map((value) => (
                <button
                  key={value.name}
                  type="button"
                  className={`valueBtn ${formData.value === value.name ? "active" : ""}`}
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, value: value.name }))
                  }
                >
                  <span>{value.icon}</span>
                  {value.label}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="saveBtn" disabled={submitting}>
            {submitting
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Save Subscription"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddSubscriptionModal;
