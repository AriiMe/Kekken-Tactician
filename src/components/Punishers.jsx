import React from "react";
import renderInputImage from "../utils/renderInputImage";
import { v4 as uuidv4 } from "uuid";
import { Helmet } from "react-helmet";
import "./Punishers.css";

const Punishers = ({ punishers, name }) => {
  const description = `Punishers for ${name} in Tekken 8. These are the most important punishers to learn for ${name}.Punishers and their frames.`;
  const keywords = [
    "Tekken 8",
    `${name} combos`,
    `${name} Heat dash`,
    `${name} Heat flop`,
    "Punishers",
    "Heat Flop",
    "Heat Dash",
    "Frame data",
    "Character-specific data",
    "Cheat Sheet",
    "Tekken 8 Cheat Sheet",
    `Tekken8 ${name} combos`,
    `Tekken8 ${name} Cheat Sheet`,
    `Tekken8 ${name} Punishers`,
    `Tekken8 ${name} Punish frames`,
    `Tekken8 ${name} Frame Data`,
  ].join(", ");
  return (
    <div className="combo-section">
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
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
