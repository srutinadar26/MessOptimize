import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';
import { useTheme } from '../context/ThemeContext';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  emoji: string;
  unlocked: boolean;
  progress: number; // 0–100
  target: string;
  category: 'streak' | 'meals' | 'eco' | 'social';
}

interface AchievementCardProps {
  achievement: Achievement;
  index?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  streak: Colors.secondary,
  meals: Colors.success,
  eco: Colors.info,
  social: Colors.accent,
};

export function AchievementCard({ achievement, index = 0 }: AchievementCardProps) {
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const progressWidth = useSharedValue(0);
  const color = CATEGORY_COLORS[achievement.category] || Colors.primary;

  useEffect(() => {
    scale.value = withDelay(index * 80, withSpring(1, { damping: 12, stiffness: 200 }));
    opacity.value = withDelay(index * 80, withSpring(1));
    progressWidth.value = withDelay(index * 80 + 200, withSpring(achievement.progress, { damping: 15 }));
  }, []);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <Animated.View style={[cardStyle]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: achievement.unlocked ? color + '12' : scheme.card,
            borderColor: achievement.unlocked ? color : scheme.border,
          },
        ]}
      >
        <View style={styles.header}>
          <View style={[styles.emojiWrap, { backgroundColor: color + '20' }]}>
            <Text style={styles.emoji}>{achievement.emoji}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: scheme.text }]}>{achievement.title}</Text>
            <Text style={[styles.desc, { color: scheme.textSecondary }]}>{achievement.description}</Text>
          </View>
          {achievement.unlocked && (
            <View style={[styles.unlockedBadge, { backgroundColor: color + '25' }]}>
              <Text style={[styles.unlockedText, { color }]}>✓ Unlocked</Text>
            </View>
          )}
        </View>

        {!achievement.unlocked && (
          <View style={styles.progressSection}>
            <View style={[styles.progressBg, { backgroundColor: isDark ? '#333' : '#EEF1F5' }]}>
              <Animated.View style={[styles.progressFill, { backgroundColor: color }, progressStyle]} />
            </View>
            <Text style={[styles.progressText, { color: scheme.textMuted }]}>
              {achievement.progress}% · {achievement.target}
            </Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}

export const SAMPLE_ACHIEVEMENTS: Achievement[] = [
  { id: 'a1', title: '🔥 Week Warrior', description: 'Maintain a 7-day streak', emoji: '🔥', unlocked: true, progress: 100, target: '7/7 days', category: 'streak' },
  { id: 'a2', title: '⭐ Month Master', description: 'Complete a 30-day streak', emoji: '⭐', unlocked: false, progress: 47, target: '14/30 days', category: 'streak' },
  { id: 'a3', title: '🍛 Century Saver', description: 'Save 100 meals from waste', emoji: '🍛', unlocked: false, progress: 42, target: '42/100 meals', category: 'meals' },
  { id: 'a4', title: '🌱 Eco Champion', description: 'Reduce 10kg CO₂ emissions', emoji: '🌱', unlocked: false, progress: 84, target: '8.4/10 kg', category: 'eco' },
  { id: 'a5', title: '💰 Smart Saver', description: 'Save ₹5,000 in mess bills', emoji: '💰', unlocked: false, progress: 42, target: '₹2,100/₹5,000', category: 'meals' },
  { id: 'a6', title: '🤝 Community Hero', description: 'Help feed 50 people via marketplace', emoji: '🤝', unlocked: false, progress: 30, target: '15/50 people', category: 'social' },
  { id: 'a7', title: '📋 Menu Voter', description: 'Vote on 50 menu items', emoji: '📋', unlocked: false, progress: 60, target: '30/50 votes', category: 'social' },
  { id: 'a8', title: '♻️ Waste Warrior', description: 'Mark meals for 60 consecutive days', emoji: '♻️', unlocked: false, progress: 23, target: '14/60 days', category: 'eco' },
];

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 10,
    borderWidth: 1,
  },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emojiWrap: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  emoji: { fontSize: 22 },
  title: { fontSize: 14, fontWeight: '700' },
  desc: { fontSize: 12, marginTop: 2 },
  unlockedBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  unlockedText: { fontSize: 11, fontWeight: '700' },
  progressSection: { marginTop: 12 },
  progressBg: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  progressText: { fontSize: 11, marginTop: 6, fontWeight: '500' },
});
