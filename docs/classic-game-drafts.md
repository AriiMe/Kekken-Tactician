# Classic game data preparation

Local drafts: `public/data/tekken-3.json`, `tekken-tag-1.json`, `tekken-4.json`, and `tekken-5.json` (including Dark Resurrection).

These follow the Tekken 1/2 `characters[].sections` structure. They are not connected to navigation, routes, or the sitemap yet. The roster is a starting inventory from the HISSATSU playlist, not a claim of complete game coverage; alternate characters and edition differences still need checking. DR uses the PS3 edition to accommodate the Jinpachi video.

Empty arrays mean no researched entries yet. Do not add placeholder commands, guessed frames, or “needs verification” rows to user-facing data. `portrait: null` means no artwork has been collected. Keep draft games unavailable until data and rendering are ready.

## Row contract

All populated rows use `name`, `input`, and optional concise `notes`. Do not store source links, source IDs or video timestamps in the game JSON. Verify commands during research before adding them.

| Section | Additional fields |
| --- | --- |
| `punishers` | `position`: `standing` or `while-standing`; `startupFrames`: integer; optional `damage`, `onHit`, `onBlock`, `conditions` |
| `throws` | `breakInput`: button notation, or null when unbreakable; `unbreakable`: boolean; optional `position`, `damage`, `conditions` |
| `chains` | `from`: preceding throw name; `breakInput`, `unbreakable` as above |
| `moves` | Optional `startupFrames`, `onBlock`, `onHit`, `damage`, `purpose`, `conditions` |
| `combos`, `wallCombos` | Optional `launchers`: alternative starter inputs; then `input` is the shared follow-up only. Without `launchers`, `input` is the entire route. Optional `damage`, `conditions` |
| `stances` | `abbreviation`; `input` is the entry command, `name` is the full stance name; optional `conditions` for a transition |
| `strings` | `hits`: integer; use “10 Hit Combo” for ten-hit strings |
| `unblockables`, `pounces` | Standard row fields; add conditions only when supported |
| `tagMoves` | Standard fields plus optional `purpose`, `conditions` |
| `teamCombos` | `partnerSlug`, `launchers` when applicable, and `steps`: ordered `{ characterSlug, input }` records; preserve which fighter performs each part |

Omit unknown optional values instead of using zero. A missing throw break is unknown, not unbreakable; only set `unbreakable: true` with evidence. Punishment and throw data needs separate research when a combo video does not supply it. Damage and conditions are edition-specific.

Use existing notation: `1/2/3/4`, `n` for neutral, `~f`/`~df` for held directions, commas inside moves, and ` > ` between combo steps. `>` renders as the existing Into icon. Group identical follow-ups instead of repeating routes. Keep plain instructions in `notes`/`conditions`, outside icon commands.

## Combined Tekken 5 / DR archive

One dataset, `tekken-5.json`, contains the Tekken 5 roster and the four DR playlist additions. There is no separate DR file or inheritance resolver. Record `sourceVersion` on imported rows (`tekken-5` or `tekken-5-dr`) so version-specific evidence remains identifiable. DR-only characters have `sourceVersion: "tekken-5-dr"`. Keep any demonstrated version-specific limitations in notes; grouping the games does not prove identical frame data.

## Before release

Fill the existing files progressively. Add display support for punisher frames, throw breaks, stance abbreviations and entry inputs; the current classic renderer only displays basic rows plus grouped launchers. Then add the game to the loader, routes, game library and SEO catalog. Verify command icons and responsive layouts. Do not publish an empty draft game or advertise a complete roster based solely on the playlist.
