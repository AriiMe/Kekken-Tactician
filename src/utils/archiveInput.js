// RBNorway and archived guides use capital directions for held inputs.
// Convert that convention before the shared icon parser lowercases tokens.
export function normalizeArchiveHolds(input = '') {
  return input.replace(/\b(?:[UD]\/?[FB]|[FBUD])\b(?![!])/g, (direction, offset) => {
    const standaloneHold = input[offset - 1] === '~' && (offset === 1 || /[\s,]/.test(input[offset - 2]));
    // A transition such as 3~F needs both immediate timing and a hold. The icon
    // parser cannot express that combination; its unknown-token result makes
    // GuideInput preserve the complete original command as text instead.
    return `${standaloneHold ? '' : '~'}${direction.toLowerCase().replace('/', '')}`;
  });
}

export function needsArchiveText(normalized = '') {
  // In legacy move lists > means delay, not our combo-step arrow. Immediate
  // held transitions also cannot be represented by the shared icon parser.
  return /[<>]|~~/.test(normalized);
}
