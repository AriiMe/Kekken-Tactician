# Tekken 5 / Dark Resurrection content

The combined game ID and character routes are unchanged. `availability: "dr-only"` means a confirmed addition. `edition` identifies documented coverage, not exclusivity. `versions` contains edition-specific details in `tekken5`, `dr` order; identical fields remain on the parent row.

Vanilla frame measurements are scoped to Tekken 5. DR values are not inferred from vanilla. Raven's DR d/f+2 startup (16 frames) is independently documented in his DR FAQ; its other DR frame fields remain absent. Branch frame values are labeled “Follow-up only.” Damage strings retain the preceding hits when a move-list branch is expanded.

The move lists and frames come from the linked character tables under the [vanilla move index](https://web.archive.org/web/20201206040736/http://www.tekkenzaibatsu.com/tekken5/_movelist.php), [vanilla frame index](https://web.archive.org/web/20201206040736/http://www.tekkenzaibatsu.com/tekken5/_framedata.php), and [DR move index](https://web.archive.org/web/20201206040358/http://www.tekkenzaibatsu.com/tekken5dr/_movelist.php).

The [DR Wild FAQ](https://web.archive.org/web/20201206043038/http://www.tekkenzaibatsu.com/tekken5dr/faq/gen-move-02.txt), sections 8–11, distinguishes added commands, changed commands, changed properties, hidden moves and DR combo routes. A “New” table marker does not make a command exclusive when that same command exists in vanilla with different properties. For example, Anna's d/f+3,2,1,4 has different final-hit behavior, while u/f+3+4 is a DR addition.

The [vanilla combo FAQ](https://web.archive.org/web/20201206044419/http://www.tekkenzaibatsu.com/tekken5/faq/gen-combo-01.txt) documents PS2 US testing and explicitly warns about arcade 5.1 differences. Two clear routes per source launcher group were selected where available, then repeated follow-ups were grouped. Damage ranges account for documented launcher adjustments. Multi-hit starters do not imply every preceding hit is guaranteed. Wall requirements and counter hits remain explicit.

Useful commands supplement the tables from the supplied hidden-move and taunt FAQs. The King, Lei, Law and Marduk guides contribute buffered throws, crouch cancels and stance transitions. Pre/post-match presentation choices, customization, unlockables and dialogue are omitted. The Ling tricks guide mixes setups and version-sensitive information; it is not treated as a blanket source of guaranteed vanilla combos. Lili's preliminary arcade FAQ explicitly mentions test-version uncertainty, so its disputed frame values were not imported.

This is an expansion, not an exhaustive transcription. Ambiguous alternatives, charged timings, footnote-dependent routes and unresolved multi-throw trees are omitted rather than guessed. Unmatched existing entries remain labeled `unverified`. Eddy points to Christie's shared guide. Jinpachi's PS3 playability is distinguished from his boss appearances.

Validation: `tests/tekken5.test.mjs` checks edition ordering, new-move exclusivity, frame scope, branch damage, stance/throw context, notation and route duplication. Browser checks cover stacked version details and the DR-only badge at desktop and mobile widths. Source checks are not in-game retesting.
