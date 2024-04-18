import React from "react";
import renderInputImage from "../utils/renderInputImage";
import { v4 as uuidv4 } from "uuid";
import "./Punishers.css";

const Punishers = ({ punishers }) => {
  console.log("punish", punishers);
  return (
    <div className="combo-section">
      <h2>Punishers</h2>
      <ul>
        {punishers.startup.map((punish, index) => (
          <li key={uuidv4()} className="my-li">
            <span className="bit-of-space">
              {renderInputImage(punish.move)}{" "}
              <span className="escape-label">Frames: {punish.frames}</span>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Punishers;
