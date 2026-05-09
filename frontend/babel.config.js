/**
 * Babel config for Jest
 * --------------------------------------------------
 * Enables React automatic runtime (no need import React)
 */
export default {
  presets: [
    ["@babel/preset-env", { targets: { node: "current" } }],
    ["@babel/preset-react", { runtime: "automatic" }],
  ],
};
