import React, { useState } from "react";
import { Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import renderInputImage from "../utils/renderInputImage";
import { Helmet } from "react-helmet";
import "./WallCombos.css";

const WallCombos = ({ wallCombos, name }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const description = `Wall Combos for ${name} in Tekken 8. These are the most important wall combos to learn for ${name}. Wall combos and their follow-ups.`;

  const keywords = [
    "Tekken-8",
    `${name}-combos`,
    `${name}-Heat-dash`,
    `${name}-Heat-flop`,
    "Tekken-8-Punishers",
    "Tekken-8-Heat-Flop",
    "Tekken-8-Heat-Dash",
    "Tekken-8-frame-data",
    "Tekken-8-character-specific-data",
    "Tekken-8-guide",
    "Tekken-8-tutorial",
    "Tekken-8-cheat-sheet",
    `Tekken-8-${name}-combos`,
    `Tekken-8-${name}-cheat-sheet`,
    `Tekken-8-${name}-tutorial`,
    `Tekken-8-${name}-guide`,
    `Tekken-8-${name}-wall-combos`,
  ].join(", ");
  if (!wallCombos) {
    return <div>Loading...</div>;
  }
  return (
    <div className="wall-combos">
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
      <h2>Wall Combos</h2>

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
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div className="combo-section">
              <h3>General</h3>
              {wallCombos.general.map((combo) => (
                <div key={combo._id} className="combo">
                  <div className="wall-move">
                    <div className="label">Move:</div>
                    <div className="icons-row">
                      {renderInputImage(combo.move)}
                    </div>
                  </div>
                  <div className="wall-follow-up">
                    <div className="label">Follow-Up:</div>
                    <div className="icons-row">
                      {renderInputImage(combo.followUp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Grid>
          <Grid item xs={6}>
            <div className="combo-section">
              <h3>With Tornado</h3>
              {wallCombos.withTornado.map((combo) => (
                <div key={combo._id} className="combo">
                  <div className="wall-move">
                    <span className="label">Move:</span>
                    <div className="icons-row">
                      {renderInputImage(combo.move)}
                    </div>
                  </div>
                  <div className="wall-follow-up">
                    <span className="label">Follow-Up:</span>
                    <div className="icons-row">
                      {renderInputImage(combo.followUp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Grid>
        </Grid>
      </div>
    </div>
  );
};

export default WallCombos;
