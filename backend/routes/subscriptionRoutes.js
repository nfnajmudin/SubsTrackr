import express from "express";
import Subscription from "../models/Subscription.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/subscriptions
 * @desc    Create a new subscription
 * --------------------------------------------------
 * Security:
 * - userId is NOT taken from frontend
 * - extracted from verified Firebase token
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, price, billingDate, cycle, color, icon, value } = req.body;

    // ✅ Secure user identification
    const userId = req.user.uid;

    const newSubscription = new Subscription({
      name,
      price,
      billingDate,
      userId,
      cycle,
      color,
      icon,
      value,
    });

    const savedSubscription = await newSubscription.save();

    res.status(201).json(savedSubscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/subscriptions
 * @desc    Get all subscriptions for logged-in user
 * --------------------------------------------------
 * Security:
 * - userId is NOT read from query
 * - always derived from token
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const subscriptions = await Subscription.find({ userId });

    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/subscriptions/:id
 * @desc    Update a subscription
 * --------------------------------------------------
 * Security:
 * - Optional improvement: ensure user owns the subscription
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, price, billingDate, cycle, color, icon, value } = req.body;

    const userId = req.user.uid;

    const updatedSubscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId }, // 🔒 ensures ownership
      { name, price, billingDate, cycle, color, icon, value },
      { new: true, runValidators: true }
    );

    if (!updatedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json(updatedSubscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/subscriptions/:id
 * @desc    Delete a subscription
 * --------------------------------------------------
 * Security:
 * - ensures user can only delete their own data
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const userId = req.user.uid;

    const deletedSubscription = await Subscription.findOneAndDelete({
      _id: req.params.id,
      userId,
    });

    if (!deletedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json({ message: "Subscription deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;