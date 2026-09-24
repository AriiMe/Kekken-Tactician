export const classicSectionTitles = {
  combos: 'Main Combos', punishers: 'Punishers', wallCombos: 'Wall Combos',
  teamCombos: 'Tag Combos', throws: 'Throws', chains: 'Throw Follow-Ups',
  setups: 'Recovery Setups', tagMoves: 'Team Moves', techniques: 'Advanced Techniques',
  stances: 'Stances', strings: '10 Hit Combos', unblockables: 'Unblockable Attacks',
  pounces: 'Ground Attacks', moves: 'Move List',
};

// Only direct attacks are eligible: motion/stance entry adds time that the
// archive's startup column does not measure. Strings contribute their first hit.
const directAttack = /^(?:(WS|FC)\s*\+?\s*)?(?:(?:d\/f|d\/b|u\/f|u\/b|f|b|d|u)\+)?[1-4](?:\+[1-4])*$/i;

export function getClassicPunishers(character) {
  const result = { standing: [], crouching: [] };
  const seen = new Set();
  const curatedGroups = new Set();
  for (const row of character?.sections.punishers || []) {
    const frames = Number(row.startupFrames);
    if (!Number.isFinite(frames) || frames <= 0 || (frames > 18 && !row.launcher)) continue;
    const position = row.position === 'crouching' ? 'crouching' : 'standing';
    const key = `${position}:${row.input}:${row.edition}:${frames}`;
    if (seen.has(key)) continue;
    seen.add(key);
    curatedGroups.add(`${position}:${row.edition || ''}`);
    result[position].push({ ...row, frames, curated: true });
  }
  for (const row of character?.sections.moves || []) {
    if (/parry|reversal|taunt|(?:^|\s)stance|offensive push/i.test(row.name)) continue;
    const variants = row.versions?.length ? row.versions : [row];
    for (const variant of variants) {
      const move = { ...row, ...variant };
      const frameData = variant.frameData || (!row.versions ? row.frameData || row.referenceFrameData : null);
      const startup = String(frameData?.startup || '');
      if (!/^\d+(?:[~-]\d+)?$/.test(startup) || move.frameScope) continue;
      const frames = Math.max(...startup.split(/[~-]/).map(Number));
      const original = move.input.trim();
      let input = original.split(',')[0].trim();
      const motion = /^(?:f,f|b,b|f,n,d,d\/f|qcf|qcb)(?:\+|~)[1-4](?:\+[1-4])*$/.test(original);
      if (motion) input = original;
      const match = input.match(directAttack);
      const comboLauncher = (character.sections.combos || []).some(combo =>
        (!editionMismatch(combo.edition, move.edition)) && combo.launchers?.includes(original));
      const launcher = input === original && (/launches on (?:normal )?hit/i.test(move.notes || '') || comboLauncher) && !/only.*counter|only.*CH/i.test(move.notes || '');
      if ((!match && !(motion && launcher)) || /unblockable/i.test(move.hitLevel || '')) continue;
      if (!launcher && /^low/i.test(move.hitLevel || '')) continue;
      // Down attacks without a known hit level can be lows in the older archives.
      if (!launcher && /^(?:FC\s*\+?\s*)?d(?:\/b)?\+/i.test(input) && !/mid|high/i.test(move.hitLevel || '')) continue;
      if (frames > 18 && !launcher) continue;
      const position = match?.[1] ? 'crouching' : 'standing';
      const edition = variant.edition || row.edition;
      if (curatedGroups.has(`${position}:${edition || ''}`)) continue;
      const reference = Boolean(row.referenceFrameData && !row.frameData);
      const key = `${position}:${input}:${edition}:${frames}`;
      if (seen.has(key)) continue;
      seen.add(key);
      result[position].push({ input, frames, edition, reference, launcher, motion,
        name: input === original ? row.name : 'Opening hit', availability: row.availability });
    }
  }
  for (const rows of Object.values(result)) rows.sort((a, b) => a.frames - b.frames || a.input.localeCompare(b.input) || (a.edition === 'tekken5' ? -1 : 1));
  return result;
}

function editionMismatch(comboEdition, moveEdition) {
  return comboEdition === 'unverified' || Boolean(comboEdition && moveEdition && comboEdition !== moveEdition);
}
