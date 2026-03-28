import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { useTheme } from '../context/ThemeContext';

interface StreakCardProps {
  streak: number;
  monthlyData?: boolean[]; // 30 days, true = completed
}

export function StreakCard({ streak, monthlyData = [] }: StreakCardProps) {
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;
  const fireScale = useSharedValue(1);
  const fireOpacity = useSharedValue(1);

  // Generate 30-day data if not provided
  const days = monthlyData.length === 30 ? monthlyData : Array.from({ length: 30 }, (_, i) => i < streak);

  useEffect(() => {
    fireScale.value = withSequence(
      withSpring(1.3, { damping: 6, stiffness: 200 }),
      withSpring(1, { damping: 8, stiffness: 200 })
    );
  }, [streak]);

  const fireStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fireScale.value }],
    opacity: fireOpacity.value,
  }));

  return (
    <View style={[styles.container, { backgroundColor: isDark ? Colors.dark.card : Colors.light.card }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.label, { color: scheme.textSecondary }]}>Current Streak</Text>
          <View style={styles.streakRow}>
            <Animated.Text style={[styles.fireEmoji, fireStyle]}>🔥</Animated.Text>
            <Text style={styles.streakCount}>{streak}</Text>
            <Text style={[styles.streakUnit, { color: scheme.textSecondary }]}> days</Text>
          </View>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{streak >= 7 ? '⭐ On Fire!' : streak >= 3 ? '💪 Good' : '🌱 Starting'}</Text>
        </View>
      </View>

      {/* 30-day calendar */}
      <View style={styles.calendar}>
        {days.map((done, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              done ? styles.dotActive : { backgroundColor: isDark ? '#333' : '#EEF1F5' },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.calLabel, { color: scheme.textMuted }]}>Last 30 days</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    padding: 20,
    shadowColor: '#233D4D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  label: { fontSize: 13, fontWeight: '500', marginBottom: 4 },
  streakRow: { flexDirection: 'row', alignItems: 'baseline' },
  fireEmoji: { fontSize: 28, marginRight: 4 },
  streakCount: { fontSize: 36, fontWeight: '800', color: Colors.secondary },
  streakUnit: { fontSize: 16, fontWeight: '500' },
  badge: {
    backgroundColor: Colors.accent + '30',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#B8860B' },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 6,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 3,
  },
  dotActive: {
    backgroundColor: Colors.success,
  },
  calLabel: { fontSize: 11, fontWeight: '500' },
});
