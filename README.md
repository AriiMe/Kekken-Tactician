# TEKKTICIAN

TEKKTICIAN is a community-built fighting-game knowledge hub for combos,
punishment, matchup notes, and practical lab tools. Tekken 8 is the active
library; the homepage also presents the planned Tekken archive and additional
fighting games as unavailable roadmap entries.

## Local development

Requirements: Node.js 18 or newer and npm.

```bash
npm ci
npm run dev
```

The public production API defaults to
`https://kekken-backend.onrender.com/api`. Create `.env.local` only when you
need to point the frontend at another backend (the `/api` suffix is required):

```dotenv
VITE_API_URL=http://localhost:3000/api
```

The frontend prefers the versioned, game-scoped endpoints:

- `GET /v1/games/tekken-8/characters?view=summary`
- `GET /v1/games/tekken-8/characters/:characterId`
- `GET /v1/games/tekken-8/players/:polarisId/replays`

During a staged rollout, frontend origins already allowed by an older backend
can fall back to the existing `/characters`, `/characters/:characterId`, and
`/stats/replays` routes. Other games never fall back to the Tekken 8 collection.

## Useful commands

```bash
npm run dev
npm run lint
npm run build
npm run preview
```

## Frontend structure

- `src/data/games.js` is the source of truth for homepage games, availability,
  artwork, and routes.
- `src/pages/GameLibrary.jsx` renders the multi-game landing page.
- `src/utils/inputNotation.js` parses command notation without React concerns.
- `src/utils/InputNotation.jsx` renders notation text or accessible command
  icons and owns display preferences.
- `src/utils/renderInputImage.js` keeps legacy one-argument call sites working
  while they migrate to the component API.

Client routes are lazy-loaded, while `/` remains in the initial bundle. Vercel
rewrites deep links to `index.html` through `vercel.json`.

## Artwork

The game tiles use official title-archive or official storefront artwork. File
origins and SHA-256 hashes are recorded in
[`public/game-art/SOURCES.md`](public/game-art/SOURCES.md). TEKKTICIAN claims no
ownership of game names, artwork, logos, or trademarks.

## Deployment checklist

Before pointing `tekktician.com` at production:

1. Optionally set `VITE_API_URL` (including `/api`) when not using the Render
   production API.
2. Allow `https://tekktician.com` in the API CORS configuration.
3. Confirm the AdSense privacy/consent configuration for every served region.
4. Run `npm run lint` and `npm run build`.
