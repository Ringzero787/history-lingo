import React from 'react';
import { View, Text, Modal, StyleSheet } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { Button } from '../ui/Button';
import { AchievementDefinition } from '../../types';

interface AchievementModalProps {
  visible: boolean;
  achievement: AchievementDefinition | null;
  onDismiss: () => void;
}

export function AchievementModal({ visible, achievement, onDismiss }: AchievementModalProps) {
  if (!achievement) return null;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View entering={ZoomIn.duration(400)} style={styles.modal}>
          <Text style={styles.icon}>{achievement.icon}</Text>
          <Text style={styles.heading}>Achievement Unlocked!</Text>
          <Text style={styles.name}>{achievement.name}</Text>
          <Text style={styles.description}>{achievement.description}</Text>
          <View style={styles.xpBadge}>
            <Text style={styles.xpText}>+{achievement.xpReward} XP</Text>
          </View>
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
  icon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  heading: {
    fontSize: FontSizes.xl,
    fontWeight: '900',
    color: Colors.xpGold,
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  description: {
    fontSize: FontSizes.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  xpBadge: {
    backgroundColor: Colors.xpGold + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.lg,
  },
  xpText: {
    color: Colors.xpGold,
    fontWeight: '800',
    fontSize: FontSizes.md,
  },
});
