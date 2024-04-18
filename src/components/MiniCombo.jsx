import React from "react";
import renderInputImage from "../utils/renderInputImage";

const MiniCombo = ({ miniCombo }) => {
  return (
    <div className="combo-section guaranteed-follow-ups">
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
