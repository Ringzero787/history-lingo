import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { AgeGroup, SkillLevel } from '../../types';

interface SkillSliderProps {
  selectedAge: AgeGroup | null;
  selectedSkill: SkillLevel | null;
  onAgeSelect: (age: AgeGroup) => void;
  onSkillSelect: (skill: SkillLevel) => void;
}

const AGE_OPTIONS: { value: AgeGroup; label: string; emoji: string }[] = [
  { value: 'under13', label: 'Under 13', emoji: '🧒' },
  { value: '13-17', label: '13-17', emoji: '🧑' },
  { value: '18-25', label: '18-25', emoji: '🎓' },
  { value: '26-40', label: '26-40', emoji: '💼' },
  { value: '40+', label: '40+', emoji: '📚' },
];

const SKILL_OPTIONS: { value: SkillLevel; label: string; description: string; emoji: string }[] = [
  {
    value: 'beginner',
    label: 'Beginner',
    description: 'New to history - teach me the basics!',
    emoji: '🌱',
  },
  {
    value: 'intermediate',
    label: 'Intermediate',
    description: 'I know some history and want to learn more',
    emoji: '📖',
  },
  {
    value: 'advanced',
    label: 'Advanced',
    description: 'I love history and want a challenge!',
    emoji: '🏆',
  },
];

export function SkillSlider({
  selectedAge,
  selectedSkill,
  onAgeSelect,
  onSkillSelect,
}: SkillSliderProps) {
  return (
    <View style={styles.container}>
      {/* Age Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>How old are you?</Text>
        <Text style={styles.sectionSubtitle}>
          This helps us create age-appropriate content
        </Text>
        <View style={styles.ageGrid}>
          {AGE_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => onAgeSelect(option.value)}
              style={[
                styles.ageOption,
                selectedAge === option.value && styles.selectedOption,
              ]}
            >
              <Text style={styles.ageEmoji}>{option.emoji}</Text>
              <Text
                style={[
                  styles.ageLabel,
                  selectedAge === option.value && styles.selectedLabel,
                ]}
              >
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {/* Skill Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What's your history level?</Text>
        <View style={styles.skillList}>
          {SKILL_OPTIONS.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => onSkillSelect(option.value)}
              style={[
                styles.skillOption,
                selectedSkill === option.value && styles.selectedOption,
              ]}
            >
              <Text style={styles.skillEmoji}>{option.emoji}</Text>
              <View style={styles.skillInfo}>
                <Text
                  style={[
                    styles.skillLabel,
                    selectedSkill === option.value && styles.selectedLabel,
                  ]}
                >
                  {option.label}
                </Text>
                <Text style={styles.skillDescription}>{option.description}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: Spacing.xl,
  },
  section: {
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    color: Colors.text,
  },
  sectionSubtitle: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  ageOption: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
    alignItems: 'center',
    minWidth: 80,
  },
  selectedOption: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '15',
  },
  ageEmoji: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  ageLabel: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  selectedLabel: {
    color: Colors.primary,
  },
  skillList: {
    gap: Spacing.md,
  },
  skillOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.surfaceLight,
  },
  skillEmoji: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  skillInfo: {
    flex: 1,
  },
  skillLabel: {
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  skillDescription: {
    fontSize: FontSizes.sm,
    color: Colors.textSecondary,
  },
});
