import { useState } from "react";
import renderInputImage from "../utils/renderInputImage";
import "./HeatEngagers.css";
import CollapsableSection from "./CollapsableSection";
import PropTypes from "prop-types";

const HeatEngagers = ({ heat }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="combo-section heat-engagers">

      <CollapsableSection
        title="Heat Engagers"
        toggleState={isCollapsed}
        collapseFn={toggleCollapse}
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
              <div style={{ fontSize: ".85rem", lineHeight: "1.5" }}>
                {het.description}
              </div>
            </li>
          ))}
        </ul>
      </CollapsableSection>
    </div>
  );
};

HeatEngagers.propTypes = {
  heat: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
};

export default HeatEngagers;
