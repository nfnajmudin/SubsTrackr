import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import subscriptionRoutes from "./routes/subscriptionRoutes.js";

dotenv.config();
const app = express();

const getDatabaseNameFromMongoUri = (mongoUri) => {
  const uriWithoutOptions = mongoUri.split("?")[0];
  const protocolIndex = uriWithoutOptions.indexOf("://");

  if (protocolIndex === -1) {
    return "";
  }

  const uriAfterProtocol = uriWithoutOptions.slice(protocolIndex + 3);
  const uriAfterAuth = uriAfterProtocol.includes("@")
    ? uriAfterProtocol.slice(uriAfterProtocol.lastIndexOf("@") + 1)
    : uriAfterProtocol;

  const databaseStartIndex = uriAfterAuth.indexOf("/");

  if (databaseStartIndex === -1) {
    return "";
  }

  return decodeURIComponent(uriAfterAuth.slice(databaseStartIndex + 1).trim());
};

const getMongoUri = () => {
  if (process.env.NODE_ENV === "test") {
    const testUri = process.env.MONGO_URI_TEST;

    if (!testUri) {
      throw new Error("MONGO_URI_TEST is required when NODE_ENV=test");
    }

    const databaseName = getDatabaseNameFromMongoUri(testUri);

    if (!databaseName || !databaseName.toLowerCase().endsWith("_test")) {
      throw new Error("MONGO_URI_TEST database name must end with _test");
    }

    return testUri;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required");
  }

  return process.env.MONGO_URI;
};

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
export const dbConnection = mongoose.connect(getMongoUri())
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error(err);
    throw err;
  });
  
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

// Export app so tests can import it
export default app;

// Prevent server from starting during tests
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
