/**
 * Home Component Tests
 * --------------------------------------------------
 * - Render test
 * - Delete interaction test (with confirmation modal)
 */

import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "../pages/Home";
import { deleteSubscription } from "../services/api";

/**
 * Mock data (shared across tests)
 */
const mockSubscriptions = [
  {
    _id: "sub-1",
    name: "Netflix",
    price: 15,
    cycle: "monthly",
    billingDate: new Date().toISOString(),
    value: "fair",
    color: "blue",
  },
];

/**
 * Mock API layer
 */
jest.mock("../services/api", () => ({
  getSubscriptions: jest.fn(() => Promise.resolve(mockSubscriptions)),
  deleteSubscription: jest.fn(() => Promise.resolve({})),
  updateSubscription: jest.fn(),
}));

/**
 * Mock Firebase
 */
jest.mock("../config/firebase", () => ({
  auth: {},
}));

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
   * Test: Page renders title
   */
  test("renders title", async () => {
    render(<Home />);

    expect(
      await screen.findByText(/your subscriptions/i)
    ).toBeInTheDocument();
  });

  /**
   * Test: delete flow with confirmation modal
   */
  test("deletes subscription after confirmation", async () => {
    render(<Home />);

    // wait for card to appear
    await screen.findByText("Netflix");

    // click delete icon (aria-label = "Delete Netflix")
    const deleteIcon = screen.getByRole("button", {
      name: /delete netflix/i,
    });

    await userEvent.click(deleteIcon);

    // confirm modal appears
    const confirmBtn = await screen.findByRole("button", {
      name: /^delete$/i,
    });

    await userEvent.click(confirmBtn);

    // verify API call
    expect(deleteSubscription).toHaveBeenCalledWith("sub-1");

    // verify UI update
    await waitFor(() => {
      expect(screen.queryByText("Netflix")).not.toBeInTheDocument();
    });
  });

});