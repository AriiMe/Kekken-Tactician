# Search and page delivery

`npm run build` reads the public guide API and local classic-game JSON, builds
the browser and server bundles, renders the existing React pages to HTML, and
audits the result. The build fails if required guide sources are unavailable;
an incomplete roster must not silently replace a working deployment.

- `scripts/prepare-seo.mjs` owns route metadata and legacy redirects. Run
  `npm run seo:refresh` and commit `src/data/seoCatalog.json` and `vercel.json`
  when adding or renaming routes, before deployment reads Vercel configuration.
- `PageSeo` is the only metadata owner, including on client-side navigation.
  Section components must not add competing descriptions or canonical tags.
- Every guide is rendered through the same React components used in the browser.
  Public data is embedded safely for the first render, then refreshed from its
  existing API. The HTML snapshot refreshes on a frontend deployment; backend-only
  content changes require a frontend rebuild to update crawler-visible HTML.
- The canonical origin is `https://www.tekktician.com`, matching the live redirect.
  Keep the existing Tekken 8 name/ObjectId canonical paths. Older name variants
  and slug identifiers redirect to them, preserving incoming links.
- `dist/sitemap.xml` is generated from real, indexable routes. `robots.txt`
  advertises it. Stats, the easter egg and the 404 page are excluded and noindexed.
  No invented modification dates, ratings, review counts or keyword lists.
- Vercel serves real HTML files and the custom `404.html`. Do not restore the
  catch-all rewrite to `/`: that creates identical initial metadata and soft 404s.
- Only the current route's CSS is included, and its script is preloaded. Roster
  cards are real links for keyboard users and crawlers.

Validation: `npm run lint`, `npm run build`, `node --test tests/*.test.mjs`, then
check public HTML, sitemap content type, legacy redirects and a genuine HTTP 404.
Also check client navigation, search, icon preferences and mobile layouts.

After deployment, submit `https://www.tekktician.com/sitemap.xml` in the site's
Google Search Console property and inspect representative game/character URLs.
Sitemaps help discovery; they do not guarantee indexing or rankings. Google does
not use the meta keywords tag for ranking. Useful visible content, unique page
titles, descriptive snippets and stable canonical routes are the focus here.

References: [JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics),
[sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap),
[canonical URLs](https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls),
[Vercel static 404s](https://vercel.com/kb/guide/custom-404-page).
