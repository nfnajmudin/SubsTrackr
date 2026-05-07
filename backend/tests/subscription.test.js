/**
 * Subscription API Tests
 * --------------------------------------------------
 * Tests DELETE /api/subscriptions/:id
 * Ensures:
 * - Subscription is deleted from DB
 * - Correct response is returned
 */

import request from "supertest";
import mongoose from "mongoose";
import app from "../server.js";
import Subscription from "../models/Subscription.js";

describe("DELETE /api/subscriptions/:id", () => {

  /**
   * Setup: create a test subscription before each test
   */
  let testSubscription;

  beforeEach(async () => {
    testSubscription = await Subscription.create({
      name: "Test Sub",
      price: 10,
      billingDate: new Date(),
      userId: "test-user",
    });
  });

  /**
   * Cleanup after each test
   */
  afterEach(async () => {
    await Subscription.deleteMany();
  });

  /**
   * Test case:
   * Should delete a subscription successfully
   */
  it("should delete a subscription and return 200", async () => {

    const res = await request(app)
      .delete(`/api/subscriptions/${testSubscription._id}`);

    // Check response status
    expect(res.statusCode).toBe(200);

    // Check DB (subscription should be gone)
    const found = await Subscription.findById(testSubscription._id);
    expect(found).toBeNull();
  });

    /**
     * Test case:
     * Should return 404 when deleting a non-existing subscription
     */
    it("should return 404 if subscription does not exist", async () => {

    // Use a valid MongoDB ObjectId format (but not in DB)
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
        .delete(`/api/subscriptions/${fakeId}`);

    // Expect 404 response
    expect(res.statusCode).toBe(404);

    // Optional: verify message
    expect(res.body.message).toBe("Subscription not found");
    });
    
    /**
     * Close DB connection after all tests
     * --------------------------------------------------
     * Prevents Jest from hanging
     */
    afterAll(async () => {
    await mongoose.connection.close();
    });

});