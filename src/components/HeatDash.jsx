import React from "react";
import renderInputImage from "../utils/renderInputImage";

// heat dash explanation box

export const HeatDash = ({ heat }) => {
  console.log("render", renderInputImage("~F"));
  return (
    <div className="heat-system combo-section">
      <h2>Max Damage combo enders with Heat</h2>
      <ul>
        <li className="my-li bit-of-space-around">
          {renderInputImage(heat.engager)}
          {renderInputImage("~F")} DASH {renderInputImage(heat.ender)}
        </li>
      </ul>
    </div>
  );
};
