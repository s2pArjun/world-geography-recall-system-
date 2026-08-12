import type { Continent } from '../types';

// A coherent "aged chart ink" palette — muted, distinct hues per continent
// rather than primary-color choropleth defaults.
export const CONTINENT_COLORS: Record<Continent, string> = {
  Africa: '#c98a3e',
  Asia: '#4c8577',
  Europe: '#6b7fa3',
  'North America': '#b5654f',
  'South America': '#8a9a4e',
  Oceania: '#5b9aa6',
  Antarctica: '#8b92a0'
};

export const CONTINENT_LIST: Continent[] = [
  'Africa',
  'Asia',
  'Europe',
  'North America',
  'South America',
  'Oceania',
  'Antarctica'
];

export function continentColor(continent: string | undefined | null): string {
  if (!continent) return '#5c6b80';
  return CONTINENT_COLORS[continent as Continent] ?? '#5c6b80';
}

export function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
