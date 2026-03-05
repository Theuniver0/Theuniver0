import React from "react";
import { createRoot } from "react-dom/client";
import CalisthenicsApp from "../CalisthenicsApp.jsx";

// Polyfill window.storage with localStorage for browser environments
if (!window.storage) {
  window.storage = {
    async get(key) {
      try {
        return localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    async set(key, value) {
      try {
        if (value === null || value === undefined) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, value);
        }
      } catch {}
    },
  };
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CalisthenicsApp />
  </React.StrictMode>
);
