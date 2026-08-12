import { useState, useMemo, useRef, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useGeoDataStore } from '../store/useGeoDataStore';
import { searchCountries, featureCentroid, type SearchResult } from '../lib/geoData';

export default function Header() {
  const mode = useAppStore((s) => s.mode);
  const setMode = useAppStore((s) => s.setMode);
  const flyTo = useAppStore((s) => s.flyTo);
  const setSearchHighlight = useAppStore((s) => s.setSearchHighlight);
  const sovereignCountries = useGeoDataStore((s) => s.sovereignCountries);

  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo<SearchResult[]>(() => {
    if (query.trim().length === 0) return [];
    return searchCountries(query, sovereignCountries, 7);
  }, [query, sovereignCountries]);

  const pickResult = useCallback(
    (r: SearchResult) => {
      const [lat, lng] = featureCentroid(r.feature);
      flyTo(lat, lng, 1.5);
      setSearchHighlight(r.feature.properties.id);
      setQuery('');
      setOpen(false);
      inputRef.current?.blur();
    },
    [flyTo, setSearchHighlight]
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open || results.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % results.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + results.length) % results.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      pickResult(results[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  return (
    <header className="hud-header">
      <div className="brand">
        <svg className="brand__mark" viewBox="0 0 32 32" aria-hidden="true">
          <circle cx="16" cy="16" r="12.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          <ellipse cx="16" cy="16" rx="12.5" ry="5" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <line x1="16" y1="3.5" x2="16" y2="28.5" stroke="currentColor" strokeWidth="1" opacity="0.6" />
          <circle cx="16" cy="16" r="1.6" fill="currentColor" />
        </svg>
        <div className="brand__text">
          <h1>Chart &amp; Recall</h1>
          <span>World Geography · Active Recall</span>
        </div>
      </div>

      <div className="search-bar">
        <svg className="search-bar__icon" viewBox="0 0 20 20" aria-hidden="true">
          <circle cx="8.5" cy="8.5" r="6" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <line x1="13" y1="13" x2="18" y2="18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          value={query}
          placeholder="Search a country or capital…"
          aria-label="Search for a country or capital"
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
            setActiveIndex(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
        />
        {open && results.length > 0 && (
          <ul className="search-bar__results" role="listbox">
            {results.map((r, i) => (
              <li key={r.feature.properties.id} role="option" aria-selected={i === activeIndex}>
                <button
                  type="button"
                  className={i === activeIndex ? 'is-active' : ''}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => pickResult(r)}
                >
                  <span className="result-name">{r.feature.properties.name}</span>
                  <span className="result-meta">{r.feature.properties.capital ?? r.feature.properties.continent}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mode-switcher" role="tablist" aria-label="Learning mode">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'explore'}
          className={mode === 'explore' ? 'is-active' : ''}
          onClick={() => setMode('explore')}
        >
          Explore
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'quiz'}
          className={mode === 'quiz' ? 'is-active' : ''}
          onClick={() => setMode('quiz')}
        >
          Quiz
        </button>
      </div>
    </header>
  );
}
