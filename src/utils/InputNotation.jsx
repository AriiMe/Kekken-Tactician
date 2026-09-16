import { Fragment, useContext, useMemo } from "react";
import { StanceContext } from "../context/StanceContext";
import PropTypes from "prop-types";
import { useColorMode } from "../context/ColorModeContext";
import { useDisplayMode } from "../context/DisplayModeContext";
import inputToIconMap from "./inputToIconMap.js";
import t8InputToIconMap from "./t8InputToIconMap.js";
import {
  MOTION_SEQUENCES,
  getInputLabel,
  isSpecialInput,
  parseInputNotation,
} from "./inputNotation.js";
import "./InputNotation.css";

const MOVEMENT_STATE_INPUTS = new Set([
  "bt",
  "ss",
  "ssl",
  "ssr",
  "wr",
  "ws",
  "ch",
]);
const NUMERIC_NOTATION_PATTERN = /^\d+(?:\+\d+)*$/;
const HOLD_NOTATION_PATTERN = /^~([dfublr]{1,2})$/i;
const renderAnnotation = (segment) => (
  <span className="input-annotation">{segment.raw}</span>
);

function StanceInput({ token, raw }) {
  const labels = useContext(StanceContext);
  const label = token === 'FC' ? 'Full crouch' : labels[token];
  return <abbr className="input-stance" title={label || 'Stance abbreviation'}>{raw}</abbr>;
}
StanceInput.propTypes = { token: PropTypes.string.isRequired, raw: PropTypes.string.isRequired };

const getIconSource = (token, useClassicIcons) => {
  if (isSpecialInput(token)) return t8InputToIconMap[token];
  if (useClassicIcons && inputToIconMap[token]) return inputToIconMap[token];
  return t8InputToIconMap[token];
};

const renderInputIcon = (token, sourceToken, colorMode, className = "") => {
  const src = getIconSource(token, colorMode);
  if (!src) return <span>{sourceToken}</span>;

  const label = getInputLabel(token);
  const sizeClass = MOVEMENT_STATE_INPUTS.has(token)
    ? token === "ch"
      ? "input-icon--counter-hit"
      : "input-icon--movement-state"
    : "";
  const responsiveSize = sizeClass
    ? {
        height: "var(--input-icon-size)",
        width: "var(--input-icon-size)",
      }
    : undefined;

  return (
    <img
      src={src}
      alt={label}
      title={`${sourceToken}: ${label}`}
      className={["input-icons", sizeClass, className].filter(Boolean).join(" ")}
      style={responsiveSize}
      draggable="false"
    />
  );
};

const renderNotationText = (segment, colorMode) => {
  const { raw, normalized, key: segmentKey } = segment;
  const holdMatch = raw.match(HOLD_NOTATION_PATTERN);

  if (holdMatch || normalized?.startsWith("hold")) {
    const direction = (holdMatch?.[1] || normalized.slice(4)).toLowerCase();
    const holdClass =
      direction.length > 1
        ? `hold-combo-input-${direction}`
        : `hold-input-${direction}`;

    return <span className={`hold-input ${holdClass}`}>{raw}</span>;
  }

  if (NUMERIC_NOTATION_PATTERN.test(raw)) {
    const buttons = raw.split("+");
    return (
      <span>
        {buttons.map((button, index) => (
          <Fragment key={`${segmentKey}:button:${index}`}>
            <span
              className={[
                "xbox-input",
                colorMode ? `xbox-input-${button}` : "",
                colorMode ? (index === 0 ? "first-number" : "last-number") : "",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              {button}
            </span>
            {index < buttons.length - 1 && <span className="plus-sign">+</span>}
          </Fragment>
        ))}
      </span>
    );
  }

  return <span className="normal-inputs">{raw}</span>;
};

const renderNotationSegment = (segment, colorMode) => {
  if (segment.kind === "stance") return <StanceInput token={segment.normalized} raw={segment.raw} />;
  if (segment.kind === "annotation") return renderAnnotation(segment);
  if (segment.kind === "group") return <span className="input-group">{segment.raw}</span>;
  if (segment.kind === "space") {
    return <span className="input-gap"> </span>;
  }

  if (segment.kind === "separator") {
    return (
      <span className={segment.raw === "+" ? "plus-sign" : "input-separator"}>
        {segment.raw}
      </span>
    );
  }

  if (segment.kind === "input" && isSpecialInput(segment.normalized)) {
    return renderInputIcon(segment.normalized, segment.raw, colorMode);
  }

  return renderNotationText(segment, colorMode);
};

const renderIconSegment = (segment, colorMode) => {
  if (segment.kind === "stance") return <StanceInput token={segment.normalized} raw={segment.raw} />;
  if (segment.kind === "annotation") {
    const tapDirection = segment.raw.match(/^\(tap (up|down|forward|back)\)$/i);
    if (tapDirection) {
      const direction = { up: "u", down: "d", forward: "f", back: "b" }[tapDirection[1].toLowerCase()];
      return <span className="input-annotation">tap {renderInputIcon(direction, direction, colorMode)}</span>;
    }
    return renderAnnotation(segment);
  }
  if (segment.kind === "group") return <span className="input-group">{segment.raw}</span>;
  if (segment.kind === "space") {
    return <span className="input-gap" aria-hidden="true" />;
  }

  if (segment.kind === "separator") {
    const separatorLabel = {
      "+": "plus",
      ",": "then",
      ">": "into",
      "~": "immediately followed by",
      ":": "just-frame timing",
    }[segment.raw];

    return (
      <span
        className={segment.raw === "+" ? "plus-sign" : "input-separator"}
        aria-label={separatorLabel}
      >
        {segment.raw}
      </span>
    );
  }

  if (segment.kind !== "input") return <span>{segment.raw}</span>;

  const motion = MOTION_SEQUENCES[segment.normalized];
  if (motion) {
    return motion.map((token, index) => (
      <Fragment key={`${segment.key}:motion:${index}`}>
        {renderInputIcon(token, token, colorMode)}
      </Fragment>
    ));
  }

  return renderInputIcon(segment.normalized, segment.raw, colorMode);
};

const InputNotation = ({ input }) => {
  const { displayMode } = useDisplayMode();
  const { colorMode } = useColorMode();
  const segments = useMemo(() => parseInputNotation(input), [input]);

  if (displayMode === "notations") {
    return (
      <>
        {segments.map((segment) => (
          <Fragment key={segment.key}>
            {renderNotationSegment(segment, colorMode)}
          </Fragment>
        ))}
      </>
    );
  }

  return (
    <span className="others">
      {segments.map((segment) => (
        <Fragment key={segment.key}>
          {renderIconSegment(segment, colorMode)}
        </Fragment>
      ))}
    </span>
  );
};

InputNotation.propTypes = {
  input: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

InputNotation.defaultProps = {
  input: "",
};

export default InputNotation;
