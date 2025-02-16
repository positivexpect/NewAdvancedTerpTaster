import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Ensure Tailwind is properly loaded
import App from "./App"; // Load the Router-based App.js
// Ensure the root element exists before rendering
const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found. Make sure you have <div id='root'></div> in index.html");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);