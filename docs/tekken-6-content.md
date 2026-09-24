# Tekken 6 archive

The local `public/data/tekken-6.json` covers the **console / Bloodline Rebellion** version. Tekken Zaibatsu explicitly assigns its move lists to those releases. This is not a separate reconstruction of the original 2007 arcade version.

## Coverage

The import contains 41 roster entries: 40 fighters with moves and one mimic, Mokujin. Every non-mimic has frame data, actual juggle routes, wall combos, and standing/crouching punishment options. Eddy/Christie and Kuma/Panda remain separate roster entries; shared combo material retains relevant body/character consistency notes.

| Content | Rows |
| --- | ---: |
| Moves | 6,270 |
| Throws and throw chains | 600 |
| Stances | 521 |
| Unblockables | 139 |
| Strings | 144 |
| Additional techniques | 166 |
| Main/grouped combos | 638 |
| Wall combos | 71 |
| Punishment options | 484 |
| Total | 9,033 |

There are 4,443 rows with frame fields. The hidden-move FAQ contributed 246 reviewed entries, merged into existing moves when appropriate; this is not a count of 246 distinct new moves. SD Tekken supplied 1,018 missing frame fields. Sixty-two move rows preserve conflicting startup reports instead of silently replacing them. Combo rows can have several starters sharing one follow-up, so row totals are not a count of unique executable routes.

## Sources

| Source | Use and scope |
| --- | --- |
| [Tekken Zaibatsu move lists](https://web.archive.org/web/20201206040751/http://www.tekkenzaibatsu.com/tekken6/_movelist.php) | Forty character pages: move commands, names, damage, hit levels, properties, stance context, and throw chains. The source identifies console/BR and reports standing-opponent damage using its 120% practice convention. |
| [Kenneth Walton / Wild Man X hidden-move FAQ](https://web.archive.org/web/20201206044531/http://www.tekkenzaibatsu.com/tekken6/faq/gen-hidden-01.txt) | Version 0.31, February 15, 2010; PS3 US testing. Additional moves, transitions, cancels, and conditions. |
| [Kenneth Walton combo FAQ](https://web.archive.org/web/20201206044532/http://www.tekkenzaibatsu.com/tekken6/faq/gen-combo-01.txt) | Version 0.40, February 15, 2010. Launchers, natural strings, grouped juggles and reported damage. Natural strings inform punishment and are not presented as juggle routes. |
| [Avoiding the Puddle frame index](https://web.archive.org/web/20140626115612/http://www.avoidingthepuddle.com/tekken-6-frame-data/) | Thirty-nine linked character pages, including shared/mimic entries. The site translates Ina Tekken and acknowledges possible translation errors. Supplies the principal startup/block/hit/counter-hit fields. |
| [SD Tekken frame index](https://sdtekken.com/tekken-6/frame-data/) | Supplemental tables for Alisa, Lars, Leo, Miguel, Lili, Feng, Asuka, Jack-6 and Hwoarang. Fills missing values and records startup disagreements. |
| [Game Watch BR player guide](https://game.watch.impress.co.jp/docs/20090311/tk6_br.htm) | March 11, 2009. Nine character-guide pages (`tk6_br1b.htm` through the `1b–1d`, `2b–2d`, `3b–3d` groups) provide additional basic juggles, wall routes and execution conditions. Japanese numpad/button notation is converted to the site's input notation. |
| [TekkenZone T6 punishers](https://www.tekkenzone.net/tekken6/punishers/) | Curated standing recommendations in 10/12/14-frame punishment windows. Eighty-three selected string options supplement the measured-startup ladder. Repeated chart recommendations are consolidated and retain their actual opening startup, not the column's window. |
| [Creative Uncut T6 gallery](https://www.creativeuncut.com/art_tekken-6_a.html) | Bandai Namco character artwork, including the associated BR gallery; individual framing is stored with each character. |

## Selection and notation rules

- Earlier/later Tekken move or frame data is never substituted. The requested `tekkenpunisher.com` identifies its data as **Tekken 7** and is excluded from this archive.
- Unknown frame values stay blank. Stance attacks and continuation-hit timings are not matched to ordinary standing attacks just because their button strings look alike. Different reported startup values remain visible; punishment uses the slower reported value.
- Ordinary punishment options use documented direct high/mid/special-mid attacks and normal-hit strings, sorted by measured startup through i18. Slower normal-hit launchers are retained. Counter-hit-only launchers, lows, stance-only attacks, and motion recommendations without validated total input timing are excluded from the ladder. Range and execution still matter; Flash has an explicit short-range note.
- Complete duplicate combo routes are removed across main/wall sections. Identical follow-ups are grouped under their compatible starters, preserving damage and conditions. Reported damage is not recalculated across differing source conventions.
- Source conditions survive translation, including counter hit, whiffed opening hits, bound, side-specific sidestep cancels, delays, crouch cancels, and character consistency. Examples covered by regression checks include Steve's FLK notation, Nina's player-side-dependent SSR cancel, Leo's crouch dash, Alisa's tech-roll-sensitive SBT follow-up, and the Eddy/Christie route difference.
- Thirty-five commands with malformed or unresolved source notation were omitted rather than guessed. The importer records them in `.seo-cache/tekken6/excluded-commands.json`. Other source conflicts and skipped punishment recommendations have separate audit files in the same ignored cache.
- Mokujin points to the borrowed fighter's guide rather than duplicating every moveset. Its note preserves the body-size caveat.

## Rebuilding and checks

The downloader caches the public reference pages under ignored `.seo-cache/tekken6/`. Python requires `lxml`; Node uses the project's notation parser. Existing portrait metadata is retained during re-import.

```text
node scripts/fetch-tekken6.mjs
python scripts/import-tekken6.py
node --test tests/tekken6.test.mjs
```

Seven data tests cover roster/source scope, frame values and disagreements, correct punishment windows, Japanese translation regressions, hidden moves and throw chains, every emitted input/alternative/starter, and duplicate complete routes. All seven pass. These validate extraction and presentation contracts; the imported routes have not been independently tested in an emulator or on hardware.
