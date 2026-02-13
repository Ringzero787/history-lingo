import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSizes } from '../../src/constants/theme';
import { Button } from '../../src/components/ui/Button';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>🏛️</Text>
        <Text style={styles.title}>Welcome to{'\n'}History Lingo!</Text>
        <Text style={styles.description}>
          Learn history through interactive lessons, earn XP, compete with friends, and become a history master.
        </Text>

        <View style={styles.features}>
          {[
            { emoji: '📚', text: 'AI-generated lessons tailored to you' },
            { emoji: '🔥', text: 'Build streaks and earn XP daily' },
            { emoji: '⚔️', text: 'Challenge friends in multiplayer battles' },
            { emoji: '🗺️', text: 'Explore history from ancient to modern' },
          ].map((feature, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureEmoji}>{feature.emoji}</Text>
              <Text style={styles.featureText}>{feature.text}</Text>
            </View>
          ))}
        </View>
      </View>

      <Button
        title="Get Started"
        onPress={() => router.push('/(onboarding)/preferences')}
        size="lg"
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: Spacing.lg,
    justifyContent: 'space-between',
    paddingTop: 80,
    paddingBottom: 40,
  },
  content: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 80,
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.hero,
    fontWeight: '900',
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.md,
    lineHeight: 48,
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xl,
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  features: {
    alignSelf: 'stretch',
    gap: Spacing.md,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  featureEmoji: {
    fontSize: 28,
  },
  featureText: {
    fontSize: FontSizes.md,
    color: Colors.text,
    flex: 1,
  },
});
