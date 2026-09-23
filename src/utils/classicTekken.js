export const gameTitles = { 'tekken-1': 'Tekken 1', 'tekken-2': 'Tekken 2', 'tekken-3': 'Tekken 3', 'tekken-tag-1': 'Tekken Tag Tournament', 'tekken-4': 'Tekken 4', 'tekken-5': 'Tekken 5 / Dark Resurrection' };

export async function getClassicTekkenGuides(gameId, { signal } = {}) {
  if (!Object.hasOwn(gameTitles, gameId)) throw new Error('Unsupported archive game.');
  const response = await fetch(`/data/${gameId}.json`, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error(`The ${gameTitles[gameId]} guides could not be loaded.`);
  const data = await response.json();
  if (data.gameId !== gameId || !Array.isArray(data.characters) || !data.characters.length) {
    throw new Error(`The ${gameTitles[gameId]} guide file is invalid.`);
  }
  return data;
}
