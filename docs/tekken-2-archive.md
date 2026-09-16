# Tekken 2 archive

The guide is a static public JSON file: `public/data/tekken-2.json`. It uses the
shared classic-game view and needs no backend or Render data import.

## References and scope

- [Chin / Slikatel, Combo Guide v0.1](https://gamefaqs.gamespot.com/arcade/583639-tekken-2/faqs/966)
  supplies the initial juggle routes.
- [Meanbean, Move List and Guide v2.30](https://gamefaqs.gamespot.com/ps/198899-tekken-2/faqs/939)
  supplies throws, selected key moves, preset strings and additional routes.
- [Namco's original character pages](https://www.bandainamcoent.co.jp/cs/list/tekken2/frame.html)
  supply the local GIF artwork. The Roger/Alex page uses Alex's face twice;
  Roger therefore uses the separate Roger illustration from that page.

Each move and route has a `sourceId` matching `source.references`. There are 25
character pages, with four routes each. Alex/Roger and Devil/Angel share move
sets but have separate pages and artwork. Key moves are a curated selection,
not a complete transcription of either FAQ. Labels and explanations are written
for this site's guide layout.

Uppercase directions in the references become held directions (`~df`); `D#`
becomes full crouch (`FC`). `(WC)` commands use down inputs, while `(WS)` remains
the rising attack marker. Between buttons, `~` retains quick successive presses.
Preset strings use comma-separated inputs; their rhythm still needs practice.
Jun's ten-hit string has nine button commands because the ending hits twice.

Grounded endings are described separately from airborne hits. Counter-hit and
launcher conditions remain with the relevant route. Routes requiring deliberate
misses were excluded. These are documented routes, not newly emulator-tested
claims about every opponent, distance or game revision. Damage totals are omitted.

`node --test tests/*.test.mjs` checks roster coverage, reference IDs, notation
parsing, local image files, source-specific conditions and archive loading.
