# Tekken 1 content review — 2026-09-16

Scope: the PlayStation archive in `public/data/tekken-1.json`.

## References

- [Slikatel's Tekken Combo Guide](https://gamefaqs.gamespot.com/ps/366755-tekken/faqs/4252): 50 selected juggle routes covering all 17 fighters. Each route records `sourceId: slikatel-combos`. Shared-character headings apply to both characters; character-only subsections stay with that character. Slash-separated alternatives were resolved to one command, not concatenated. Names and execution notes are written for this site's notation.
- [jesus2099's PlayStation move list](https://gamefaqs.gamespot.com/ps/366755-tekken/faqs/63721): based on the European PlayStation release; used to cross-check crouching uppercuts, inherited move sets, and throw commands.
- [Tekken 1 combo demonstration](https://www.youtube.com/watch?v=LPMmGvQH5TY): distinguishes Kunimitsu's seven-hit sequence from the ten-hit sequences.
- [King's original-game move list](https://tekken.fandom.com/wiki/King/Tekken_Movelist): corroborates the three, not four, repeated kicks in his ten-hit sequence.
- [GKomatsu's original-game move list](https://gamefaqs.gamespot.com/ps/366755-tekken/faqs/4249): corroborates Wang's ten-hit sequence, Kuma's crouching uppercuts, the windup motion, and Kunimitsu's cartwheel follow-up.

## Corrections

- Removed Armor King's empty Multi Slide Kicks row. Searches found only the same incomplete historical entry; the documented Triple Slide Kick remains.
- Corrected Kuma and Prototype Jack's crouching triple uppercut from 1,4,1 to 1,2,1.
- Replaced Kunimitsu's misplaced Mishima uppercut route with documented standing-uppercut juggles.
- Replaced the old Law route with whiffed punches and Yoshimitsu knockdown follow-up with documented juggles.
- Corrected the Mishima double-axe-kick follow-up to a crouch dash followed by neutral and 4,4.
- Removed an extra forward dash from Kunimitsu's cartwheel follow-up; press 1+2 during the cartwheel.
- Removed extra repeated buttons from King's and Wang's long sequences. Wang inherits Michelle's sequence in the PlayStation move list.
- Renamed Attack Strings to 10 Hit Combos, with a seven-hit exception for Kunimitsu. Ganryu has no ten-hit section.
- Removed unresolved editorial notes and the verification UI. Empty commands are rejected by the data tests.

Routes were checked against published original-game documentation, not tested in an emulator. Automated tests check coverage, source links, notation parsing, and known transcription errors; they cannot prove game timing or hit registration. No damage totals or universal matchup guarantees were added.
