import React from "react";
import { v4 as uuidv4 } from "uuid";
import renderInputImage from "../utils/renderInputImage";

import "./MainCombos.css";

const MainCombos = ({ combos }) => {
  const displaySimpleCombo = (combo) => {
    return combo.followUpSimple && combo.followUpSimple.length > 0
      ? combo.followUpSimple.join(" > ")
      : "N/A";
  };

  return (
    <div className="main-combos">
      <h2>Main Combos</h2>
      <table>
        <thead>
          <tr>
            <th>Launcher(s)</th>
            <th>Follow-Ups</th>
            <th>Simple Version</th>
          </tr>
        </thead>
        <tbody>
          {combos.map((combo) => (
            <tr key={combo._id}>
              <td>
                {combo.launchers.map((launcher) => (
                  <div key={uuidv4()} className="launcher-item">
                    {renderInputImage(launcher)}
                  </div>
                ))}
              </td>
              <td>
                {combo.followUps.map((followUp, index) => (
                  <React.Fragment key={uuidv4()}>
                    {renderInputImage(followUp)}
                    {index < combo.followUps.length - 1 ? " > " : ""}
                  </React.Fragment>
                ))}
              </td>
              <td>{renderInputImage(displaySimpleCombo(combo))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MainCombos;
