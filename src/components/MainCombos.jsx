import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import renderInputImage from "../utils/renderInputImage";
import IconButton from "@mui/material/IconButton";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import { Helmet } from "react-helmet";

import "./MainCombos.css";
import { useDisplayMode } from "../context/DisplayModeContext";
import CollapsableSection from "./CollapsableSection";

const MainCombos = ({ combos, name }) => {
  const { displayMode } = useDisplayMode();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedRow, setExpandedRow] = useState(null);
  const [playingStatus, setPlayingStatus] = useState({});
  const [startTimes, setStartTimes] = useState({});
  const playerRefs = useRef([]);
  const handleProgress =
    (index) =>
    ({ playedSeconds }) => {
      // If the video just started playing, store the start time
      if (playingStatus[index] && !startTimes[index]) {
        setStartTimes((prev) => ({ ...prev, [index]: playedSeconds }));
      }

      const targetTime = startTimes[index] + combos[index].endTime;
      console.log(
        `Played Seconds: ${playedSeconds}, Target Time: ${targetTime}`
      );

      if (playedSeconds >= targetTime) {
        console.log("Pausing video...");
        setPlayingStatus((prev) => ({ ...prev, [index]: false }));
        // Reset the start time for this video
        setStartTimes((prev) => ({ ...prev, [index]: null }));
      }
    };

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

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleRow = (index) => {
    const isExpanded = expandedRow === index;
    setExpandedRow(isExpanded ? null : index);
    setPlayingStatus((prev) => ({ ...prev, [index]: !isExpanded }));
  };

  const patchVersion = "1.05";

  const description = `All main combos for ${name} in Tekken 8. ${name} patch ${patchVersion} combos. These are the most important combos to learn for ${name}.`;
  const keywords = [
    "Tekken 8",
    `${name} combos`,
    `${name} Heat dash`,
    `${name} Heat flop`,
    "Punishers",
    "Heat Flop",
    `Tekken 8 patch ${patchVersion} combos`,
    `patch ${patchVersion} combo sheets`,
    `patch ${patchVersion} combo cheat sheets`,
    `Tekken ${patchVersion} combos`,
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

      <CollapsableSection
        title="Main Combos"
        toggleState={isCollapsed}
        collapseFn={toggleCollapse}
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
                      <div key={i} className="launch-options">
                        {renderInputImage(launcher)}
                      </div>
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
                        className="react-player"
                        url={combo.vidUrl}
                        ref={(player) => {
                          playerRefs.current[index] = player;
                        }}
                        playing={playingStatus[index]}
                        controls
                        onProgress={handleProgress(index)}
                      />
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </CollapsableSection>
    </div>
  );
};

export default MainCombos;

// import React, { useState, useEffect, useRef } from "react";
// import ReactPlayer from "react-player";
// import IconButton from "@mui/material/IconButton";
// import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

// const MainCombos = ({ combos }) => {
//   const [expandedRow, setExpandedRow] = useState(null);
//   const [playingStatus, setPlayingStatus] = useState({});
//   const playerRefs = useRef([]);

//   // Effect to pause the video when progress reaches 96 seconds
//   useEffect(() => {
//     const handleProgress = ({ playedSeconds }) => {
//       if (playedSeconds >= 96) {
//         setPlayingStatus((prev) => ({ ...prev, [expandedRow]: false }));
//         console.log("Paused the video after 96 seconds.");
//       }
//     };
//   }, [expandedRow, playingStatus]);

//   const toggleRow = (index) => {
//     const isExpanded = expandedRow === index;
//     setExpandedRow(isExpanded ? null : index);
//     setPlayingStatus((prev) => ({ ...prev, [index]: !isExpanded }));
//   };

//   return (
//     <div>
//       {combos.map((combo, index) => (
//         <div key={index}>
//           <IconButton onClick={() => toggleRow(index)}>
//             <VideoLibraryIcon />
//           </IconButton>
//           {expandedRow === index && (
//             <ReactPlayer
//               url={combo.vidUrl}
//               ref={(player) => {
//                 playerRefs.current[index] = player;
//               }}
//               playing={playingStatus[index]}
//               controls
//               onProgress={({ playedSeconds }) => {
//                 console.log(
//                   `Progress: ${playedSeconds} seconds, Index: ${index}`
//                 );
//                 if (playedSeconds >= 96) {
//                   setPlayingStatus((prev) => ({ ...prev, [index]: false }));
//                   console.log("Paused the video after 96 seconds.");
//                 }
//               }}
//             />
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default MainCombos;
