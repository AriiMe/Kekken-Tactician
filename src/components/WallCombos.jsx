import React from "react";
import { Grid } from "@mui/material";
import renderInputImage from "../utils/renderInputImage";
import "./WallCombos.css";

const WallCombos = ({ wallCombos }) => {
  console.log("here", wallCombos);
  if (!wallCombos) {
    return <div>Loading...</div>;
  }
  return (
    <div className="wall-combos">
      <h2>Wall Combos</h2>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <div className="combo-section">
            <h3>General</h3>
            {wallCombos.general.map((combo) => (
              <div key={combo._id} className="combo">
                <div>{renderInputImage(combo.move)}</div>
                <div>{renderInputImage(combo.followUp)}</div>
              </div>
            ))}
          </div>
        </Grid>
        <Grid item xs={6}>
          <div className="combo-section">
            <h3>With Tornado</h3>
            {wallCombos.withTornado.map((combo) => (
              <div key={combo._id} className="combo">
                <div>{renderInputImage(combo.move)}</div>
                <div>{renderInputImage(combo.followUp)}</div>
              </div>
            ))}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default WallCombos;
