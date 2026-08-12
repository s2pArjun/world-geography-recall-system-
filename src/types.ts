// Shared domain types.

export type Continent =
  | 'Africa'
  | 'Asia'
  | 'Europe'
  | 'North America'
  | 'South America'
  | 'Oceania'
  | 'Antarctica';

export interface CountryProperties {
  id: string; // cca3, e.g. "IND"
  cca2: string;
  name: string;
  officialName: string;
  capital: string | null;
  capitalLatLng: [number, number] | null;
  continent: Continent | string;
  region: string;
  subregion: string;
  sovereign: boolean; // part of the graded 195-country set
  landlocked: boolean;
  area: number | null;
  latlng: [number, number] | null;
  neighbors: string[];
  flagEmoji: string;
}

export interface CountryFeature {
  type: 'Feature';
  id: string;
  properties: CountryProperties;
  geometry: GeoJSON.Geometry;
}

export interface CountryFeatureCollection {
  type: 'FeatureCollection';
  features: CountryFeature[];
}

export type WaterBodyType = 'Ocean' | 'Sea' | 'Gulf' | 'Bay' | 'Strait';

export interface WaterBody {
  id: string;
  name: string;
  type: WaterBodyType;
  lat: number;
  lng: number;
  bordering: string[]; // countries / regions
  facts: string; // 1-2 sentence exam-relevant note
}

export type GeoFeatureCategory =
  | 'River'
  | 'Mountain Range'
  | 'Desert'
  | 'Strait'
  | 'Canal'
  | 'Island / Island Group';

export interface GeoFeatureItem {
  id: string;
  name: string;
  category: GeoFeatureCategory;
  lat: number;
  lng: number;
  countries: string[];
  facts: string;
}

export interface ReferenceLine {
  id: string;
  name: string;
  kind: 'latitude' | 'longitude';
  value: number; // degrees
  color: string;
}

export type AppMode = 'explore' | 'quiz';

export type QuizCategory = 'countries' | 'waterBodies';

export type QuizQuestionType = 'capital' | 'continent' | 'find';

export interface LayerState {
  countries: boolean;
  capitals: boolean;
  oceans: boolean;
  rivers: boolean;
  mountains: boolean;
  deserts: boolean;
  straitsCanals: boolean;
  islands: boolean;
  graticule: boolean;
}

export interface CountryStats {
  attempts: number;
  correct: number;
  wrong: number;
  lastSeen: number;
  lastFieldResult?: { country: boolean; capital: boolean; continent: boolean };
}

export interface WaterBodyStats {
  attempts: number;
  correct: number;
  wrong: number;
}
