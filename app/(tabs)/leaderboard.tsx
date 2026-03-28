import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  FadeInDown,
} from 'react-native-reanimated';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Colors } from '../../constants/Colors';
import { Card } from '../../components/Card';
import { AchievementCard, SAMPLE_ACHIEVEMENTS } from '../../components/AchievementCard';
import { SAMPLE_LEADERBOARD } from '../../constants/sampleData';

const BADGE_LABELS: Record<string, string> = {
  '🔥': 'Streak Master',
  '🌟': 'Top Saver',
  '♻️': 'Eco Champion',
  '💚': 'Green Hero',
};

export default function LeaderboardScreen() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;
  const [activeTab, setActiveTab] = useState<'weekly' | 'monthly' | 'alltime'>('monthly');

  const data = SAMPLE_LEADERBOARD;
  const myEntry = data.find(e => e.isCurrentUser);

  const podium = data.slice(0, 3);
  const rest = data.slice(3);

  return (
    <View style={[styles.root, { backgroundColor: scheme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: scheme.text }]}>🏆 Leaderboard</Text>
        <Text style={[styles.subtitle, { color: scheme.textSecondary }]}>
          Top food-waste reducers this month
        </Text>

        {/* Tab selector */}
        <View style={[styles.tabRow, { backgroundColor: scheme.card }]}>
          {(['weekly', 'monthly', 'alltime'] as const).map(tab => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
            >
              <Text style={[styles.tabText, { color: activeTab === tab ? '#FFF' : scheme.textSecondary }]}>
                {tab === 'alltime' ? 'All Time' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Podium */}
        <View style={styles.podiumContainer}>
          {/* 2nd place */}
          <View style={styles.podiumSide}>
            <View style={[styles.podiumAvatar, { backgroundColor: Colors.info + '20' }]}>
              <Text style={styles.podiumAvatarText}>🥈</Text>
            </View>
            <Text style={[styles.podiumName, { color: scheme.text }]} numberOfLines={1}>{podium[1]?.name}</Text>
            <Text style={styles.podiumPoints}>{podium[1]?.points} pts</Text>
            <View style={[styles.podiumBar, styles.podiumBar2, { backgroundColor: Colors.info + '30' }]}>
              <Text style={styles.podiumRank}>2</Text>
            </View>
          </View>

          {/* 1st place */}
          <View style={styles.podiumCenter}>
            <Text style={styles.crownEmoji}>👑</Text>
            <View style={[styles.podiumAvatar, styles.podiumAvatarFirst, { backgroundColor: Colors.accent + '30' }]}>
              <Text style={styles.podiumAvatarTextFirst}>🥇</Text>
            </View>
            <Text style={[styles.podiumName, styles.podiumNameFirst, { color: scheme.text }]} numberOfLines={1}>{podium[0]?.name}</Text>
            <Text style={[styles.podiumPoints, styles.podiumPointsFirst]}>{podium[0]?.points} pts</Text>
            <View style={[styles.podiumBar, styles.podiumBar1, { backgroundColor: Colors.accent + '30' }]}>
              <Text style={[styles.podiumRank, styles.podiumRankFirst]}>1</Text>
            </View>
          </View>

          {/* 3rd place */}
          <View style={styles.podiumSide}>
            <View style={[styles.podiumAvatar, { backgroundColor: Colors.secondary + '20' }]}>
              <Text style={styles.podiumAvatarText}>🥉</Text>
            </View>
            <Text style={[styles.podiumName, { color: scheme.text }]} numberOfLines={1}>{podium[2]?.name}</Text>
            <Text style={styles.podiumPoints}>{podium[2]?.points} pts</Text>
            <View style={[styles.podiumBar, styles.podiumBar3, { backgroundColor: Colors.secondary + '20' }]}>
              <Text style={styles.podiumRank}>3</Text>
            </View>
          </View>
        </View>

        {/* Your position */}
        {myEntry && (
          <Card glass style={styles.myRankCard}>
            <View style={styles.myRankRow}>
              <View style={[styles.rankBadge, { backgroundColor: Colors.accent + '25' }]}>
                <Text style={styles.rankBadgeText}>#{myEntry.rank}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.myRankName, { color: scheme.text }]}>{user?.name || 'You'}</Text>
                <Text style={[styles.myRankSub, { color: scheme.textSecondary }]}>
                  🔥 {myEntry.streak} day streak · {myEntry.mealsMissedReduced} meals saved
                </Text>
              </View>
              <Text style={styles.myRankPoints}>{myEntry.points}</Text>
            </View>
            <View style={styles.myBadges}>
              {myEntry.badges.map((b, i) => (
                <View key={i} style={[styles.badge, { backgroundColor: Colors.accent + '20' }]}>
                  <Text style={styles.badgeText}>{b} {BADGE_LABELS[b] || ''}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* Rankings list */}
        <Text style={[styles.sectionLabel, { color: scheme.text }]}>Full Rankings</Text>
        {rest.map((entry, idx) => (
          <Animated.View key={entry.userId} entering={FadeInDown.delay(idx * 60).springify()}>
            <View
              style={[
                styles.rankRow,
                { backgroundColor: entry.isCurrentUser ? Colors.primary + '10' : scheme.card, borderColor: entry.isCurrentUser ? Colors.primary : scheme.border },
              ]}
            >
              <Text style={[styles.rankNum, { color: scheme.textMuted }]}>{entry.rank}</Text>
              <View style={[styles.rankAvatar, { backgroundColor: entry.isCurrentUser ? Colors.primary + '20' : scheme.inputBg || '#EEF1F5' }]}>
                <Text style={styles.rankAvatarText}>{entry.name.charAt(0)}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.rankName, { color: scheme.text }, entry.isCurrentUser && { color: Colors.primary, fontWeight: '800' }]}>
                  {entry.isCurrentUser ? (user?.name || 'You') : entry.name}
                </Text>
                <View style={styles.rankMeta}>
                  <Text style={[styles.rankStreak, { color: Colors.secondary }]}>🔥 {entry.streak}</Text>
                  <Text style={[styles.rankMeals, { color: scheme.textMuted }]}>· {entry.mealsMissedReduced} meals</Text>
                </View>
              </View>
              <View>
                <Text style={[styles.rankPoints, { color: Colors.primary }]}>{entry.points}</Text>
                <Text style={[styles.rankPtsLabel, { color: scheme.textMuted }]}>pts</Text>
              </View>
            </View>
          </Animated.View>
        ))}

        {/* Streak calendar */}
        <Text style={[styles.sectionLabel, { color: scheme.text }]}>📅 Your 30-Day Streak</Text>
        <Card style={styles.calendarCard}>
          <View style={styles.calendarGrid}>
            {Array.from({ length: 30 }, (_, i) => {
              const active = i < (user?.streak || 0);
              return (
                <View
                  key={i}
                  style={[
                    styles.calDay,
                    { backgroundColor: active ? Colors.success : isDark ? '#333' : '#EEF1F5' },
                  ]}
                >
                  {active && <Text style={styles.calDayCheck}>✓</Text>}
                </View>
              );
            })}
          </View>
          <View style={styles.calLegend}>
            <View style={styles.calLegendItem}>
              <View style={[styles.calLegendDot, { backgroundColor: Colors.success }]} />
              <Text style={[styles.calLegendText, { color: scheme.textSecondary }]}>Active</Text>
            </View>
            <View style={styles.calLegendItem}>
              <View style={[styles.calLegendDot, { backgroundColor: isDark ? '#333' : '#EEF1F5' }]} />
              <Text style={[styles.calLegendText, { color: scheme.textSecondary }]}>Missed</Text>
            </View>
          </View>
        </Card>

        {/* Achievements */}
        <Text style={[styles.sectionLabel, { color: scheme.text }]}>🏅 Achievements</Text>
        <Text style={[styles.achievementsSub, { color: scheme.textSecondary }]}>Unlock badges by reducing waste</Text>
        {SAMPLE_ACHIEVEMENTS.map((achievement, idx) => (
          <AchievementCard key={achievement.id} achievement={achievement} index={idx} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 24 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: 16 },

  tabRow: { flexDirection: 'row', borderRadius: 14, padding: 4, marginBottom: 20 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 12, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: 13, fontWeight: '600' },

  // Podium
  podiumContainer: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', marginBottom: 24, paddingTop: 20 },
  podiumSide: { flex: 1, alignItems: 'center' },
  podiumCenter: { flex: 1.2, alignItems: 'center' },
  crownEmoji: { fontSize: 28, marginBottom: 4 },
  podiumAvatar: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  podiumAvatarFirst: { width: 56, height: 56, borderRadius: 18 },
  podiumAvatarText: { fontSize: 24 },
  podiumAvatarTextFirst: { fontSize: 28 },
  podiumName: { fontSize: 12, fontWeight: '600', textAlign: 'center', marginBottom: 2 },
  podiumNameFirst: { fontSize: 14, fontWeight: '700' },
  podiumPoints: { fontSize: 11, fontWeight: '600', color: Colors.info, marginBottom: 6 },
  podiumPointsFirst: { color: Colors.accent, fontSize: 13 },
  podiumBar: { width: '100%', alignItems: 'center', justifyContent: 'flex-end', borderTopLeftRadius: 12, borderTopRightRadius: 12, paddingBottom: 8 },
  podiumBar1: { height: 80 },
  podiumBar2: { height: 56 },
  podiumBar3: { height: 42 },
  podiumRank: { fontSize: 20, fontWeight: '800', color: Colors.info },
  podiumRankFirst: { fontSize: 26, color: Colors.accent },

  // My rank
  myRankCard: { marginBottom: 20 },
  myRankRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rankBadge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 },
  rankBadgeText: { fontSize: 16, fontWeight: '800', color: '#B8860B' },
  myRankName: { fontSize: 16, fontWeight: '700' },
  myRankSub: { fontSize: 12, marginTop: 2 },
  myRankPoints: { fontSize: 22, fontWeight: '800', color: Colors.primary },
  myBadges: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  badge: { borderRadius: 10, paddingHorizontal: 10, paddingVertical: 5 },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#B8860B' },

  sectionLabel: { fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 10 },

  // Rank list
  rankRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 8,
  },
  rankNum: { fontSize: 14, fontWeight: '700', width: 20, textAlign: 'center' },
  rankAvatar: { width: 40, height: 40, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  rankAvatarText: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  rankName: { fontSize: 14, fontWeight: '600' },
  rankMeta: { flexDirection: 'row', gap: 4, marginTop: 2 },
  rankStreak: { fontSize: 12, fontWeight: '600' },
  rankMeals: { fontSize: 12 },
  rankPoints: { fontSize: 18, fontWeight: '800', textAlign: 'right' },
  rankPtsLabel: { fontSize: 10, textAlign: 'right' },
  inputBg: {},

  // Calendar
  calendarCard: { marginBottom: 12 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  calDay: { width: 28, height: 28, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  calDayCheck: { fontSize: 12, fontWeight: '800', color: '#FFF' },
  calLegend: { flexDirection: 'row', gap: 16, marginTop: 12 },
  calLegendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  calLegendDot: { width: 10, height: 10, borderRadius: 3 },
  calLegendText: { fontSize: 12 },

  // Achievements
  achievementsSub: { fontSize: 13, marginBottom: 12 },
});
