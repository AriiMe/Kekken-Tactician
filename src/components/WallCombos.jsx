import { useState } from "react";
import { Grid } from "@mui/material";
import renderInputImage from "../utils/renderInputImage";
import "./WallCombos.css";
import CollapsableSection from "./CollapsableSection";
import PropTypes from "prop-types";

const WallCombos = ({ wallCombos }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };


  if (!wallCombos) {
    return <div>Loading...</div>;
  }
  return (
    <div className="wall-combos">

      <CollapsableSection
        title="Wall Combos"
        toggleState={isCollapsed}
        collapseFn={toggleCollapse}
      >
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <div className="combo-section">
              <h3>General</h3>
              {wallCombos.general.map((combo, index) => (
                <div key={combo._id || `general-${index}`} className="combo">
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
              {wallCombos.withTornado.map((combo, index) => (
                <div key={combo._id || `tornado-${index}`} className="combo">
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
      </CollapsableSection>
    </div>
  );
};

WallCombos.propTypes = {
  wallCombos: PropTypes.shape({
    general: PropTypes.arrayOf(PropTypes.object).isRequired,
    withTornado: PropTypes.arrayOf(PropTypes.object).isRequired,
  }),
  name: PropTypes.string.isRequired,
};

export default WallCombos;
