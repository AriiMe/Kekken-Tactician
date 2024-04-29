import React from "react";
import { DisplayModeProvider } from "./DisplayModeContext";
import { ColorModeProvider } from "./ColorModeContext"; // Import the ColorModeProvider
import { ThemeProvider } from "@mui/material/styles";
import tekkenTheme from "../theme/theme.js";

export const CombinedProvider = ({ children }) => {
  return (
    <DisplayModeProvider>
      <ColorModeProvider>
        <ThemeProvider theme={tekkenTheme}>{children}</ThemeProvider>
      </ColorModeProvider>
    </DisplayModeProvider>
  );
};
