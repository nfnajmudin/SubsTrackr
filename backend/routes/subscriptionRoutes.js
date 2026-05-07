import express from "express";
import Subscription from "../models/Subscription.js";

const router = express.Router();

/**
 * @route   POST /api/subscriptions
 * @desc    Create a new subscription
 */
router.post("/", async (req, res) => {
  try {
    const { name, price, billingDate, userId, cycle, color, icon, value } = req.body;

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

/**
 * @route   PUT /api/subscriptions/:id
 * @desc    Update a subscription
 */
router.put("/:id", async (req, res) => {
  try {
    const { name, price, billingDate, cycle, color, icon, value } = req.body;

    const updatedSubscription = await Subscription.findByIdAndUpdate(
      req.params.id,
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
 */
router.delete("/:id", async (req, res) => {
  try {
    const deletedSubscription = await Subscription.findByIdAndDelete(req.params.id);

    if (!deletedSubscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }

    res.status(200).json({ message: "Subscription deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
