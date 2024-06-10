import React, { useEffect, useState, useRef } from "react";
import { Howl } from "howler";
import renderInputImage from "../utils/renderInputImage";
import useFrameInput from "../hooks/useFrameInput";

const sounds = {
  u: new Howl({ src: ["/input-sounds/u.mp3"] }),
  d: new Howl({ src: ["/input-sounds/d.mp3"] }),
  b: new Howl({ src: ["/input-sounds/b.mp3"] }),
  f: new Howl({ src: ["/input-sounds/f.mp3"] }),
  1: new Howl({ src: ["/input-sounds/1.mp3"] }),
  2: new Howl({ src: ["/input-sounds/2.mp3"] }),
  3: new Howl({ src: ["/input-sounds/3.mp3"] }),
  4: new Howl({ src: ["/input-sounds/4.mp3"] }),
};

// const defaultKeys = {
//   up: "ArrowUp",
//   down: "ArrowDown",
//   left: "ArrowLeft",
//   right: "ArrowRight",
//   button1: "1",
//   button2: "2",
//   button3: "3",
//   button4: "4",
// };
const defaultKeys = {
  up: { type: "movement", keyName: "ArrowUp", notationName: "u" },
  down: { type: "movement", keyName: "ArrowDown", notationName: "d" },
  left: { type: "movement", keyName: "ArrowLeft", notationName: "b" },
  right: { type: "movement", keyName: "ArrowRight", notationName: "f" },
  button1: { type: "attack", keyName: "1", notationName: "1" },
  button2: { type: "attack", keyName: "2", notationName: "2" },
  button3: { type: "attack", keyName: "3", notationName: "3" },
  button4: { type: "attack", keyName: "4", notationName: "4" },
};

const directionMap = {
  ArrowUp: "u",
  ArrowDown: "d",
  ArrowLeft: "b",
  ArrowRight: "f",
};

const buttonMap = {
  1: "1",
  2: "2",
  3: "3",
  4: "4",
};

const gamepadButtonMap = {
  12: "u",
  13: "d",
  14: "b",
  15: "f",
  0: "1",
  3: "2",
  1: "3",
  2: "4",
};

const COMBINATION_THRESHOLD = 20; // milliseconds

