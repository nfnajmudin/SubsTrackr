/**
 * Home Component Tests
 * --------------------------------------------------
 * Ensures component renders correctly
 */

import React from "react";
import { render, screen } from "@testing-library/react";
import Home from "../pages/Home";

/**
 * Mock API layer
 */
jest.mock("../services/api", () => ({
  getSubscriptions: jest.fn(() => Promise.resolve([])),
  deleteSubscription: jest.fn(),
  updateSubscription: jest.fn(),
}));

/**
 * Mock Firebase config
 */
jest.mock("../config/firebase", () => ({
  auth: {},
}));

/**
 * Mock Firebase Auth
 */
jest.mock("firebase/auth", () => ({
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback({ uid: "test-user" });
    return jest.fn();
  }),
}));

/**
 * ================= TEST SUITE =================
 */
describe("Home Component", () => {

  /**
   * Test: Page title renders
   */
  test("renders title", async () => {
    render(<Home />);

    expect(await screen.findByText(/your subscriptions/i))
      .toBeInTheDocument();
  });

});