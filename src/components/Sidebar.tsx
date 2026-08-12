import { useAppStore } from '../store/useAppStore';
import type { LayerState } from '../types';
import { CONTINENT_LIST, CONTINENT_COLORS } from '../lib/continents';

const LAYER_GROUPS: { title: string; items: { key: keyof LayerState; label: string }[] }[] = [
  {
    title: 'Base',
    items: [
      { key: 'countries', label: 'Countries' },
      { key: 'capitals', label: 'Capitals' }
    ]
  },
  {
    title: 'Water',
    items: [{ key: 'oceans', label: 'Oceans & Seas' }]
  },
  {
    title: 'Features',
    items: [
      { key: 'rivers', label: 'Rivers' },
      { key: 'mountains', label: 'Mountains' },
      { key: 'deserts', label: 'Deserts' },
      { key: 'straitsCanals', label: 'Straits & Canals' },
      { key: 'islands', label: 'Islands' }
    ]
  },
  {
    title: 'Reference lines',
    items: [{ key: 'graticule', label: 'Latitudes / longitudes' }]
  }
];

export default function Sidebar() {
  const layers = useAppStore((s) => s.layers);
  const toggleLayer = useAppStore((s) => s.toggleLayer);
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);

  return (
    <>
      <button
        type="button"
        className={`sidebar-toggle ${sidebarOpen ? 'is-open' : ''}`}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-expanded={sidebarOpen}
        aria-label={sidebarOpen ? 'Collapse layer panel' : 'Expand layer panel'}
      >
        <span className={`chevron ${sidebarOpen ? 'is-open' : ''}`}>›</span>
      </button>

      <aside className={`hud-sidebar ${sidebarOpen ? 'is-open' : 'is-closed'}`} aria-hidden={!sidebarOpen}>
        <div className="hud-sidebar__inner">
          <h2 className="panel-heading">Layers</h2>
          {LAYER_GROUPS.map((group) => (
            <div className="layer-group" key={group.title}>
              <span className="layer-group__title">{group.title}</span>
              {group.items.map((item) => (
                <label className="layer-toggle" key={item.key}>
                  <input
                    type="checkbox"
                    checked={layers[item.key]}
                    onChange={() => toggleLayer(item.key)}
                  />
                  <span className="layer-toggle__box" aria-hidden="true" />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          ))}

          <h2 className="panel-heading panel-heading--spaced">Continents</h2>
          <ul className="legend">
            {CONTINENT_LIST.map((c) => (
              <li key={c}>
                <span className="legend__swatch" style={{ background: CONTINENT_COLORS[c] }} aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
}
