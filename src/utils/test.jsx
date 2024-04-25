import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useDisplayMode } from "../context/DisplayModeContext";
import inputToIconMap from "./inputToIconMap";

const test = (input) => {
  const { displayMode } = useDisplayMode();

  // Define the combinations
  const combinations = {
    hcf: ["b", "db", "d", "df", "f"],
    hcb: ["f", "df", "d", "db", "b"],
    qcf: ["d", "df", "f"],
    qcb: ["d", "db", "b"],
  };

  // Helper function to generate image element for a single part
  const createImageElement = (subSeq) => (
    <img
      key={uuidv4()}
      src={inputToIconMap[subSeq] || ""}
      alt={subSeq}
      className="input-icons"
    />
  );

  const applyNumericStyling = (part) => {
    const numericRegex = /^\d+(\+\d+)*$/; // Matches single digits and combinations like 1+2
    const holdRegex = /^~[DFUBLRdfublr]$/; // Matches holds like ~F, ~B, etc.
    const holdComboRegex = /^~[DFUBLRdfublr]{2}$/; // Matches combinations like ~DF, ~UB, etc.
    const trimmedPart = part.trim();

    // Function to create a styled span for a hold
    const styledHoldSpan = (text, className) => (
      <span key={uuidv4()} className={`${className} notation-span`}>
        {text}
      </span>
    );

    if (holdComboRegex.test(trimmedPart)) {
      // Special styling for combinations like ~DF
      return styledHoldSpan(
        trimmedPart,
        `hold-input hold-combo-input-${trimmedPart.substring(1).toLowerCase()}`
      );
    } else if (holdRegex.test(trimmedPart)) {
      // Special styling for single holds like ~F
      return styledHoldSpan(
        trimmedPart,
        `hold-input hold-input-${trimmedPart.substring(1).toLowerCase()}`
      );
    } else if (numericRegex.test(trimmedPart)) {
      // Split the part by '+'
      const numbers = trimmedPart.split("+");
      // Render each number with unique styling, and keep '+' outside
      return (
        <span key={uuidv4()} className="notation-span">
          {numbers.map((num, index) => (
            <React.Fragment key={uuidv4()}>
              <span
                key={uuidv4()}
                className={`xbox-input xbox-input-${num} notation-number ${
                  index === 0 ? "first-number" : "last-number"
                }`}
              >
                {num}
              </span>
              {index < numbers.length - 1 && (
                <span key={uuidv4()} className="plus-sign">
                  +
                </span>
              )}
            </React.Fragment>
          ))}
        </span>
      );
    }

    // Default text rendering
    return styledHoldSpan(trimmedPart, "normal-inputs");
  };

  if (displayMode === "notations") {
    return input
      .split(/(\s+)/)
      .filter((e) => e.trim().length > 0)
      .map((part) => {
        const trimmedPart = part.trim();

        // Apply numeric styling to all parts
        return applyNumericStyling(trimmedPart);
      });
  }

  return input
    .split(/(\s+)/)
    .filter((e) => e.trim().length > 0)
    .map((part) => {
      const trimmedPart = part.trim();

      // Check if the part is a key in inputToIconMap
      if (inputToIconMap.hasOwnProperty(trimmedPart)) {
        return createImageElement(trimmedPart);
      } else if (combinations.hasOwnProperty(trimmedPart)) {
        // If the part is a key in combinations, map each constituent part to its icon
        return combinations[trimmedPart].map((subpart) =>
          createImageElement(subpart)
        );
      } else {
        // If the part is not a key in inputToIconMap or combinations, split it by '+'
        const numbers = trimmedPart.split("+");
        return (
          <span key={uuidv4()}>
            {numbers.map((num, index) => {
              // Check if the number is a hold input
              if (num.startsWith("~")) {
                // Remove the '~' from the hold input and prepend 'hold' to it
                const holdKey = "hold" + num.slice(1);
                if (inputToIconMap.hasOwnProperty(holdKey)) {
                  return (
                    <React.Fragment key={uuidv4()}>
                      {createImageElement(holdKey)}
                      {index < numbers.length - 1 && (
                        <span className="plus">+</span>
                      )}
                    </React.Fragment>
                  );
                }
              } else if (inputToIconMap.hasOwnProperty(num)) {
                return (
                  <React.Fragment key={uuidv4()}>
                    {createImageElement(num)}
                    {index < numbers.length - 1 && (
                      <span className="plus">+</span>
                    )}
                  </React.Fragment>
                );
              }
              return null;
            })}
          </span>
        );
      }
    });
};

export default test;
