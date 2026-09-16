import  { useState } from "react";
import renderInputImage from "../utils/renderInputImage";
import { v4 as uuidv4 } from "uuid";
import "./Punishers.css";
import CollapsableSection from "./CollapsableSection";
import PropTypes from "prop-types";

const Punishers = ({ punishers }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="combo-section punishers">

      <CollapsableSection
        title="Punishers"
        toggleState={isCollapsed}
        collapseFn={toggleCollapse}
      >
        <ul>
          {punishers.startup.map((punish) => (
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

Punishers.propTypes = {
  punishers: PropTypes.shape({
    startup: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  name: PropTypes.string.isRequired,
};

export default Punishers;
