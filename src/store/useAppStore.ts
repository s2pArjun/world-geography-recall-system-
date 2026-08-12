import { create } from 'zustand';
import type { AppMode, LayerState, QuizCategory, QuizQuestionType } from '../types';

export type SelectionType = 'country' | 'waterBody' | 'geoFeature' | null;

interface QuizState {
  active: boolean;
  category: QuizCategory;
  questionType: QuizQuestionType | null;
  targetId: string | null;
  userPickId: string | null; // for 'find' questions: what the learner actually clicked
  feedback: 'correct' | 'incorrect' | null;
  revealName: string | null; // shown after an answer, right or wrong
}

interface CameraCommand {
  lat: number;
  lng: number;
  altitude: number;
  ts: number;
}

interface AppState {
  mode: AppMode;
  layers: LayerState;

  selectionType: SelectionType;
  selectedId: string | null;
  searchHighlightId: string | null;

  quiz: QuizState;
  cameraCommand: CameraCommand | null;
  sidebarOpen: boolean;
  toast: { message: string; tone: 'info' | 'success' | 'error' } | null;

  setMode: (mode: AppMode) => void;
  toggleLayer: (key: keyof LayerState) => void;
  select: (type: SelectionType, id: string | null) => void;
  clearSelection: () => void;
  setSearchHighlight: (id: string | null) => void;
  flyTo: (lat: number, lng: number, altitude?: number) => void;
  clearCameraCommand: () => void;
  setSidebarOpen: (open: boolean) => void;

  startQuizQuestion: (category: QuizCategory, questionType: QuizQuestionType, targetId: string) => void;
  setQuizFeedback: (feedback: 'correct' | 'incorrect', revealName?: string, userPickId?: string) => void;
  clearQuizFeedback: () => void;
  setQuizCategory: (category: QuizCategory) => void;

  showToast: (message: string, tone?: 'info' | 'success' | 'error') => void;
  clearToast: () => void;
}

export const DEFAULT_LAYERS: LayerState = {
  countries: true,
  capitals: false,
  oceans: true,
  rivers: false,
  mountains: false,
  deserts: false,
  straitsCanals: false,
  islands: false,
  graticule: false
};

export const useAppStore = create<AppState>((set) => ({
  mode: 'explore',
  layers: { ...DEFAULT_LAYERS },
  selectionType: null,
  selectedId: null,
  searchHighlightId: null,
  quiz: {
    active: false,
    category: 'countries',
    questionType: null,
    targetId: null,
    userPickId: null,
    feedback: null,
    revealName: null
  },
  cameraCommand: null,
  sidebarOpen: true,
  toast: null,

  setMode: (mode) =>
    set((state) => ({
      mode,
      selectionType: null,
      selectedId: null,
      quiz: mode === 'quiz' ? state.quiz : { ...state.quiz, active: false, feedback: null }
    })),

  toggleLayer: (key) => set((state) => ({ layers: { ...state.layers, [key]: !state.layers[key] } })),

  select: (type, id) => set({ selectionType: type, selectedId: id, searchHighlightId: null }),
  clearSelection: () => set({ selectionType: null, selectedId: null }),
  setSearchHighlight: (id) => set({ searchHighlightId: id }),

  flyTo: (lat, lng, altitude = 1.6) => set({ cameraCommand: { lat, lng, altitude, ts: Date.now() } }),
  clearCameraCommand: () => set({ cameraCommand: null }),

  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  startQuizQuestion: (category, questionType, targetId) =>
    set({
      quiz: { active: true, category, questionType, targetId, userPickId: null, feedback: null, revealName: null },
      selectionType: null,
      selectedId: null
    }),

  setQuizFeedback: (feedback, revealName, userPickId) =>
    set((state) => ({
      quiz: {
        ...state.quiz,
        feedback,
        revealName: revealName ?? state.quiz.revealName,
        userPickId: userPickId ?? state.quiz.userPickId
      }
    })),

  clearQuizFeedback: () => set((state) => ({ quiz: { ...state.quiz, feedback: null, revealName: null, userPickId: null } })),

  setQuizCategory: (category) =>
    set((state) => ({
      quiz: { ...state.quiz, category, active: false, targetId: null, questionType: null, userPickId: null }
    })),

  showToast: (message, tone = 'info') => set({ toast: { message, tone } }),
  clearToast: () => set({ toast: null })
}));
