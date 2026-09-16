# Tekken 1 guide archive

The roster and all 17 character guides load from `public/data/tekken-1.json`.
No backend, Mongo import, authentication or third-party image request is needed.
The routes are `/games/tekken-1` and `/games/tekken-1/:characterSlug`.

Content comes from the move list supplied by the site owner on 2026-09-16.
LP/RP/LK/RK become 1/2/3/4, with simultaneous button chords preserved.
Held directions use the site's `~` notation. Tap, crouch, release, timing,
on-hit requirements and chained-throw context remain attached to each move.
Duplicate move entries are merged. Missing categories are omitted.
There is no invented frame, damage, throw-break or guaranteed-combo data.

Corrected spelling includes Michelle Chang, Lee Chaolan, Wang Jinrei and
Prototype Jack. FD is normalized to df. A malformed Heihachi `D,D F` is
normalized to d, df and disclosed in the row note. The original list has
strings labeled as ten attacks that contain eleven button steps; the UI
therefore calls the section Attack Strings without asserting a hit count.

Known source ambiguities are visible as Needs verification: Kunimitsu's
Mishima-like combo, the Kazuya/Heihachi Double Axe Kick route mismatch,
Kuma/Prototype Jack's `4` inside a Triple Uppercut, Yoshimitsu's pounce
route and Armor King's missing Multi Slide Kicks input. No in-game testing
is claimed. Tekken 1 Kunimitsu is included; the earlier exclusion applied
only to the empty Tekken 8 spreadsheet tab.

Original portraits are stored locally as an unchanged sprite sheet. See
`public/characters/tekken-1/README.md` for provenance and mapping notes.

Validation: `node --test tests/tekken1.test.mjs`, `npm run lint`, `npm run build`.
