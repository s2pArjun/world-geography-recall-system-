import type { ReferenceLine } from '../types';

// Definitions of the key latitudes/longitudes tested in exam geography.
// Actual path point arrays (for react-globe.gl's pathsData) are derived
// from these in lib/geoData.ts, since they're trivial to generate rather
// than needing external data.

export const REFERENCE_LINES: ReferenceLine[] = [
  { id: 'equator', name: 'Equator', kind: 'latitude', value: 0, color: '#d4a24c' },
  { id: 'tropic-cancer', name: 'Tropic of Cancer', kind: 'latitude', value: 23.436, color: '#c98a3e' },
  { id: 'tropic-capricorn', name: 'Tropic of Capricorn', kind: 'latitude', value: -23.436, color: '#c98a3e' },
  { id: 'arctic-circle', name: 'Arctic Circle', kind: 'latitude', value: 66.563, color: '#6b7fa3' },
  { id: 'antarctic-circle', name: 'Antarctic Circle', kind: 'latitude', value: -66.563, color: '#6b7fa3' },
  { id: 'prime-meridian', name: 'Prime Meridian', kind: 'longitude', value: 0, color: '#8a9a4e' }
];

/** Builds the [lat, lng] point array react-globe.gl needs to draw one reference line. */
export function buildLinePath(line: ReferenceLine): [number, number][] {
  const points: [number, number][] = [];
  if (line.kind === 'latitude') {
    for (let lng = -180; lng <= 180; lng += 4) {
      points.push([line.value, lng]);
    }
  } else {
    for (let lat = -90; lat <= 90; lat += 4) {
      points.push([lat, line.value]);
    }
  }
  return points;
}
