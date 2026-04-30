import express from "express";
import Subscription from "../models/Subscription.js";

const router = express.Router();

/**
 * @route   POST /api/subscriptions
 * @desc    Create a new subscription
 */
router.post("/", async (req, res) => {
  try {
    const { name, price, billingDate, userId } = req.body;

    const newSubscription = new Subscription({
      name,
      price,
      billingDate,
      userId,
    });

    const savedSubscription = await newSubscription.save();

    res.status(201).json(savedSubscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @route   GET /api/subscriptions
 * @desc    Get all subscriptions
 */
router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;

    // Validation check
    if (!userId) {
      return res.status(400).json({ message: "userId is required" });
    }
    
    // Filter by userId
    const subscriptions = await Subscription.find({ userId });

    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;