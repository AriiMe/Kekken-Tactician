import React, { useContext } from "react";
import inputToIconMap from "./inputToIconMap";
import { v4 as uuidv4 } from "uuid";
import { useDisplayMode } from "../context/DisplayModeContext";

const renderInputImage = (input) => {
  const { displayMode } = useDisplayMode();

  const applyNumericStyling = (part) => {
    const numericRegex = /^\d+(\+\d+)*$/; // Matches single digits and combinations like 1+2
    const trimmedPart = part.trim();
    if (numericRegex.test(trimmedPart)) {
      // Split the part by '+'
      const numbers = trimmedPart.split("+");
      // Render each number with unique styling, and keep '+' outside
      return (
        <span key={uuidv4()}>
          {numbers.map((num, index) => (
            <>
              <span
                key={uuidv4()}
                className={`xbox-input xbox-input-${num} ${
                  index === 0 ? "first-number" : "last-number"
                }`}
              >
                {num}
              </span>
              {index < numbers.length - 1 && (
                <span key={uuidv4()} className="plus-sign">
                  +
                </span>
              )}{" "}
              {/* Plus sign as a separate span */}
            </>
          ))}
        </span>
      );
    }
    return <span key={uuidv4()}>{trimmedPart}</span>;
  };

  if (displayMode === "notations") {
    return (
      <>
        {input.split(">").map((sequence, index) => (
          <span key={uuidv4()}>
            {index !== 0 && <span className="input-gap">{">"}</span>}
            {/* Split the sequence by comma and map each subPart */}
            {sequence.split(",").map((subPart, subPartIndex, subPartArray) => (
              <React.Fragment key={uuidv4()}>
                <span className="sequence-part">
                  {applyNumericStyling(subPart)}
                </span>
                {/* Add a comma after each subPart except for the last one */}
                {subPartIndex < subPartArray.length - 1 && (
                  <span className="subpart-comma">, </span>
                )}
              </React.Fragment>
            ))}
          </span>
        ))}
      </>
    );
  }

  // Normalize input to handle sequences and split correctly
  const normalizeInput = (inputString) => {
    return inputString.split(/,\s*/); // Split by commas and remove any trailing spaces
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

  // Replace known sequences with image elements
  const replaceSequences = (inputParts) => {
    // console.log("Normalized input parts:", inputParts);
    const sequences = {
      qcf: ["d", "df", "f"],
      qcb: ["d", "db", "b"],
      hcf: ["b", "db", "d", "df", "f"],
      hcb: ["f", "df", "d", "db", "b"],
    };

    const holds = {
      "~F": "holdF",
      "~B": "holdB",
      "~U": "holdU",
      "~D": "holdD",
      "~DF": "holdDF",
      "~DB": "holdDB",
      "~UF": "holdUF",
      "~UB": "holdUB",
    };

    return inputParts
      .map((part) => {
        // console.log("Processing part:", part);
        const subParts = part.split(" > ");
        if (subParts.length > 1) {
          return subParts.map((subPart, index) => {
            // Insert '>' delimiter visual or spacing between the icons
            return (
              <>
                {index > 0 && <span className="input-gap">{">"}</span>}
                {createImageElement(subPart.trim())}
              </>
            );
          });
        }
        // Handle holds (case-sensitive)
        Object.entries(holds).forEach(([key, value]) => {
          const regex = new RegExp(key, "g");
          part = part.replace(regex, value);
        });

        // Handle sequences
        const sequenceElements = sequences[part]?.map((subSeq) =>
          createImageElement(subSeq)
        );
        if (sequenceElements) {
          return sequenceElements;
        }

        // Handle button combinations and normal inputs
        if (inputToIconMap[part]) {
          return createImageElement(part);
        }

        // Default case for unrecognized parts
        return <span key={uuidv4()}>{part}</span>;
      })
      .flat(); // Flatten in case of nested arrays from sequences
  };

  const normalizedInput = normalizeInput(input);
  const elements = replaceSequences(normalizedInput);

  return <span>{elements}</span>;
};

export default renderInputImage;
