import { useState } from "react";
import renderInputImage from "../utils/renderInputImage";
import { Helmet } from "react-helmet";
import "./HeatEngagers.css";
import CollapsableSection from "./CollapsableSection";

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

export default HeatEngagers;
