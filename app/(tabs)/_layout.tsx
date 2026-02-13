import { Tabs } from 'expo-router';
import { Colors, FontSizes, Shadows } from '../../src/constants/theme';
import { Text } from 'react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.surfaceLight,
          borderTopWidth: 0,
          height: 80,
          paddingBottom: 20,
          paddingTop: 8,
          ...Shadows.medium,
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: {
          fontSize: FontSizes.xs,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏠</Text>,
        }}
      />
      <Tabs.Screen
        name="timeline"
        options={{
          title: 'Timeline',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🗺️</Text>,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Ranks',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>🏆</Text>,
        }}
      />
      <Tabs.Screen
        name="multiplayer"
        options={{
          title: 'Battle',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>⚔️</Text>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ fontSize: 24, color }}>👤</Text>,
        }}
      />
    </Tabs>
  );
}
