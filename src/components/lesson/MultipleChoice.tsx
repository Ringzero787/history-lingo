import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn, useAnimatedStyle, withSequence, withTiming } from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { MultipleChoiceQuestion } from '../../types';

interface MultipleChoiceProps {
  question: MultipleChoiceQuestion;
  onAnswer: (selectedIndex: number) => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
  selectedAnswer: number | null;
}

export function MultipleChoice({
  question,
  onAnswer,
  isAnswered,
  isCorrect,
  selectedAnswer,
}: MultipleChoiceProps) {
  const getOptionStyle = (index: number) => {
    if (!isAnswered) return styles.option;

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
      <Text style={styles.prompt}>{question.prompt}</Text>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  prompt: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.lg,
    lineHeight: 32,
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
});
