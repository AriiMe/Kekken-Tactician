import React from "react";
import renderInputImage from "../utils/renderInputImage";

import { Helmet } from "react-helmet";
import "./MiniCombo.css";

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
  // Group moves by their shared followUps
  const groupedMoves = miniCombo.reduce((acc, combo) => {
    acc[combo.followUp] = [...(acc[combo.followUp] || []), combo.move];
    return acc;
  }, {});

  return (
    <div className="combo-section guaranteed-follow-ups">
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
      <h2>Mini Combos</h2>
      <div className="combo-container">
        {Object.entries(groupedMoves).map(([followUp, moves], index) => (
          <div key={index} className="combo-group">
            <div className="move-column">
              <h3>Move(s)</h3>
              {moves.map((move, moveIndex) => (
                <div key={moveIndex} className="move">
                  {renderInputImage(move)}
                </div>
              ))}
            </div>
            <div className="follow-up-column">
              <h3>Follow-up</h3>
              {followUp.split("-").map((followUp, idx) => (
                <div className="follow-up" key={idx}>
                  {renderInputImage(followUp)}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MiniCombo;
