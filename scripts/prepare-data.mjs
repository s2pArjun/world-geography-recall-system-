// One-off data preparation script.
// Merges world-atlas country polygon geometry (50m resolution) with
// mledoze/countries metadata (capital, region, neighbours, coordinates)
// into a single static GeoJSON file the app fetches at runtime.
//
// Re-run with: npm run prepare-data
// (requires `world-atlas` to be installed: npm install --no-save world-atlas@2.0.2)

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import * as topojsonClient from 'topojson-client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const topoPath = path.join(root, 'node_modules/world-atlas/countries-50m.json');
const topoHiResPath = path.join(root, 'node_modules/world-atlas/countries-10m.json');
const rawCountriesPath = path.join(root, 'scripts/raw-countries.json');
const rawCapitalsPath = path.join(root, 'scripts/raw-capitals.json');
const outPath = path.join(root, 'public/data/countries.geo.json');
const reportPath = path.join(root, 'scripts/prepare-data-report.json');

// Manual fill-in for the one sovereign country (South Sudan, independent
// 2011) missing from the third-party capitals point dataset.
const CAPITAL_COORD_OVERRIDES = {
  SSD: [31.6, 4.85] // Juba — [lng, lat]
};

if (!existsSync(topoPath)) {
  console.error('Missing world-atlas topojson. Run: npm install --no-save world-atlas@2.0.2');
  process.exit(1);
}
if (!existsSync(rawCountriesPath)) {
  console.error('Missing scripts/raw-countries.json (mledoze/countries dump).');
  process.exit(1);
}

const topology = JSON.parse(readFileSync(topoPath, 'utf-8'));
const rawCountries = JSON.parse(readFileSync(rawCountriesPath, 'utf-8'));
const rawCapitals = existsSync(rawCapitalsPath)
  ? JSON.parse(readFileSync(rawCapitalsPath, 'utf-8'))
  : { features: [] };

const capitalCoordByIso3 = new Map();
for (const f of rawCapitals.features) {
  const iso3 = f.properties?.iso3;
  if (iso3 && f.geometry?.type === 'Point') {
    capitalCoordByIso3.set(iso3, f.geometry.coordinates); // [lng, lat]
  }
}
for (const [iso3, coord] of Object.entries(CAPITAL_COORD_OVERRIDES)) {
  capitalCoordByIso3.set(iso3, coord);
}

// --- 1. TopoJSON -> GeoJSON -------------------------------------------------
const geoRaw = topojsonClient.feature(topology, topology.objects.countries);

// A handful of ISO numeric codes are shared by a country and a small
// external territory in this source (e.g. Australia's "036" also covers
// the uninhabited Ashmore & Cartier Islands as a separate geometry). Keep
// only the largest geometry per id — a reliable proxy for "the country"
// rather than an attached speck — so a territory doesn't silently overwrite
// or duplicate the real country's polygon.
function coordCount(geometry) {
  let n = 0;
  const walk = (node) => {
    if (typeof node[0] === 'number') {
      n++;
      return;
    }
    for (const child of node) walk(child);
  };
  walk(geometry.coordinates);
  return n;
}

const byId = new Map();
for (const f of geoRaw.features) {
  const existing = byId.get(f.id);
  if (!existing || coordCount(f.geometry) > coordCount(existing.geometry)) {
    byId.set(f.id, f);
  }
}
let geo = { type: 'FeatureCollection', features: [...byId.values()] };
const droppedDuplicates = geoRaw.features.length - geo.features.length;
// geo.features[i]: { type:'Feature', id: '356', properties:{name:'India'}, geometry }

// --- 1b. Patch in geometry for any sovereign country the 50m generalisation
// drops entirely (islands small enough to vanish at 1:50,000,000 — e.g.
// Tuvalu, total land area ~26 km²) using the higher-resolution 10m file
// just for those, rather than paying the 10m size cost for the whole globe.
const patched = [];
if (existsSync(topoHiResPath)) {
  const idsSoFar = new Set(geo.features.map((f) => String(parseInt(f.id, 10))));
  const targetCcn3 = new Set(
    rawCountries.filter((c) => (c.independent === true || c.cca3 === 'PSE') && c.ccn3).map((c) => String(parseInt(c.ccn3, 10)))
  );
  const missingCcn3 = [...targetCcn3].filter((id) => !idsSoFar.has(id));
  if (missingCcn3.length > 0) {
    const topoHiRes = JSON.parse(readFileSync(topoHiResPath, 'utf-8'));
    const geoHiRes = topojsonClient.feature(topoHiRes, topoHiRes.objects.countries);
    for (const wantedId of missingCcn3) {
      const candidates = geoHiRes.features.filter((f) => f.id && String(parseInt(f.id, 10)) === wantedId);
      if (candidates.length === 0) continue;
      const best = candidates.reduce((a, b) => (coordCount(b.geometry) > coordCount(a.geometry) ? b : a));
      geo.features.push(best);
      patched.push(best.properties?.name ?? wantedId);
    }
  }
}

