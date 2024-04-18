import React from "react";
import renderInputImage from "../utils/renderInputImage";
import { Helmet } from "react-helmet";

const MiniCombo = ({ miniCombo, name }) => {
  const description = `Mini Combos for ${name} in Tekken 8. These are quick follow-ups to certain moves that guarantee a hit.`;
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
    `Tekken8 ${name} Guaranteed follow-ups`,
    `Tekken8 ${name} Mini Combos`,
  ].join(", ");
  return (
    <div className="combo-section guaranteed-follow-ups">
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
      <h2>Mini Combos</h2>
      <ul>
        {miniCombo.map((combo, index) => (
          <li key={index} className="my-li bit-of-space">
            {renderInputImage(combo.move)} - {renderInputImage(combo.followUp)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MiniCombo;
