# Chart & Recall — World Geography Active Recall

An interactive 3D globe built for **active-recall revision** of world geography — the kind of drilling that actually helps for SSC CGL / UPSC / CDS-style general knowledge sections. You rotate a real globe, click a country, and have to *recall* its name, capital, and continent before anything is revealed — not just click around and read facts.

## Quick start

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (`http://localhost:5173` by default).

```bash
npm run build      # production build (also type-checks)
npm run preview    # serve the production build locally
npm run lint        # type-check only, no bundling
```

No API keys, no backend — everything (including the country dataset) is a static asset shipped in the app.

## What's implemented

- **3D globe** (real geographic polygons, not approximations) — drag to rotate, scroll/pinch to zoom, gentle auto-rotate until you first interact.
- **Explore mode**: click any of the 195 sovereign countries → recall its name, capital and continent before the answer is shown → get told exactly which fields were right or wrong, with the correct answer for anything missed → "Next Country" (weighted toward countries you're weaker on).
- **Quiz mode**: randomly-generated capital / continent / "find it on the globe" questions, plus a separate water-bodies find-it quiz. Live score.
- **Water bodies**: 19 oceans/seas/gulfs/bays as an optional layer, each with bordering countries and an exam-relevant fact.
- **Geographic features layer**: ~40 curated rivers, mountain ranges, deserts, straits, canals and islands (optional, off by default so the globe doesn't get cluttered).
- **Reference lines**: Equator, both Tropics, both polar circles, Prime Meridian — toggleable.
- **Progress tracking**, persisted to `localStorage`: countries learned, accuracy, quiz score, and a "weak countries" list.
- **Spaced-repetition-style quiz weighting**: countries you get wrong resurface more often; countries you've mastered resurface less (but not never).
- **Search**: type a country or capital, fly the camera to it.
- Territories/dependencies (Greenland, Puerto Rico, etc.) still render on the globe for visual completeness and are clickable for a quick note, but aren't part of the graded 195-country set — see below.

## Why this stack

- **Vite + React + TypeScript** — no need for Next.js's SSR/routing here; this is a single client-side canvas app, and Vite's dev server is faster to iterate against a WebGL-heavy page.
- **[react-globe.gl](https://github.com/vasturiano/react-globe.gl)** (wrapping `three-globe` / `three.js`) instead of hand-rolled Three.js — it does accurate GeoJSON-polygon hit-testing, camera fly-to, and point/path layers out of the box, which is exactly what "click detection must use real polygons, not nearest-point" needs. Verified its prop API against the current README before building against it rather than trusting memory.
- **zustand** for state (selection, mode, quiz flow, layers) — avoids prop-drilling across the header/sidebar/panels/globe without pulling in a heavier state library. `zustand/middleware`'s `persist` handles the `localStorage` progress store.
- **No photoreal earth texture.** The globe uses a plain navy `MeshPhongMaterial` plus `react-globe.gl`'s built-in atmosphere glow, and the starfield background is a pure-CSS radial-gradient pattern. This was a deliberate choice, not a shortcut: it means the app has **zero external image dependencies** — nothing to 404 if a CDN texture URL ever changes — and it reads more like a chart/instrument panel than a stock-photo Earth, which fit the "cartography, not sci-fi dashboard" visual direction better anyway.

## Data sources

| Data | Source | Notes |
|---|---|---|
| Country boundary polygons | [`world-atlas`](https://github.com/topojson/world-atlas) (npm), 50m resolution | TopoJSON → GeoJSON via `topojson-client`. Coordinates rounded to 4 decimals (~11 m precision, invisible at globe scale) — cut the payload from 3.9 MB to 1.9 MB. |
| Capital, continent, neighbours, area | [`mledoze/countries`](https://github.com/mledoze/countries) | Also gives the `borders` list used for "neighbouring countries" and the region/subregion used to derive the 7-continent model. |
| Precise capital-city coordinates | [`Stefie/geojson-world`](https://github.com/Stefie/geojson-world) | Needed separately from the country centroid — for a large country like Russia or Brazil, the country's centroid is nowhere near its actual capital. |
| Water bodies, geographic features, reference lines | Hand-curated | Sea/ocean *boundaries* aren't a solved, standardised open dataset the way country borders are, so these are rendered as labelled point markers rather than (unreliable) boundary polygons — see Limitations. |

All three fetched datasets are public/open and used only for coordinates and standard reference facts (names, capitals, borders) — not for prose.

### The "195 countries" figure

The graded set is the 194 countries `mledoze/countries` marks `independent: true`, plus Palestine (`PSE`, a UN observer state) — matching the 195 figure that's the standard reference count in SSC/UPSC-style material (it's also literally what you asked for in the original brief's dashboard mock). Taiwan and Kosovo, which many such datasets also flag as edge cases, are excluded to stay consistent with that convention.

## Answer checking

Typed answers ("Country", "Capital") are graded with typo-tolerant fuzzy matching rather than exact string equality — but this got real scrutiny rather than being a naive Levenshtein cutoff, because a geography quiz is *specifically* full of similar-looking-but-different real answers:

- Uses **Damerau-Levenshtein distance** (transpositions like "Indai" → count as one edit, not two) with a tolerance that scales with answer length.
- **Ambiguity-guarded**: a near-match is only accepted if the intended answer is the *uniquely* closest real country/capital — not just "close enough" in isolation. A naive version of this accepted "Niger" for "Nigeria", "Ireland" for "Iceland", "South Korea" for "North Korea", and "Kingston" for "Kingstown" — all genuinely different real places, not typos of each other. This was caught and fixed by exhaustively checking all 195×194 country-name pairs and all capital pairs (including multi-capital overrides) for accidental cross-matches; that scan now comes back clean.
- **Multi-capital overrides** for the handful of countries where "the" capital is genuinely ambiguous or commonly mistaught — South Africa (3 capitals), Bolivia, Sri Lanka, Malaysia, Eswatini (the source data only listed the *lesser*-known one), the Netherlands, Israel, Côte d'Ivoire, Benin, Tanzania and Myanmar. Both the well-known and official answers are accepted; the reveal panel explains the split.
- **Name aliases** (USA/US/United States, UK/Britain, Czechia/Czech Republic, Turkey/Türkiye, Burma/Myanmar, etc.) are accepted alongside the primary name.
- Continent is a select dropdown, not free text — there are only 7 valid answers, so typo-tolerance there would only be solving a problem that doesn't exist while adding risk.

## Known limitations / deliberate trade-offs

- **Water bodies and the geographic-features layer (rivers, mountains, deserts, straits, canals, islands) are point markers, not boundary polygons.** There's no standard, reliable open dataset for sea/ocean *boundaries* the way there is for country borders — even professional atlases draw these somewhat arbitrarily. Accurate, clickable points with real facts felt more honest than approximated polygons.
- **The geo-features layer is curated (~40 entries) for exam relevance, not exhaustive** — it's the commonly-tested set (Nile, Amazon, Himalayas, Sahara, Strait of Hormuz, Suez/Panama canals, etc.), not a full gazetteer.
- **Territories render but aren't quizzed.** Greenland, Puerto Rico, Hong Kong and similar dependencies show on the globe (so the map doesn't have odd blank gaps) and give a one-line note on click, but aren't part of the graded 195.
- **Country-polygon resolution is 50m** (Natural-Earth-derived, via `world-atlas`), patched with a 10m-resolution pull for Tuvalu specifically, since it's small enough to disappear entirely at 50m. This keeps the initial load light (~1.9 MB, ~660 KB gzipped) while still hitting all 195 countries. A handful of extremely small states (Vatican City, Monaco, etc.) are present but will render as very small click targets at continent-level zoom — zoom in for a bigger hit area.
- **Testing was thorough but not in an actual browser.** This environment can run `tsc`, `vite build`, and Node scripts, but has no real display or WebGL, so I validated as much as I could without one: full TypeScript compilation, a full production build, every source file requested through the dev server to confirm clean transformation, and exhaustive scripted data-integrity checks (all 195 countries present exactly once with valid geometry, zero answer-matching collisions across every country/capital pair). What I *can't* vouch for firsthand is the feel of the actual drag/zoom/click interaction — give that a run on first use.
- **Desktop was the explicitly tested target** (per the brief). The layout is responsive down to mobile widths via CSS media queries, but hasn't had the same scrutiny as desktop.
- `npm audit` flags a moderate advisory in `esbuild`/Vite's *dev server only* (a known, low-real-world-risk CORS issue affecting local development, not the production build or anything deployed). Fixing it means a Vite 8 major-version jump; I left that as a deliberate choice for you to make rather than force an untested upgrade.

## Regenerating the country dataset

`public/data/countries.geo.json` is generated, not hand-written:

```bash
npm run prepare-data
```

This re-runs `scripts/prepare-data.mjs` against `scripts/raw-countries.json` and `scripts/raw-capitals.json` (point-in-time snapshots already included in the repo) plus the `world-atlas` package. To refresh those snapshots from source:

```bash
curl -o scripts/raw-countries.json https://raw.githubusercontent.com/mledoze/countries/master/dist/countries.json
curl -o scripts/raw-capitals.json https://raw.githubusercontent.com/Stefie/geojson-world/master/capitals.geojson
```

## Project structure

```
src/
  components/     Globe3D, Header (search+mode), Sidebar (layers+legend),
                  ProgressDashboard, RecallPanel, InfoPanel, QuizBar
  store/          zustand stores — app/UI state, localStorage progress, geo data cache
  lib/            answer matching, quiz weighting, continent colours, geo data helpers
  data/           water bodies, geo features, reference lines, name/capital overrides
  types.ts
scripts/
  prepare-data.mjs      merges topology + metadata into public/data/countries.geo.json
  raw-countries.json    mledoze/countries snapshot
  raw-capitals.json     capital-coordinates snapshot
```

## Possible next steps

- Swap the geo-features layer's point markers for real traced polylines (river courses, mountain ridgelines) if a good open dataset turns up.
- MCQ variant of quiz mode for closer 1:1 practice with actual SSC CGL question format.
- Per-continent or per-region drilling ("quiz me on Africa only").
- Export/import progress as a JSON file, for moving between devices without relying on `localStorage`.
