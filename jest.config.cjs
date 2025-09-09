/**
 * Jest configuration for the cryptocurrency dashboard project.
 * @module JestConfig
 */

// Configuration Section
// --------------------
module.exports = {
  // Set the test environment to jsdom for simulating a browser environment
  testEnvironment: "jsdom",

  // Specify setup files to run after the test environment is set up
  setupFilesAfterEnv: ["<rootDir>/src/setupTests.js"],

  // Define transformations for JavaScript and JSX files using babel-jest
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },

  // Configure transformation to include specific node_modules (e.g., msw for mocking)
  transformIgnorePatterns: ["/node_modules/(?!msw)/"],

  // Map non-JavaScript assets (e.g., CSS files) to a mock file for testing
  moduleNameMapper: {
    "\\.(css|less|scss|sass)$": "<rootDir>/src/__tests__/fileMock.js",
  },

  // Ignore specific paths during test execution
  testPathIgnorePatterns: ["/node_modules/", "/__mocks__/"], // Ignore node_modules and mock directories
};