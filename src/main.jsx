import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { CombinedProvider } from "./context/CombinedProvider";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <CombinedProvider>
    <App />
    <Analytics />
    <SpeedInsights />
  </CombinedProvider>
);
