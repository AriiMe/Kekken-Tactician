import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { CombinedProvider } from "./context/CombinedProvider"; // Updated import

ReactDOM.createRoot(document.getElementById("root")).render(
  <CombinedProvider>
    <App />
  </CombinedProvider>
);
