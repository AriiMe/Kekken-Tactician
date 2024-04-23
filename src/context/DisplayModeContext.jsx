import React, { useState, createContext, useContext, useEffect } from "react";

export const DisplayModeContext = createContext();

export const DisplayModeProvider = ({ children }) => {
  const [displayMode, setDisplayMode] = useState("icons");

  return (
    <DisplayModeContext.Provider value={{ displayMode, setDisplayMode }}>
      {children}
    </DisplayModeContext.Provider>
  );
};

export const useDisplayMode = () => useContext(DisplayModeContext);
