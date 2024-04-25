import React from "react";
import renderInputImage from "../utils/renderInputImage";
import { Helmet } from "react-helmet";
import "./HeatDash.css";

// heat dash explanation box

export const HeatDash = ({ heat, name }) => {
  const description = `Max Damage combo enders with Heat for ${name}, using the new Heat Flop mechanic from Tekken 8.`;
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
    <div className="heat-system combo-section">
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
      <h2>Max Damage combo enders with Heat</h2>
      <ul>
        <li className="my-li bit-of-space-around">
          {renderInputImage(heat.engager)}
          {renderInputImage("~F")}
          {renderInputImage(heat.ender)}
        </li>
      </ul>
    </div>
  );
};
