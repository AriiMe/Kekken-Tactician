import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ReactPlayer from "react-player";
import renderInputImage from "../utils/renderInputImage";
import IconButton from "@mui/material/IconButton";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { Helmet } from "react-helmet";

import "./MainCombos.css";
import { useDisplayMode } from "../context/DisplayModeContext";

const MainCombos = ({ combos, name }) => {
  const { displayMode } = useDisplayMode();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [volume, setVolume] = useState(0.4);
  const displaySimpleCombo = (combo) => {
    // If there is no simple combo, just return "N/A"
    if (!combo.followUpSimple || combo.followUpSimple.length === 0) {
      return "N/A";
    }

    // Generate elements with separators for non-empty simple combos
    return combo.followUpSimple.map((item, index) => {
      // For the last element, don't add a separator
      const separator =
        index < combo.followUpSimple.length - 1 ? (
          <>
            {displayMode === "notations" && (
              <span className="notation-separator">, </span>
            )}
            <span className="arrow-separator">
              <img
                className="input-icons "
                src="/icons-t8/into.png"
                alt="into"
              />
            </span>
            <span className="arrow-separator-mobile">{""}</span>
          </>
        ) : null;

      // Return the image followed by a possible separator
      return (
        <React.Fragment key={index}>
          {renderInputImage(item)}
          {separator}
        </React.Fragment>
      );
    });
  };
  console.log(combos);
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleRow = (index, event) => {
    event.stopPropagation(); // Ensure that the video icon click does not toggle the entire row
    setExpandedRow(expandedRow === index ? null : index);
  };
  const description = `All main combos for ${name} in Tekken 8. These are the most important combos to learn for ${name}.`;
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
    <div className="main-combos">
      <Helmet>
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
      </Helmet>
      <h2>Main Combos</h2>
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
        <table>
          <thead>
            <tr>
              <th className="launcher-header">Launcher(s)</th>
              <th className="follow-ups-header">Follow-Ups</th>
              <th className="simple-version-header">Simple Version</th>
            </tr>
          </thead>
          <tbody>
            {combos.map((combo, index) => (
              <React.Fragment key={index}>
                <tr>
                  <td>
                    {combo.launchers.map((launcher, i) => (
                      <div key={i}>{renderInputImage(launcher)}</div>
                    ))}
                    {combo.vidUrl && (
                      <IconButton
                        onClick={(event) => toggleRow(index, event)}
                        style={{ textAlign: "center" }}
                      >
                        <VideoLibraryIcon />
                      </IconButton>
                    )}
                  </td>
                  <td>
                    {combo.followUps.map((followUp, i) => (
                      <React.Fragment key={i}>
                        {renderInputImage(followUp)}
                        {i < combo.followUps.length - 1 && (
                          <>
                            <span className="arrow-separator">
                              <img
                                className="input-icons"
                                src="/icons-t8/into.png"
                                alt="into"
                              />
                            </span>
                            <span className="arrow-separator-mobile">{""}</span>
                          </>
                        )}
                      </React.Fragment>
                    ))}
                  </td>
                  <td>{displaySimpleCombo(combo)}</td>
                </tr>
                {expandedRow === index && combo.vidUrl && (
                  <tr>
                    <td colSpan="4">
                      <ReactPlayer
                        url={combo.vidUrl}
                        playing
                        controls
                        width="100%"
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainCombos;
