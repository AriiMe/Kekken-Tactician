import ReactDOM from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';
import { PageDataContext } from './context/PageDataContext';
import App from "./App.jsx";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { CombinedProvider } from "./context/CombinedProvider";

import "./index.css";

const seed = document.getElementById('page-data');
const pageData = seed ? JSON.parse(seed.textContent) : null;

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter><PageDataContext.Provider value={pageData}><CombinedProvider>
    <App />
    <Analytics />
    <SpeedInsights />
  </CombinedProvider></PageDataContext.Provider></BrowserRouter>
);
