/* jest-dom adds custom jest matchers for asserting on DOM nodes.
   learn more: https://github.com/testing-library/jest-dom */
import '@testing-library/jest-dom';

// Provide crypto.randomUUID fallback for test environment if missing
if (typeof global.crypto === "undefined") {
  global.crypto = {};
}
if (typeof global.crypto.randomUUID !== "function") {
  global.crypto.randomUUID = () =>
    `${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${Math.random().toString(36).slice(2, 10)}`;
}
