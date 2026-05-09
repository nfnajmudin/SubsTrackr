/**
 * Jest Configuration for React (Vite project)
 */
export default {
  testEnvironment: "jsdom",

  transform: {
    "^.+\\.[jt]sx?$": "babel-jest",
  },

  moduleFileExtensions: ["js", "jsx"],

  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],

  /**
   * Ignore CSS imports
   */
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy",
  },
};
