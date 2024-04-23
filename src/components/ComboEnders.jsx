import React from "react";
import renderInputImage from "../utils/renderInputImage";
import "./ComboEnders.css";

const ComboEnders = ({ enders }) => {
  // Group enders by category
  const groupedEnders = enders.reduce((acc, ender) => {
    acc[ender.category] = [...(acc[ender.category] || []), ender];
    return acc;
  }, {});

  return (
    <div className="combo-enders">
      <h2>Combo Enders</h2>
      <table className="combo-enders-table">
        <tbody>
          {Object.entries(groupedEnders).map(([category, moves], index) => (
            <React.Fragment key={category}>
              {moves.map((move, moveIndex) => (
                <tr key={move._id}>
                  {moveIndex === 0 && (
                    <td className="category-cell" rowSpan={moves.length}>
                      {category}
                    </td>
                  )}
                  <td>
                    <div
                      className={`combo-ender-move ${
                        moveIndex === moves.length - 1 ? "last-move" : ""
                      }`}
                    >
                      {renderInputImage(move.move)}
                    </div>
                  </td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComboEnders;
