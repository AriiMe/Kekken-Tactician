import { useState } from "react";
import renderInputImage from "../utils/renderInputImage";
import "./MostImportantGrabs.css";
import CollapsableSection from "./CollapsableSection";
import PropTypes from "prop-types";

const MostImportantGrabs = ({ grabs }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="most-important-grabs">

      <CollapsableSection
        title="Important Grabs"
        toggleState={isCollapsed}
        collapseFn={toggleCollapse}
      >
        <ul>
          {grabs.map((grab, index) => (
            <li key={index} id="imp-grabs" className="my-li bit-of-space">
              <div className="grab-move">{renderInputImage(grab.move)}</div>
              <div className="escape-label">
                Escape: {renderInputImage(grab.escape)}
              </div>
            </li>
          ))}
        </ul>
      </CollapsableSection>
    </div>
  );
};

MostImportantGrabs.propTypes = {
  grabs: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
};

export default MostImportantGrabs;
