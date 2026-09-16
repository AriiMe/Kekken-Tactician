# Tekken Tag Tournament 2 essentials

Reviewed 16 September 2026. Console / Unlimited roster: 59 slots, including
57 fixed movesets, Mokujin and configurable Combot. Devil Kazuya is Kazuya's
in-match transformation, not an additional roster slot.

The backend owns `content/essentials/tekken-tag-2.json`; the frontend requests
`/api/v1/games/tekken-tag-2/essentials`. No MongoDB import or editor overwrite.

## References and selection

- [Catlord / Hans Poorvin, move list v1.24](https://gamefaqs.gamespot.com/ps3/652997-tekken-tag-tournament-2/faqs/64909):
  character-specific sample combo inputs, taggable moves and stance entries.
  Two solo routes per fixed moveset, plus a short Paul route from the thread below.
  Functional game inputs were curated into our schema; no guide prose was copied.
- [TekkenDocs Tag 2 / RBNorway](https://tekkendocs.com/tag2/): actual Tag 2 startup
  values for the selected standing/while-rising punishment commands. These are a
  small set of usable picks, not an exhaustive or maximum-damage punishment chart.
  Per-character source URLs are in the backend data. For Christie and Panda, the
  shared moves are corroborated by the FAQ's joint Christie/Eddy and Kuma/Panda sections.
- [GameFAQs combo thread](https://gamefaqs.gamespot.com/boards/652997-tekken-tag-tournament-2/64087315):
  post 7's short Paul b+3 route and post 5's Paul/Anna Tag Assault. Read both pages;
  excluded jokes, ambiguous shorthand and the route explicitly called inconsistent.
- [Great Combo reference](https://tekken.fandom.com/wiki/Great_Combo): selected
  special team sequences, partner requirements and timing, linked in Credits
  (Tekken Wiki, CC BY-SA). Great Combos are distinct from ordinary Tag Assaults.
- [Tekken Zaibatsu archive](https://web.archive.org/web/20201206040146/http://www.tekkenzaibatsu.com/forums/forumdisplay.php?forumid=196)
  and [EventHubs index](https://www.eventhubs.com/guides/2012/sep/10/tekken-tag-tournament-2-moves-characters-combos-and-strategy-guides/)
  were reviewed for the character guide structure and coverage. The early
  EventHubs index does not include every later console DLC character.

## Notation and conditions

- `into` is a complete move boundary; commas stay inside a command/string.
- `bound` / `B!` reuses the existing extender artwork with the correct Bound label.
- `tag` / `5` renders a distinct TAG control, including chords and immediate tags.
- TTT2's original `>` can mean delayed input; it was **not** blindly converted into
  our step separator. The selected routes retain explicit timing and hold notes.
- Baek's b+3 bound requires Flamingo: the combo and bound list explicitly show FLA,
  and the stance entry is supplied. Other displayed stance abbreviations also have entries.
- Jinpachi's sample WS+1,1 starter has conflicting normal-hit/CH implications in
  the frame reference; use the separately documented WS+2 route instead.
- Miguel's WS+2,2 launch depends on hit circumstances; use the documented df+2,1
  route for the second main combo instead. WS+2,2 remains a damage punishment pick.
- No damage totals or universal partner follow-ups are inferred. Mokujin and
  Combot do not receive fabricated fixed combos. Routes are source-checked,
  not claimed to have been replayed in a game emulator.

## Artwork

59 Bandai Namco roster portraits preserved on the
[Tekken Wiki roster](https://tekken.fandom.com/wiki/Tekken_Tag_Tournament_2#Characters),
downloaded to `public/characters/tekken-tag-2`. They are compact WebP files at their
original small portrait size; CSS keeps them centered without upscaling into large
hero artwork. Exact source URLs are in `tekken-tag-2-artwork.json`.
