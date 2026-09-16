import React, { useRef, useState } from "react";
import ReactPlayer from "react-player";
import renderInputImage from "../utils/renderInputImage";
import IconButton from "@mui/material/IconButton";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";

import "./MainCombos.css";
import CollapsableSection from "./CollapsableSection";
import PropTypes from "prop-types";

const MainCombos = ({ combos }) => {
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
    return renderInputImage(combo.followUpSimple);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleRow = (index) => {
    const isExpanded = expandedRow === index;
    setExpandedRow(isExpanded ? null : index);
    setPlayingStatus((prev) => ({ ...prev, [index]: !isExpanded }));
  };


  return (
    <div className="main-combos">

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
                    {renderInputImage(combo.followUps)}
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
                        volume={0.3}
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

MainCombos.propTypes = {
  combos: PropTypes.arrayOf(
    PropTypes.shape({
      endTime: PropTypes.number,
    })
  ).isRequired,
  name: PropTypes.string.isRequired,
  version: PropTypes.string,
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
