import React from "react";
import renderInputImage from "../utils/renderInputImage";
import { Helmet } from "react-helmet";
import "./HeatEngagers.css";

const HeatEngagers = ({ heat, name }) => {
  const description = `Every Heat move available for ${name} in Tekken 8.`;
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
  ].join(", ");
  return (
    <div className="combo-section heat-engagers">
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
      <h2>Heat Engagers</h2>
      <ul>
        {heat.map((het, index) => (
          <li key={index} className="my-li">
            <div style={{ marginBottom: "15px" }}>
              {renderInputImage(het.move)}
            </div>
            <div>{het.description}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeatEngagers;
