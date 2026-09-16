export const DEFAULT_GAME_ID = "tekken-8";
export const DEFAULT_API_URL = "https://kekken-backend.onrender.com/api";

const normalizeApiBaseUrl = (value) => {
  const candidate = (value || DEFAULT_API_URL).trim().replace(/\/+$/, "");

  try {
    const url = new URL(candidate);
    if (!url.pathname || url.pathname === "/") {
      url.pathname = "/api";
    }
    return url.toString().replace(/\/$/, "");
  } catch {
    return candidate;
  }
};

export const API_BASE_URL = normalizeApiBaseUrl(
  import.meta.env?.VITE_API_URL
);

export class ApiRequestError extends Error {
  constructor(message, { status = 0, code = "REQUEST_FAILED" } = {}) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

const buildApiUrl = (path) => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

const canUseLegacyFallback = (response) =>
  response.status === 404 &&
  !response.headers.get("content-type")?.includes("application/json");

const readErrorPayload = async (response) => {
  try {
    return await response.json();
  } catch {
    return null;
  }
};

const requestJson = async (path, { fallbackPath, signal } = {}) => {
  let response = await fetch(buildApiUrl(path), {
    headers: { Accept: "application/json" },
    signal,
  });

  // Older deployments answer unknown /v1 routes with Express's HTML 404.
  // Keep their Tekken 8 routes usable during a staged rollout when CORS allows
  // the current frontend origin.
  if (fallbackPath && canUseLegacyFallback(response)) {
    response = await fetch(buildApiUrl(fallbackPath), {
      headers: { Accept: "application/json" },
      signal,
    });
  }

  if (!response.ok) {
    const payload = await readErrorPayload(response);
    throw new ApiRequestError(
      payload?.message || `The guide server returned ${response.status}`,
      {
        status: response.status,
        code: payload?.error?.code,
      }
    );
  }

  return response.json();
};

const asCharacterSummary = (character) => ({
  ...character,
  id: character.id || character._id,
  _id: character._id || character.id,
  gameId: character.gameId || DEFAULT_GAME_ID,
  hasCounterGuide:
    character.hasCounterGuide ??
    (Array.isArray(character.counterSchema) &&
      character.counterSchema.length > 0),
});

export const getGames = async ({ signal } = {}) => {
  const payload = await requestJson("/v1/games", { signal });
  const gameList = Array.isArray(payload) ? payload : payload?.items;

  if (!Array.isArray(gameList)) {
    throw new ApiRequestError("The game response was not a list", {
      code: "INVALID_RESPONSE",
    });
  }

  return gameList;
};

export const getTekken7Essentials = async ({ signal } = {}) => {
  const payload = await requestJson('/v1/games/tekken-7/essentials', { signal });
  if (payload?.gameId !== 'tekken-7' || !Array.isArray(payload.characters) || !payload.characters.length) {
    throw new ApiRequestError('The Tekken 7 guide response was invalid', { code: 'INVALID_RESPONSE' });
  }
  return payload;
};

export const getCharacters = async ({
  gameId = DEFAULT_GAME_ID,
  view = "summary",
  signal,
} = {}) => {
  const encodedGameId = encodeURIComponent(gameId);
  const payload = await requestJson(
    `/v1/games/${encodedGameId}/characters?view=${encodeURIComponent(view)}`,
    {
      fallbackPath:
        gameId === DEFAULT_GAME_ID ? `/characters?view=${view}` : undefined,
      signal,
    }
  );
  const characters = Array.isArray(payload) ? payload : payload?.items;

  if (!Array.isArray(characters)) {
    throw new ApiRequestError("The character response was not a list", {
      code: "INVALID_RESPONSE",
    });
  }

  return characters.map(asCharacterSummary);
};

export const getCharacter = async (
  characterId,
  { gameId = DEFAULT_GAME_ID, signal } = {}
) => {
  const encodedGameId = encodeURIComponent(gameId);
  const encodedCharacterId = encodeURIComponent(characterId);
  const payload = await requestJson(
    `/v1/games/${encodedGameId}/characters/${encodedCharacterId}`,
    {
      fallbackPath:
        gameId === DEFAULT_GAME_ID
          ? `/characters/${encodedCharacterId}`
          : undefined,
      signal,
    }
  );
  const character = payload?.data || payload;

  if (!character || typeof character !== "object" || !character.name) {
    throw new ApiRequestError("The character response was invalid", {
      code: "INVALID_RESPONSE",
    });
  }

  return character;
};

const getLegacyStatsUrl = (playerId) => {
  try {
    const apiUrl = new URL(API_BASE_URL);
    return `${apiUrl.origin}/stats/replays?id=${encodeURIComponent(playerId)}`;
  } catch {
    return `/stats/replays?id=${encodeURIComponent(playerId)}`;
  }
};

export const getReplays = async (
  playerId,
  { gameId = DEFAULT_GAME_ID, signal } = {}
) => {
  const normalizedPlayerId = playerId.trim();
  const payload = await requestJson(
    `/v1/games/${encodeURIComponent(gameId)}/players/${encodeURIComponent(
      normalizedPlayerId
    )}/replays`,
    {
      fallbackPath:
        gameId === DEFAULT_GAME_ID
          ? getLegacyStatsUrl(normalizedPlayerId)
          : undefined,
      signal,
    }
  );

  if (!Array.isArray(payload)) {
    throw new ApiRequestError("The replay response was not a list", {
      code: "INVALID_RESPONSE",
    });
  }

  return payload;
};
