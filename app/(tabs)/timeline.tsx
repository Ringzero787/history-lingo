import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../src/constants/theme';
import { useUserStore } from '../../src/stores/userStore';
import { useLessonStore } from '../../src/stores/lessonStore';
import { getCategoryForTopic, getTopicById, HISTORY_CATEGORIES, HistoryCategory } from '../../src/constants/eras';
import { fetchLessons, generateLessonForTopic } from '../../src/services/lessons';
import { Lesson } from '../../src/types';

interface GroupedTopics {
  category: HistoryCategory;
  topicIds: string[];
}

export default function TimelineScreen() {
  const { profile, eraProgress } = useUserStore();
  const { setCurrentEra } = useLessonStore();
  const router = useRouter();
  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [topicLessons, setTopicLessons] = useState<Record<string, Lesson[]>>({});
  const [generatingTopic, setGeneratingTopic] = useState<string | null>(null);

  // Group user's selected topics by parent category
  const groupedTopics = useMemo<GroupedTopics[]>(() => {
    const selectedTopicIds = profile?.preferences?.eras ?? [];
    const groups = new Map<string, GroupedTopics>();

    for (const topicId of selectedTopicIds) {
      const category = getCategoryForTopic(topicId);
      if (!category) continue;

      if (!groups.has(category.id)) {
        groups.set(category.id, { category, topicIds: [] });
      }
      groups.get(category.id)!.topicIds.push(topicId);
    }

    // Sort by category order in HISTORY_CATEGORIES
    const categoryOrder = HISTORY_CATEGORIES.map((c) => c.id);
    return Array.from(groups.values()).sort(
      (a, b) => categoryOrder.indexOf(a.category.id) - categoryOrder.indexOf(b.category.id)
    );
  }, [profile?.preferences?.eras]);

  const handleExpandTopic = async (topicId: string) => {
    if (expandedTopic === topicId) {
      setExpandedTopic(null);
      return;
    }
    setExpandedTopic(topicId);
    if (!topicLessons[topicId]) {
      try {
        const lessons = await fetchLessons(topicId);
        if (lessons.length > 0) {
          setTopicLessons((prev) => ({ ...prev, [topicId]: lessons }));
        } else {
          // No lessons exist yet — generate the first one
          await handleGenerateLesson(topicId);
        }
      } catch (err) {
        console.error('Failed to fetch lessons:', err);
      }
    }
  };

  const handleGenerateLesson = async (topicId: string) => {
    if (!profile) return;
    setGeneratingTopic(topicId);
    try {
      const existingLessons = topicLessons[topicId] ?? [];
      const nextOrder = existingLessons.length + 1;
      await generateLessonForTopic(topicId, profile.skillLevel, profile.age, nextOrder);
      // Re-fetch lessons after generation
      const lessons = await fetchLessons(topicId);
      setTopicLessons((prev) => ({ ...prev, [topicId]: lessons }));
    } catch (err: any) {
      console.error('Failed to generate lesson:', err);
    } finally {
      setGeneratingTopic(null);
    }
  };

  const handleStartLesson = (topicId: string, lessonId: string) => {
    setCurrentEra(topicId);
    router.push(`/lesson/${lessonId}?eraId=${topicId}`);
  };

  if (groupedTopics.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <Text style={styles.title}>Timeline</Text>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No topics selected yet.</Text>
          <Text style={styles.emptySubtext}>Complete onboarding to pick your history interests!</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Timeline</Text>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {groupedTopics.map((group) => (
          <View key={group.category.id} style={styles.categorySection}>
            {/* Category header */}
            <View style={styles.categoryHeader}>
              <Text style={styles.categoryEmoji}>{group.category.emoji}</Text>
              <Text style={[styles.categoryName, { color: group.category.color }]}>
                {group.category.name}
              </Text>
            </View>

            {/* Topics in this category */}
            <View style={styles.timeline}>
              {group.topicIds.map((topicId, index) => {
                const topic = getTopicById(topicId);
                if (!topic) return null;

                const progress = eraProgress[topicId];
                const isExpanded = expandedTopic === topicId;
                const lessons = topicLessons[topicId] ?? [];

                return (
                  <View key={topicId}>
                    {/* Connector line */}
                    {index > 0 && (
                      <View style={[styles.connector, { backgroundColor: group.category.color }]} />
                    )}

                    {/* Topic node */}
                    <Pressable
                      onPress={() => handleExpandTopic(topicId)}
                      style={({ pressed }) => [
                        styles.topicNode,
                        { borderColor: group.category.color },
                        pressed && styles.topicNodePressed,
                      ]}
                    >
                      <View style={[styles.topicDot, { backgroundColor: group.category.color }]}>
                        <Text style={styles.topicDotEmoji}>{topic.emoji}</Text>
                      </View>
                      <View style={styles.topicInfo}>
                        <Text style={styles.topicName}>{topic.name}</Text>
                        {progress && (
                          <Text style={[styles.topicProgress, { color: group.category.color }]}>
                            {progress.completedLessons} lessons completed
                          </Text>
                        )}
                      </View>
                      {progress && progress.completedLessons > 0 && (
                        <Text style={styles.checkIcon}>✓</Text>
                      )}
                    </Pressable>

                    {/* Expanded lesson list */}
                    {isExpanded && (
                      <View style={styles.lessonList}>
                        {generatingTopic === topicId ? (
                          <View style={styles.generatingContainer}>
                            <ActivityIndicator size="small" color={group.category.color} />
                            <Text style={styles.generatingText}>Generating lesson with AI...</Text>
                          </View>
                        ) : lessons.length > 0 ? (
                          <>
                            {lessons.map((lesson, li) => {
                              const isLessonUnlocked = li === 0 || (progress && progress.completedLessons >= li);
                              return (
                                <Pressable
                                  key={lesson.id}
                                  onPress={() => isLessonUnlocked && handleStartLesson(topicId, lesson.id)}
                                  disabled={!isLessonUnlocked}
                                  style={[
                                    styles.lessonItem,
                                    !isLessonUnlocked && styles.lessonLocked,
                                  ]}
                                >
                                  <View style={[styles.lessonDot, { backgroundColor: isLessonUnlocked ? group.category.color : Colors.textMuted }]}>
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
                            })}
                            <Pressable
                              onPress={() => handleGenerateLesson(topicId)}
                              style={[styles.generateButton, { borderColor: group.category.color }]}
                            >
                              <Text style={[styles.generateButtonText, { color: group.category.color }]}>
                                + Generate Next Lesson
                              </Text>
                            </Pressable>
                          </>
                        ) : (
                          <Text style={styles.noLessons}>No lessons yet. Tap to expand and generate!</Text>
                        )}
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        ))}
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
    gap: Spacing.xl,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  categorySection: {
    gap: Spacing.md,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: FontSizes.lg,
    fontWeight: '800',
  },
  timeline: {
    paddingLeft: Spacing.md,
  },
  connector: {
    width: 3,
    height: 24,
    marginLeft: 18,
    opacity: 0.4,
  },
  topicNode: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    gap: Spacing.md,
  },
  topicNodePressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  topicDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topicDotEmoji: {
    fontSize: 18,
  },
  topicInfo: {
    flex: 1,
  },
  topicName: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text,
  },
  topicProgress: {
    fontSize: FontSizes.xs,
    fontWeight: '600',
    marginTop: 4,
  },
  checkIcon: {
    fontSize: 20,
    color: Colors.success,
    fontWeight: '700',
  },
  lockedText: {
    color: Colors.textMuted,
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
    color: Colors.textOnColor,
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
  generatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  generatingText: {
    color: Colors.textSecondary,
    fontSize: FontSizes.sm,
  },
  generateButton: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    alignItems: 'center',
  },
  generateButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
  },
});
