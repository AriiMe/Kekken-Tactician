import { useState } from "react";
import renderInputImage from "../utils/renderInputImage";

import "./MiniCombo.css";
import CollapsableSection from "./CollapsableSection";
import PropTypes from "prop-types";

const MiniCombo = ({ miniCombo }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Group moves by their shared followUps
  const groupedMoves = miniCombo.reduce((acc, combo) => {
    acc[combo.followUp] = [...(acc[combo.followUp] || []), combo.move];
    return acc;
  }, {});

  return (
    <div className="combo-section guaranteed-follow-ups">

      <CollapsableSection
        title="Mini Combos"
        toggleState={isCollapsed}
        collapseFn={toggleCollapse}
      >
        <div className="combo-container">
          {Object.entries(groupedMoves).map(([followUp, moves], index) => (
            <div key={index} className="combo-group">
              <div className="move-column">
                <h5>Move(s)</h5>
                {moves.map((move, moveIndex) => (
                  <div key={moveIndex} className="move">
                    {renderInputImage(move)}
                  </div>
                ))}
              </div>
              <div className="follow-up-column">
                <h5>Follow-up(s)</h5>
                {followUp.split("-").map((followUp, idx) => (
                  <div className="follow-up" key={idx}>
                    {renderInputImage(followUp)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CollapsableSection>
    </div>
  );
};

MiniCombo.propTypes = {
  miniCombo: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
};

export default MiniCombo;
