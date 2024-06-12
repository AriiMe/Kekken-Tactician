import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const useFrameInput = (inputDeclarations) => {
  const [moveId, setMoveId] = useState(() => uuidv4());
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [keyDurations, setKeyDurations] = useState({});
  const [neutralFrames, setNeutralFrames] = useState(0);
  const neutralFrameLimit = 120; // Maximum number of neutral frames
  let keyFrames = [];

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      if (
        Object.values(inputDeclarations).some((input) => input.keyName === key)
      ) {
        if (!pressedKeys.has(key)) {
          setPressedKeys((prev) => new Set(prev.add(key)));
          setKeyDurations((prev) => ({ ...prev, [key]: 0 }));
        }
        setNeutralFrames(0); // Reset neutral frames when a valid key is pressed
      }
    };

    const handleKeyUp = (event) => {
      const key = event.key;
      if (pressedKeys.has(key)) {
        setMoveId(uuidv4());
        setPressedKeys((prev) => {
          const newPressedKeys = new Set(prev);
          newPressedKeys.delete(key);
          return newPressedKeys;
        });
      }

      // If no keys are pressed after keyup, update neutral frames
      if (pressedKeys.size === 0) {
        setNeutralFrames((prev) => {
          if (prev < neutralFrameLimit) {
            return Math.min(prev + 1, neutralFrameLimit); // Limit to 120 frames if not reached yet
          }
          return prev; // Neutral frames already reached the limit, no change
        });
      }
    };

    const interval = setInterval(() => {
      if (neutralFrames >= neutralFrameLimit) {
        return; // Stop execution if neutral frames reach the limit
      }

      const updatedKeyDurations = {};
      pressedKeys.forEach((key) => {
        updatedKeyDurations[key] = Math.min((keyDurations[key] || 0) + 1, 400); // Limit to 400 frames
      });
      setKeyDurations(updatedKeyDurations);

      if (pressedKeys.size === 0) {
        setNeutralFrames((prev) => Math.min(prev + 1, neutralFrameLimit)); // Limit to 120 frames if no keys are pressed
      } else {
        setNeutralFrames(0); // Reset neutral frames if keys are pressed
      }
    }, 1000 / 60); // 60 FPS

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      clearInterval(interval);
    };
  }, [pressedKeys, neutralFrames]);

  const getInputDetails = (key) => {
    return (
      Object.values(inputDeclarations).find(
        (input) => input.keyName === key
      ) || { notationName: "n", type: "neutral" }
    ); // Return default if key is not found
  };

  Object.entries(keyDurations).forEach(([key, duration]) => {
    const inputDetails = getInputDetails(key);
    keyFrames.push({
      frames: duration,
      notationName: inputDetails.notationName,
      type: inputDetails.type,
      key,
    });
  });

  if (neutralFrames > 0) {
    keyFrames.push({
      frames: neutralFrames,
      key: "neutral",
      notationName: "n",
      type: "neutral",
    });
  }

  return {
    keyFrames,
    neutralFrames,
    id: moveId,
  };
};

export default useFrameInput;
