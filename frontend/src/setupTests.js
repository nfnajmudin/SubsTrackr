/**
 * Global Test Setup
 * --------------------------------------------------
 * 1. Extend Jest DOM matchers
 * 2. Polyfill browser APIs (fetch)
 */

import "@testing-library/jest-dom";

/**
 * Polyfill fetch for Jest (Node environment)
 */
import "whatwg-fetch";