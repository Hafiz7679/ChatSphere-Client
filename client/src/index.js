import { Toaster } from "react-hot-toast";
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          borderRadius: "12px",
          background: "#1e293b",
          color: "#f1f5f9",
          fontSize: "14px",
        },
        success: {
          iconTheme: { primary: "#22c55e", secondary: "#fff" },
        },
        error: {
          iconTheme: { primary: "#ef4444", secondary: "#fff" },
        },
      }}
    />
    <App />
  </BrowserRouter>
);
