import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { Button } from '../ui/Button';
import { StoryCompletionQuestion } from '../../types';

interface StoryCompletionProps {
  question: StoryCompletionQuestion;
  onAnswer: (answers: string[]) => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
}

export function StoryCompletion({
  question,
  onAnswer,
  isAnswered,
  isCorrect,
}: StoryCompletionProps) {
  const [answers, setAnswers] = useState<string[]>(
    () => new Array(question.blanks.length).fill('')
  );
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const allFilled = answers.every((a) => a.trim().length > 0);

  const handleChange = (index: number, value: string) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSubmitInput = (index: number) => {
    if (index < question.blanks.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = () => {
    if (allFilled) {
      onAnswer(answers.map((a) => a.trim()));
    }
  };

  // Check correctness per blank for display after answering
  const blankResults = isAnswered
    ? question.blanks.map((blank, i) => {
        const userAnswer = answers[i]?.toLowerCase().trim() ?? '';
        return (
          userAnswer === blank.answer.toLowerCase() ||
          blank.acceptableAnswers.some(
            (a) => a.toLowerCase() === userAnswer
          )
        );
      })
    : [];

  // Render narrative with blank indicators
  const renderNarrative = () => {
    // Split by [1], [2], etc.
    const parts = question.narrative.split(/\[(\d+)\]/);
    return parts.map((part, i) => {
      // Odd indices are the blank numbers
      if (i % 2 === 1) {
        const blankIndex = parseInt(part, 10) - 1;
        if (blankIndex < 0 || blankIndex >= question.blanks.length) {
          return <Text key={i}>[{part}]</Text>;
        }

        if (isAnswered) {
          const correct = blankResults[blankIndex];
          return (
            <Text
              key={i}
              style={[
                styles.blankInline,
                correct ? styles.correctBlank : styles.incorrectBlank,
              ]}
            >
              {answers[blankIndex] || '___'}
            </Text>
          );
        }

        return (
          <Text key={i} style={styles.blankInline}>
            [{blankIndex + 1}]
          </Text>
        );
      }
      return <Text key={i}>{part}</Text>;
    });
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      {/* Narrative */}
      <View style={styles.narrativeContainer}>
        <Text style={styles.narrativeText}>{renderNarrative()}</Text>
      </View>

      {/* Blank inputs */}
      <View style={styles.inputsContainer}>
        {question.blanks.map((blank, index) => (
          <View key={index} style={styles.inputRow}>
            <Text style={styles.inputLabel}>Blank {index + 1}:</Text>
            {!isAnswered ? (
              <TextInput
                ref={(ref) => { inputRefs.current[index] = ref; }}
                style={styles.input}
                value={answers[index]}
                onChangeText={(val) => handleChange(index, val)}
                placeholder={`Answer for blank ${index + 1}...`}
                placeholderTextColor={Colors.textMuted}
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType={
                  index < question.blanks.length - 1 ? 'next' : 'done'
                }
                onSubmitEditing={() => handleSubmitInput(index)}
              />
            ) : (
              <View
                style={[
                  styles.resultBox,
                  blankResults[index] ? styles.correctResult : styles.incorrectResult,
                ]}
              >
                <Text
                  style={[
                    styles.resultText,
                    blankResults[index] ? styles.correctText : styles.incorrectText,
                  ]}
                >
                  {answers[index]}
                </Text>
                {!blankResults[index] && (
                  <Text style={styles.correctAnswer}>
                    Correct: {blank.answer}
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}
      </View>

      {!isAnswered && (
        <Button
          title="Submit Answers"
          onPress={handleSubmit}
          disabled={!allFilled}
          size="lg"
          fullWidth
        />
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  narrativeContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  narrativeText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 26,
  },
  blankInline: {
    color: Colors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  correctBlank: {
    color: Colors.success,
  },
  incorrectBlank: {
    color: Colors.error,
  },
  inputsContainer: {
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  inputRow: {
    gap: Spacing.xs,
  },
  inputLabel: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.md,
    color: Colors.text,
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
  },
  resultBox: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
  },
  correctResult: {
    backgroundColor: Colors.success + '15',
    borderColor: Colors.success + '30',
  },
  incorrectResult: {
    backgroundColor: Colors.error + '15',
    borderColor: Colors.error + '30',
  },
  resultText: {
    fontSize: FontSizes.md,
    fontWeight: '600',
  },
  correctText: {
    color: Colors.success,
  },
  incorrectText: {
    color: Colors.error,
  },
  correctAnswer: {
    fontSize: FontSizes.sm,
    color: Colors.success,
    marginTop: Spacing.xs,
    fontWeight: '600',
  },
});
