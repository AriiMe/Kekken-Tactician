import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useDisplayMode } from "../context/DisplayModeContext";
import t8InputToIconMap from "./t8InputToIconMap";

const test = (input) => {
  const { displayMode } = useDisplayMode();

  // Define the combinations
  const combinations = {
    hcf: ["b", "db", "d", "df", "f"],
    hcb: ["f", "df", "d", "db", "b"],
    qcf: ["d", "df", "f"],
    qcb: ["d", "db", "b"],
  };

  // Create a new object with all lowercase keys
  const lowerCaseT8InputToIconMap = Object.keys(t8InputToIconMap).reduce(
    (result, key) => {
      result[key.toLowerCase()] = t8InputToIconMap[key];

      return result;
    },
    {}
  );

  // Helper function to generate image element for a single part
  const createImageElement = (subSeq) => {
    // Check if subSeq is defined
    if (subSeq) {
      // Convert subSeq to lowercase
      const lowerCaseSubSeq = subSeq.toLowerCase();

      // Check if lowerCaseSubSeq matches any key in lowerCaseT8InputToIconMap
      if (lowerCaseT8InputToIconMap.hasOwnProperty(lowerCaseSubSeq)) {
        // Create an image element with the corresponding value as the source
        return (
          <img
            key={uuidv4()}
            src={lowerCaseT8InputToIconMap[lowerCaseSubSeq]}
            alt={subSeq}
            className="input-icons"
          />
        );
      }
    }

    // If subSeq is undefined or null, or if lowerCaseSubSeq doesn't match any key in lowerCaseT8InputToIconMap, return null
    return null;
  };

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
      const lowerCaseTrimmedPart = trimmedPart.toLowerCase(); // Convert trimmedPart to lowercase

      // Check if the part is a key in lowerCaseT8InputToIconMap
      if (lowerCaseT8InputToIconMap.hasOwnProperty(lowerCaseTrimmedPart)) {
        return createImageElement(trimmedPart);
      } else if (combinations.hasOwnProperty(lowerCaseTrimmedPart)) {
        // If the part is a key in combinations, map each constituent part to its icon
        return combinations[lowerCaseTrimmedPart].map((subpart) =>
          createImageElement(subpart)
        );
      } else {
        // If the part is not a key in lowerCaseT8InputToIconMap or combinations, split it by '+'
        const numbers = trimmedPart.split("+");
        return (
          <span key={uuidv4()}>
            {numbers.map((num, index) => {
              // Check if the number is a hold input
              // Check if the number is a hold input
              if (num.startsWith("~")) {
                // Remove the '~' from the hold input and prepend 'hold' to it
                const holdKey = "hold" + num.slice(1).toLowerCase(); // Convert the hold input to lowercase
                if (lowerCaseT8InputToIconMap.hasOwnProperty(holdKey)) {
                  return (
                    <React.Fragment key={uuidv4()}>
                      {createImageElement(holdKey)}
                      {index < numbers.length - 1 && (
                        <span className="plus">+</span>
                      )}
                    </React.Fragment>
                  );
                }
              } else if (
                lowerCaseT8InputToIconMap.hasOwnProperty(num.toLowerCase())
              ) {
                // Convert num to lowercase
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
