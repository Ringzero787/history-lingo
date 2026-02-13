import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { Button } from '../ui/Button';
import { getLevelTitle } from '../../constants/xp';

interface LevelUpModalProps {
  visible: boolean;
  newLevel: number;
  onDismiss: () => void;
}

export function LevelUpModal({ visible, newLevel, onDismiss }: LevelUpModalProps) {
  const title = getLevelTitle(newLevel);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View entering={ZoomIn.duration(400)} style={styles.modal}>
          <Text style={styles.celebration}>🎉</Text>
          <Text style={styles.heading}>Level Up!</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelNumber}>{newLevel}</Text>
          </View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            Keep learning to reach the next level!
          </Text>
          <Button
            title="Continue"
            onPress={onDismiss}
            variant="primary"
            size="lg"
            fullWidth
          />
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  modal: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    width: '100%',
    maxWidth: 340,
  },
  celebration: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  heading: {
    fontSize: FontSizes.hero,
    fontWeight: '900',
    color: Colors.xpGold,
    marginBottom: Spacing.md,
  },
  levelBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  levelNumber: {
    fontSize: FontSizes.hero,
    fontWeight: '900',
    color: Colors.text,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
});
