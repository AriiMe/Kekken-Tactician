import React from "react";
import { v4 as uuidv4 } from "uuid";
import test from "../utils/test";
import { Helmet } from "react-helmet";

import "./MainCombos.css";
import { useDisplayMode } from "../context/DisplayModeContext";

const MainCombos = ({ combos, name }) => {
  const { displayMode } = useDisplayMode();
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
          {test(item)}
          {separator}
        </React.Fragment>
      );
    });
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

      <table>
        <thead>
          <tr>
            <th className="launcher-header">Launcher(s)</th>
            <th className="follow-ups-header">Follow-Ups</th>
            <th className="simple-version-header">Simple Version</th>
          </tr>
        </thead>
        <tbody>
          {combos.map((combo, comboIndex) => (
            <tr key={comboIndex}>
              <td>
                {combo.launchers.map((launcher, launcherIndex) => (
                  <div key={launcherIndex} className="launcher-item">
                    {test(launcher)}
                  </div>
                ))}
              </td>
              <td className="follow-ups-cell">
                {combo.followUps.map((followUp, index) => (
                  <React.Fragment key={index}>
                    {test(followUp)}
                    {index < combo.followUps.length - 1 && (
                      <>
                        <span className="arrow-separator">
                          <img
                            className="input-icons "
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

              <td className="simple-version-cell">
                {displaySimpleCombo(combo)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MainCombos;
