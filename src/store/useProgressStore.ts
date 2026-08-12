import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CountryStats, WaterBodyStats } from '../types';

interface FieldCorrectness {
  country: boolean;
  capital: boolean;
  continent: boolean;
}

interface ProgressState {
  countryStats: Record<string, CountryStats>;
  waterBodyStats: Record<string, WaterBodyStats>;
  quizScore: { correct: number; total: number };

  /** `correct` is the single overall outcome for this attempt (all fields must match in Explore mode; the one asked field in Quiz mode). `fields` is optional extra detail for the reveal UI. */
  recordCountryAttempt: (cca3: string, correct: boolean, fields?: FieldCorrectness) => void;
  recordWaterBodyAttempt: (id: string, correct: boolean) => void;
  recordQuizAnswer: (correct: boolean) => void;
  resetProgress: () => void;
}

const STORAGE_KEY = 'worldgeo-recall-progress-v1';

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      countryStats: {},
      waterBodyStats: {},
      quizScore: { correct: 0, total: 0 },

      recordCountryAttempt: (cca3, allCorrect, fields) => {
        set((state) => {
          const prev = state.countryStats[cca3] ?? { attempts: 0, correct: 0, wrong: 0, lastSeen: 0 };
          return {
            countryStats: {
              ...state.countryStats,
              [cca3]: {
                attempts: prev.attempts + 1,
                correct: prev.correct + (allCorrect ? 1 : 0),
                wrong: prev.wrong + (allCorrect ? 0 : 1),
                lastSeen: Date.now(),
                lastFieldResult: fields ?? prev.lastFieldResult
              }
            }
          };
        });
      },

      recordWaterBodyAttempt: (id, correct) => {
        set((state) => {
          const prev = state.waterBodyStats[id] ?? { attempts: 0, correct: 0, wrong: 0 };
          return {
            waterBodyStats: {
              ...state.waterBodyStats,
              [id]: {
                attempts: prev.attempts + 1,
                correct: prev.correct + (correct ? 1 : 0),
                wrong: prev.wrong + (correct ? 0 : 1)
              }
            }
          };
        });
      },

      recordQuizAnswer: (correct) => {
        const { quizScore } = get();
        set({ quizScore: { correct: quizScore.correct + (correct ? 1 : 0), total: quizScore.total + 1 } });
      },

      resetProgress: () => set({ countryStats: {}, waterBodyStats: {}, quizScore: { correct: 0, total: 0 } })
    }),
    { name: STORAGE_KEY }
  )
);