// --- 2. Build metadata lookup by numeric ISO code (ccn3) --------------------
const SEVEN_CONTINENT = (region, subregion) => {
  if (region === 'Africa') return 'Africa';
  if (region === 'Europe') return 'Europe';
  if (region === 'Asia') return 'Asia';
  if (region === 'Oceania') return 'Oceania';
  if (region === 'Antarctic') return 'Antarctica';
  if (region === 'Americas') {
    if (subregion === 'South America') return 'South America';
    return 'North America'; // Northern America, Central America, Caribbean
  }
  return region || 'Unknown';
};

// Palestine is a UN-observer state widely taught alongside the 194 that
// mledoze marks `independent:true`; SSC/UPSC materials commonly cite "195
// countries" for exactly this union, so we include it explicitly.
const SOVEREIGN_195 = new Set(
  rawCountries.filter((c) => c.independent === true || c.cca3 === 'PSE').map((c) => c.cca3)
);

const byCcn3 = new Map();
for (const c of rawCountries) {
  if (!c.ccn3) continue; // e.g. Kosovo has no ISO numeric code
  byCcn3.set(String(parseInt(c.ccn3, 10)), c);
}

const cca3ToName = new Map(rawCountries.map((c) => [c.cca3, c.name.common]));

// --- 3. Merge ----------------------------------------------------------------
const matched = [];
const unmatched = [];

for (const feature of geo.features) {
  const key = String(parseInt(feature.id, 10));
  const meta = byCcn3.get(key);
  if (!meta) {
    unmatched.push({ id: feature.id, name: feature.properties?.name });
    continue;
  }

  const continent = SEVEN_CONTINENT(meta.region, meta.subregion);
  const sovereign = SOVEREIGN_195.has(meta.cca3);
  const capitalCoord = capitalCoordByIso3.get(meta.cca3); // [lng, lat] | undefined

  feature.properties = {
    id: meta.cca3,
    cca2: meta.cca2,
    name: meta.name.common,
    officialName: meta.name.official,
    capital: meta.capital && meta.capital.length ? meta.capital[0] : null,
    capitalLatLng: capitalCoord ? [capitalCoord[1], capitalCoord[0]] : null,
    continent,
    region: meta.region,
    subregion: meta.subregion,
    sovereign,
    landlocked: !!meta.landlocked,
    area: meta.area ?? null,
    latlng: meta.latlng ?? null,
    neighbors: (meta.borders || []).map((code) => cca3ToName.get(code) || code),
    flagEmoji: meta.flag || ''
  };
  matched.push(feature);
}

// Round coordinates to 4 decimal places (~11m precision) — invisible at
// globe scale, but cuts the payload roughly in half.
const ROUND = 4;
const roundCoords = (node) => {
  if (typeof node[0] === 'number') {
    node[0] = Math.round(node[0] * 10 ** ROUND) / 10 ** ROUND;
    node[1] = Math.round(node[1] * 10 ** ROUND) / 10 ** ROUND;
    return;
  }
  for (const child of node) roundCoords(child);
};
for (const f of matched) roundCoords(f.geometry.coordinates);

const outGeo = { type: 'FeatureCollection', features: matched };

writeFileSync(outPath, JSON.stringify(outGeo));
writeFileSync(
  reportPath,
  JSON.stringify(
    {
      totalTopoFeatures: geo.features.length,
      matched: matched.length,
      unmatchedCount: unmatched.length,
      unmatched,
      sovereignMatched: matched.filter((f) => f.properties.sovereign).length,
      sovereignTarget: SOVEREIGN_195.size
    },
    null,
    2
  )
);

const sovereignWithCapitalCoord = matched.filter((f) => f.properties.sovereign && f.properties.capitalLatLng).length;
console.log(`Matched ${matched.length}/${geo.features.length} topojson features (dropped ${droppedDuplicates} duplicate-id territory slivers).`);
if (patched.length > 0) console.log(`Patched in ${patched.length} countries missing at 50m resolution from the 10m source: ${patched.join(', ')}`);
console.log(`Sovereign (quizzable) countries matched: ${matched.filter((f) => f.properties.sovereign).length} / ${SOVEREIGN_195.size}`);
console.log(`Sovereign countries with a precise capital coordinate: ${sovereignWithCapitalCoord} / ${SOVEREIGN_195.size}`);
console.log(`Unmatched: ${unmatched.length} (see scripts/prepare-data-report.json)`);
console.log(`Output written to ${path.relative(root, outPath)} (${(JSON.stringify(outGeo).length / 1024).toFixed(0)} KB)`);
