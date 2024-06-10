import { useEffect, useState } from "react";

const useFrameInput = () => {
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [keyDurations, setKeyDurations] = useState({});
  const [neutralFrames, setNeutralFrames] = useState(0);

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      if (!pressedKeys.has(key)) {
        setPressedKeys((prev) => new Set(prev.add(key)));
        setKeyDurations((prev) => ({ ...prev, [key]: 0 }));
      }
      setNeutralFrames(0); // Reset neutral frames when a key is pressed
    };

    const handleKeyUp = (event) => {
      const key = event.key;
      if (pressedKeys.has(key)) {
        setPressedKeys((prev) => {
          const newPressedKeys = new Set(prev);
          newPressedKeys.delete(key);
          return newPressedKeys;
        });
      }
    };

    const interval = setInterval(() => {
      const updatedKeyDurations = {};
      pressedKeys.forEach((key) => {
        updatedKeyDurations[key] = Math.min(keyDurations[key] + 1, 999); // Limit to 999 frames
      });
      setKeyDurations(updatedKeyDurations);

      setNeutralFrames((prev) => Math.min(prev + 1, 999)); // Limit to 999 frames
    }, 1000 / 60); // 60 FPS

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
      clearInterval(interval);
    };
  }, [pressedKeys, keyDurations]);

  return {
    keyDurations,
    neutralFrames,
  };
};

export default useFrameInput;
