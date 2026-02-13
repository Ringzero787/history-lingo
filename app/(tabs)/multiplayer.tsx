import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../src/constants/theme';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';

export default function MultiplayerScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Multiplayer</Text>
      <View style={styles.content}>
        <Card variant="elevated" style={styles.card}>
          <Text style={styles.emoji}>⚔️</Text>
          <Text style={styles.cardTitle}>Quick Battle</Text>
          <Text style={styles.cardDescription}>
            Challenge another player to a 5-question history duel. Fastest correct answers win!
          </Text>
          <Button
            title="Find Opponent"
            onPress={() => {/* Coming in Phase 3 */}}
            size="lg"
            fullWidth
          />
        </Card>

        <Card variant="outline" style={styles.card}>
          <Text style={styles.emoji}>🏟️</Text>
          <Text style={styles.cardTitle}>Coming Soon</Text>
          <Text style={styles.cardDescription}>
            Tournament mode, team battles, and more multiplayer features are on the way!
          </Text>
        </Card>
      </View>
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
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  card: {
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.xl,
  },
  emoji: {
    fontSize: 48,
  },
  cardTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '800',
    color: Colors.text,
  },
  cardDescription: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
