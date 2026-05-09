/**
 * Subscription API Tests
 * --------------------------------------------------
 * Tests DELETE /api/subscriptions/:id against a dedicated test database.
 */

import request from "supertest";
import mongoose from "mongoose";
import { jest } from "@jest/globals";

const TEST_USER_ID = `test-user-${Date.now()}`;
const AUTH_HEADER = "Bearer test-token";

jest.unstable_mockModule("../config/firebaseAdmin.js", () => ({
  default: {
    auth: () => ({
      verifyIdToken: jest.fn(async () => ({ uid: TEST_USER_ID })),
    }),
  },
}));

const { default: app, dbConnection } = await import("../server.js");
const { default: Subscription } = await import("../models/Subscription.js");

describe("DELETE /api/subscriptions/:id", () => {
  let testSubscription;

  beforeAll(async () => {
    await dbConnection;
  });

  beforeEach(async () => {
    testSubscription = await Subscription.create({
      name: "Test Sub",
      price: 10,
      billingDate: new Date(),
      userId: TEST_USER_ID,
    });
  });

  /**
   * Cleanup is scoped to this test run's user only.
   * This avoids deleting data that belongs to other users, even inside the
   * dedicated test database.
   */
  afterEach(async () => {
    await Subscription.deleteMany({ userId: TEST_USER_ID });
  });

  it("should delete a subscription and return 200", async () => {
    const res = await request(app)
      .delete(`/api/subscriptions/${testSubscription._id}`)
      .set("Authorization", AUTH_HEADER);

    expect(res.statusCode).toBe(200);

    const found = await Subscription.findById(testSubscription._id);
    expect(found).toBeNull();
  });

  it("should return 404 if subscription does not exist", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/subscriptions/${fakeId}`)
      .set("Authorization", AUTH_HEADER);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Subscription not found");
  });

  it("should not delete another user's subscription", async () => {
    const otherUserSubscription = await Subscription.create({
      name: "Other User Sub",
      price: 20,
      billingDate: new Date(),
      userId: "other-user",
    });

    const res = await request(app)
      .delete(`/api/subscriptions/${otherUserSubscription._id}`)
      .set("Authorization", AUTH_HEADER);

    expect(res.statusCode).toBe(404);

    const found = await Subscription.findById(otherUserSubscription._id);
    expect(found).not.toBeNull();

    await Subscription.deleteOne({ _id: otherUserSubscription._id });
  });

  afterAll(async () => {
    await Subscription.deleteMany({ userId: TEST_USER_ID });
    await mongoose.connection.close();
  });
});
