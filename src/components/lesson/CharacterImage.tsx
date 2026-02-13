import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import { Colors, Spacing, FontSizes, BorderRadius, Shadows } from '../../constants/theme';

interface CharacterImageProps {
  imageUrl: string;
  characterName?: string;
  variant: 'hero' | 'avatar';
}

export function CharacterImage({ imageUrl, characterName, variant }: CharacterImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) return null;

  if (variant === 'avatar') {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={styles.avatar}
        contentFit="cover"
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <View style={styles.heroContainer}>
      <View style={styles.heroImageWrapper}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.heroImage}
          contentFit="cover"
          onError={() => setHasError(true)}
        />
      </View>
      {characterName && (
        <Text style={styles.heroName}>{characterName}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  heroContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  heroImageWrapper: {
    width: 200,
    height: 200,
    borderRadius: BorderRadius.xl,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
    ...Shadows.medium,
  },
  heroImage: {
    width: 200,
    height: 200,
  },
  heroName: {
    marginTop: Spacing.sm,
    fontSize: FontSizes.md,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: Colors.surface,
  },
});
