import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

dotenv.config();
const app = express();

/**
 * Middleware Configuration
 * - cors: allows requests from frontend (React)
 * - express.json: parses incoming JSON request bodies
 */
app.use(cors());
app.use(express.json());

/**
 * Subscription Routes
 */
app.use("/api/subscriptions", subscriptionRoutes);

/**
 * MongoDB Connection
 */
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));
  
/**
 * Health Check Route
 * Used to verify that the server is running
 */
app.get("/", (req, res) => {
  res.send("API is running...");
});

/**
 * Start Server
 */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});