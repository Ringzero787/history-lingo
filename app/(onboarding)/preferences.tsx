import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '../../src/constants/theme';
import { Button } from '../../src/components/ui/Button';
import { EraSelector } from '../../src/components/onboarding/EraSelector';

export default function PreferencesScreen() {
  const [selectedEras, setSelectedEras] = useState<string[]>([]);
  const router = useRouter();

  const toggleEra = (topicId: string) => {
    setSelectedEras((prev) =>
      prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]
    );
  };

  const bulkToggle = (topicIds: string[], selected: boolean) => {
    setSelectedEras((prev) => {
      if (selected) {
        // Add all that aren't already selected
        const newIds = topicIds.filter((id) => !prev.includes(id));
        return [...prev, ...newIds];
      } else {
        // Remove all from the list
        return prev.filter((id) => !topicIds.includes(id));
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <EraSelector
          selectedEras={selectedEras}
          onToggleEra={toggleEra}
          onBulkToggle={bulkToggle}
        />
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
