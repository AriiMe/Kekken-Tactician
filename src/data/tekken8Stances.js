import stanceEntries from './tekken8StanceEntries.js';

// Stance names checked against https://wavu.wiki/t/<character>, 2026-09-16.
// Keep the guide's existing aliases alongside the common movelist abbreviations.
const entries = {
  'Alisa Bosconovitch': [['SBT', 'Boot'], ['DBT', 'Dual Boot'], ['DES', 'Destructive Form'], ['BKP', 'Backup']],
  'Anna Williams': [['CJM', 'Chaos Judgement'], ['HCS / HAM', 'Hammer Chance'], ['PTS / TOM', 'Pleasure Time'], ['ROLL', 'Chaos Judgement Roll']],
  'Armor King': [['CD / BST', 'Crouch Dash / Beast Step'], ['BAD', 'Bad Jaguar'], ['BT', 'Back Turned']],
  'Azucena': [['LIB', 'Libertador'], ['BT', 'Back Turned']],
  'Bob Richards': [['BALL / BAL', 'Spinner Ball'], ['CD', 'Crouch Dash']],
  'Bryan Fury': [['SLS', 'Slither Step'], ['SWA', 'Sway'], ['SNE', 'Snake Eyes']],
  'Claudio Serafino': [['STB', 'Starburst']],
  'Clive Rosfield': [['PHX', 'Phoenix Shift'], ['BHT / WOL', 'Wings of Light'], ['GAR', 'Updraft']],
  'Devil Jin': [['FLY', 'Fly Stance'], ['MCR', 'Mourning Crow'], ['CD', 'Crouch Dash']],
  'Fahkumram': [['RMS / RAM', 'Rama Stance'], ['GRF', 'Garuda Force']],
  'Feng Wei': [['KNP', 'Kenpo'], ['STC', 'Shifting Clouds']],
  'Eddy Gordo': [['HSP', 'Bananeira (Handstand)'], ['RLX', 'Negativa']],
  'Heihachi Mishima': [['RAI', 'Raijin'], ['FUJ', 'Fujin'], ['CD', 'Wind God Step'], ['WAR', 'Warrior Instinct']],
  'Hwoarang': [['LFF', 'Left Foot Forward'], ['RFF', 'Right Foot Forward'], ['LFS', 'Left Flamingo Stance'], ['RFS', 'Right Flamingo Stance'], ['BT', 'Back Turned'], ['CD', 'Shark Step']],
  'Jack-8': [['GMH', 'Gamma Howl'], ['GMC', 'Gamma Charge']],
  'Jin Kazama': [['ZEN', 'Zenshin'], ['CD', 'Crouch Dash']],
  'Jun Kazama': [['IZU', 'Izumo'], ['GEN', 'Genjitsu'], ['MIA', 'Miare']],
  'Kazuya Mishima': [['CD', 'Crouch Dash'], ['DVK', 'Devil Kazuya']],
  'King': [['JGS', 'Jaguar Step'], ['JGR', 'Jaguar Sprint'], ['CD', 'Crouch Dash']],
  'Kuma': [['HBS', 'Hunting Bear Stance'], ['ROLL', 'Bear Roll'], ['SIT', 'Bear Sit']],
  'Lars Alexandersson': [['DEN', 'Dynamic Entry'], ['SEN', 'Silent Entry'], ['LEN', 'Limited Entry']],
  'Marshall Law': [['DSS', 'Dragon Sign Stance (Dragon Charge)']],
  'Lee Chaolan': [['HMS', 'Hitman Stance'], ['MS', 'Mist Step'], ['SWAY', 'Sway']],
  'Leo Kliesen': [['KNK', 'Kinkei (Jin Ji Du Li)'], ['BOK', 'Bokuho (Fo Bu)'], ['CD', 'Jin Bu']],
  'Leroy Smith': [['HRM', 'Hermit']],
  'Lidia Sobieska': [['HRS', 'Horse'], ['CAT', 'Cat'], ['WLF', 'Stalking Wolf'], ['HAE', 'Heaven and Earth']],
  'Lili': [['BT', 'Back Turned'], ['DEW', 'Dew Glide'], ['RAB', 'Feisty Rabbit']],
  'Miary Zo': [['MOR', 'Morengy Miroso'], ['BAO', 'Baobab Mihira'], ['WAL', 'Tromba']],
  'Nina Williams': [['', 'Ducking Step'], ['', 'Sway']],
  'Panda': [['HBS', 'Hunting Bear Stance'], ['ROLL', 'Bear Roll'], ['SIT', 'Bear Sit']],
  'Paul Phoenix': [['CS', 'Cormorant Step'], ['SWA', 'Sway'], ['DPD', 'Deep Dive']],
  'Raven': [['LAB / BT', 'Labyrinth (Back Turned)'], ['SZN', 'Soulzone'], ['CD', 'Crouch Dash']],
  'Reina': [['WGS', 'Wind God Step'], ['SEN', 'Sentai'], ['SSH', 'Senshin'], ['UNS', 'Unsoku'], ['WRA', "Heaven's Wrath"], ['WDS', 'Wind Step']],
  'Sergei Dragunov': [['SNK', 'Sneak'], ['PGR', 'Pigeon Roll']],
  'Shaheen': [['SNK', 'Stealth Step']],
  'Steve Fox': [['DCK', 'Ducking'], ['EXT DCK', 'Extended Ducking'], ['PAB', 'Peekaboo'], ['FLK', 'Flicker'], ['SWY', 'Sway'], ['WV', 'Weave'], ['LNH', 'Lionheart']],
  'Victor Chevalier': [['IAI', 'Iai'], ['PRF', 'Perfumer']],
  'Ling Xiaoyu': [['AOP', 'Art of Phoenix'], ['RDS / BT', 'Rain Dance (Back Turned)'], ['HYP', 'Hypnotist']],
  'Yoshimitsu': [['DGF', 'Manji Dragonfly'], ['FLE', 'Flea'], ['IND', 'Indian Stance'], ['KIN', 'Kincho'], ['MED', 'Meditation'], ['NSS', 'No Sword Stance']],
  'Zafina': [['SCR', 'Scarecrow'], ['MNT', 'Mantis'], ['TRT', 'Tarantula']],
};

const slugify = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
export const tekken8Stances = Object.fromEntries(Object.entries(entries).map(([name, rows]) => [
  slugify(name), rows.map(([abbreviation, fullName], index) => ({
    abbreviation, name: fullName,
    input: stanceEntries[slugify(name)][index][0],
    notes: stanceEntries[slugify(name)][index][1] || '',
  })),
]));

const characterAliases = {
  'azucena-milagros': 'azucena',
  'king-ii': 'king',
  'kuma-ii': 'kuma',
  'lili-de-rochefort': 'lili',
  'reina-mishima': 'reina',
};
export const getCharacterStances = (character) => {
  const slug = character.slug || slugify(character.name);
  return tekken8Stances[characterAliases[slug] || slug] || tekken8Stances[slugify(character.name)] || [];
};

export const getStanceLabels = (stances) => Object.fromEntries(stances.flatMap(({ abbreviation, name }) =>
  abbreviation.split(' / ').filter(Boolean).map((alias) => [alias.toUpperCase(), name]),
));

export const stanceTokens = new Set(Object.values(tekken8Stances).flatMap((stances) => Object.keys(getStanceLabels(stances))));
