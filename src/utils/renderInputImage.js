import React from "react";
import InputNotation from "./InputNotation.jsx";

/**
 * Backwards-compatible adapter for existing call sites. It returns a component
 * boundary so hooks in InputNotation are owned by React instead of being called
 * from this ordinary helper function.
 */
const renderInputImage = (input) => React.createElement(InputNotation, { input });

export default renderInputImage;
