import { useEffect, useCallback } from 'react';
import Globe3D from './components/Globe3D';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ProgressDashboard from './components/ProgressDashboard';
import RecallPanel from './components/RecallPanel';
import InfoPanel from './components/InfoPanel';
import QuizBar from './components/QuizBar';
import { useAppStore } from './store/useAppStore';
import { useGeoDataStore } from './store/useGeoDataStore';
import { useProgressStore } from './store/useProgressStore';
import { WATER_BODIES } from './data/waterBodies';
import type { CountryFeature, WaterBody, GeoFeatureItem } from './types';

export default function App() {
  const { countries, loading, error, init } = useGeoDataStore();
  const mode = useAppStore((s) => s.mode);
  const quiz = useAppStore((s) => s.quiz);
  const layers = useAppStore((s) => s.layers);
  const selectionType = useAppStore((s) => s.selectionType);
  const selectedId = useAppStore((s) => s.selectedId);
  const searchHighlightId = useAppStore((s) => s.searchHighlightId);
  const cameraCommand = useAppStore((s) => s.cameraCommand);
  const clearCameraCommand = useAppStore((s) => s.clearCameraCommand);
  const select = useAppStore((s) => s.select);
  const clearSelection = useAppStore((s) => s.clearSelection);
  const setQuizFeedback = useAppStore((s) => s.setQuizFeedback);

  const recordCountryAttempt = useProgressStore((s) => s.recordCountryAttempt);
  const recordWaterBodyAttempt = useProgressStore((s) => s.recordWaterBodyAttempt);
  const recordQuizAnswer = useProgressStore((s) => s.recordQuizAnswer);

  useEffect(() => {
    init();
  }, [init]);

  const handleCountryClick = useCallback(
    (feature: CountryFeature) => {
      const state = useAppStore.getState();
      if (
        state.mode === 'quiz' &&
        state.quiz.active &&
        state.quiz.category === 'countries' &&
        state.quiz.questionType === 'find' &&
        !state.quiz.feedback
      ) {
        const correct = feature.properties.id === state.quiz.targetId;
        const target = countries.find((c) => c.properties.id === state.quiz.targetId);
        recordCountryAttempt(state.quiz.targetId ?? '', correct);
        recordQuizAnswer(correct);
        setQuizFeedback(correct ? 'correct' : 'incorrect', target?.properties.name, feature.properties.id);
        return;
      }
      if (state.mode === 'explore') {
        select('country', feature.properties.id);
      }
    },
    [countries, recordCountryAttempt, recordQuizAnswer, setQuizFeedback, select]
  );

  const handleWaterBodyClick = useCallback(
    (wb: WaterBody) => {
      const state = useAppStore.getState();
      if (state.mode === 'quiz' && state.quiz.active && state.quiz.category === 'waterBodies' && !state.quiz.feedback) {
        const correct = wb.id === state.quiz.targetId;
        const target = WATER_BODIES.find((w) => w.id === state.quiz.targetId);
        recordWaterBodyAttempt(state.quiz.targetId ?? '', correct);
        recordQuizAnswer(correct);
        setQuizFeedback(correct ? 'correct' : 'incorrect', target?.name, wb.id);
        return;
      }
      if (state.mode === 'explore') {
        select('waterBody', wb.id);
      }
    },
    [recordWaterBodyAttempt, recordQuizAnswer, setQuizFeedback, select]
  );

  const handleGeoFeatureClick = useCallback(
    (gf: GeoFeatureItem) => {
      if (useAppStore.getState().mode === 'explore') {
        select('geoFeature', gf.id);
      }
    },
    [select]
  );

  if (error) {
    return (
      <div className="load-screen">
        <p>Couldn't load the world geography dataset.</p>
        <p className="muted-note">{error}</p>
        <button type="button" className="primary-button" onClick={() => init()}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      {loading ? (
        <div className="load-screen">
          <div className="load-screen__spinner" aria-hidden="true" />
          <p>Charting the world…</p>
        </div>
      ) : (
        <Globe3D
          countries={countries}
          layers={layers}
          mode={mode}
          selectedCountryId={selectionType === 'country' ? selectedId : null}
          selectedWaterBodyId={selectionType === 'waterBody' ? selectedId : null}
          selectedGeoFeatureId={selectionType === 'geoFeature' ? selectedId : null}
          searchHighlightId={searchHighlightId}
          quiz={{
            active: quiz.active,
            targetId: quiz.targetId,
            userPickId: quiz.userPickId,
            feedback: quiz.feedback,
            category: quiz.category
          }}
          cameraCommand={cameraCommand}
          onCameraCommandHandled={clearCameraCommand}
          onCountryClick={handleCountryClick}
          onWaterBodyClick={handleWaterBodyClick}
          onGeoFeatureClick={handleGeoFeatureClick}
          onBackgroundClick={clearSelection}
        />
      )}

      <Header />
      <Sidebar />
      <ProgressDashboard />
      {mode === 'explore' && <RecallPanel />}
      {mode === 'explore' && <InfoPanel />}
      {mode === 'quiz' && <QuizBar />}
    </div>
  );
}
