import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { useTheme } from '../context/ThemeContext';
import { CountdownTimer } from './CountdownTimer';

export type MealType = 'breakfast' | 'lunch' | 'dinner';

interface MealToggleProps {
  type: MealType;
  marked: boolean;
  deadline: Date;
  onToggle: (type: MealType) => void;
}

const MEAL_CONFIG = {
  breakfast: { emoji: '🌅', label: 'Breakfast', timeHint: 'By 8:30 AM' },
  lunch: { emoji: '☀️', label: 'Lunch', timeHint: 'By 12:00 PM' },
  dinner: { emoji: '🌙', label: 'Dinner', timeHint: 'By 7:00 PM' },
};

export function MealToggle({ type, marked, deadline, onToggle }: MealToggleProps) {
  const { isDark } = useTheme();
  const [expired, setExpired] = useState(deadline < new Date());
  const scale = useSharedValue(1);
  const config = MEAL_CONFIG[type];

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  function handlePress() {
    if (expired) return;
    scale.value = withSpring(0.9, { damping: 6, stiffness: 300 }, () => {
      scale.value = withSpring(1, { damping: 8, stiffness: 200 });
    });
    onToggle(type);
  }

  return (
    <Animated.View style={style}>
      <TouchableOpacity
        onPress={handlePress}
        disabled={expired}
        activeOpacity={0.85}
        style={[
          styles.container,
          marked && styles.marked,
          expired && styles.expired,
          {
            backgroundColor: marked
              ? Colors.success + '20'
              : isDark ? Colors.dark.card : '#F5F7FA',
            borderColor: marked ? Colors.success : expired ? '#DDD' : Colors.light.border,
          },
        ]}
      >
        <Text style={styles.emoji}>{config.emoji}</Text>
        <View style={styles.info}>
          <Text style={[styles.label, { color: isDark ? Colors.dark.text : Colors.light.text }, expired && styles.muted]}>
            {config.label}
          </Text>
          <CountdownTimer deadline={deadline} onExpire={() => setExpired(true)} />
        </View>
        {!expired && (
          <View style={[styles.toggle, marked && styles.toggleActive]}>
            <Text style={styles.toggleIcon}>{marked ? '✓' : ''}</Text>
          </View>
        )}
        {expired && <Text style={styles.lockedLabel}>Closed</Text>}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 12,
  },
  marked: {},
  expired: { opacity: 0.55 },
  emoji: { fontSize: 28 },
  info: { flex: 1 },
  label: { fontSize: 15, fontWeight: '600', marginBottom: 2 },
  muted: { color: '#A0ADB8' },
  toggle: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  toggleIcon: { color: '#FFF', fontWeight: '800', fontSize: 14 },
  lockedLabel: { fontSize: 11, color: '#A0ADB8', fontWeight: '600' },
});
