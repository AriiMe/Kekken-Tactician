import React from "react";
import renderInputImage from "../utils/renderInputImage";

import "./MostImportantGrabs.css";

const MostImportantGrabs = ({ grabs }) => {
  return (
    <div className="most-important-grabs">
      <h2>Important Grabs</h2>
      <ul>
        {grabs.map((grab, index) => (
          <li key={index} className="my-li bit-of-space">
            <span className="grab-move">{renderInputImage(grab.move)}</span>
            <span className="escape-label">
              Escape: {renderInputImage(grab.escape)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MostImportantGrabs;
