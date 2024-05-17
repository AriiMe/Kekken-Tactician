import React from "react";
import { v4 as uuidv4 } from "uuid";
import { useDisplayMode } from "../context/DisplayModeContext";
import { useColorMode } from "../context/ColorModeContext";
import inputToIconMap from "./inputToIconMap";
import t8InputToIconMap from "./t8InputToIconMap";

const renderInputImage = (input) => {
  const { displayMode } = useDisplayMode();
  const { colorMode } = useColorMode();

  const alwaysIcon = [
    "homing",
    "pc",
    "t",
    "T",
    "[",
    "]",
    "chip",
    "heat",
    "fb",
    "into",
    "wb",
    "launch",
    "bt",
    "ss",
    "ssl",
    "ssr",
    "wr",
    "ws",
    "ch",
  ];

  const normalizeInput = (inputString) => {
    return inputString.split(/\s+/); // Split by spaces
  };

  const applyNumericStyling = (part) => {
    const numericRegex = /^\d+(\+\d+)*$/; // Matches single digits and combinations like 1+2
    const holdRegex = /^~[DFUBLRdfublr]$/; // Matches holds like ~F, ~B, etc.
    const holdComboRegex = /^~[DFUBLRdfublr]{2}$/; // Matches combinations like ~DF, ~UB, etc.
    const trimmedPart = part.trim();

    const styledHoldSpan = (text, className) => (
      <span key={uuidv4()} className={className}>
        {text}
      </span>
    );

    if (holdComboRegex.test(trimmedPart)) {
      return styledHoldSpan(
        trimmedPart,
        `hold-input hold-combo-input-${trimmedPart.substring(1).toLowerCase()}`
      );
    } else if (holdRegex.test(trimmedPart)) {
      return styledHoldSpan(
        trimmedPart,
        `hold-input hold-input-${trimmedPart.substring(1).toLowerCase()}`
      );
    } else if (numericRegex.test(trimmedPart)) {
      const numbers = trimmedPart.split("+");
      return (
        <span key={uuidv4()}>
          {numbers.map((num, index) => (
            <>
              <span
                key={uuidv4()}
                className={`xbox-input ${
                  colorMode
                    ? `xbox-input-${num} ${
                        index === 0 ? "first-number" : "last-number"
                      }`
                    : ""
                }`}
              >
                {num}
              </span>
              {index < numbers.length - 1 && (
                <span key={uuidv4()} className="plus-sign">
                  +
                </span>
              )}
            </>
          ))}
        </span>
      );
    }

    return styledHoldSpan(trimmedPart, "normal-inputs");
  };

  if (displayMode === "notations") {
    return (
      <>
        {input.split(" ").map((sequence, index) => (
          <span key={uuidv4()}>
            {index !== 0 && <span className="input-gap"> </span>}
            {alwaysIcon.includes(sequence)
              ? createImageElement(sequence)
              : applyNumericStyling(sequence)}
          </span>
        ))}
      </>
    );
  }

  // Replace known sequences with image elements
  const replaceSequences = (inputParts) => {
    const sequences = {
      qcf: ["d", "df", "f"],
      qcb: ["d", "db", "b"],
      hcf: ["b", "db", "d", "df", "f"],
      hcb: ["f", "df", "d", "db", "b"],
    };

    const holds = {
      "~F": "holdF",
      "~f": "holdF",
      "~B": "holdB",
      "~b": "holdB",
      "~U": "holdU",
      "~u": "holdU",
      "~D": "holdD",
      "~d": "holdD",
      "~DF": "holdDF",
      "~df": "holdDF",
      "~DB": "holdDB",
      "~db": "holdDB",
      "~UF": "holdUF",
      "~uf": "holdUF",
      "~UB": "holdUB",
      "~ub": "holdUB",
    };

    return inputParts
      .map((part) => {
        const subParts = part.split(" ");
        // Handle button combinations and normal inputs
        if (alwaysIcon.includes(part) || inputToIconMap[part]) {
          return createImageElement(part);
        }

        if (subParts.length > 1) {
          return subParts.map((subPart, index) => {
            return (
              <React.Fragment key={uuidv4()}>
                {index > 0 && <span className="input-gap"> </span>}
                {createImageElement(subPart.trim())}
              </React.Fragment>
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
        return createImageElement(part);
      })
      .flat(); // Flatten in case of nested arrays from sequences
  };

  function createImageElement(part) {
    let src = "";
    let style = {}; // Default style
    let lowerCasePart = part.toLowerCase();

    // Check if the window width is less than or equal to 768px
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (alwaysIcon.includes(lowerCasePart)) {
      src = t8InputToIconMap[lowerCasePart] || "";

      // Check if part is one of the last 6 elements in alwaysIcon
      if (alwaysIcon.slice(-7).includes(lowerCasePart)) {
        style = isMobile
          ? { height: "25px", width: "25px" } // Set style for mobile
          : { height: "45px", width: "45px" }; // Set style for desktop

        // If part is the very last one in alwaysIcon, change the style
        if (lowerCasePart === alwaysIcon[alwaysIcon.length - 1]) {
          style = isMobile
            ? { height: "25px", width: "25px" } // Set style for mobile
            : { height: "50px", width: "50px" }; // Set style for desktop
        }
      }
    } else if (inputToIconMap[lowerCasePart]) {
      src = colorMode
        ? `/icons/${lowerCasePart}.webp`
        : `/icons-t8/${lowerCasePart}.png`;
    }

    return src ? (
      <img
        key={uuidv4()}
        src={src}
        alt={part}
        className="input-icons"
        style={style}
      />
    ) : (
      <span key={uuidv4()}>{part}</span>
    );
  }

  const normalizedInput = normalizeInput(input);
  const elements = replaceSequences(normalizedInput);

  return <span className="others">{elements}</span>;
};

export default renderInputImage;
