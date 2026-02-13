import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { TrueFalseQuestion } from '../../types';

interface TrueFalseProps {
  question: TrueFalseQuestion;
  onAnswer: (answer: boolean) => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
  selectedAnswer: boolean | null;
}

export function TrueFalse({
  question,
  onAnswer,
  isAnswered,
  isCorrect,
  selectedAnswer,
}: TrueFalseProps) {
  const getButtonStyle = (value: boolean) => {
    if (!isAnswered) return [styles.button];

    if (value === question.correct) {
      return [styles.button, styles.correctButton];
    }
    if (value === selectedAnswer && !isCorrect) {
      return [styles.button, styles.incorrectButton];
    }
    return [styles.button, styles.dimmedButton];
  };

  const getButtonTextStyle = (value: boolean) => {
    if (!isAnswered) return styles.buttonText;

    if (value === question.correct) {
      return [styles.buttonText, { color: Colors.success }];
    }
    if (value === selectedAnswer && !isCorrect) {
      return [styles.buttonText, { color: Colors.error }];
    }
    return [styles.buttonText, { color: Colors.textMuted }];
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <Text style={styles.statement}>{question.statement}</Text>
      <View style={styles.buttonsContainer}>
        <Pressable
          onPress={() => !isAnswered && onAnswer(true)}
          disabled={isAnswered}
          style={({ pressed }) => [
            ...getButtonStyle(true),
            pressed && !isAnswered && styles.pressed,
          ]}
        >
          <Text style={styles.emoji}>✓</Text>
          <Text style={getButtonTextStyle(true)}>True</Text>
        </Pressable>

        <Pressable
          onPress={() => !isAnswered && onAnswer(false)}
          disabled={isAnswered}
          style={({ pressed }) => [
            ...getButtonStyle(false),
            pressed && !isAnswered && styles.pressed,
          ]}
        >
          <Text style={styles.emoji}>✗</Text>
          <Text style={getButtonTextStyle(false)}>False</Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statement: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xl,
    lineHeight: 32,
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    gap: Spacing.sm,
  },
  correctButton: {
    borderColor: Colors.success,
    backgroundColor: Colors.success + '15',
  },
  incorrectButton: {
    borderColor: Colors.error,
    backgroundColor: Colors.error + '15',
  },
  dimmedButton: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  emoji: {
    fontSize: 32,
    color: Colors.text,
  },
  buttonText: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
  },
});
