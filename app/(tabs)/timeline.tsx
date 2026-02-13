import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../src/constants/theme';
import { useUserStore } from '../../src/stores/userStore';
import { useGameStore } from '../../src/stores/gameStore';
import { useLessonStore } from '../../src/stores/lessonStore';
import { ERA_DEFINITIONS } from '../../src/constants/eras';
import { fetchLessons } from '../../src/services/lessons';
import { Lesson } from '../../src/types';

export default function TimelineScreen() {
  const { xp } = useGameStore();
  const { eraProgress } = useUserStore();
  const { setCurrentEra } = useLessonStore();
  const router = useRouter();
  const [expandedEra, setExpandedEra] = useState<string | null>(null);
  const [eraLessons, setEraLessons] = useState<Record<string, Lesson[]>>({});

  const handleExpandEra = async (eraId: string) => {
    if (expandedEra === eraId) {
      setExpandedEra(null);
      return;
    }
    setExpandedEra(eraId);
    if (!eraLessons[eraId]) {
      try {
        const lessons = await fetchLessons(eraId);
        setEraLessons((prev) => ({ ...prev, [eraId]: lessons }));
      } catch (err) {
        console.error('Failed to fetch lessons:', err);
      }
    }
  };

  const handleStartLesson = (eraId: string, lessonId: string) => {
    setCurrentEra(eraId);
    router.push(`/lesson/${lessonId}?eraId=${eraId}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Timeline</Text>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Vertical timeline line */}
        <View style={styles.timeline}>
          {ERA_DEFINITIONS.map((era, index) => {
            const isUnlocked = xp >= era.requiredXpToUnlock;
            const progress = eraProgress[era.id];
            const isExpanded = expandedEra === era.id;
            const lessons = eraLessons[era.id] ?? [];

            return (
              <View key={era.id}>
                {/* Timeline connector */}
                {index > 0 && (
                  <View style={[styles.connector, !isUnlocked && styles.connectorLocked]} />
                )}

                {/* Era node */}
                <Pressable
                  onPress={() => isUnlocked && handleExpandEra(era.id)}
                  style={({ pressed }) => [
                    styles.eraNode,
                    { borderColor: isUnlocked ? era.color : Colors.textMuted },
                    !isUnlocked && styles.eraNodeLocked,
                    pressed && isUnlocked && styles.eraNodePressed,
                  ]}
                >
                  <View style={[styles.eraDot, { backgroundColor: isUnlocked ? era.color : Colors.textMuted }]} />
                  <View style={styles.eraInfo}>
                    <Text style={[styles.eraName, !isUnlocked && styles.lockedText]}>
                      {era.name}
                    </Text>
                    <Text style={styles.eraDescription} numberOfLines={1}>
                      {isUnlocked ? era.description : `Unlock at ${era.requiredXpToUnlock} XP`}
                    </Text>
                    {progress && (
                      <Text style={[styles.eraProgress, { color: era.color }]}>
                        {progress.completedLessons} lessons completed
                      </Text>
                    )}
                  </View>
                  {!isUnlocked && <Text style={styles.lockIcon}>🔒</Text>}
                  {progress && progress.completedLessons > 0 && isUnlocked && (
                    <Text style={styles.checkIcon}>✓</Text>
                  )}
                </Pressable>

                {/* Expanded lesson list */}
                {isExpanded && isUnlocked && (
                  <View style={styles.lessonList}>
                    {lessons.length > 0 ? (
                      lessons.map((lesson, li) => {
                        const isLessonUnlocked = li === 0 || (progress && progress.completedLessons >= li);
                        return (
                          <Pressable
                            key={lesson.id}
                            onPress={() => isLessonUnlocked && handleStartLesson(era.id, lesson.id)}
                            disabled={!isLessonUnlocked}
                            style={[
                              styles.lessonItem,
                              !isLessonUnlocked && styles.lessonLocked,
                            ]}
                          >
                            <View style={[styles.lessonDot, { backgroundColor: isLessonUnlocked ? era.color : Colors.textMuted }]}>
                              <Text style={styles.lessonNumber}>{li + 1}</Text>
                            </View>
                            <View style={styles.lessonInfo}>
                              <Text style={[styles.lessonTitle, !isLessonUnlocked && styles.lockedText]}>
                                {lesson.title}
                              </Text>
                              <Text style={styles.lessonMeta}>
                                {lesson.xpReward} XP · {lesson.estimatedMinutes} min
                              </Text>
                            </View>
                          </Pressable>
                        );
                      })
                    ) : (
                      <Text style={styles.noLessons}>Loading lessons...</Text>
                    )}
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  title: {
    fontSize: FontSizes.xxl,
    fontWeight: '900',
    color: Colors.text,
    padding: Spacing.lg,
    paddingBottom: 0,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  timeline: {
    paddingLeft: Spacing.md,
  },
  connector: {
    width: 3,
    height: 24,
    backgroundColor: Colors.primary,
    marginLeft: 18,
  },
  connectorLocked: {
    backgroundColor: Colors.textMuted,
    opacity: 0.3,
  },
  eraNode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    gap: Spacing.md,
  },
  eraNodeLocked: {
    opacity: 0.5,
  },
  eraNodePressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  eraDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  eraInfo: {
    flex: 1,
  },
  eraName: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  eraDescription: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  eraProgress: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    marginTop: 4,
  },
  lockedText: {
    color: Colors.textMuted,
  },
  lockIcon: {
    fontSize: 20,
  },
  checkIcon: {
    fontSize: 20,
    color: Colors.success,
    fontWeight: '700',
  },
  lessonList: {
    marginLeft: 38,
    marginTop: Spacing.sm,
    gap: Spacing.sm,
    borderLeftWidth: 2,
    borderLeftColor: Colors.surfaceLight,
    paddingLeft: Spacing.md,
  },
  lessonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    gap: Spacing.sm,
  },
  lessonLocked: {
    opacity: 0.4,
  },
  lessonDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lessonNumber: {
    color: Colors.text,
    fontSize: FontSizes.sm,
    fontWeight: '700',
  },
  lessonInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.text,
  },
  lessonMeta: {
    fontSize: FontSizes.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  noLessons: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
    padding: Spacing.md,
  },
});
