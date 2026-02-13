import { useCallback } from 'react';
import { useLessonStore } from '../stores/lessonStore';
import { useGameStore } from '../stores/gameStore';
import { useAuthStore } from '../stores/authStore';
import { Question, Lesson, LessonResult } from '../types';
import { submitLessonResult } from '../services/lessons';
import { deductHeart } from '../services/gamification';
import { XP_REWARDS } from '../constants/xp';

export function useLesson() {
  const {
    currentLesson,
    currentQuestionIndex,
    answers,
    correctCount,
    startTime,
    isCorrect,
    showExplanation,
    lessonComplete,
    answerQuestion,
    setCorrect,
    showExplanationAction,
    nextQuestion,
    startLesson,
    resetLesson,
  } = useLessonStore();

  const { addXp, addDailyXp, triggerXpAnimation, deductHeart: deductHeartLocal, triggerLevelUp } = useGameStore();
  const { user } = useAuthStore();

  const currentQuestion: Question | null =
    currentLesson?.questions[currentQuestionIndex] ?? null;

  const totalQuestions = currentLesson?.questions.length ?? 0;
  const progress = totalQuestions > 0 ? (currentQuestionIndex + 1) / totalQuestions : 0;

  // Check answer correctness based on question type
  const checkAnswer = useCallback(
    (answer: number | string | boolean) => {
      if (!currentQuestion) return;

      let correct = false;

      switch (currentQuestion.type) {
        case 'multiple_choice':
          correct = answer === currentQuestion.correctIndex;
          break;
        case 'true_false':
          correct = answer === currentQuestion.correct;
          break;
        case 'fill_blank': {
          const strAnswer = String(answer).toLowerCase().trim();
          correct =
            strAnswer === currentQuestion.answer.toLowerCase() ||
            currentQuestion.acceptableAnswers.some(
              (a) => a.toLowerCase() === strAnswer
            );
          break;
        }
        case 'who_said_it':
          correct = answer === currentQuestion.correctIndex;
          break;
        default:
          break;
      }

      answerQuestion(answer);
      setCorrect(correct);

      if (correct) {
        addXp(XP_REWARDS.CORRECT_ANSWER);
        addDailyXp(XP_REWARDS.CORRECT_ANSWER);
        triggerXpAnimation(XP_REWARDS.CORRECT_ANSWER);
      } else {
        deductHeartLocal();
        if (user) {
          deductHeart(user.uid).catch(console.error);
        }
      }

      showExplanationAction();
    },
    [currentQuestion, user]
  );

  // Submit lesson results
  const finishLesson = useCallback(async (): Promise<LessonResult | null> => {
    if (!currentLesson || !user || !startTime) return null;

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    const perfect = correctCount === currentLesson.questions.length;

    const result: LessonResult = {
      lessonId: currentLesson.id,
      eraId: useLessonStore.getState().currentEraId ?? '',
      score: Math.round((correctCount / currentLesson.questions.length) * 100),
      totalQuestions: currentLesson.questions.length,
      correctAnswers: correctCount,
      xpEarned: correctCount * XP_REWARDS.CORRECT_ANSWER + (perfect ? XP_REWARDS.PERFECT_LESSON_BONUS : 0),
      perfectLesson: perfect,
      timeSpentSeconds: timeSpent,
    };

    try {
      const { totalXpEarned, newLevel } = await submitLessonResult(user.uid, result);
      const currentLevel = useGameStore.getState().level;
      if (newLevel > currentLevel) {
        useGameStore.getState().setLevel(newLevel);
        triggerLevelUp();
      }
    } catch (error) {
      console.error('Error submitting lesson result:', error);
    }

    return result;
  }, [currentLesson, user, startTime, correctCount]);

  return {
    currentLesson,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    answers,
    isCorrect,
    showExplanation,
    lessonComplete,
    correctCount,
    checkAnswer,
    nextQuestion,
    finishLesson,
    startLesson,
    resetLesson,
  };
}
