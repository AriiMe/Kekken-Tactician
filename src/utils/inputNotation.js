import inputToIconMap from "./inputToIconMap.js";
import t8InputToIconMap from "./t8InputToIconMap.js";
import { stanceTokens } from "../data/tekken8Stances.js";
import { tekken7StanceLabels } from "../data/tekken7Notation.js";

export const MOTION_SEQUENCES = Object.freeze({
  qcf: ["d", "df", "f"],
  qcb: ["d", "db", "b"],
  hcf: ["b", "db", "d", "df", "f"],
  hcb: ["f", "df", "d", "db", "b"],
});

export const SPECIAL_INPUT_LABELS = Object.freeze({
  homing: "Homing move",
  pc: "Power crush",
  t: "Tornado",
  screw: "Screw / spin extender",
  "[": "Opening bracket",
  "]": "Closing bracket",
  chip: "Chip damage",
  heat: "Heat",
  fb: "Floor break",
  into: "Into",
  wb: "Wall break",
  launch: "Launch",
  bt: "Back turned",
  ss: "Sidestep",
  ssl: "Sidestep left",
  ssr: "Sidestep right",
  wr: "While running",
  ws: "While standing",
  ch: "Counter hit",
});

const BASE_INPUT_LABELS = Object.freeze({
  f: "Forward",
  n: "Neutral",
  df: "Down-forward",
  d: "Down",
  db: "Down-back",
  b: "Back",
  ub: "Up-back",
  u: "Up",
  uf: "Up-forward",
  1: "Left punch",
  2: "Right punch",
  3: "Left kick",
  4: "Right kick",
  0: "No attack button",
});

const HOLD_DIRECTIONS = new Set([
  "f",
  "b",
  "u",
  "d",
  "df",
  "db",
  "uf",
  "ub",
]);
const BASE_ICON_TOKENS = new Set([
  ...Object.keys(inputToIconMap),
  ...Object.keys(t8InputToIconMap),
]);
const SPECIAL_ICON_TOKENS = new Set(Object.keys(SPECIAL_INPUT_LABELS));
const BUTTON_TOKEN_PATTERN = /^[1-4](?:\+[1-4])*$/;
const COMPACT_PREFIX_PATTERN = /^(~?(?:df|db|uf|ub|f|b|u|d)|qcf|qcb|hcf|hcb|ssr|ssl|wr|ws|ch|bt|ss)([1-4](?:\+[1-4])*)$/i;
const REPEATED_DIRECTION_PATTERN =
  /^(f{2,}|b{2,}|d{2,}|u{2,})([1-4](?:\+[1-4])*)$/i;

const toNotationString = (input) => {
  if (input == null) return "";
  if (Array.isArray(input)) return input.map(toNotationString).map(s => s.trim()).filter(Boolean).join(" into ");

  return typeof input === "string" ? input : String(input);
};

export const normalizeInputToken = (value) => {
  if (typeof value !== "string") return null;

  const source = value.trim().toLowerCase();
  const token = ({ '>': 'into', '→': 'into', 's!': 'screw', 't!': 't', tornado: 't',
    'floor break': 'fb', 'wall break': 'wb', 'power crush': 'pc',
    'counter hit': 'ch', 'back turned': 'bt' })[source] || source;
  if (!token) return null;

  if (token.startsWith("~") && HOLD_DIRECTIONS.has(token.slice(1))) {
    return `hold${token.slice(1)}`;
  }

  if (
    BASE_ICON_TOKENS.has(token) ||
    SPECIAL_ICON_TOKENS.has(token) ||
    Object.hasOwn(MOTION_SEQUENCES, token)
  ) {
    return token;
  }

  return null;
};

export const isSpecialInput = (token) => SPECIAL_ICON_TOKENS.has(token);

export const getInputLabel = (token) => {
  if (SPECIAL_INPUT_LABELS[token]) return SPECIAL_INPUT_LABELS[token];
  if (BASE_INPUT_LABELS[token]) return BASE_INPUT_LABELS[token];
  if (MOTION_SEQUENCES[token]) {
    return {
      qcf: "Quarter-circle forward",
      qcb: "Quarter-circle back",
      hcf: "Half-circle forward",
      hcb: "Half-circle back",
    }[token];
  }

  if (token.startsWith("hold")) {
    const direction = token.slice(4);
    return `Hold ${BASE_INPUT_LABELS[direction]?.toLowerCase() || direction}`;
  }

  if (BUTTON_TOKEN_PATTERN.test(token)) {
    return token
      .split("+")
      .map((button) => BASE_INPUT_LABELS[button])
      .join(" + ");
  }

  return token;
};

const createSegment = (kind, raw, start, normalized) => ({
  kind,
  raw,
  normalized,
  key: `${start}:${kind}:${raw}`,
});

const createInputSegment = (raw, start) => {
  const normalized = normalizeInputToken(raw);
  return normalized
    ? createSegment("input", raw, start, normalized)
    : createSegment("text", raw, start, null);
};

