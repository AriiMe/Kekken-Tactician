import React, { useState } from "react";
import renderInputImage from "../utils/renderInputImage";
import { Helmet } from "react-helmet";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "./HeatEngagers.css";

const HeatEngagers = ({ heat, name }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

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
      <div style={{ marginBottom: "10px" }}>
        <IconButton onClick={toggleCollapse}>
          {isCollapsed ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </div>

      <div
        style={{
          transition: "width 0.3s",
          overflowX: "auto",
          display: isCollapsed ? "none" : "block",
        }}
      >
        <ul>
          {heat.map((het, index) => (
            <li key={index} className="my-li">
              <div
                className="heat-engager-move"
                style={{
                  marginBottom: "18px",
                }}
              >
                {renderInputImage(het.move)}
              </div>
              <div>{het.description}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HeatEngagers;
