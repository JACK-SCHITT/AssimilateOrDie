import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View, Text, StyleSheet } from 'react-native';
import { Colors, Typography } from '@/constants/theme';

function TabIcon({ name, color, label }: { name: any; color: string; label: string }) {
  return (
    <View style={styles.iconWrap}>
      <MaterialIcons name={name} size={22} color={color} />
    </View>
  );
}

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          height: Platform.select({ ios: insets.bottom + 64, android: insets.bottom + 64, default: 72 }),
          paddingTop: 8,
          paddingBottom: Platform.select({ ios: insets.bottom + 8, android: insets.bottom + 8, default: 8 }),
          paddingHorizontal: 4,
          backgroundColor: '#080808',
          borderTopWidth: 1,
          borderTopColor: '#1e1e1e',
        },
        tabBarActiveTintColor: Colors.crimson,
        tabBarInactiveTintColor: '#444',
        tabBarLabelStyle: {
          fontSize: 9,
          fontWeight: '700',
          letterSpacing: 1.2,
          marginTop: 2,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'FOUNDRY',
          tabBarIcon: ({ color }) => <TabIcon name="bolt" color={color} label="FOUNDRY" />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'COMMAND',
          tabBarIcon: ({ color }) => <TabIcon name="psychology" color={color} label="COMMAND" />,
        }}
      />
      <Tabs.Screen
        name="build"
        options={{
          title: 'BUILD',
          tabBarIcon: ({ color }) => <TabIcon name="construction" color={color} label="BUILD" />,
        }}
      />
      <Tabs.Screen
        name="submit"
        options={{
          title: 'SUBMIT',
          tabBarIcon: ({ color }) => <TabIcon name="rocket_launch" color={color} label="SUBMIT" />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: 'RANK',
          tabBarIcon: ({ color }) => <TabIcon name="military_tech" color={color} label="RANK" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: { alignItems: 'center', justifyContent: 'center' },
});
