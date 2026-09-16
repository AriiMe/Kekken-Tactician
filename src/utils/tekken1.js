export async function getTekken1Guides({ signal } = {}) {
  const response = await fetch('/data/tekken-1.json', {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!response.ok) throw new Error('The Tekken 1 guides could not be loaded.');
  const data = await response.json();
  if (data.gameId !== 'tekken-1' || !Array.isArray(data.characters) || !data.characters.length) {
    throw new Error('The Tekken 1 guide file is invalid.');
  }
  return data;
}
