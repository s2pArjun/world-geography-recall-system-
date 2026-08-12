import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useGeoDataStore } from '../store/useGeoDataStore';
import { useProgressStore } from '../store/useProgressStore';
import { checkAnswer } from '../lib/matching';
import {
  acceptedCountryNames,
  acceptedCapitals,
  displayCapital,
  capitalNote,
  featureCentroid,
  allCountryNamesPool,
  allCapitalsPool
} from '../lib/geoData';
import { CONTINENT_LIST } from '../lib/continents';
import { pickQuizCountry } from '../lib/quizEngine';
import type { CountryFeature } from '../types';

interface FieldResult {
  correct: boolean;
  given: string;
}

export default function RecallPanel() {
  const selectionType = useAppStore((s) => s.selectionType);
  const selectedId = useAppStore((s) => s.selectedId);
  const clearSelection = useAppStore((s) => s.clearSelection);
  const select = useAppStore((s) => s.select);
  const flyTo = useAppStore((s) => s.flyTo);

  const countries = useGeoDataStore((s) => s.countries);
  const sovereignCountries = useGeoDataStore((s) => s.sovereignCountries);
  const countryStats = useProgressStore((s) => s.countryStats);
  const recordCountryAttempt = useProgressStore((s) => s.recordCountryAttempt);

  const isOpen = selectionType === 'country' && !!selectedId;
  const feature = countries.find((c) => c.properties.id === selectedId) ?? null;

  const [countryInput, setCountryInput] = useState('');
  const [capitalInput, setCapitalInput] = useState('');
  const [continentInput, setContinentInput] = useState('');
  const [results, setResults] = useState<{ country: FieldResult; capital: FieldResult; continent: FieldResult } | null>(
    null
  );

  // Reset the form whenever a new country is selected.
  useEffect(() => {
    setCountryInput('');
    setCapitalInput('');
    setContinentInput('');
    setResults(null);
  }, [selectedId]);

  const handleCheck = useCallback(() => {
    if (!feature) return;
    const countryOk = checkAnswer(countryInput, acceptedCountryNames(feature), allCountryNamesPool(countries));
    const capitalOk = checkAnswer(capitalInput, acceptedCapitals(feature), allCapitalsPool(countries));
    const continentOk = continentInput === feature.properties.continent;

    setResults({
      country: { correct: countryOk, given: countryInput },
      capital: { correct: capitalOk, given: capitalInput },
      continent: { correct: continentOk, given: continentInput }
    });

    recordCountryAttempt(feature.properties.id, countryOk && capitalOk && continentOk, {
      country: countryOk,
      capital: capitalOk,
      continent: continentOk
    });
  }, [feature, countryInput, capitalInput, continentInput, recordCountryAttempt, countries]);

  const handleNext = useCallback(() => {
    if (sovereignCountries.length === 0) return;
    const pool = feature ? sovereignCountries.filter((c) => c.properties.id !== feature.properties.id) : sovereignCountries;
    const next = pickQuizCountry(pool, countryStats) as CountryFeature | null;
    if (!next) return;
    const [lat, lng] = featureCentroid(next);
    flyTo(lat, lng, 1.6);
    select('country', next.properties.id);
  }, [sovereignCountries, feature, countryStats, flyTo, select]);

  if (!isOpen) return null;

  // Territory / non-quizzed land: lightweight note instead of the graded form.
  if (feature && !feature.properties.sovereign) {
    return (
      <aside className="side-panel is-open" aria-label="Territory information">
        <button type="button" className="side-panel__close" onClick={clearSelection} aria-label="Close panel">
          ×
        </button>
        <span className="side-panel__eyebrow">Territory</span>
        <h2>{feature.properties.name}</h2>
        <p className="muted-note">
          This is a dependency or territory rather than one of the 195 sovereign countries in the graded quiz set, so it
          isn't part of active recall — but you can still explore where it sits on the globe.
        </p>
        {feature.properties.neighbors.length > 0 && (
          <div className="fact-row">
            <span>Nearby</span>
            <span>{feature.properties.neighbors.slice(0, 5).join(', ')}</span>
          </div>
        )}
      </aside>
    );
  }

  if (!feature) return null;

  const note = capitalNote(feature);
  const primaryCapital = displayCapital(feature);

  return (
    <aside className="side-panel is-open" aria-label="Active recall">
      <button type="button" className="side-panel__close" onClick={clearSelection} aria-label="Close panel">
        ×
      </button>

      {!results ? (
        <>
          <span className="side-panel__eyebrow">Active Recall</span>
          <h2>What do you know about this country?</h2>
          <p className="muted-note">You selected a country on the globe — recall what you can before checking.</p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleCheck();
            }}
          >
            <label className="recall-field">
              <span>Country</span>
              <input
                type="text"
                value={countryInput}
                onChange={(e) => setCountryInput(e.target.value)}
                placeholder="Type the country name…"
                autoFocus
              />
            </label>
            <label className="recall-field">
              <span>Capital</span>
              <input
                type="text"
                value={capitalInput}
                onChange={(e) => setCapitalInput(e.target.value)}
                placeholder="Type the capital city…"
              />
            </label>
            <label className="recall-field">
              <span>Continent</span>
              <select value={continentInput} onChange={(e) => setContinentInput(e.target.value)}>
                <option value="" disabled>
                  Choose a continent…
                </option>
                {CONTINENT_LIST.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <button
              type="submit"
              className="primary-button"
              disabled={!countryInput.trim() || !capitalInput.trim() || !continentInput}
            >
              Check Answer
            </button>
          </form>
          <button type="button" className="text-link" onClick={handleNext}>
            Skip without answering
          </button>
        </>
      ) : (
        <>
          <span className="side-panel__eyebrow">{results.country.correct && results.capital.correct && results.continent.correct ? 'All correct' : 'Reveal'}</span>
          <h2>
            {feature.properties.flagEmoji} {feature.properties.name}
          </h2>
          <p className="muted-note">{feature.properties.officialName}</p>

          <div className="result-list">
            <ResultRow label="Country" result={results.country} correctAnswer={feature.properties.name} />
            <ResultRow label="Capital" result={results.capital} correctAnswer={primaryCapital ?? '—'} />
            <ResultRow label="Continent" result={results.continent} correctAnswer={feature.properties.continent} />
          </div>

          {note && <p className="fact-note">{note}</p>}

          <div className="fact-row">
            <span>Neighbours</span>
            <span>{feature.properties.neighbors.length > 0 ? feature.properties.neighbors.join(', ') : 'None — island nation'}</span>
          </div>
          {feature.properties.area && (
            <div className="fact-row">
              <span>Area</span>
              <span className="mono">{feature.properties.area.toLocaleString()} km²</span>
            </div>
          )}

          <button type="button" className="primary-button" onClick={handleNext}>
            Next Country →
          </button>
        </>
      )}
    </aside>
  );
}

function ResultRow({ label, result, correctAnswer }: { label: string; result: FieldResult; correctAnswer: string }) {
  return (
    <div className={`result-row ${result.correct ? 'is-correct' : 'is-incorrect'}`}>
      <div className="result-row__top">
        <span className="result-row__icon" aria-hidden="true">
          {result.correct ? '✓' : '✗'}
        </span>
        <span className="result-row__label">{label}</span>
        <span className="result-row__given">{result.given || '(blank)'}</span>
      </div>
      {!result.correct && (
        <div className="result-row__correct">
          Correct: <strong>{correctAnswer}</strong>
        </div>
      )}
    </div>
  );
}
