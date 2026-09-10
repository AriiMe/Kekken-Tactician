/* eslint-disable react-refresh/only-export-components */
import { useState, createContext, useContext, useEffect } from "react";
import PropTypes from "prop-types";

const DEFAULT_DISPLAY_MODE = "icons";
const VALID_DISPLAY_MODES = new Set(["icons", "notations"]);

const readDisplayMode = () => {
  try {
    const savedMode = JSON.parse(localStorage.getItem("displayMode"));
    return VALID_DISPLAY_MODES.has(savedMode)
      ? savedMode
      : DEFAULT_DISPLAY_MODE;
  } catch {
    return DEFAULT_DISPLAY_MODE;
  }
};

const saveDisplayMode = (displayMode) => {
  try {
    localStorage.setItem("displayMode", JSON.stringify(displayMode));
  } catch {
    // Preferences remain usable for this session when storage is unavailable.
  }
};

export const DisplayModeContext = createContext();

export const DisplayModeProvider = ({ children }) => {
  const [displayMode, setDisplayMode] = useState(readDisplayMode);

  useEffect(() => {
    saveDisplayMode(displayMode);
  }, [displayMode]);

  return (
    <DisplayModeContext.Provider value={{ displayMode, setDisplayMode }}>
      {children}
    </DisplayModeContext.Provider>
  );
};

DisplayModeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useDisplayMode = () => useContext(DisplayModeContext);
