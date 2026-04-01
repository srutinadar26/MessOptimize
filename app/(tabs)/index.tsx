import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Colors } from '../../constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../../components/Card';

export default function HomeScreen() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;

  const [meals, setMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  const toggleMeal = (meal: 'breakfast' | 'lunch' | 'dinner') => {
    setMeals(prev => ({ ...prev, [meal]: !prev[meal] }));
    Alert.alert('Meal Marked', `${meal.charAt(0).toUpperCase() + meal.slice(1)} marked successfully!`);
  };

  // Helper to get first name from full name
  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0];
  };

  return (
    <ScrollView style={[styles.root, { backgroundColor: scheme.background }]}>
      {/* Header */}
      <LinearGradient
        colors={[Colors.primary, Colors.info]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View>
          {/* ✅ Shows the name entered during signup - No Google Account */}
          <Text style={styles.greeting}>Hello, {getFirstName(user?.name || 'User')}! 👋</Text>
          <Text style={styles.subGreeting}>Ready to reduce food waste today?</Text>
        </View>
        <TouchableOpacity style={styles.avatar} onPress={() => router.push('/profile')}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        {/* Savings Card */}
        <Card style={styles.savingsCard}>
          <Text style={[styles.savingsLabel, { color: scheme.textSecondary }]}>💰 This Month Savings</Text>
          <Text style={[styles.savingsAmount, { color: Colors.primary }]}>₹{user?.moneySaved || 150}</Text>
          <Text style={[styles.savingsSub, { color: scheme.textMuted }]}>from mess fee discounts</Text>
        </Card>

        {/* Streak Card */}
        <Card style={styles.streakCard}>
          <View style={styles.streakRow}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <View style={styles.streakTextContainer}>
              <Text style={[styles.streakTitle, { color: scheme.text }]}>{user?.streak || 7} Day Streak!</Text>
              <Text style={[styles.streakSub, { color: scheme.textSecondary }]}>
                {user?.streak && user.streak >= 7 ? 'Meal Priority Unlocked! 🎉' : `${7 - (user?.streak || 0)} more days for Meal Priority`}
              </Text>
            </View>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${((user?.streak || 0) / 7) * 100}%` }]} />
          </View>
        </Card>

        {/* Meal Cards */}
        <Text style={[styles.sectionTitle, { color: scheme.text }]}>Today's Meals</Text>

        {/* Breakfast */}
        <TouchableOpacity
          style={[
            styles.mealCard,
            { backgroundColor: scheme.card, borderColor: scheme.border },
            meals.breakfast && styles.mealCardActive,
          ]}
          onPress={() => toggleMeal('breakfast')}
        >
          <View style={styles.mealLeft}>
            <Text style={styles.mealEmoji}>🍳</Text>
            <View>
              <Text style={[styles.mealName, { color: scheme.text }]}>Breakfast</Text>
              <Text style={[styles.mealDeadline, { color: scheme.textMuted }]}>⏰ Mark by 10:00 AM</Text>
            </View>
          </View>
          <View style={[styles.checkbox, meals.breakfast && styles.checkboxActive]}>
            {meals.breakfast && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        {/* Lunch */}
        <TouchableOpacity
          style={[
            styles.mealCard,
            { backgroundColor: scheme.card, borderColor: scheme.border },
            meals.lunch && styles.mealCardActive,
          ]}
          onPress={() => toggleMeal('lunch')}
        >
          <View style={styles.mealLeft}>
            <Text style={styles.mealEmoji}>🍛</Text>
            <View>
              <Text style={[styles.mealName, { color: scheme.text }]}>Lunch</Text>
              <Text style={[styles.mealDeadline, { color: scheme.textMuted }]}>⏰ Mark by 2:00 PM</Text>
            </View>
          </View>
          <View style={[styles.checkbox, meals.lunch && styles.checkboxActive]}>
            {meals.lunch && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        {/* Dinner */}
        <TouchableOpacity
          style={[
            styles.mealCard,
            { backgroundColor: scheme.card, borderColor: scheme.border },
            meals.dinner && styles.mealCardActive,
          ]}
          onPress={() => toggleMeal('dinner')}
        >
          <View style={styles.mealLeft}>
            <Text style={styles.mealEmoji}>🍲</Text>
            <View>
              <Text style={[styles.mealName, { color: scheme.text }]}>Dinner</Text>
              <Text style={[styles.mealDeadline, { color: scheme.textMuted }]}>⏰ Mark by 7:00 PM</Text>
            </View>
          </View>
          <View style={[styles.checkbox, meals.dinner && styles.checkboxActive]}>
            {meals.dinner && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: scheme.card, borderColor: scheme.border }]}>
            <Text style={styles.statEmoji}>🌍</Text>
            <Text style={[styles.statValue, { color: Colors.success }]}>{user?.totalMealsSaved || 48} kg</Text>
            <Text style={[styles.statLabel, { color: scheme.textMuted }]}>Food Saved</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: scheme.card, borderColor: scheme.border }]}>
            <Text style={styles.statEmoji}>👥</Text>
            <Text style={[styles.statValue, { color: Colors.info }]}>{user?.co2Reduced || 45}</Text>
            <Text style={[styles.statLabel, { color: scheme.textMuted }]}>People Fed</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  greeting: { fontSize: 24, fontWeight: '800', color: '#FFF', marginBottom: 4 },
  subGreeting: { fontSize: 14, color: 'rgba(255,255,255,0.8)' },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { fontSize: 20, fontWeight: '600', color: '#FFF' },
  content: { padding: 20 },
  savingsCard: { padding: 20, marginBottom: 16 },
  savingsLabel: { fontSize: 14, marginBottom: 4 },
  savingsAmount: { fontSize: 32, fontWeight: '800', marginBottom: 2 },
  savingsSub: { fontSize: 12 },
  streakCard: { padding: 20, marginBottom: 24 },
  streakRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  streakEmoji: { fontSize: 32, marginRight: 12 },
  streakTextContainer: { flex: 1 },
  streakTitle: { fontSize: 18, fontWeight: '700' },
  streakSub: { fontSize: 12, marginTop: 2 },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 16 },
  mealCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  mealCardActive: { borderColor: Colors.success, backgroundColor: Colors.success + '10' },
  mealLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  mealEmoji: { fontSize: 28 },
  mealName: { fontSize: 16, fontWeight: '600' },
  mealDeadline: { fontSize: 12, marginTop: 2 },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxActive: { backgroundColor: Colors.success, borderColor: Colors.success },
  checkmark: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', gap: 12, marginTop: 16 },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  statEmoji: { fontSize: 28, marginBottom: 8 },
  statValue: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  statLabel: { fontSize: 12 },
});