import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useToast } from '../../components/Toast';
import { Colors } from '../../constants/Colors';
import { Card } from '../../components/Card';
import { StatCard } from '../../components/StatCard';
import { StreakCard } from '../../components/StreakCard';
import { MealToggle, MealType } from '../../components/MealToggle';
import { BarChart } from '../../components/SimpleCharts';
import { SAMPLE_HEADCOUNT } from '../../constants/sampleData';
import { ANALYTICS_DATA } from '../../constants/analyticsData';

const { width } = Dimensions.get('window');

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

function getMealDeadlines(): Record<MealType, Date> {
  const today = new Date();
  const y = today.getFullYear(), m = today.getMonth(), d = today.getDate();
  return {
    breakfast: new Date(y, m, d, 8, 30),
    lunch: new Date(y, m, d, 12, 0),
    dinner: new Date(y, m, d, 19, 0),
  };
}

// ── Staff Dashboard ──
function StaffDashboard() {
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;
  const hc = SAMPLE_HEADCOUNT;

  const meals = [
    { label: 'Breakfast', emoji: '🌅', actual: hc.breakfast, expected: hc.expectedBreakfast },
    { label: 'Lunch', emoji: '☀️', actual: hc.lunch, expected: hc.expectedLunch },
    { label: 'Dinner', emoji: '🌙', actual: hc.dinner, expected: hc.expectedDinner },
  ];

  const totalActual = hc.breakfast + hc.lunch + hc.dinner;
  const totalExpected = hc.expectedBreakfast + hc.expectedLunch + hc.expectedDinner;
  const wasteSaved = totalExpected - totalActual;
  const efficiency = Math.round((totalActual / totalExpected) * 100);

  return (
    <>
      <Card glass style={styles.staffSummary}>
        <Text style={[styles.staffTitle, { color: scheme.text }]}>📊 Today's Overview</Text>
        <View style={styles.staffMetricsRow}>
          <View style={styles.staffMetric}>
            <Text style={styles.staffMetricVal}>{totalActual}</Text>
            <Text style={[styles.staffMetricLabel, { color: scheme.textSecondary }]}>Marked</Text>
          </View>
          <View style={[styles.staffDivider, { backgroundColor: scheme.border }]} />
          <View style={styles.staffMetric}>
            <Text style={[styles.staffMetricVal, { color: Colors.success }]}>{wasteSaved}</Text>
            <Text style={[styles.staffMetricLabel, { color: scheme.textSecondary }]}>Meals Saved</Text>
          </View>
          <View style={[styles.staffDivider, { backgroundColor: scheme.border }]} />
          <View style={styles.staffMetric}>
            <Text style={[styles.staffMetricVal, { color: Colors.info }]}>{efficiency}%</Text>
            <Text style={[styles.staffMetricLabel, { color: scheme.textSecondary }]}>Efficiency</Text>
          </View>
        </View>
      </Card>

      <Text style={[styles.sectionLabel, { color: scheme.text }]}>🍽 Live Headcount</Text>
      {meals.map(meal => {
        const pct = Math.round((meal.actual / meal.expected) * 100);
        return (
          <Card key={meal.label} style={styles.headcountCard}>
            <View style={styles.headcountHeader}>
              <Text style={styles.headcountEmoji}>{meal.emoji}</Text>
              <Text style={[styles.headcountLabel, { color: scheme.text }]}>{meal.label}</Text>
              <Text style={[styles.headcountPct, { color: Colors.info }]}>{pct}%</Text>
            </View>
            <View style={[styles.progressBg, { backgroundColor: isDark ? '#333' : '#EEF1F5' }]}>
              <View style={[styles.progressFill, { width: `${Math.min(pct, 100)}%`, backgroundColor: pct > 80 ? Colors.success : pct > 50 ? Colors.accent : Colors.secondary }]} />
            </View>
            <View style={styles.headcountRow}>
              <Text style={[styles.headcountSub, { color: scheme.textSecondary }]}>{meal.actual} marked</Text>
              <Text style={[styles.headcountSub, { color: scheme.textMuted }]}>of {meal.expected} expected</Text>
            </View>
          </Card>
        );
      })}

      <Card glass style={styles.alertCard}>
        <Text style={styles.alertEmoji}>⚠️</Text>
        <View style={{ flex: 1 }}>
          <Text style={[styles.alertTitle, { color: scheme.text }]}>Waste Alert</Text>
          <Text style={[styles.alertDesc, { color: scheme.textSecondary }]}>
            Dinner headcount is low today — consider reducing portions by 25%
          </Text>
        </View>
      </Card>

      <Text style={[styles.sectionLabel, { color: scheme.text }]}>📦 Auto Quantities</Text>
      <Card style={styles.quantityCard}>
        {[
          { item: 'Rice', qty: `${Math.round(totalActual * 0.15)} kg`, emoji: '🍚' },
          { item: 'Dal', qty: `${Math.round(totalActual * 0.05)} kg`, emoji: '🥘' },
          { item: 'Rotis', qty: `${totalActual * 2} pcs`, emoji: '🫓' },
          { item: 'Vegetables', qty: `${Math.round(totalActual * 0.1)} kg`, emoji: '🥗' },
        ].map((q, i) => (
          <View key={q.item} style={[styles.quantityRow, i > 0 && { borderTopWidth: 1, borderTopColor: isDark ? '#333' : '#EEF1F5' }]}>
            <Text style={styles.quantityEmoji}>{q.emoji}</Text>
            <Text style={[styles.quantityItem, { color: scheme.text }]}>{q.item}</Text>
            <Text style={[styles.quantityVal, { color: Colors.primary }]}>{q.qty}</Text>
          </View>
        ))}
      </Card>

      {/* Historical 7-day chart */}
      <Text style={[styles.sectionLabel, { color: scheme.text }]}>📈 7-Day Headcount</Text>
      <Card style={{ marginBottom: 12 }}>
        <BarChart
          data={ANALYTICS_DATA.staffHistorical.map(d => ({ label: d.day, value: d.lunch, color: Colors.info }))}
          height={130}
        />
        <Text style={{ fontSize: 11, color: scheme.textMuted, marginTop: 6, fontStyle: 'italic' }}>Lunch headcount · last 7 days</Text>
      </Card>

      {/* Overproduction Alert */}
      {(() => {
        const overproduction = Math.round(((totalExpected - totalActual) / totalExpected) * 100);
        return overproduction > 20 ? (
          <Card glass style={{ ...styles.alertCard, borderLeftWidth: 3, borderLeftColor: '#E55' }}>
            <Text style={styles.alertEmoji}>🚨</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.alertTitle, { color: '#E55' }]}>Overproduction Alert</Text>
              <Text style={[styles.alertDesc, { color: scheme.textSecondary }]}>
                {overproduction}% overproduction detected. Reduce cooking by ~{Math.round(overproduction * 0.7)}% to minimize waste.
              </Text>
            </View>
          </Card>
        ) : null;
      })()}
    </>
  );
}

