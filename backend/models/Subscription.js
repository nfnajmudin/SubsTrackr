import mongoose from "mongoose";

/**
 * Subscription Schema
 * Represents a user's subscription (e.g., Netflix, Spotify)
 */
const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  billingDate: {
    type: Date,
    required: true,
  },
  userId: {
    type: String, // from Firebase auth
    required: true,
  },
}, {
  timestamps: true,
});

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;