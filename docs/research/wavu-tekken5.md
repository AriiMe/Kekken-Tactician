# Tekken 5 / Dark Resurrection enrichment

Wavu's Tekken 5 section is explicitly **Dark Resurrection**. The existing vanilla data remains separate, with vanilla listed before DR in shared move records. Finding a move on Wavu does not prove that it was added in DR, so this import never marks a move `dr-only`.

The import reviewed 34 character guides: 33 distinct movesets plus Mokujin. Eddy's page enriches the existing Christie guide, which Eddy already shares. The original portraits, portrait framing, classic routes, vanilla measurements, and PlayStation 3 restriction on playable Jinpachi are preserved.

`wavu-tekken5-import.json` records the source pages and revision IDs, per-character additions, and commands skipped because their context could not be mapped safely. Source metadata stays out of the player-facing move rows.

The importer adds missing DR moves and measured frame fields, documented standing/crouching punishers through i18 plus slower launchers, and compact selections of missing juggle, wall, and conditional follow-up routes. It keeps execution, character-size, axis, and recovery conditions. Follow-up damage is labeled separately from total combo damage. Identical routes are not re-added; compatible launchers share follow-ups. Fake-combo sections and unfinished examples are excluded.

For strings, Wavu's startup field often measures the final hit, while its punishment tables use the first attack's startup. Imported move rows therefore carry `frameScope: "Follow-up only"`; explicit punishment rows resolve the opening hit or use the source's stated punishment threshold. Input motions and just-frame requirements remain visible. Unknown values are left absent.

Most Wavu DR strategy and tech tabs are unfinished. Move properties and conditional combo notes are imported where available, and Baek's documented Flamingo cancel and buffered 3+4 loop technique is included. Empty tabs do not generate filler content.

To refresh the public-source cache and enrich the current file:

```text
node scripts/import-wavu-tekken5.mjs --fetch
node scripts/import-wavu-tekken5.mjs --import
node --test tests/tekken5.test.mjs tests/wavu-tekken5.test.mjs
```

The ignored `.seo-cache/wavu-tekken5` directory holds research downloads. The import is additive and repeatable. Review updated source revisions and the coverage report before accepting a refresh.
