import React, { createContext, useState, useEffect, useContext } from "react";

// Create the context
export const ColorModeContext = createContext({
  colorMode: false,
  setColorMode: () => {},
});

// Provider component
export const ColorModeProvider = ({ children }) => {
  // Read the current color mode from local storage or default to false
  const [colorMode, setColorMode] = useState(
    () => JSON.parse(localStorage.getItem("colorMode")) || false
  );

  // Update local storage when colorMode changes
  useEffect(() => {
    localStorage.setItem("colorMode", JSON.stringify(colorMode));
  }, [colorMode]);

  return (
    <ColorModeContext.Provider value={{ colorMode, setColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);
