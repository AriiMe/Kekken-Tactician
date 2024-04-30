import React, { useState } from "react";
import renderInputImage from "../utils/renderInputImage";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "./ComboEnders.css";

const ComboEnders = ({ enders }) => {
  // Group enders by category
  const [isCollapsed, setIsCollapsed] = useState(false);

  const groupedEnders = enders.reduce((acc, ender) => {
    acc[ender.category] = [...(acc[ender.category] || []), ender];
    return acc;
  }, {});

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="combo-enders">
      <h2>Combo Enders</h2>
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
        <table className="combo-enders-table">
          <tbody>
            {Object.entries(groupedEnders).map(([category, moves], index) => (
              <React.Fragment key={category}>
                {moves.map((move, moveIndex) => (
                  <tr key={move._id}>
                    {moveIndex === 0 && (
                      <td className="category-cell" rowSpan={moves.length}>
                        {category}
                      </td>
                    )}
                    <td>
                      <div
                        className={`combo-ender-move ${
                          moveIndex === moves.length - 1 ? "last-move" : ""
                        }`}
                      >
                        <div className="combo-ender-move-content">
                          {renderInputImage(move.move)}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ComboEnders;
