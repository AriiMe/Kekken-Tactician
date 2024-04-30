import React, { useState, useEffect } from "react";
import tips from "../utils/useless";

function RandomTip() {
  const [currentTip, setCurrentTip] = useState("");

  useEffect(() => {
    setCurrentTip(getRandomTip());
  }, []);

  const getRandomTip = () => {
    const randomIndex = Math.floor(Math.random() * tips.length);
    return tips[randomIndex];
  };

  const handleClick = () => {
    setCurrentTip(getRandomTip());
  };

  return (
    <p onClick={handleClick} style={{ cursor: "pointer" }}>
      {currentTip}
    </p>
  );
}

export default RandomTip;
