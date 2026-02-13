import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import firestore from '@react-native-firebase/firestore';
import { Colors, Spacing } from '../../src/constants/theme';
import { Button } from '../../src/components/ui/Button';
import { SkillSlider } from '../../src/components/onboarding/SkillSlider';
import { useAuthStore } from '../../src/stores/authStore';
import { userDoc } from '../../src/services/firebase';
import { AgeGroup, SkillLevel, UserProfile } from '../../src/types';
import { HEARTS } from '../../src/constants/xp';

export default function AgeSkillScreen() {
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<SkillLevel | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { eras } = useLocalSearchParams<{ eras: string }>();
  const { user, setHasCompletedOnboarding } = useAuthStore();

  const handleComplete = async () => {
    if (!selectedAge || !selectedSkill || !user) return;

    setLoading(true);
    try {
      const eraList = eras?.split(',').filter(Boolean) ?? [];

      const profile: Omit<UserProfile, 'createdAt' | 'heartsRegenAt'> & {
        createdAt: ReturnType<typeof firestore.Timestamp.now>;
        heartsRegenAt: null;
      } = {
        displayName: user.displayName ?? 'Learner',
        email: user.email ?? '',
        avatarUrl: '',
        age: selectedAge,
        skillLevel: selectedSkill,
        preferences: {
          eras: eraList,
          interests: [],
        },
        xp: 0,
        level: 0,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        streakFreezes: 0,
        heartsRemaining: HEARTS.MAX_HEARTS,
        heartsRegenAt: null,
        lessonsCompleted: 0,
        createdAt: firestore.Timestamp.now(),
      };

      await userDoc(user.uid).set(profile);
      setHasCompletedOnboarding(true);
      router.replace('/(tabs)/home');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to save preferences');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SkillSlider
          selectedAge={selectedAge}
          selectedSkill={selectedSkill}
          onAgeSelect={setSelectedAge}
          onSkillSelect={setSelectedSkill}
        />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title="Start Learning!"
          onPress={handleComplete}
          disabled={!selectedAge || !selectedSkill}
          loading={loading}
          size="lg"
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingTop: 60,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: 40,
  },
});