const InputTrainer = () => {
  // const [gamepadIndex, setGamepadIndex] = useState(null);
  // const [keys, setKeys] = useState(defaultKeys);
  // const [pressedKeys, setPressedKeys] = useState({});
  const [inputHistory, setInputHistory] = useState([]);
  // const [currentCombination, setCurrentCombination] = useState("");
  // const [lastKeyPressTime, setLastKeyPressTime] = useState(Date.now());
  // const [inputQueue, setInputQueue] = useState([]);
  // const [frameCounter, setFrameCounter] = useState(0);
  // const frameRequestRef = useRef();

  const frameData = useFrameInput(defaultKeys);
  const { keyFrames, neutralFrames, id } = frameData;

  // console.log(inputHistory);

  useEffect(() => {
    // Check for new move or changes in existing move only when id changes
    if (id) {
      const existingEntry = inputHistory.find((entry) => entry.id === id);

      if (!existingEntry) {
        setInputHistory((prevHistory) => [...prevHistory, frameData]);
      }
    }
  }, [id, frameData]);

  // useEffect(() => {
  //   const savedKeys = localStorage.getItem("inputTrainerKeys");
  //   if (savedKeys) {
  //     setKeys(JSON.parse(savedKeys));
  //   }
  // }, []);

  // const playSound = (sound) => {
  //   if (sounds[sound]) {
  //     sounds[sound].stop();
  //     sounds[sound].play();
  //   }
  // };

  // const updateInputHistory = (input) => {
  //   setInputHistory((prev) => {
  //     const newHistory = [input, ...prev];
  //     return newHistory.length > 10 ? newHistory.slice(0, 10) : newHistory;
  //   });
  // };

  // const sortCombination = (combination) => {
  //   const directionals = combination
  //     .filter((input) => "udbf".includes(input))
  //     .sort((a, b) => {
  //       const order = {
  //         u: 1,
  //         d: 2,
  //         b: 3,
  //         f: 4,
  //       };
  //       return order[a] - order[b];
  //     });
  //   const buttons = combination
  //     .filter((input) => "1234".includes(input))
  //     .sort();

  //   const sortedCombination = [
  //     ...directionals.join(""), // Join directionals without plus sign
  //     ...buttons.join("+"), // Join buttons with plus sign
  //   ];

  //   return sortedCombination.join("");
  // };

  // const handleKeyPress = (event) => {
  //   const { key } = event;
  //   if (pressedKeys[key]) return; // If key is already pressed, do nothing

  //   const direction = directionMap[key];
  //   const button = buttonMap[key];
  //   const currentTime = Date.now();
  //   const timeSinceLastPress = currentTime - lastKeyPressTime;
  //   let newCombination = currentCombination
  //     ? currentCombination.split("+")
  //     : [];

  //   if (direction || button) {
  //     if (timeSinceLastPress <= COMBINATION_THRESHOLD) {
  //       if (direction) {
  //         newCombination.push(direction);
  //       } else if (button) {
  //         newCombination.push(button);
  //       }
  //     } else {
  //       if (currentCombination) {
  //         updateInputHistory(currentCombination);
  //       }
  //       newCombination = direction ? [direction] : [button];
  //     }
  //   }

  //   setPressedKeys((prev) => ({ ...prev, [key]: true })); // Mark key as pressed
  //   setCurrentCombination(sortCombination(newCombination));
  //   setLastKeyPressTime(currentTime);

  //   if (direction) {
  //     playSound(direction);
  //   } else if (button) {
  //     playSound(button);
  //   }
  // };

  // const handleKeyRelease = (event) => {
  //   const { key } = event;
  //   setPressedKeys((prev) => {
  //     const newPressedKeys = { ...prev };
  //     delete newPressedKeys[key];
  //     return newPressedKeys;
  //   }); // Mark key as released

  //   // Only update history and reset combination if not part of an ongoing combination
  //   const currentTime = Date.now();
  //   const timeSinceLastPress = currentTime - lastKeyPressTime;
  //   if (timeSinceLastPress > COMBINATION_THRESHOLD) {
  //     if (currentCombination) {
  //       updateInputHistory(currentCombination);
  //       setCurrentCombination("");
  //     }
  //   }
  // };

  // const handleInputChange = (e) => {
  //   const { name, value } = e.target;
  //   setKeys((prevKeys) => {
  //     const newKeys = { ...prevKeys, [name]: value };
  //     localStorage.setItem("inputTrainerKeys", JSON.stringify(newKeys));
  //     return newKeys;
  //   });
  // };

  // const handleGamepadInput = () => {
  //   const gamepads = navigator.getGamepads();
  //   if (gamepads[gamepadIndex]) {
  //     const gp = gamepads[gamepadIndex];
  //     gp.buttons.forEach((button, index) => {
  //       if (button.pressed && !pressedKeys[index]) {
  //         setPressedKeys((prev) => ({ ...prev, [index]: true }));
  //         const input = gamepadButtonMap[index];
  //         if (input) {
  //           playSound(input);
  //           const newCombination = currentCombination
  //             ? currentCombination.split("+").concat(input)
  //             : [input];
  //           const sortedCombination = sortCombination(newCombination);
  //           setCurrentCombination(sortedCombination);
  //         }
  //       } else if (!button.pressed && pressedKeys[index]) {
  //         setPressedKeys((prev) => {
  //           const newPressedKeys = { ...prev };
  //           delete newPressedKeys[index];
  //           return newPressedKeys;
  //         });
  //       }
  //     });

  //     if (currentCombination) {
  //       updateInputHistory(currentCombination);
  //       setCurrentCombination("");
  //     }
  //   }
  // };

  // const updateFrameCounter = () => {
  //   setFrameCounter((prev) => (prev < 999 ? prev + 1 : 999));
  // };

  // const animate = () => {
  //   updateFrameCounter();
  //   if (gamepadIndex !== null) {
  //     handleGamepadInput();
  //   }
  //   frameRequestRef.current = requestAnimationFrame(animate);
  // };

  // useEffect(() => {
  //   frameRequestRef.current = requestAnimationFrame(animate);
  //   return () => cancelAnimationFrame(frameRequestRef.current);
  // }, [gamepadIndex, pressedKeys, currentCombination]);

  // useEffect(() => {
  //   window.addEventListener("keydown", handleKeyPress);
  //   window.addEventListener("keyup", handleKeyRelease);

  //   return () => {
  //     window.removeEventListener("keydown", handleKeyPress);
  //     window.removeEventListener("keyup", handleKeyRelease);
  //   };
  // }, [keys, pressedKeys, currentCombination]);

  // useEffect(() => {
  //   const connectHandler = (e) => {
  //     setGamepadIndex(e.gamepad.index);
  //   };

  //   const disconnectHandler = () => {
  //     setGamepadIndex(null);
  //   };

  //   window.addEventListener("gamepadconnected", connectHandler);
  //   window.addEventListener("gamepaddisconnected", disconnectHandler);

  //   return () => {
  //     window.removeEventListener("gamepadconnected", connectHandler);
  //     window.removeEventListener("gamepaddisconnected", disconnectHandler);
  //   };
  // }, []);

  return (
    <div>
      {/* <h1>Input Trainer</h1>
      <p>Press arrow keys, 1-4, or use your gamepad to play sounds</p>
      <div>
        <strong>Frame Counter:</strong> {frameCounter}
      </div>
      <form>
        <div>
          <label>
            Up:
            <input
              type="text"
              name="up"
              value={keys.up}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Down:
            <input
              type="text"
              name="down"
              value={keys.down}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Left:
            <input
              type="text"
              name="left"
              value={keys.left}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Right:
            <input
              type="text"
              name="right"
              value={keys.right}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Button 1:
            <input
              type="text"
              name="button1"
              value={keys.button1}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Button 2:
            <input
              type="text"
              name="button2"
              value={keys.button2}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Button 3:
            <input
              type="text"
              name="button3"
              value={keys.button3}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Button 4:
            <input
              type="text"
              name="button4"
              value={keys.button4}
              onChange={handleInputChange}
            />
          </label>
        </div>
      </form> */}

      <div style={{ marginTop: "10rem" }}>
        {Object.keys(keyFrames).map((key) => (
          <div key={key}>
            Key: {key}, Pressed for: {keyFrames[key].frames} frames, Notation:{" "}
            {keyFrames[key].notationName}
          </div>
        ))}
        <div>Neutral frames: {neutralFrames}</div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "50%",
          marginTop: "20px",
        }}
      >
        {inputHistory.map((input, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            {input.neutralFrames !== 0
              ? "n"
              : input.keyFrames.map((keyframe, idx) => (
                  <div key={idx}>
                    <div>{console.log(keyframe)}</div>
                    {renderInputImage(keyframe.notationName)}
                  </div>
                ))}
          </div>
        ))}
      </div>
      {/* <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          width: "50%",
          marginTop: "20px",
        }}
      >
        {inputHistory.map((input, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            {renderInputImage(input)}
          </div>
        ))}
      </div> */}
    </div>
  );
};

export default InputTrainer;
