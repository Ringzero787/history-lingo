import { create } from 'zustand';
import { Lesson, Question, Era } from '../types';

interface LessonState {
  // Era data
  eras: Era[];
  currentEraId: string | null;

  // Lesson data
  currentLesson: Lesson | null;
  currentQuestionIndex: number;
  answers: (number | string | string[] | number[] | boolean | null)[];
  isCorrect: boolean | null;
  showExplanation: boolean;
  lessonComplete: boolean;

  // Stats for current lesson
  correctCount: number;
  startTime: number | null;

  // Actions
  setEras: (eras: Era[]) => void;
  setCurrentEra: (eraId: string) => void;
  startLesson: (lesson: Lesson) => void;
  answerQuestion: (answer: number | string | string[] | number[] | boolean) => void;
  setCorrect: (correct: boolean) => void;
  showExplanationAction: () => void;
  nextQuestion: () => void;
  completeLesson: () => void;
  resetLesson: () => void;
  reset: () => void;
}

export const useLessonStore = create<LessonState>((set, get) => ({
  eras: [],
  currentEraId: null,
  currentLesson: null,
  currentQuestionIndex: 0,
  answers: [],
  isCorrect: null,
  showExplanation: false,
  lessonComplete: false,
  correctCount: 0,
  startTime: null,

  setEras: (eras) => set({ eras }),
  setCurrentEra: (eraId) => set({ currentEraId: eraId }),

  startLesson: (lesson) =>
    set({
      currentLesson: lesson,
      currentQuestionIndex: 0,
      answers: new Array(lesson.questions.length).fill(null),
      isCorrect: null,
      showExplanation: false,
      lessonComplete: false,
      correctCount: 0,
      startTime: Date.now(),
    }),

  answerQuestion: (answer) =>
    set((state) => {
      const newAnswers = [...state.answers];
      newAnswers[state.currentQuestionIndex] = answer;
      return { answers: newAnswers };
    }),

  setCorrect: (correct) =>
    set((state) => ({
      isCorrect: correct,
      correctCount: correct ? state.correctCount + 1 : state.correctCount,
    })),

  showExplanationAction: () => set({ showExplanation: true }),

  nextQuestion: () =>
    set((state) => {
      const nextIndex = state.currentQuestionIndex + 1;
      const isComplete =
        state.currentLesson !== null && nextIndex >= state.currentLesson.questions.length;
      return {
        currentQuestionIndex: isComplete ? state.currentQuestionIndex : nextIndex,
        isCorrect: null,
        showExplanation: false,
        lessonComplete: isComplete,
      };
    }),

  completeLesson: () => set({ lessonComplete: true }),

  resetLesson: () =>
    set({
      currentLesson: null,
      currentQuestionIndex: 0,
      answers: [],
      isCorrect: null,
      showExplanation: false,
      lessonComplete: false,
      correctCount: 0,
      startTime: null,
    }),

  reset: () =>
    set({
      eras: [],
      currentEraId: null,
      currentLesson: null,
      currentQuestionIndex: 0,
      answers: [],
      isCorrect: null,
      showExplanation: false,
      lessonComplete: false,
      correctCount: 0,
      startTime: null,
    }),
}));