const joinCompactParts = (raw, start, parts, separator = "+") => {
  const segments = [];
  let cursor = 0;

  parts.forEach((part, index) => {
    const partStart = raw.indexOf(part, cursor);
    const safePartStart = partStart === -1 ? cursor : partStart;

    if (index > 0 && separator) {
      const separatorStart = raw.lastIndexOf(separator, safePartStart);
      segments.push(
        createSegment(
          "separator",
          separator,
          start + (separatorStart === -1 ? cursor : separatorStart),
          null
        )
      );
    }

    segments.push(createInputSegment(part, start + safePartStart));
    cursor = safePartStart + part.length;
  });

  return segments;
};

const parseCompactLexeme = (raw, start) => {
  // A leading tilde is this site's held-direction notation. Between inputs it
  // means a rapid succession, so keep that timing marker between separate icons.
  if (raw.includes("~") && !raw.startsWith("~")) {
    const parts = raw.split("~");
    const parsed = parts.map((part) => parseInputNotation(part));
    if (parts.every(Boolean) && parsed.every((part) => part.every((s) => s.kind !== "text"))) {
      let offset = start;
      return parsed.flatMap((part, index) => {
        const result = part.map((s) => ({ ...s, key: `${offset}:${s.key}` }));
        if (index) result.unshift(createSegment("separator", "~", offset - 1, null));
        offset += parts[index].length + 1;
        return result;
      });
    }
  }

  const compactMatch = raw.match(COMPACT_PREFIX_PATTERN);
  if (compactMatch) {
    const [, prefix, buttons] = compactMatch;
    if (BASE_ICON_TOKENS.has(buttons.toLowerCase())) {
      return joinCompactParts(
        raw,
        start,
        [prefix, buttons],
        ""
      );
    }
  }

  const repeatedDirectionMatch = raw.match(REPEATED_DIRECTION_PATTERN);
  if (repeatedDirectionMatch) {
    const [, directions, buttons] = repeatedDirectionMatch;
    if (BASE_ICON_TOKENS.has(buttons.toLowerCase())) {
      return joinCompactParts(raw, start, [...directions, buttons], "");
    }
  }

  if (!raw.includes("+")) return null;

  const parts = raw.split("+");
  if (parts.some((part) => !part)) return null;

  const firstButtonIndex = parts.findIndex((part) => /^[1-4]$/.test(part));
  if (firstButtonIndex > 0) {
    const prefixParts = parts.slice(0, firstButtonIndex);
    const buttons = parts.slice(firstButtonIndex).join("+");
    const prefixesAreKnown = prefixParts.every((part) => normalizeInputToken(part));

    if (prefixesAreKnown && BASE_ICON_TOKENS.has(buttons.toLowerCase())) {
      return joinCompactParts(raw, start, [...prefixParts, buttons]);
    }
  }

  if (parts.every((part) => normalizeInputToken(part))) {
    return joinCompactParts(raw, start, parts);
  }

  return null;
};

/**
 * Parses notation once for both text and icon rendering. Unknown lexemes remain
 * intact, so malformed or game-specific notation is displayed instead of lost.
 */
export const parseInputNotation = (input) => {
  const notation = toNotationString(input);
  if (!notation) return [];

  const lexemePattern = /EXT DCK\b|\([^()]*\)|\s+|[[\],>:()]|[^\s[\],>:()]+/g;
  const segments = [];

  for (const match of notation.matchAll(lexemePattern)) {
    const raw = match[0];
    const start = match.index ?? 0;

    if (/^\s+$/.test(raw)) {
      segments.push(createSegment("space", " ", start, null));
      continue;
    }

    if (raw.startsWith("(") && raw.endsWith(")") && raw.length > 2) {
      const content = raw.slice(1, -1);
      const special = normalizeInputToken(content);
      if (special && isSpecialInput(special)) {
        segments.push(createSegment("input", raw, start, special));
        continue;
      }
      const inner = parseInputNotation(content);
      if (inner.some((s) => s.kind === "input") && inner.every((s) => s.kind !== "text")) {
        segments.push(createSegment("group", "(", start, null));
        segments.push(...inner.map((s) => ({ ...s, key: `${start}:group:${s.key}` })));
        segments.push(createSegment("group", ")", start + raw.length - 1, null));
      } else {
        segments.push(createSegment("annotation", raw, start, null));
      }
      continue;
    }

    if (["+", ",", ":", "~"].includes(raw)) {
      segments.push(createSegment("separator", raw, start, null));
      continue;
    }

    const normalized = normalizeInputToken(raw);
    if (normalized) {
      segments.push(createSegment("input", raw, start, normalized));
      continue;
    }

    if (stanceTokens.has(raw.toUpperCase()) || Object.hasOwn(tekken7StanceLabels, raw.toUpperCase()) || raw.toUpperCase() === "FC") {
      segments.push(createSegment("stance", raw, start, raw.toUpperCase()));
      continue;
    }

    const compactSegments = parseCompactLexeme(raw, start);
    segments.push(
      ...(compactSegments || [createSegment("text", raw, start, null)])
    );
  }

  return segments;
};
