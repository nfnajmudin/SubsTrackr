import express from "express";
import Subscription from "../models/Subscription.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route   POST /api/subscriptions
 * @desc    Create a new subscription for the authenticated user
 *
 * Security:
 * - The client must not decide which user owns a subscription.
 * - verifyToken validates the Firebase ID token and exposes the trusted
 *   Firebase UID on req.user.uid.
 * - We store req.user.uid as userId so the subscription is linked to the
 *   authenticated user only.
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const { name, price, billingDate, cycle, color, icon, value } = req.body;

    const newSubscription = new Subscription({
      name,
      price,
      billingDate,
      cycle,
      color,
      icon,
      value,
      userId: req.user.uid,
    });

    const savedSubscription = await newSubscription.save();

    res.status(201).json(savedSubscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/subscriptions
 * @desc    Get all subscriptions for the authenticated user
 *
 * Security:
 * - userId is derived from req.user.uid instead of req.query.
 * - This prevents users from changing a query string to read another user's
 *   subscription data.
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({
      userId: req.user.uid,
    });

    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/subscriptions/:id
 * @desc    Update one subscription owned by the authenticated user
 *
 * Security:
 * - We match both the subscription id and req.user.uid.
 * - The ownership check prevents an authenticated user from updating another
 *   user's subscription by guessing or reusing a MongoDB document id.
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const { name, price, billingDate, cycle, color, icon, value } = req.body;

    const updatedSubscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.uid },
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
 * @desc    Delete one subscription owned by the authenticated user
 *
 * Security:
 * - We match both the subscription id and req.user.uid.
 * - The ownership check ensures users can only delete their own subscriptions,
 *   even if they know another subscription's database id.
 */
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const deletedSubscription = await Subscription.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.uid,
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
