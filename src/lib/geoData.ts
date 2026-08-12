import type { CountryFeature, CountryFeatureCollection } from '../types';
import { NAME_ALIASES, CAPITAL_OVERRIDES } from '../data/overrides';

let cache: CountryFeatureCollection | null = null;
let inFlight: Promise<CountryFeatureCollection> | null = null;

export async function loadCountries(): Promise<CountryFeatureCollection> {
  if (cache) return cache;
  if (inFlight) return inFlight;
  inFlight = fetch(`${import.meta.env.BASE_URL}data/countries.geo.json`)
    .then((res) => {
      if (!res.ok) throw new Error(`Failed to load country data (${res.status})`);
      return res.json();
    })
    .then((data: CountryFeatureCollection) => {
      cache = data;
      return data;
    });
  return inFlight;
}

export function sovereignOnly(fc: CountryFeatureCollection): CountryFeature[] {
  return fc.features.filter((f) => f.properties.sovereign);
}

/** All names a correct "country name" answer could take: the display name plus curated aliases. */
export function acceptedCountryNames(feature: CountryFeature): string[] {
  const aliases = NAME_ALIASES[feature.properties.id] ?? [];
  return [feature.properties.name, feature.properties.officialName, ...aliases];
}

/** All accepted capital answers, applying multi-capital overrides where they exist. */
export function acceptedCapitals(feature: CountryFeature): string[] {
  const override = CAPITAL_OVERRIDES[feature.properties.id];
  if (override) return override.accepted;
  return feature.properties.capital ? [feature.properties.capital] : [];
}

/** The capital to show when revealing/quizzing — override's primary if one exists. */
export function displayCapital(feature: CountryFeature): string | null {
  const override = CAPITAL_OVERRIDES[feature.properties.id];
  if (override) return override.primary;
  return feature.properties.capital;
}

export function capitalNote(feature: CountryFeature): string | null {
  return CAPITAL_OVERRIDES[feature.properties.id]?.note ?? null;
}

let namesPoolCache: string[] | null = null;
let capitalsPoolCache: string[] | null = null;

/** All 195 sovereign country names — used as the distractor pool for ambiguity-guarded matching. Memoized. */
export function allCountryNamesPool(features: CountryFeature[]): string[] {
  if (!namesPoolCache) {
    namesPoolCache = features.filter((f) => f.properties.sovereign).map((f) => f.properties.name);
  }
  return namesPoolCache;
}

/** Every accepted capital spelling for every sovereign country (override-aware) — the distractor pool for ambiguity-guarded matching. Memoized. */
export function allCapitalsPool(features: CountryFeature[]): string[] {
  if (!capitalsPoolCache) {
    capitalsPoolCache = features.filter((f) => f.properties.sovereign).flatMap((f) => acceptedCapitals(f));
  }
  return capitalsPoolCache;
}

export interface SearchResult {
  feature: CountryFeature;
  matchedOn: string;
}

/** Simple substring search across country names, aliases, and capitals. */
export function searchCountries(query: string, features: CountryFeature[], limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (q.length < 1) return [];
  const results: SearchResult[] = [];

  for (const f of features) {
    if (!f.properties.sovereign) continue;
    const names = acceptedCountryNames(f);
    const hit = names.find((n) => n.toLowerCase().includes(q));
    if (hit) {
      results.push({ feature: f, matchedOn: hit });
      continue;
    }
    const capital = f.properties.capital;
    if (capital && capital.toLowerCase().includes(q)) {
      results.push({ feature: f, matchedOn: `${capital} (capital)` });
    }
  }

  // Prefer names that start with the query over ones that merely contain it.
  results.sort((a, b) => {
    const aStarts = a.feature.properties.name.toLowerCase().startsWith(q) ? 0 : 1;
    const bStarts = b.feature.properties.name.toLowerCase().startsWith(q) ? 0 : 1;
    return aStarts - bStarts;
  });

  return results.slice(0, limit);
}

/** Rough polygon centroid (area-weighted per ring) — good enough for camera fly-to and marker placement. */
export function featureCentroid(feature: CountryFeature): [number, number] {
  // Prefer the curated latlng from the metadata source (already a sensible
  // representative point); fall back to a geometric centroid if missing.
  if (feature.properties.latlng) {
    const [lat, lng] = feature.properties.latlng;
    return [lat, lng];
  }

  type Ring = number[][];
  const rings: Ring[] =
    feature.geometry.type === 'Polygon'
      ? (feature.geometry.coordinates as unknown as Ring[])
      : feature.geometry.type === 'MultiPolygon'
        ? (feature.geometry.coordinates as unknown as Ring[][]).flat()
        : [];

  let area = 0;
  let cx = 0;
  let cy = 0;
  for (const ring of rings) {
    for (let i = 0; i < ring.length - 1; i++) {
      const [x0, y0] = ring[i];
      const [x1, y1] = ring[i + 1];
      const cross = x0 * y1 - x1 * y0;
      area += cross;
      cx += (x0 + x1) * cross;
      cy += (y0 + y1) * cross;
    }
  }
  if (area === 0) {
    const [x, y] = rings[0]?.[0] ?? [0, 0];
    return [y, x];
  }
  area *= 0.5;
  cx /= 6 * area;
  cy /= 6 * area;
  return [cy, cx]; // [lat, lng]
}
