import React, { useState } from "react";
import renderInputImage from "../utils/renderInputImage";
import { Helmet } from "react-helmet";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "./MostImportantGrabs.css";
import { Box } from "@mui/material";
import CollapsableTitle from "./CollapsableTitle";

const MostImportantGrabs = ({ grabs, name }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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
      
      <CollapsableTitle
        title="Important Grabs"
        toggleState={isCollapsed}
        collapseFn={toggleCollapse}
      />

      <div
        style={{
          transition: "width 0.3s",
          overflowX: "auto",
          display: isCollapsed ? "none" : "block",
        }}
      >
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
    </div>
  );
};

export default MostImportantGrabs;
