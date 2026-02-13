import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { WhoSaidItQuestion } from '../../types';

interface WhoSaidItProps {
  question: WhoSaidItQuestion;
  onAnswer: (selectedIndex: number) => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
  selectedAnswer: number | null;
}

export function WhoSaidIt({
  question,
  onAnswer,
  isAnswered,
  isCorrect,
  selectedAnswer,
}: WhoSaidItProps) {
  const getOptionStyle = (index: number) => {
    if (!isAnswered) return [styles.option];

    if (index === question.correctIndex) {
      return [styles.option, styles.correctOption];
    }
    if (index === selectedAnswer && !isCorrect) {
      return [styles.option, styles.incorrectOption];
    }
    return [styles.option, styles.dimmedOption];
  };

  const getOptionTextStyle = (index: number) => {
    if (!isAnswered) return styles.optionText;

    if (index === question.correctIndex) {
      return [styles.optionText, styles.correctText];
    }
    if (index === selectedAnswer && !isCorrect) {
      return [styles.optionText, styles.incorrectText];
    }
    return [styles.optionText, styles.dimmedText];
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      {/* Quote display */}
      <View style={styles.quoteContainer}>
        <Text style={styles.quoteMarks}>"</Text>
        <Text style={styles.quoteText}>{question.quote}</Text>
        <Text style={[styles.quoteMarks, styles.quoteMarksEnd]}>"</Text>
      </View>

      <Text style={styles.prompt}>Who said this?</Text>

      {/* Options */}
      <View style={styles.optionsContainer}>
        {question.options.map((option, index) => (
          <Pressable
            key={index}
            onPress={() => !isAnswered && onAnswer(index)}
            disabled={isAnswered}
            style={({ pressed }) => [
              ...getOptionStyle(index),
              pressed && !isAnswered && styles.optionPressed,
            ]}
          >
            <View style={styles.optionLetter}>
              <Text style={styles.optionLetterText}>
                {String.fromCharCode(65 + index)}
              </Text>
            </View>
            <Text style={getOptionTextStyle(index)}>{option}</Text>
          </Pressable>
        ))}
      </View>

      {/* Context shown after answering */}
      {isAnswered && (
        <View style={[styles.contextBox, isCorrect ? styles.correctBox : styles.incorrectBox]}>
          <Text style={styles.contextTitle}>
            {isCorrect ? 'Correct!' : 'Not quite'}
          </Text>
          <Text style={styles.contextText}>{question.context}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  quoteContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary,
  },
  quoteMarks: {
    fontSize: 48,
    color: Colors.primary,
    fontWeight: '900',
    lineHeight: 48,
    opacity: 0.6,
  },
  quoteMarksEnd: {
    textAlign: 'right',
    marginTop: -Spacing.sm,
  },
  quoteText: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.text,
    fontStyle: 'italic',
    lineHeight: 28,
    paddingHorizontal: Spacing.sm,
  },
  prompt: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  optionsContainer: {
    gap: Spacing.md,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
  },
  optionPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  correctOption: {
    borderColor: Colors.success,
    backgroundColor: Colors.success + '15',
  },
  incorrectOption: {
    borderColor: Colors.error,
    backgroundColor: Colors.error + '15',
  },
  dimmedOption: {
    opacity: 0.5,
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surfaceLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  optionLetterText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  optionText: {
    flex: 1,
    color: Colors.text,
    fontSize: FontSizes.md,
    lineHeight: 22,
  },
  correctText: {
    color: Colors.success,
    fontWeight: '600',
  },
  incorrectText: {
    color: Colors.error,
    fontWeight: '600',
  },
  dimmedText: {
    color: Colors.textMuted,
  },
  contextBox: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginTop: Spacing.lg,
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
  contextTitle: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  contextText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});
