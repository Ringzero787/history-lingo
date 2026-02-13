import React, { useState, useCallback } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { Button } from '../ui/Button';
import { TimelineOrderQuestion } from '../../types';
import { shuffleArray } from '../../utils/formatters';

const ITEM_HEIGHT = 64;
const ITEM_GAP = Spacing.sm;
const ITEM_TOTAL = ITEM_HEIGHT + ITEM_GAP;

interface TimelineOrderProps {
  question: TimelineOrderQuestion;
  onAnswer: (orderedIndices: number[]) => void;
  isAnswered: boolean;
  isCorrect: boolean | null;
}

interface DraggableItemProps {
  event: { text: string; year: number };
  originalIndex: number;
  position: number;
  onDragEnd: (fromPosition: number, toPosition: number) => void;
  disabled: boolean;
  isAnswered: boolean;
  correctPosition: number | null;
}

function DraggableItem({
  event,
  position,
  onDragEnd,
  disabled,
  isAnswered,
  correctPosition,
}: DraggableItemProps) {
  const translateY = useSharedValue(0);
  const zIndex = useSharedValue(0);
  const scale = useSharedValue(1);

  const gesture = Gesture.Pan()
    .enabled(!disabled)
    .onStart(() => {
      zIndex.value = 100;
      scale.value = withTiming(1.03, { duration: 150 });
    })
    .onUpdate((e) => {
      translateY.value = e.translationY;
    })
    .onEnd((e) => {
      const movedPositions = Math.round(e.translationY / ITEM_TOTAL);
      const newPosition = Math.max(
        0,
        Math.min(position + movedPositions, 5) // max 6 items (0-5)
      );

      translateY.value = withTiming(0, { duration: 200 });
      scale.value = withTiming(1, { duration: 150 });
      zIndex.value = 0;

      if (newPosition !== position) {
        runOnJS(onDragEnd)(position, newPosition);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    zIndex: zIndex.value,
  }));

  const isInCorrectPosition = isAnswered && correctPosition === position;
  const isInWrongPosition = isAnswered && correctPosition !== null && correctPosition !== position;

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          styles.item,
          animatedStyle,
          isInCorrectPosition && styles.correctItem,
          isInWrongPosition && styles.incorrectItem,
        ]}
      >
        <View style={styles.dragHandle}>
          <Text style={styles.dragIcon}>≡</Text>
        </View>
        <Text
          style={[
            styles.itemText,
            isInCorrectPosition && styles.correctText,
            isInWrongPosition && styles.incorrectText,
          ]}
          numberOfLines={2}
        >
          {event.text}
        </Text>
        {isAnswered && (
          <Text style={styles.yearText}>{event.year}</Text>
        )}
      </Animated.View>
    </GestureDetector>
  );
}

export function TimelineOrder({
  question,
  onAnswer,
  isAnswered,
  isCorrect,
}: TimelineOrderProps) {
  const [items, setItems] = useState(() => {
    const indexed = question.events.map((event, idx) => ({
      event,
      originalIndex: idx,
    }));
    return shuffleArray(indexed);
  });

  // Compute correct order: sort by year ascending
  const correctOrder = [...question.events]
    .map((e, i) => ({ year: e.year, originalIndex: i }))
    .sort((a, b) => a.year - b.year);

  const handleDragEnd = useCallback((from: number, to: number) => {
    setItems((prev) => {
      const newItems = [...prev];
      const [moved] = newItems.splice(from, 1);
      newItems.splice(to, 0, moved);
      return newItems;
    });
  }, []);

  const handleSubmit = () => {
    const orderedIndices = items.map((item) => item.originalIndex);
    onAnswer(orderedIndices);
  };

  // Map each original index to its correct position (sorted by year)
  const correctPositionMap = new Map<number, number>();
  correctOrder.forEach((item, position) => {
    correctPositionMap.set(item.originalIndex, position);
  });

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.container}>
      <Text style={styles.prompt}>{question.prompt}</Text>
      <Text style={styles.instruction}>
        Drag to arrange events in chronological order (earliest first)
      </Text>

      <View style={styles.itemsContainer}>
        {items.map((item, position) => (
          <DraggableItem
            key={item.originalIndex}
            event={item.event}
            originalIndex={item.originalIndex}
            position={position}
            onDragEnd={handleDragEnd}
            disabled={isAnswered}
            isAnswered={isAnswered}
            correctPosition={
              isAnswered ? correctPositionMap.get(item.originalIndex) ?? null : null
            }
          />
        ))}
      </View>

      {!isAnswered && (
        <Button
          title="Submit Order"
          onPress={handleSubmit}
          size="lg"
          fullWidth
        />
      )}

      {isAnswered && !isCorrect && (
        <View style={styles.correctOrderContainer}>
          <Text style={styles.correctOrderTitle}>Correct order:</Text>
          {correctOrder.map((item, idx) => (
            <Text key={idx} style={styles.correctOrderItem}>
              {idx + 1}. {question.events[item.originalIndex].text} ({item.year})
            </Text>
          ))}
        </View>
      )}
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
    marginBottom: Spacing.sm,
    lineHeight: 32,
  },
  instruction: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  itemsContainer: {
    gap: ITEM_GAP,
    marginBottom: Spacing.lg,
  },
  item: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
  },
  correctItem: {
    borderColor: Colors.success,
    backgroundColor: Colors.success + '15',
  },
  incorrectItem: {
    borderColor: Colors.error,
    backgroundColor: Colors.error + '15',
  },
  dragHandle: {
    width: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  dragIcon: {
    fontSize: 20,
    color: Colors.textMuted,
  },
  itemText: {
    flex: 1,
    fontSize: FontSizes.md,
    color: Colors.text,
    lineHeight: 20,
  },
  correctText: {
    color: Colors.success,
    fontWeight: '600',
  },
  incorrectText: {
    color: Colors.error,
    fontWeight: '600',
  },
  yearText: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    fontWeight: '700',
    marginLeft: Spacing.sm,
  },
  correctOrderContainer: {
    backgroundColor: Colors.success + '15',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.success + '30',
  },
  correctOrderTitle: {
    fontSize: FontSizes.sm,
    color: Colors.success,
    fontWeight: '700',
    marginBottom: Spacing.sm,
  },
  correctOrderItem: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
});