// ── NGO Dashboard ──
function NgoDashboard() {
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;

  return (
    <>
      <Card glass style={styles.ngoCard}>
        <Text style={styles.ngoEmoji}>🤝</Text>
        <Text style={[styles.ngoTitle, { color: scheme.text }]}>Welcome, Partner!</Text>
        <Text style={[styles.ngoDesc, { color: scheme.textSecondary }]}>
          Browse the Marketplace tab to claim surplus food from nearby hostels.
        </Text>
      </Card>

      <View style={styles.statsGrid}>
        <StatCard emoji="🍽" label="Meals Claimed" value="127" color={Colors.success} />
        <StatCard emoji="👨‍👩‍👧‍👦" label="People Fed" value="380+" color={Colors.info} />
      </View>
      <View style={styles.statsGrid}>
        <StatCard emoji="🏫" label="Partner Messes" value="6" color={Colors.secondary} />
        <StatCard emoji="✅" label="Verified" value="Yes" color={Colors.success} />
      </View>

      <Card style={{ marginTop: 12 }}>
        <Text style={[styles.sectionLabel, { color: scheme.text, marginBottom: 8, marginTop: 0 }]}>📢 Recent Activity</Text>
        {[
          { text: 'Claimed 5kg rice from Tagore Mess', time: '2h ago', emoji: '🍚' },
          { text: 'Picked up bread from Nehru Mess', time: '5h ago', emoji: '🍞' },
          { text: 'Claimed dal from Gandhi Mess', time: '1d ago', emoji: '🥘' },
        ].map((item, i) => (
          <View key={i} style={[styles.activityRow, { borderBottomColor: scheme.border }]}>
            <Text style={styles.activityEmoji}>{item.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[styles.activityText, { color: scheme.text }]}>{item.text}</Text>
              <Text style={[styles.activityTime, { color: scheme.textMuted }]}>{item.time}</Text>
            </View>
          </View>
        ))}
      </Card>
    </>
  );
}

