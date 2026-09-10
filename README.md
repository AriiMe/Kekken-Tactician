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

Create `.env.local` when testing the Tekken 8 data-backed routes:

```dotenv
VITE_API_URL=https://your-api.example.com
```

The current frontend expects these read endpoints:

- `GET /characters`
- `GET /characters/:characterId`

Without `VITE_API_URL`, the game library still works and the Tekken 8 selector
shows a retryable configuration message instead of waiting indefinitely.

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

1. Set `VITE_API_URL` in the deployment environment.
2. Allow `https://tekktician.com` in the API CORS configuration.
3. Confirm the AdSense privacy/consent configuration for every served region.
4. Run `npm run lint` and `npm run build`.
