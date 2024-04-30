import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useDisplayMode } from "../context/DisplayModeContext";
import t8InputToIconMap from "./t8InputToIconMap";

const renderInputImage = (input) => {
  const { displayMode } = useDisplayMode();

  if (displayMode === "notations") {
    return <span>{input}</span>;
  }

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
  const createImageElement = (subSeq, className = "") => {
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

    // everything else
    return <span className={className}>{subSeq}</span>;
  };

  const applyNumericStyling = (part) => {
    const numericRegex = /^\d+(\+\d+)*$/; // Matches single digits and combinations like 1+2
    const holdRegex = /^~[DFUBLRdfublr]$/; // Matches holds like ~F, ~B, etc.
    const holdComboRegex = /^~[DFUBLRdfublr]{2}$/; // Matches combinations like ~DF, ~UB, etc.
    const trimmedPart = part.trim();
    /**TODO: FIND A SIMPLER/ BETTER WAY  TO HANDLE THIS I AM WAY TOO FUCKING TIRED OF THIS STUPID FUNCTION*/
    const normalInputsSet = new Set([
      "n",
      "f",
      "df",
      "d",
      "db",
      "b",
      "ub",
      "u",
      "uf",
      "0",
      "1",
      "2",
      "3",
      "4",
      "1+2",
      "1+3",
      "1+4",
      "2+3",
      "2+4",
      "3+4",
      "1+2+3",
      "1+2+4",
      "1+3+4",
      "2+3+4",
      "1+2+3+4",
    ]);
    const iconInputsSet = new Set([
      "homing",
      "pc",
      "t",
      "[",
      "]",
      "chip",
      "heat",
      "fb",
      "into",
      "launch",
      "ch",
      "bt",
      "ss",
      "ssl",
      "ssr",
      "wb",
      "wr",
      "ws",
    ]);

    // Function to create a styled span for a hold
    const styledHoldSpan = (text, className) => (
      <span key={uuidv4()} className={`${className} notation-span`}>
        {text}
      </span>
    );

    if (holdComboRegex.renderInputImage(trimmedPart)) {
      // Special styling for combinations like ~DF
      return styledHoldSpan(
        trimmedPart,
        `hold-input hold-combo-input-${trimmedPart.substring(1).toLowerCase()}`
      );
    } else if (holdRegex.renderInputImage(trimmedPart)) {
      // Special styling for single holds like ~F
      return styledHoldSpan(
        trimmedPart,
        `hold-input hold-input-${trimmedPart.substring(1).toLowerCase()}`
      );
    } else if (numericRegex.renderInputImage(trimmedPart)) {
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
    } else {
      const lowerCaseTrimmedPart = trimmedPart.toLowerCase();
      if (normalInputsSet.has(lowerCaseTrimmedPart)) {
        return <span className="normal-inputs">{trimmedPart}</span>;
      } else if (iconInputsSet.has(lowerCaseTrimmedPart)) {
        return createImageElement(trimmedPart);
      }
    }

    return <span className="notation-span everything-else">{trimmedPart}</span>;
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
              return (
                <span className="notation-span everything-else">{num}</span>
              );
            })}
          </span>
        );
      }
    });
};

export default renderInputImage;
