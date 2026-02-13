import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../src/constants/theme';
import { ProgressBar } from '../../src/components/ui/ProgressBar';
import { Button } from '../../src/components/ui/Button';
import { XPBadge } from '../../src/components/ui/XPBadge';
import { XPAnimation } from '../../src/components/gamification/XPAnimation';
import { MultipleChoice } from '../../src/components/lesson/MultipleChoice';
import { TrueFalse } from '../../src/components/lesson/TrueFalse';
import { FillInBlank } from '../../src/components/lesson/FillInBlank';
import { TimelineOrder } from '../../src/components/lesson/TimelineOrder';
import { WhoSaidIt } from '../../src/components/lesson/WhoSaidIt';
import { StoryCompletion } from '../../src/components/lesson/StoryCompletion';
import { useLesson } from '../../src/hooks/useLesson';
import { useLessonStore } from '../../src/stores/lessonStore';
import { useGameStore } from '../../src/stores/gameStore';
import { fetchLesson } from '../../src/services/lessons';
import { LessonResult } from '../../src/types';
import { calculateAccuracy } from '../../src/utils/formatters';

export default function LessonScreen() {
  const { id, eraId } = useLocalSearchParams<{ id: string; eraId: string }>();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<LessonResult | null>(null);

  const {
    currentLesson,
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    progress,
    isCorrect,
    showExplanation,
    lessonComplete,
    correctCount,
    checkAnswer,
    nextQuestion,
    finishLesson,
    startLesson,
    resetLesson,
  } = useLesson();

  const { pendingXpAnimation, clearXpAnimation, heartsRemaining } = useGameStore();

  // Load lesson data
  useEffect(() => {
    async function load() {
      if (!id || !eraId) return;
      try {
        const lesson = await fetchLesson(eraId, id);
        if (lesson) {
          startLesson(lesson);
        }
      } catch (err) {
        console.error('Failed to load lesson:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => resetLesson();
  }, [id, eraId]);

  // Handle lesson completion
  useEffect(() => {
    if (lessonComplete && !result) {
      finishLesson().then((r) => {
        if (r) setResult(r);
      });
    }
  }, [lessonComplete]);

  if (loading || !currentLesson) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.loadingText}>Loading lesson...</Text>
      </SafeAreaView>
    );
  }

  // Lesson Complete Screen
  if (result) {
    return (
      <SafeAreaView style={styles.container}>
        <Animated.View entering={FadeIn.duration(500)} style={styles.resultContainer}>
          <Text style={styles.resultEmoji}>
            {result.perfectLesson ? '🌟' : result.score >= 70 ? '🎉' : '📚'}
          </Text>
          <Text style={styles.resultTitle}>
            {result.perfectLesson ? 'Perfect!' : result.score >= 70 ? 'Great Job!' : 'Keep Practicing!'}
          </Text>

          <View style={styles.resultStats}>
            <View style={styles.resultStat}>
              <Text style={styles.resultStatValue}>{calculateAccuracy(result.correctAnswers, result.totalQuestions)}%</Text>
              <Text style={styles.resultStatLabel}>Accuracy</Text>
            </View>
            <View style={styles.resultStat}>
              <XPBadge xp={result.xpEarned} size="lg" showPlus />
            </View>
            <View style={styles.resultStat}>
              <Text style={styles.resultStatValue}>{result.correctAnswers}/{result.totalQuestions}</Text>
              <Text style={styles.resultStatLabel}>Correct</Text>
            </View>
          </View>

          <Button
            title="Continue"
            onPress={() => router.back()}
            size="lg"
            fullWidth
          />
        </Animated.View>
      </SafeAreaView>
    );
  }

  // Get fun fact for between questions
  const funFact = showExplanation && currentLesson.funFacts[currentQuestionIndex % currentLesson.funFacts.length];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeButton}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>
        <View style={styles.progressContainer}>
          <ProgressBar progress={progress} height={8} color={Colors.primary} />
        </View>
        <Text style={styles.heartsDisplay}>
          {'❤️'.repeat(heartsRemaining)}
        </Text>
      </View>

      {/* Question Area */}
      <ScrollView
        contentContainerStyle={styles.questionContainer}
        showsVerticalScrollIndicator={false}
      >
        {currentQuestion && (
          <>
            {currentQuestion.type === 'multiple_choice' && (
              <MultipleChoice
                question={currentQuestion}
                onAnswer={(idx) => checkAnswer(idx)}
                isAnswered={isCorrect !== null}
                isCorrect={isCorrect}
                selectedAnswer={useLessonStore.getState().answers[currentQuestionIndex] as number | null}
              />
            )}

            {currentQuestion.type === 'true_false' && (
              <TrueFalse
                question={currentQuestion}
                onAnswer={(val) => checkAnswer(val)}
                isAnswered={isCorrect !== null}
                isCorrect={isCorrect}
                selectedAnswer={useLessonStore.getState().answers[currentQuestionIndex] as boolean | null}
              />
            )}

            {currentQuestion.type === 'fill_blank' && (
              <FillInBlank
                question={currentQuestion}
                onAnswer={(val) => checkAnswer(val)}
                isAnswered={isCorrect !== null}
                isCorrect={isCorrect}
              />
            )}

            {currentQuestion.type === 'timeline_order' && (
              <TimelineOrder
                question={currentQuestion}
                onAnswer={(order) => checkAnswer(order)}
                isAnswered={isCorrect !== null}
                isCorrect={isCorrect}
              />
            )}

            {currentQuestion.type === 'who_said_it' && (
              <WhoSaidIt
                question={currentQuestion}
                onAnswer={(idx) => checkAnswer(idx)}
                isAnswered={isCorrect !== null}
                isCorrect={isCorrect}
                selectedAnswer={useLessonStore.getState().answers[currentQuestionIndex] as number | null}
              />
            )}

            {currentQuestion.type === 'story_completion' && (
              <StoryCompletion
                question={currentQuestion}
                onAnswer={(answers) => checkAnswer(answers)}
                isAnswered={isCorrect !== null}
                isCorrect={isCorrect}
              />
            )}
          </>
        )}

        {/* Explanation / Fun Fact */}
        {showExplanation && currentQuestion && (
          <Animated.View entering={FadeIn.duration(300)} style={styles.explanationContainer}>
            {('explanation' in currentQuestion || 'context' in currentQuestion) && (
              <View style={[styles.explanationBox, isCorrect ? styles.correctBox : styles.incorrectBox]}>
                <Text style={styles.explanationTitle}>
                  {isCorrect ? 'Correct! ✓' : 'Not quite ✗'}
                </Text>
                <Text style={styles.explanationText}>
                  {'explanation' in currentQuestion
                    ? currentQuestion.explanation
                    : 'context' in currentQuestion
                      ? (currentQuestion as any).context
                      : ''}
                </Text>
              </View>
            )}

            {funFact && (
              <View style={styles.funFactBox}>
                <Text style={styles.funFactTitle}>💡 Did you know?</Text>
                <Text style={styles.funFactText}>{funFact}</Text>
              </View>
            )}

            <Button
              title={currentQuestionIndex < totalQuestions - 1 ? 'Next Question' : 'Finish Lesson'}
              onPress={nextQuestion}
              size="lg"
              fullWidth
            />
          </Animated.View>
        )}
      </ScrollView>

      {/* XP Animation */}
      {pendingXpAnimation > 0 && (
        <XPAnimation amount={pendingXpAnimation} onComplete={clearXpAnimation} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.md,
    textAlign: 'center',
    marginTop: 100,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    color: Colors.textSecondary,
    fontSize: 18,
    fontWeight: '700',
  },
  progressContainer: {
    flex: 1,
  },
  heartsDisplay: {
    fontSize: 14,
  },
  questionContainer: {
    padding: Spacing.lg,
    flexGrow: 1,
  },
  explanationContainer: {
    marginTop: Spacing.lg,
    gap: Spacing.md,
  },
  explanationBox: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  correctBox: {
    backgroundColor: Colors.success + '15',
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  incorrectBox: {
    backgroundColor: Colors.error + '15',
    borderWidth: 1,
    borderColor: Colors.error + '30',
  },
  explanationTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  explanationText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  funFactBox: {
    backgroundColor: Colors.warning + '10',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.warning + '25',
  },
  funFactTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '700',
    color: Colors.warning,
    marginBottom: Spacing.xs,
  },
  funFactText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  resultContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  resultEmoji: {
    fontSize: 80,
  },
  resultTitle: {
    fontSize: FontSizes.hero,
    fontWeight: '900',
    color: Colors.text,
  },
  resultStats: {
    flexDirection: 'row',
    gap: Spacing.xl,
    marginVertical: Spacing.lg,
  },
  resultStat: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  resultStatValue: {
    fontSize: FontSizes.xxl,
    fontWeight: '900',
    color: Colors.text,
  },
  resultStatLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
