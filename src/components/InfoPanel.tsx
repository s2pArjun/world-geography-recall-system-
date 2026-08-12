import { useAppStore } from '../store/useAppStore';
import { WATER_BODIES } from '../data/waterBodies';
import { GEO_FEATURES } from '../data/geoFeatures';

export default function InfoPanel() {
  const selectionType = useAppStore((s) => s.selectionType);
  const selectedId = useAppStore((s) => s.selectedId);
  const clearSelection = useAppStore((s) => s.clearSelection);

  if (selectionType === 'waterBody' && selectedId) {
    const wb = WATER_BODIES.find((w) => w.id === selectedId);
    if (!wb) return null;
    return (
      <aside className="side-panel is-open" aria-label="Water body information">
        <button type="button" className="side-panel__close" onClick={clearSelection} aria-label="Close panel">
          ×
        </button>
        <span className="side-panel__eyebrow">Water Body</span>
        <h2>{wb.name}</h2>
        <div className="fact-row">
          <span>Type</span>
          <span>{wb.type}</span>
        </div>
        <div className="fact-row">
          <span>Bordering</span>
          <span>{wb.bordering.join(', ')}</span>
        </div>
        <p className="fact-note">{wb.facts}</p>
      </aside>
    );
  }

  if (selectionType === 'geoFeature' && selectedId) {
    const gf = GEO_FEATURES.find((g) => g.id === selectedId);
    if (!gf) return null;
    return (
      <aside className="side-panel is-open" aria-label="Geographic feature information">
        <button type="button" className="side-panel__close" onClick={clearSelection} aria-label="Close panel">
          ×
        </button>
        <span className="side-panel__eyebrow">{gf.category}</span>
        <h2>{gf.name}</h2>
        <div className="fact-row">
          <span>Countries</span>
          <span>{gf.countries.join(', ')}</span>
        </div>
        <p className="fact-note">{gf.facts}</p>
      </aside>
    );
  }

  return null;
}
