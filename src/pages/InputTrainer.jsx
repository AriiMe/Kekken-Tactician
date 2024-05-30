import React, { useEffect, useState } from "react";
import { Howl } from "howler";
import renderInputImage from "../utils/renderInputImage";

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

const defaultKeys = {
  up: "ArrowUp",
  down: "ArrowDown",
  left: "ArrowLeft",
  right: "ArrowRight",
  button1: "1",
  button2: "2",
  button3: "3",
  button4: "4",
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

const COMBINATION_THRESHOLD = 50; // Threshold in milliseconds
const COMBINATION_RESET_DELAY = 100; // Delay in milliseconds before resetting combination

const InputTrainer = () => {
  const [gamepadIndex, setGamepadIndex] = useState(null);
  const [keys, setKeys] = useState(defaultKeys);
  const [pressedKeys, setPressedKeys] = useState({});
  const [inputHistory, setInputHistory] = useState([]);
  const [currentCombination, setCurrentCombination] = useState("");
  const [lastKeyPressTime, setLastKeyPressTime] = useState(Date.now());
  const [combinationTimeout, setCombinationTimeout] = useState(null);

  useEffect(() => {
    const savedKeys = localStorage.getItem("inputTrainerKeys");
    if (savedKeys) {
      setKeys(JSON.parse(savedKeys));
    }
  }, []);

  const playSound = (sound) => {
    if (sounds[sound]) {
      sounds[sound].stop();
      sounds[sound].play();
    }
  };

  const updateInputHistory = (input) => {
    setInputHistory((prev) => {
      const newHistory = [input, ...prev];
      return newHistory.length > 10 ? newHistory.slice(0, 10) : newHistory;
    });
  };

  const remapCombination = (combination) => {
    const parts = combination.split("+").map(Number);
    parts.sort((a, b) => a - b);
    return parts.join("+");
  };

  const handleKeyPress = (event) => {
    const { key } = event;
    if (pressedKeys[key]) return; // If key is already pressed, do nothing

    const currentTime = Date.now();
    const isWithinThreshold =
      currentTime - lastKeyPressTime <= COMBINATION_THRESHOLD;
    const direction = directionMap[key];
    const button = buttonMap[key];
    let newCombination = "";

    if (direction) {
      if (isWithinThreshold && currentCombination) {
        newCombination = `${currentCombination}${direction}`
          .split("")
          .sort()
          .join("");
      } else {
        newCombination = direction;
      }
    } else if (button) {
      if (isWithinThreshold && currentCombination) {
        newCombination = remapCombination(`${currentCombination}+${button}`);
      } else {
        newCombination = button;
      }
    }

    setPressedKeys((prev) => ({ ...prev, [key]: true })); // Mark key as pressed
    setCurrentCombination(newCombination);
    setLastKeyPressTime(currentTime);

    if (direction) {
      playSound(direction);
    } else if (button) {
      playSound(button);
    }

    // Clear any existing timeout to reset the combination
    if (combinationTimeout) {
      clearTimeout(combinationTimeout);
    }
  };

  const handleKeyRelease = (event) => {
    const { key } = event;
    setPressedKeys((prev) => {
      const newPressedKeys = { ...prev };
      delete newPressedKeys[key];
      return newPressedKeys;
    }); // Mark key as released

    // Set a timeout to reset the combination after a short delay
    const timeout = setTimeout(() => {
      if (currentCombination) {
        let formattedCombination = currentCombination
          .split("+")
          .map((combo) => {
            // Correctly order the directional inputs
            if (
              combo.length === 2 &&
              "udfb".includes(combo[0]) &&
              "udfb".includes(combo[1])
            ) {
              const [first, second] = combo.split("");
              if (
                (first === "f" && second === "u") ||
                (first === "b" && second === "u") ||
                (first === "f" && second === "d") ||
                (first === "b" && second === "d")
              ) {
                return `${second}${first}`;
              }
            }
            // Correctly order numeric inputs
            if (combo.includes("+")) {
              return remapCombination(combo);
            }
            return combo;
          })
          .join("+");

        updateInputHistory(formattedCombination);
        setCurrentCombination(""); // Reset combination
      }
    }, COMBINATION_RESET_DELAY);

    setCombinationTimeout(timeout);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setKeys((prevKeys) => {
      const newKeys = { ...prevKeys, [name]: value };
      localStorage.setItem("inputTrainerKeys", JSON.stringify(newKeys));
      return newKeys;
    });
  };

  const handleGamepadInput = () => {
    const gamepads = navigator.getGamepads();
    if (gamepads[gamepadIndex]) {
      const gp = gamepads[gamepadIndex];
      gp.buttons.forEach((button, index) => {
        if (button.pressed) {
          if (!pressedKeys[index]) {
            setPressedKeys((prev) => ({ ...prev, [index]: true }));
            const input = gamepadButtonMap[index];
            if (input) {
              playSound(input);
              setCurrentCombination((prev) =>
                prev ? remapCombination(`${prev}+${input}`) : input
              );
            }
          }
        } else {
          setPressedKeys((prev) => ({ ...prev, [index]: false }));
        }
      });

      if (currentCombination) {
        let sortedCombination = currentCombination.split("+").sort((a, b) => {
          if (a.length === b.length) {
            return a.localeCompare(b);
          }
          if ("ud".includes(a) && "fb".includes(b)) {
            return -1;
          }
          if ("fb".includes(a) && "ud".includes(b)) {
            return 1;
          }
          return b.length - a.length;
        });

        // Correctly order the directional inputs
        if (sortedCombination.length === 2) {
          const [first, second] = sortedCombination;
          if (
            (first === "f" && second === "u") ||
            (first === "b" && second === "u") ||
            (first === "f" && second === "d") ||
            (first === "b" && second === "d")
          ) {
            sortedCombination = [second, first];
          }
        }

        // Join numeric inputs with "+" and directional inputs without "+"
        const formattedCombination = sortedCombination
          .map((input, index, arr) => {
            if (
              index > 0 &&
              "1234".includes(input) &&
              "1234".includes(arr[index - 1])
            ) {
              return `+${input}`;
            }
            return input;
          })
          .join("");

        updateInputHistory(formattedCombination);
        setCurrentCombination(""); // Reset combination
      }
    }
  };

  useEffect(() => {
    const connectHandler = (e) => {
      setGamepadIndex(e.gamepad.index);
    };

    const disconnectHandler = () => {
      setGamepadIndex(null);
    };

    window.addEventListener("gamepadconnected", connectHandler);
    window.addEventListener("gamepaddisconnected", disconnectHandler);

    return () => {
      window.removeEventListener("gamepadconnected", connectHandler);
      window.removeEventListener("gamepaddisconnected", disconnectHandler);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (gamepadIndex !== null) {
        handleGamepadInput();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gamepadIndex, pressedKeys, currentCombination]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keyup", handleKeyRelease);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
      window.removeEventListener("keyup", handleKeyRelease);
    };
  }, [keys, pressedKeys, currentCombination]);

  return (
    <div>
      <h1>Input Trainer</h1>
      <p>Press arrow keys, 1-4, or use your gamepad to play sounds</p>
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
      </form>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "20px",
          flexWrap: "wrap",
        }}
      >
        {inputHistory.map((input, index) => (
          <div key={index} style={{ margin: "5px" }}>
            {renderInputImage(input)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default InputTrainer;
