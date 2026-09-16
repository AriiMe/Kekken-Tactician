import React, { useState } from "react";
import PropTypes from "prop-types";
import renderInputImage from "../utils/renderInputImage";
import "./ChainThrows.css";
import CollapsableSection from "./CollapsableSection";

const ChainThrows = ({ chainThrows }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };



  return (
    <div className="chain-combos">

      <CollapsableSection
        title="Chain Throws"
        toggleState={isCollapsed}
        collapseFn={toggleCollapse}
      >
        <table className="chain-throws">
          <thead>
            <tr>
              <th className="launcher-header">Throw</th>
              <th className="follow-ups-header">Follow Up</th>
              <th className="simple-version-header">Simple</th>
            </tr>
          </thead>
          <tbody>
            {chainThrows.map((throwItem) => (
              <React.Fragment key={throwItem._id}>
                <tr>
                  <td colSpan="4" className="comboName">
                    {throwItem.name}
                  </td>
                </tr>
                <tr>
                  <td className="throwData">
                    {throwItem.throw.map((item, index) => (
                      <div key={index} className="sequenceBlock">
                        {renderInputImage(item)}
                        <div className="break">
                          Break:{" "}
                          {throwItem.throwBreak[index] &&
                            renderInputImage(throwItem.throwBreak[index])}
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="followUpData">
                    {throwItem.followUp.map((item, index, arr) => (
                      <div key={index} className="sequenceBlock">
                        {renderInputImage(item)}
                        {index < arr.length - 1 && (
                          <img
                            className="input-icons"
                            src="/icons-t8/into.png"
                            alt="into"
                          />
                        )}
                        <div className="break">
                          Break:{" "}
                          {throwItem.followUpBreak[index] ? (
                            renderInputImage(throwItem.followUpBreak[index])
                          ) : (
                            <span className="unbreakable">Unbreakable</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </td>
                  <td className="simpleInputData">
                    {throwItem.simpleInput.map((item, index, arr) => (
                      <div key={index} className="sequenceBlock">
                        {renderInputImage(item)}
                        {index < arr.length - 1 && (
                          <img
                            className="input-icons"
                            src="/icons-t8/into.png"
                            alt="into"
                          />
                        )}
                        <div className="break">
                          Break:{" "}
                          {throwItem.simpleBreak[index] ? (
                            renderInputImage(throwItem.simpleBreak[index])
                          ) : (
                            <span className="unbreakable">Unbreakable</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </CollapsableSection>
    </div>
  );
};

ChainThrows.propTypes = {
  chainThrows: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
};

export default ChainThrows;
