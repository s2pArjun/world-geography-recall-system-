import { useRef, useEffect, useMemo, useState, useCallback } from 'react';
import GlobeGL from 'react-globe.gl';
import type { GlobeMethods } from 'react-globe.gl';
import * as THREE from 'three';
import type { CountryFeature, WaterBody, GeoFeatureItem, LayerState, AppMode } from '../types';
import { continentColor, hexToRgba } from '../lib/continents';
import { WATER_BODIES } from '../data/waterBodies';
import { GEO_FEATURES } from '../data/geoFeatures';
import { REFERENCE_LINES, buildLinePath } from '../data/referenceLines';

type GlobePoint =
  | { kind: 'capital'; id: string; lat: number; lng: number; cityName: string; countryName: string }
  | { kind: 'waterBody'; id: string; lat: number; lng: number; data: WaterBody }
  | { kind: 'geoFeature'; id: string; lat: number; lng: number; data: GeoFeatureItem };

interface QuizVisualState {
  active: boolean;
  targetId: string | null;
  userPickId: string | null;
  feedback: 'correct' | 'incorrect' | null;
  category: 'countries' | 'waterBodies';
}

interface CameraCommand {
  lat: number;
  lng: number;
  altitude: number;
  ts: number;
}

interface Globe3DProps {
  countries: CountryFeature[];
  layers: LayerState;
  mode: AppMode;
  selectedCountryId: string | null;
  selectedWaterBodyId: string | null;
  selectedGeoFeatureId: string | null;
  searchHighlightId: string | null;
  quiz: QuizVisualState;
  cameraCommand: CameraCommand | null;
  onCameraCommandHandled: () => void;
  onCountryClick: (feature: CountryFeature) => void;
  onWaterBodyClick: (wb: WaterBody) => void;
  onGeoFeatureClick: (gf: GeoFeatureItem) => void;
  onBackgroundClick: () => void;
}

const OCEAN_MATERIAL = new THREE.MeshPhongMaterial({
  color: new THREE.Color('#0c1e30'),
  shininess: 4,
  transparent: false
});

