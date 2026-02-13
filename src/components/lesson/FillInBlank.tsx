import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { Button } from '../ui/Button';
import { FillInBlankQuestion } from '../../types';

interface FillInBlankProps {
  question: FillInBlankQuestion;
  onAnswer: (answer: string) => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
}

export function FillInBlank({
  question,
  onAnswer,
  isAnswered,
  isCorrect,
}: FillInBlankProps) {
  const [inputValue, setInputValue] = useState('');

  // Split template at ___ to show fill-in-the-blank
  const parts = question.template.split('___');

  const handleSubmit = () => {
    if (inputValue.trim()) {
      onAnswer(inputValue.trim());
    }
  };

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <View style={styles.templateContainer}>
        <Text style={styles.templateText}>
          {parts[0]}
          <Text
            style={[
              styles.blankText,
              isAnswered && isCorrect && styles.correctBlank,
              isAnswered && !isCorrect && styles.incorrectBlank,
            ]}
          >
            {isAnswered ? (isCorrect ? inputValue : question.answer) : '________'}
          </Text>
          {parts[1]}
        </Text>
      </View>

      {!isAnswered && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={inputValue}
            onChangeText={setInputValue}
            placeholder="Type your answer..."
            placeholderTextColor={Colors.textMuted}
            autoCapitalize="none"
            autoCorrect={false}
            onSubmitEditing={handleSubmit}
            returnKeyType="done"
          />
          <Button
            title="Submit"
            onPress={handleSubmit}
            disabled={!inputValue.trim()}
            size="md"
          />
        </View>
      )}

      {isAnswered && !isCorrect && (
        <View style={styles.correctAnswerContainer}>
          <Text style={styles.correctAnswerLabel}>Correct answer:</Text>
          <Text style={styles.correctAnswerText}>{question.answer}</Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  templateContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  templateText: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.text,
    lineHeight: 34,
  },
  blankText: {
    color: Colors.primary,
    textDecorationLine: 'underline',
    fontWeight: '700',
  },
  correctBlank: {
    color: Colors.success,
  },
  incorrectBlank: {
    color: Colors.error,
  },
  inputContainer: {
    gap: Spacing.md,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    fontSize: FontSizes.lg,
    color: Colors.text,
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
  },
  correctAnswerContainer: {
    backgroundColor: Colors.success + '15',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  correctAnswerLabel: {
    fontSize: FontSizes.sm,
    color: Colors.success,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  correctAnswerText: {
    fontSize: FontSizes.lg,
    color: Colors.success,
    fontWeight: '700',
  },
});
