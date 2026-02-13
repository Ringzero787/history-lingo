import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '../../src/constants/theme';
import { Button } from '../../src/components/ui/Button';
import { EraSelector } from '../../src/components/onboarding/EraSelector';

export default function PreferencesScreen() {
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  const router = useRouter();

  const toggleEra = (eraId: string) => {
    setSelectedEras((prev) =>
      prev.includes(eraId) ? prev.filter((id) => id !== eraId) : [...prev, eraId]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <EraSelector selectedEras={selectedEras} onToggleEra={toggleEra} />
      </ScrollView>
      <View style={styles.footer}>
        <Button
          title={`Continue (${selectedEras.length} selected)`}
          onPress={() =>
            router.push({
              pathname: '/(onboarding)/age-skill',
              params: { eras: selectedEras.join(',') },
            })
          }
          disabled={selectedEras.length === 0}
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