export default function Globe3D({
  countries,
  layers,
  mode,
  selectedCountryId,
  selectedWaterBodyId,
  selectedGeoFeatureId,
  searchHighlightId,
  quiz,
  cameraCommand,
  onCameraCommandHandled,
  onCountryClick,
  onWaterBodyClick,
  onGeoFeatureClick,
  onBackgroundClick
}: Globe3DProps) {
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: window.innerWidth, height: window.innerHeight });
  const [hoveredPolygonId, setHoveredPolygonId] = useState<string | null>(null);
  const [hoveredPointId, setHoveredPointId] = useState<string | null>(null);
  const hasInteractedRef = useRef(false);

  // --- Responsive canvas sizing ------------------------------------------
  useEffect(() => {
    const onResize = () => setDims({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // --- Initial camera + gentle idle auto-rotate --------------------------
  useEffect(() => {
    const g = globeRef.current;
    if (!g) return;
    g.pointOfView({ lat: 18, lng: 55, altitude: 2.4 }, 0);
    const controls = g.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 120;
    controls.maxDistance = 620;

    const stopAutoRotate = () => {
      if (!hasInteractedRef.current) {
        hasInteractedRef.current = true;
        controls.autoRotate = false;
      }
    };
    controls.addEventListener('start', stopAutoRotate);
    return () => controls.removeEventListener('start', stopAutoRotate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- External camera commands (search fly-to, etc.) ---------------------
  useEffect(() => {
    if (!cameraCommand || !globeRef.current) return;
    hasInteractedRef.current = true;
    const controls = globeRef.current.controls();
    controls.autoRotate = false;
    globeRef.current.pointOfView({ lat: cameraCommand.lat, lng: cameraCommand.lng, altitude: cameraCommand.altitude }, 1400);
    onCameraCommandHandled();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraCommand]);

  // --- Polygon (country) styling -------------------------------------------
  const polygonCapColor = useCallback(
    (obj: object) => {
      const f = obj as CountryFeature;
      const id = f.properties.id;

      if (!f.properties.sovereign) return 'rgba(120, 130, 145, 0.28)';

      // Quiz "find" feedback takes priority once answered
      if (quiz.active && quiz.category === 'countries' && quiz.feedback) {
        if (id === quiz.targetId) return hexToRgba('#5fae7c', 0.85);
        if (id === quiz.userPickId) return hexToRgba('#c4604a', 0.85);
      }

      if (id === selectedCountryId) return hexToRgba('#e8bc6c', 0.88);
      if (id === searchHighlightId) return hexToRgba('#e8bc6c', 0.7);
      if (id === hoveredPolygonId) return hexToRgba(continentColor(f.properties.continent), 0.85);
      return hexToRgba(continentColor(f.properties.continent), 0.58);
    },
    [selectedCountryId, searchHighlightId, hoveredPolygonId, quiz]
  );

  const polygonSideColor = useCallback((obj: object) => {
    const f = obj as CountryFeature;
    if (!f.properties.sovereign) return 'rgba(80, 90, 105, 0.2)';
    return 'rgba(10, 18, 32, 0.55)';
  }, []);

  const polygonStrokeColor = useCallback(
    (obj: object) => {
      const f = obj as CountryFeature;
      const id = f.properties.id;
      if (id === selectedCountryId || id === searchHighlightId) return '#e8bc6c';
      if (quiz.active && quiz.feedback && id === quiz.targetId) return '#5fae7c';
      return 'rgba(237, 230, 214, 0.32)';
    },
    [selectedCountryId, searchHighlightId, quiz]
  );

  const polygonAltitude = useCallback(
    (obj: object) => {
      const f = obj as CountryFeature;
      const id = f.properties.id;
      if (id === selectedCountryId || id === searchHighlightId) return 0.045;
      if (quiz.active && quiz.feedback && (id === quiz.targetId || id === quiz.userPickId)) return 0.045;
      if (id === hoveredPolygonId) return 0.02;
      return 0.006;
    },
    [selectedCountryId, searchHighlightId, hoveredPolygonId, quiz]
  );

  const polygonLabel = useCallback((obj: object) => {
    const f = obj as CountryFeature;
    if (!f.properties.sovereign) {
      return `<div class="globe-tip"><strong>${f.properties.name}</strong><span>territory · not in the 195-country quiz set</span></div>`;
    }
    return `<div class="globe-tip">Click to test recall</div>`;
  }, []);

  const handlePolygonClick = useCallback(
    (obj: object) => {
      onCountryClick(obj as CountryFeature);
    },
    [onCountryClick]
  );

  const handlePolygonHover = useCallback((obj: object | null) => {
    setHoveredPolygonId(obj ? (obj as CountryFeature).properties.id : null);
  }, []);

  // --- Points: capitals, water bodies, geo-features -----------------------
  const points = useMemo<GlobePoint[]>(() => {
    const pts: GlobePoint[] = [];

    if (layers.capitals) {
      for (const f of countries) {
        if (f.properties.sovereign && f.properties.capitalLatLng && f.properties.capital) {
          pts.push({
            kind: 'capital',
            id: f.properties.id,
            lat: f.properties.capitalLatLng[0],
            lng: f.properties.capitalLatLng[1],
            cityName: f.properties.capital,
            countryName: f.properties.name
          });
        }
      }
    }
    if (layers.oceans) {
      for (const wb of WATER_BODIES) pts.push({ kind: 'waterBody', id: wb.id, lat: wb.lat, lng: wb.lng, data: wb });
    }
    const featureLayerMap: [keyof LayerState, GeoFeatureItem['category'][]][] = [
      ['rivers', ['River']],
      ['mountains', ['Mountain Range']],
      ['deserts', ['Desert']],
      ['straitsCanals', ['Strait', 'Canal']],
      ['islands', ['Island / Island Group']]
    ];
    for (const [layerKey, categories] of featureLayerMap) {
      if (!layers[layerKey]) continue;
      for (const gf of GEO_FEATURES) {
        if (categories.includes(gf.category)) {
          pts.push({ kind: 'geoFeature', id: gf.id, lat: gf.lat, lng: gf.lng, data: gf });
        }
      }
    }
    return pts;
  }, [layers, countries]);

  const pointColor = useCallback(
    (obj: object) => {
      const p = obj as GlobePoint;
      const isSelected =
        (p.kind === 'waterBody' && p.id === selectedWaterBodyId) ||
        (p.kind === 'geoFeature' && p.id === selectedGeoFeatureId);
      const isQuizTarget = quiz.active && quiz.category === 'waterBodies' && quiz.feedback && p.kind === 'waterBody';

      if (isQuizTarget) {
        if (p.id === quiz.targetId) return '#5fae7c';
        if (p.id === quiz.userPickId) return '#c4604a';
      }
      if (isSelected || p.id === hoveredPointId) return '#e8bc6c';

      switch (p.kind) {
        case 'capital':
          return '#d4a24c';
        case 'waterBody':
          return '#5b9aa6';
        case 'geoFeature':
          switch (p.data.category) {
            case 'River':
              return '#5b9aa6';
            case 'Mountain Range':
              return '#b5654f';
            case 'Desert':
              return '#c98a3e';
            case 'Strait':
            case 'Canal':
              return '#8a9a4e';
            default:
              return '#8b92a0';
          }
        default:
          return '#d4a24c';
      }
    },
    [hoveredPointId, selectedWaterBodyId, selectedGeoFeatureId, quiz]
  );

  const pointRadius = useCallback((obj: object) => {
    const p = obj as GlobePoint;
    return p.kind === 'capital' ? 0.22 : 0.32;
  }, []);

  const pointLabel = useCallback((obj: object) => {
    const p = obj as GlobePoint;
    if (p.kind === 'capital') {
      return `<div class="globe-tip"><strong>${p.cityName}</strong><span>capital of ${p.countryName}</span></div>`;
    }
    if (p.kind === 'waterBody') {
      return `<div class="globe-tip"><strong>${p.data.name}</strong><span>${p.data.type} · click to learn more</span></div>`;
    }
    return `<div class="globe-tip"><strong>${p.data.name}</strong><span>${p.data.category} · click to learn more</span></div>`;
  }, []);

  const handlePointClick = useCallback(
    (obj: object) => {
      const p = obj as GlobePoint;
      if (p.kind === 'capital') {
        const f = countries.find((c) => c.properties.id === p.id);
        if (f) onCountryClick(f);
      } else if (p.kind === 'waterBody') {
        onWaterBodyClick(p.data);
      } else if (p.kind === 'geoFeature') {
        onGeoFeatureClick(p.data);
      }
    },
    [countries, onCountryClick, onWaterBodyClick, onGeoFeatureClick]
  );

  const handlePointHover = useCallback((obj: object | null) => {
    setHoveredPointId(obj ? (obj as GlobePoint).id : null);
  }, []);

  // --- Reference lines (equator, tropics, circles, prime meridian) --------
  const paths = useMemo(() => {
    if (!layers.graticule) return [];
    return REFERENCE_LINES.map((line) => ({ line, points: buildLinePath(line) }));
  }, [layers.graticule]);

  const polygonsData = useMemo(
    () => (layers.countries ? countries : countries.filter((c) => c.properties.id === selectedCountryId)),
    [countries, layers.countries, selectedCountryId]
  );

  return (
    <div ref={containerRef} className="globe-stage" onPointerDown={() => (hasInteractedRef.current = true)}>
      <GlobeGL
        ref={globeRef as any}
        width={dims.width}
        height={dims.height}
        backgroundColor="rgba(0,0,0,0)"
        globeMaterial={OCEAN_MATERIAL}
        showAtmosphere
        atmosphereColor="#5b9aa6"
        atmosphereAltitude={0.18}
        showGraticules={false}
        polygonsData={polygonsData}
        polygonGeoJsonGeometry={(d: object) => (d as CountryFeature).geometry as any}
        polygonCapColor={polygonCapColor as any}
        polygonSideColor={polygonSideColor as any}
        polygonStrokeColor={polygonStrokeColor as any}
        polygonAltitude={polygonAltitude as any}
        polygonsTransitionDuration={220}
        polygonLabel={polygonLabel as any}
        onPolygonClick={handlePolygonClick as any}
        onPolygonHover={handlePolygonHover as any}
        onGlobeClick={onBackgroundClick}
        pointsData={points}
        pointLat="lat"
        pointLng="lng"
        pointColor={pointColor as any}
        pointRadius={pointRadius as any}
        pointAltitude={0.012}
        pointResolution={12}
        pointLabel={pointLabel as any}
        pointsTransitionDuration={200}
        onPointClick={handlePointClick as any}
        onPointHover={handlePointHover as any}
        pathsData={paths}
        pathPoints="points"
        pathPointLat={(p: any) => p[0]}
        pathPointLng={(p: any) => p[1]}
        pathColor={(d: any) => hexToRgba(d.line.color, 0.55)}
        pathStroke={1.1}
        pathTransitionDuration={0}
        showPointerCursor
        enablePointerInteraction
      />
    </div>
  );
}
