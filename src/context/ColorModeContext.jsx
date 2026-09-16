/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";

const readColorMode = () => {
  try {
    return JSON.parse(localStorage.getItem("colorMode")) === true;
  } catch {
    return false;
  }
};

const saveColorMode = (colorMode) => {
  try {
    localStorage.setItem("colorMode", JSON.stringify(colorMode));
  } catch {
    // Preferences remain usable for this session when storage is unavailable.
  }
};

// Create the context
export const ColorModeContext = createContext({
  colorMode: false,
  setColorMode: () => {},
});

// Provider component
export const ColorModeProvider = ({ children }) => {
  // Read the current color mode from local storage or default to false
  const [colorMode, setColorMode] = useState(readColorMode);

  // Update local storage when colorMode changes
  useEffect(() => {
    saveColorMode(colorMode);
  }, [colorMode]);

  return (
    <ColorModeContext.Provider value={{ colorMode, setColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};

ColorModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useColorMode = () => useContext(ColorModeContext);
