import React from "react";
import renderInputImage from "../utils/renderInputImage";
import { Helmet } from "react-helmet";
import "./MostImportantGrabs.css";

const MostImportantGrabs = ({ grabs, name }) => {
  const description = `All main grabs and throws for ${name} in Tekken 8. These are the most important grabs to learn for ${name} and their escape inputs.`;
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
    `Tekken8 ${name} Grabs`,
    `Tekken8 ${name} Throws`,
    `Tekken8 ${name} escape throws`,
    `Tekken8 ${name} Throw inputs`,
    `Tekken8 ${name} Grab inputs`,
  ].join(", ");
  return (
    <div className="most-important-grabs">
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
      <h2>Important Grabs</h2>
      <ul>
        {grabs.map((grab, index) => (
          <li key={index} id="imp-grabs" className="my-li bit-of-space">
            <div className="grab-move">{renderInputImage(grab.move)}</div>
            <div className="escape-label">
              Escape: {renderInputImage(grab.escape)}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MostImportantGrabs;
