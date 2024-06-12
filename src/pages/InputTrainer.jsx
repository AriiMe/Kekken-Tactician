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
  const [inputHistory, setInputHistory] = useState([]);

  const frameData = useFrameInput(defaultKeys);
  const { keyFrames, neutralFrames, id } = frameData;

  console.log("frameData", frameData);

  useEffect(() => {
    // Check for new move or changes in existing move only when id changes
    if (id) {
      setInputHistory((prevHistory) => {
        const existingEntryIndex = prevHistory.findIndex(
          (entry) => entry.id === id
        );

        if (existingEntryIndex !== -1) {
          // Update existing entry
          const updatedHistory = [...prevHistory];
          updatedHistory[existingEntryIndex] = frameData;
          return updatedHistory;
        } else {
          // Add new entry
          return [...prevHistory, frameData];
        }
      });
    }
  }, [id, frameData]);

  return (
    <div>
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
          overflowX: "scroll",
        }}
      >
        {inputHistory.map((input, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            {input.keyFrames.map((keyframe, idx) => (
              <div key={idx}>{renderInputImage(keyframe.notationName)}</div>
            ))}
          </div>
        ))}
      </div>
      <div>---------------</div>
      <div>{keyFrames[0] && renderInputImage(keyFrames[0].notationName)}</div>
      <div>{keyFrames[0] && keyFrames[0].frames}</div>
    </div>
  );
};

export default InputTrainer;
