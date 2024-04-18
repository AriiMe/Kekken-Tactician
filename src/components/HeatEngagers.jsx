import React from "react";
import renderInputImage from "../utils/renderInputImage";

const HeatEngagers = ({ heat }) => {
  return (
    <div className="combo-section heat-engagers">
      <h2>Heat Engagers</h2>
      <ul>
        {heat.map((het, index) => (
          <li key={index} className="my-li">
            {renderInputImage(het.move)} - {het.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HeatEngagers;
