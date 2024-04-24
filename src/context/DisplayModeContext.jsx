import React, { useState, createContext, useContext, useEffect } from "react";

export const DisplayModeContext = createContext();

export const DisplayModeProvider = ({ children }) => {
  const [displayMode, setDisplayMode] = useState(() => {
    // Read from local storage and parse or use a default value
    const savedMode = localStorage.getItem("displayMode");
    return savedMode ? JSON.parse(savedMode) : "icons";
  });

  useEffect(() => {
    localStorage.setItem("displayMode", JSON.stringify(displayMode));
  }, [displayMode]);

  return (
    <DisplayModeContext.Provider value={{ displayMode, setDisplayMode }}>
      {children}
    </DisplayModeContext.Provider>
  );
};

export const useDisplayMode = () => useContext(DisplayModeContext);