// ── Student Dashboard ──
function StudentDashboard() {
  const { user, updateUser } = useAuth();
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;
  const deadlines = getMealDeadlines();
  const [meals, setMeals] = useState({ breakfast: false, lunch: true, dinner: false });

  function handleToggle(type: MealType) {
    setMeals(prev => {
      const newVal = !prev[type];
      if (newVal && user) {
        updateUser({ totalMealsSaved: user.totalMealsSaved + 1, moneySaved: user.moneySaved + 50, co2Reduced: +(user.co2Reduced + 0.2).toFixed(1) });
      }
      return { ...prev, [type]: newVal };
    });
  }

  return (
    <>
      {/* Savings card */}
      <LinearGradient
        colors={[Colors.primary, Colors.info]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.savingsCard}
      >
        <View style={styles.savingsHeader}>
          <Text style={styles.savingsLabel}>Monthly Savings</Text>
          <Text style={styles.savingsBadge}>Mar '26</Text>
        </View>
        <Text style={styles.savingsAmount}>₹{user?.moneySaved?.toLocaleString() || '0'}</Text>
        <View style={styles.savingsRow}>
          <View style={styles.savingsStat}>
            <Text style={styles.savingsStatVal}>{user?.totalMealsSaved || 0}</Text>
            <Text style={styles.savingsStatLabel}>Meals Saved</Text>
          </View>
          <View style={styles.savingsDot} />
          <View style={styles.savingsStat}>
            <Text style={styles.savingsStatVal}>{user?.co2Reduced || 0}kg</Text>
            <Text style={styles.savingsStatLabel}>CO₂ Reduced</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Streak */}
      <StreakCard streak={user?.streak || 0} />

      {/* Meal marking */}
      <Text style={[styles.sectionLabel, { color: scheme.text }]}>🍽 Today's Meals</Text>
      <Text style={[styles.sectionSub, { color: scheme.textSecondary }]}>Mark meals you'll skip to reduce waste</Text>
      <View style={styles.mealsContainer}>
        {(['breakfast', 'lunch', 'dinner'] as MealType[]).map(type => (
          <MealToggle key={type} type={type} marked={meals[type]} deadline={deadlines[type]} onToggle={handleToggle} />
        ))}
      </View>

      {/* Quick stats */}
      <Text style={[styles.sectionLabel, { color: scheme.text }]}>📊 Your Impact</Text>
      <View style={styles.statsGrid}>
        <StatCard emoji="🍛" label="Meals Saved" value={`${user?.totalMealsSaved || 0}`} color={Colors.success} />
        <StatCard emoji="💰" label="Money Saved" value={`₹${user?.moneySaved || 0}`} color={Colors.accent} />
      </View>
      <View style={styles.statsGrid}>
        <StatCard emoji="🌱" label="CO₂ Reduced" value={`${user?.co2Reduced || 0}kg`} color={Colors.info} />
        <StatCard emoji="🔥" label="Streak" value={`${user?.streak || 0} days`} color={Colors.secondary} />
      </View>
    </>
  );
}

