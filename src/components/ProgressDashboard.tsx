import { useMemo, useState } from 'react';
import { useProgressStore } from '../store/useProgressStore';
import { useGeoDataStore } from '../store/useGeoDataStore';
import { useAppStore } from '../store/useAppStore';
import { weakestCountries } from '../lib/quizEngine';
import { featureCentroid } from '../lib/geoData';

export default function ProgressDashboard() {
  const countryStats = useProgressStore((s) => s.countryStats);
  const quizScore = useProgressStore((s) => s.quizScore);
  const resetProgress = useProgressStore((s) => s.resetProgress);
  const sovereignCountries = useGeoDataStore((s) => s.sovereignCountries);
  const flyTo = useAppStore((s) => s.flyTo);
  const select = useAppStore((s) => s.select);
  const setMode = useAppStore((s) => s.setMode);

  const [expanded, setExpanded] = useState(false);

  const stats = useMemo(() => {
    const entries = Object.values(countryStats);
    const attempted = entries.length;
    const learned = entries.filter((s) => s.correct > 0).length;
    const totalAttempts = entries.reduce((sum, s) => sum + s.attempts, 0);
    const totalCorrect = entries.reduce((sum, s) => sum + s.correct, 0);
    const accuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;
    const weak = weakestCountries(sovereignCountries, countryStats, 15);
    return { attempted, learned, accuracy, weak, total: sovereignCountries.length || 195 };
  }, [countryStats, sovereignCountries]);

  const goToCountry = (cca3: string) => {
    const f = sovereignCountries.find((c) => c.properties.id === cca3);
    if (!f) return;
    setMode('explore');
    const [lat, lng] = featureCentroid(f);
    flyTo(lat, lng, 1.5);
    select('country', cca3);
  };

  return (
    <div className={`progress-dash ${expanded ? 'is-expanded' : ''}`}>
      <button type="button" className="progress-dash__summary" onClick={() => setExpanded((v) => !v)}>
        <div className="progress-dash__title">
          <span>World Geography Progress</span>
          <span className={`chevron ${expanded ? 'is-open' : ''}`}>›</span>
        </div>
        <div className="progress-dash__stats">
          <div className="stat">
            <span className="mono stat__value">
              {stats.learned}/{stats.total}
            </span>
            <span className="stat__label">Countries learned</span>
          </div>
          <div className="stat">
            <span className="mono stat__value">{stats.accuracy}%</span>
            <span className="stat__label">Accuracy</span>
          </div>
          <div className="stat">
            <span className="mono stat__value">
              {quizScore.correct}/{quizScore.total}
            </span>
            <span className="stat__label">Quiz score</span>
          </div>
          <div className="stat">
            <span className="mono stat__value">{stats.weak.length}</span>
            <span className="stat__label">Weak countries</span>
          </div>
        </div>
      </button>

      {expanded && (
        <div className="progress-dash__detail">
          <div className="progress-dash__row">
            <span>Countries attempted</span>
            <span className="mono">
              {stats.attempted}/{stats.total}
            </span>
          </div>

          <h3 className="panel-heading panel-heading--spaced">Revise weak countries</h3>
          {stats.weak.length === 0 ? (
            <p className="muted-note">
              No weak spots logged yet — mistakes you repeat will show up here and get prioritised in Quiz mode.
            </p>
          ) : (
            <ul className="weak-list">
              {stats.weak.map(({ feature, stats: s }) => (
                <li key={feature.properties.id}>
                  <button type="button" onClick={() => goToCountry(feature.properties.id)}>
                    <span>{feature.properties.name}</span>
                    <span className="mono weak-list__score">
                      <span className="correct">{s.correct}✓</span> <span className="incorrect">{s.wrong}✗</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          <button
            type="button"
            className="danger-link"
            onClick={() => {
              if (window.confirm('Reset all progress? This clears every score and cannot be undone.')) {
                resetProgress();
              }
            }}
          >
            Reset all progress
          </button>
        </div>
      )}
    </div>
  );
}
