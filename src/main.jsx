import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { ThemeProvider } from "@mui/material/styles";
import { DisplayModeProvider } from "./context/DisplayModeContext";
import tekkenTheme from "./theme/theme.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <DisplayModeProvider>
    <ThemeProvider theme={tekkenTheme}>
      <App />
    </ThemeProvider>
  </DisplayModeProvider>
);
