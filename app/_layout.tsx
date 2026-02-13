import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuth } from '../src/hooks/useAuth';
import { useAuthStore } from '../src/stores/authStore';
import { useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Colors } from '../src/constants/theme';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { LevelUpModal } from '../src/components/gamification/LevelUpModal';
import { useGameStore } from '../src/stores/gameStore';

export default function RootLayout() {
  useAuth();

  const { isAuthenticated, isLoading, hasCompletedOnboarding } = useAuthStore();
  const { showLevelUpModal, level, dismissLevelUp } = useGameStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && !hasCompletedOnboarding && !inOnboarding) {
      router.replace('/(onboarding)/welcome');
    } else if (isAuthenticated && hasCompletedOnboarding && (inAuthGroup || inOnboarding)) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isLoading, hasCompletedOnboarding, segments]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lesson" />
      </Stack>
      <LevelUpModal
        visible={showLevelUpModal}
        newLevel={level}
        onDismiss={dismissLevelUp}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
});
