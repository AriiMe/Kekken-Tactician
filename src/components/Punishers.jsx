import  { useState } from "react";
import renderInputImage from "../utils/renderInputImage";
import { v4 as uuidv4 } from "uuid";
import { Helmet } from "react-helmet";
import "./Punishers.css";
import CollapsableSection from "./CollapsableSection";

const Punishers = ({ punishers, name }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const description = `Punishers for ${name} in Tekken 8. These are the most important punishers to learn for ${name}.Punishers and their frames.`;
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
    `Tekken8 ${name} Punishers`,
    `Tekken8 ${name} Punish frames`,
    `Tekken8 ${name} Frame Data`,
  ].join(", ");
  return (
    <div className="combo-section punishers">
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>

      <CollapsableSection
        title="Punishers"
        toggleState={isCollapsed}
        collapseFn={toggleCollapse}
      >
        <ul>
          {punishers.startup.map((punish, index) => (
            <li key={uuidv4()} className="my-li punisher-li">
              <span>{renderInputImage(punish.move)} </span>
              <span
                className="escape-label"
                style={{
                  fontSize: ".75rem",
                  textAlign: "right",
                  minWidth: "50%",
                }}
              >
                Frames: {punish.frames}
              </span>
            </li>
          ))}
        </ul>
      </CollapsableSection>
    </div>
  );
};

export default Punishers;