// ── Main Home Screen ──
export default function HomeScreen() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { showToast } = useToast();
  const scheme = isDark ? Colors.dark : Colors.light;
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: scheme.background }]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.greeting, { color: scheme.textSecondary }]}>{getGreeting()} 👋</Text>
            <Text style={[styles.userName, { color: scheme.text }]}>{user?.name || 'User'}</Text>
          </View>
          <View style={[styles.avatarWrap, { backgroundColor: Colors.primary + '15' }]}>
            <Text style={styles.avatarEmoji}>
              {user?.role === 'staff' ? '👨‍🍳' : user?.role === 'ngo' ? '🤝' : '🎓'}
            </Text>
          </View>
        </View>

        {/* Role badge */}
        <View style={[styles.roleBadge, { backgroundColor: Colors.accent + '25' }]}>
          <Text style={styles.roleBadgeText}>
            {user?.role === 'student' ? '🎓 Student' : user?.role === 'staff' ? '👨‍🍳 Mess Staff' : '🤝 NGO Partner'}
            {user?.hostelName ? ` · ${user.hostelName}` : ''}
          </Text>
        </View>

        {/* Role-based content */}
        {user?.role === 'staff' ? <StaffDashboard /> :
         user?.role === 'ngo' ? <NgoDashboard /> :
         <StudentDashboard />}

        {/* Analytics Quick Link */}
        <TouchableOpacity
          onPress={() => router.push('/analytics')}
          style={[styles.analyticsLink, { backgroundColor: isDark ? Colors.dark.card : Colors.light.card, borderColor: scheme.border }]}
        >
          <Text style={styles.analyticsLinkEmoji}>📊</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.analyticsLinkTitle, { color: scheme.text }]}>View Full Analytics</Text>
            <Text style={[styles.analyticsLinkSub, { color: scheme.textSecondary }]}>Charts, reports & bill calculator</Text>
          </View>
          <Text style={{ color: scheme.textMuted, fontSize: 20 }}>→</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  greeting: { fontSize: 14, fontWeight: '500' },
  userName: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  avatarWrap: { width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  avatarEmoji: { fontSize: 24 },
  roleBadge: { alignSelf: 'flex-start', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 6, marginBottom: 20 },
  roleBadgeText: { fontSize: 12, fontWeight: '600', color: '#B8860B' },

  // Savings card
  savingsCard: { borderRadius: 24, padding: 24, marginBottom: 16 },
  savingsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  savingsLabel: { fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.8)' },
  savingsBadge: { fontSize: 11, fontWeight: '700', color: '#FFF', backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 },
  savingsAmount: { fontSize: 40, fontWeight: '800', color: '#FFF', letterSpacing: -1, marginBottom: 12 },
  savingsRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  savingsStat: {},
  savingsStatVal: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  savingsStatLabel: { fontSize: 12, color: 'rgba(255,255,255,0.7)' },
  savingsDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.4)' },

  sectionLabel: { fontSize: 18, fontWeight: '700', marginTop: 20, marginBottom: 4 },
  sectionSub: { fontSize: 13, marginBottom: 12 },
  mealsContainer: { gap: 10, marginBottom: 8 },
  statsGrid: { flexDirection: 'row', gap: 12, marginTop: 10 },

  // Staff
  staffSummary: { marginBottom: 16 },
  staffTitle: { fontSize: 16, fontWeight: '700', marginBottom: 14 },
  staffMetricsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  staffMetric: { alignItems: 'center' },
  staffMetricVal: { fontSize: 28, fontWeight: '800', color: Colors.primary },
  staffMetricLabel: { fontSize: 12, fontWeight: '500', marginTop: 2 },
  staffDivider: { width: 1, height: 36 },
  headcountCard: { marginBottom: 10 },
  headcountHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
  headcountEmoji: { fontSize: 22 },
  headcountLabel: { fontSize: 15, fontWeight: '600', flex: 1 },
  headcountPct: { fontSize: 14, fontWeight: '700' },
  progressBg: { height: 8, borderRadius: 4, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 4 },
  headcountRow: { flexDirection: 'row', justifyContent: 'space-between' },
  headcountSub: { fontSize: 12 },
  alertCard: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', marginTop: 12 },
  alertEmoji: { fontSize: 28 },
  alertTitle: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  alertDesc: { fontSize: 13, lineHeight: 18 },
  quantityCard: { marginTop: 4 },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12 },
  quantityEmoji: { fontSize: 20 },
  quantityItem: { flex: 1, fontSize: 14, fontWeight: '600' },
  quantityVal: { fontSize: 14, fontWeight: '700' },

  // NGO
  ngoCard: { alignItems: 'center', paddingVertical: 28, marginBottom: 12 },
  ngoEmoji: { fontSize: 48, marginBottom: 8 },
  ngoTitle: { fontSize: 20, fontWeight: '800', marginBottom: 4 },
  ngoDesc: { fontSize: 14, textAlign: 'center', lineHeight: 20, paddingHorizontal: 8 },
  activityRow: { flexDirection: 'row', gap: 10, paddingVertical: 10, borderBottomWidth: 1, alignItems: 'center' },
  activityEmoji: { fontSize: 20 },
  activityText: { fontSize: 14, fontWeight: '500' },
  activityTime: { fontSize: 11, marginTop: 2 },

  // Analytics link
  analyticsLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 20,
  },
  analyticsLinkEmoji: { fontSize: 28 },
  analyticsLinkTitle: { fontSize: 15, fontWeight: '700' },
  analyticsLinkSub: { fontSize: 12, marginTop: 2 },
});
