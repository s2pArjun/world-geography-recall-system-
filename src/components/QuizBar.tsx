import { useEffect, useState, useCallback } from 'react';
import { useAppStore } from '../store/useAppStore';
import { useGeoDataStore } from '../store/useGeoDataStore';
import { useProgressStore } from '../store/useProgressStore';
import { WATER_BODIES } from '../data/waterBodies';
import { pickQuizCountry, pickQuestionType } from '../lib/quizEngine';
import { checkAnswer } from '../lib/matching';
import { acceptedCapitals, displayCapital, allCapitalsPool } from '../lib/geoData';
import { CONTINENT_LIST } from '../lib/continents';

export default function QuizBar() {
  const mode = useAppStore((s) => s.mode);
  const quiz = useAppStore((s) => s.quiz);
  const startQuizQuestion = useAppStore((s) => s.startQuizQuestion);
  const setQuizFeedback = useAppStore((s) => s.setQuizFeedback);
  const setQuizCategory = useAppStore((s) => s.setQuizCategory);

  const sovereignCountries = useGeoDataStore((s) => s.sovereignCountries);
  const countryStats = useProgressStore((s) => s.countryStats);
  const quizScore = useProgressStore((s) => s.quizScore);
  const recordCountryAttempt = useProgressStore((s) => s.recordCountryAttempt);
  const recordQuizAnswer = useProgressStore((s) => s.recordQuizAnswer);

  const [inputValue, setInputValue] = useState('');

  const currentCountry =
    quiz.category === 'countries' && quiz.targetId
      ? sovereignCountries.find((c) => c.properties.id === quiz.targetId) ?? null
      : null;
  const currentWaterBody =
    quiz.category === 'waterBodies' && quiz.targetId ? WATER_BODIES.find((w) => w.id === quiz.targetId) ?? null : null;

  const generateQuestion = useCallback(() => {
    setInputValue('');
    if (quiz.category === 'countries') {
      if (sovereignCountries.length === 0) return;
      const country = pickQuizCountry(sovereignCountries, countryStats);
      if (!country) return;
      startQuizQuestion('countries', pickQuestionType(), country.properties.id);
    } else {
      const wb = WATER_BODIES[Math.floor(Math.random() * WATER_BODIES.length)];
      startQuizQuestion('waterBodies', 'find', wb.id);
    }
  }, [quiz.category, sovereignCountries, countryStats, startQuizQuestion]);

  // Kick off a question whenever quiz mode starts, or once a fresh category has no active question.
  useEffect(() => {
    if (mode === 'quiz' && !quiz.active && sovereignCountries.length > 0) {
      generateQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, quiz.active, quiz.category, sovereignCountries.length]);

  const submitTextAnswer = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!currentCountry || !quiz.questionType || quiz.feedback) return;
      let correct = false;
      let correctDisplay = '';
      if (quiz.questionType === 'capital') {
        correct = checkAnswer(inputValue, acceptedCapitals(currentCountry), allCapitalsPool(sovereignCountries));
        correctDisplay = displayCapital(currentCountry) ?? '';
      } else if (quiz.questionType === 'continent') {
        correct = inputValue === currentCountry.properties.continent;
        correctDisplay = currentCountry.properties.continent;
      }
      recordCountryAttempt(currentCountry.properties.id, correct);
      recordQuizAnswer(correct);
      setQuizFeedback(correct ? 'correct' : 'incorrect', correctDisplay);
    },
    [currentCountry, quiz.questionType, quiz.feedback, inputValue, recordCountryAttempt, recordQuizAnswer, setQuizFeedback, sovereignCountries]
  );

  if (mode !== 'quiz') return null;

  const questionText = (() => {
    if (quiz.questionType === 'capital' && currentCountry) return `What is the capital of ${currentCountry.properties.name}?`;
    if (quiz.questionType === 'continent' && currentCountry) return `Which continent is ${currentCountry.properties.name} in?`;
    if (quiz.questionType === 'find' && quiz.category === 'countries' && currentCountry)
      return `Find ${currentCountry.properties.name} on the globe.`;
    if (quiz.questionType === 'find' && quiz.category === 'waterBodies' && currentWaterBody)
      return `Find the ${currentWaterBody.name} on the globe.`;
    return 'Loading question…';
  })();

  return (
    <div className="quiz-bar">
      <div className="quiz-bar__top">
        <div className="quiz-bar__category" role="tablist" aria-label="Quiz category">
          <button
            type="button"
            role="tab"
            aria-selected={quiz.category === 'countries'}
            className={quiz.category === 'countries' ? 'is-active' : ''}
            onClick={() => setQuizCategory('countries')}
          >
            Countries
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={quiz.category === 'waterBodies'}
            className={quiz.category === 'waterBodies' ? 'is-active' : ''}
            onClick={() => setQuizCategory('waterBodies')}
          >
            Water Bodies
          </button>
        </div>
        <span className="quiz-bar__score mono">
          Score {quizScore.correct}/{quizScore.total}
        </span>
      </div>

      <p className="quiz-bar__question">{questionText}</p>

      {quiz.feedback ? (
        <div className={`quiz-bar__feedback ${quiz.feedback === 'correct' ? 'is-correct' : 'is-incorrect'}`}>
          <span>{quiz.feedback === 'correct' ? '✓ Correct' : '✗ Not quite'}</span>
          {quiz.feedback === 'incorrect' && quiz.revealName && (
            <span>
              Correct answer: <strong>{quiz.revealName}</strong>
            </span>
          )}
          <button type="button" className="primary-button" onClick={generateQuestion}>
            Next Question →
          </button>
        </div>
      ) : quiz.questionType === 'find' ? (
        <p className="quiz-bar__hint">Click the correct {quiz.category === 'countries' ? 'country' : 'water body'} on the globe.</p>
      ) : quiz.questionType === 'continent' ? (
        <form className="quiz-bar__form" onSubmit={submitTextAnswer}>
          <select value={inputValue} onChange={(e) => setInputValue(e.target.value)} autoFocus>
            <option value="" disabled>
              Choose a continent…
            </option>
            {CONTINENT_LIST.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <button type="submit" className="primary-button" disabled={!inputValue}>
            Check Answer
          </button>
        </form>
      ) : (
        <form className="quiz-bar__form" onSubmit={submitTextAnswer}>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type the capital city…"
            autoFocus
          />
          <button type="submit" className="primary-button" disabled={!inputValue.trim()}>
            Check Answer
          </button>
        </form>
      )}
    </div>
  );
}
