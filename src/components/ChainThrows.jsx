import React, { useState } from "react";
import { Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import renderInputImage from "../utils/renderInputImage";
import { Helmet } from "react-helmet";
import "./ChainThrows.css";

const ChainThrows = ({ chainThrows, name }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const description = `Chain Throws for ${name} in Tekken 8. These are the most important Chain Throws to learn for ${name} and how to break them.`;

  const keywords = [
    "Tekken-8",
    "How to break throws",
    "Break King Throws tekken",
    "Tekken 8 Chain Throws",
    "Counter King Chain Throws",
    `${name}-combos`,
    `${name}-throws`,
    `${name}-throw-break`,
    `${name}-chain-throws`,
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
    `Tekken-8-${name}-chain-throws`,
    `Tekken-8-${name}-grab-combos`,
  ].join(", ");

  return (
    <div className="chain-combos">
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
      <h2>Chain Throws</h2>

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
      </div>
    </div>
  );
};

export default ChainThrows;
