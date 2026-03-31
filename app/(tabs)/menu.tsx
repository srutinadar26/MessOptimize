import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from '../../constants/Colors';
import { MenuCard } from '../../components/MenuCard';
import { SAMPLE_MENU } from '../../constants/sampleData';
import { MenuItem } from '../../constants/types';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '🍽' },
  { id: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { id: 'lunch', label: 'Lunch', emoji: '☀️' },
  { id: 'dinner', label: 'Dinner', emoji: '🌙' },
  { id: 'fastfood', label: 'Fast Food', emoji: '🍔' },
  { id: 'beverage', label: 'Beverages', emoji: '☕' },
  { id: 'dessert', label: 'Desserts', emoji: '🍮' },
];

export default function MenuScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const scheme = isDark ? Colors.dark : Colors.light;
  const today = new Date().getDay();
  const hasPriority = (user?.streak || 0) >= 7;

  const [selectedDay, setSelectedDay] = useState(today);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [menu, setMenu] = useState<MenuItem[]>(SAMPLE_MENU);

  // Filter menu items based on selected day and category
  const filteredMenu = menu.filter(item => {
    const dayMatch = item.day === selectedDay;
    const catMatch = selectedCategory === 'all' || item.category === selectedCategory;
    return dayMatch && catMatch;
  });

  function handleVote(id: string, direction: 'up' | 'down') {
    setMenu(prev =>
      prev.map(item => {
        if (item.id !== id) return item;
        const wasUp = item.userVote === 'up';
        const wasDown = item.userVote === 'down';
        const isUp = direction === 'up';

        if (isUp) {
          return {
            ...item,
            userVote: wasUp ? null : 'up',
            upvotes: wasUp ? item.upvotes - 1 : item.upvotes + 1,
            downvotes: wasDown ? item.downvotes - 1 : item.downvotes,
          } as MenuItem;
        } else {
          return {
            ...item,
            userVote: wasDown ? null : 'down',
            downvotes: wasDown ? item.downvotes - 1 : item.downvotes + 1,
            upvotes: wasUp ? item.upvotes - 1 : item.upvotes,
          } as MenuItem;
        }
      })
    );
  }

  // Get category-specific items count
  const getCategoryCount = (categoryId: string) => {
    if (categoryId === 'all') {
      return menu.filter(item => item.day === selectedDay).length;
    }
    return menu.filter(item => item.day === selectedDay && item.category === categoryId).length;
  };

  // Handle category press without popups
  const handleCategoryPress = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  // Get category icon
  const getCategoryIcon = (categoryId: string) => {
    const category = CATEGORIES.find(c => c.id === categoryId);
    return category?.emoji || '🍽';
  };

  return (
    <View style={[styles.root, { backgroundColor: scheme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <Text style={[styles.title, { color: scheme.text }]}>📋 Weekly Menu</Text>
        <Text style={[styles.subtitle, { color: scheme.textSecondary }]}>
          Vote for your favorites & help us plan better
        </Text>

        {/* Day selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dayScroll} contentContainerStyle={styles.dayScrollContent}>
          {DAYS.map((day, i) => {
            const isSelected = i === selectedDay;
            const isToday = i === today;
            const dayItemCount = menu.filter(item => item.day === i).length;
            return (
              <TouchableOpacity
                key={day}
                onPress={() => setSelectedDay(i)}
                style={[
                  styles.dayChip,
                  { backgroundColor: isSelected ? Colors.primary : scheme.card, borderColor: isSelected ? Colors.primary : scheme.border },
                ]}
              >
                <Text style={[styles.dayText, { color: isSelected ? '#FFF' : scheme.text }]}>{day}</Text>
                {isToday && <View style={[styles.todayDot, isSelected && { backgroundColor: '#FFF' }]} />}
                {dayItemCount > 0 && (
                  <Text style={[styles.itemCount, { color: isSelected ? '#FFF' : scheme.textMuted }]}>
                    {dayItemCount}
                  </Text>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Category filter - Now includes Fast Food and Beverages */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll} contentContainerStyle={styles.catScrollContent}>
          {CATEGORIES.map(cat => {
            const isSelected = cat.id === selectedCategory;
            const itemCount = getCategoryCount(cat.id);
            return (
              <TouchableOpacity
                key={cat.id}
                onPress={() => handleCategoryPress(cat.id)}
                style={[
                  styles.catChip,
                  {
                    backgroundColor: isSelected ? Colors.accent + '30' : scheme.card,
                    borderColor: isSelected ? Colors.accent : scheme.border,
                  },
                ]}
              >
                <Text style={styles.catEmoji}>{cat.emoji}</Text>
                <Text style={[styles.catText, { color: isSelected ? '#B8860B' : scheme.textSecondary }]}>
                  {cat.label}
                </Text>
                {itemCount > 0 && (
                  <View style={[styles.countBadge, { backgroundColor: isSelected ? Colors.accent : scheme.border }]}>
                    <Text style={[styles.countText, { color: isSelected ? '#FFF' : scheme.textMuted }]}>
                      {itemCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Meal Priority Unlock */}
        {hasPriority && (
          <LinearGradient
            colors={[Colors.accent + '25', Colors.secondary + '15']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.priorityCard}
          >
            <View style={styles.priorityHeader}>
              <Text style={styles.priorityEmoji}>⭐</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.priorityTitle, { color: scheme.text }]}>Meal Priority Unlocked!</Text>
                <Text style={[styles.prioritySub, { color: scheme.textSecondary }]}>7+ day streak — choose a special dish</Text>
              </View>
            </View>
            <View style={styles.priorityOptions}>
              {[
                { name: 'Extra Paneer', emoji: '🧀' },
                { name: 'Double Dessert', emoji: '🍮' },
                { name: 'Fresh Juice', emoji: '🧃' },
              ].map(opt => (
                <TouchableOpacity
                  key={opt.name}
                  style={[styles.priorityOption, { backgroundColor: scheme.card, borderColor: scheme.border }]}
                >
                  <Text style={styles.priorityOptEmoji}>{opt.emoji}</Text>
                  <Text style={[styles.priorityOptText, { color: scheme.text }]}>{opt.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </LinearGradient>
        )}

        {/* Category Header */}
        {selectedCategory !== 'all' && filteredMenu.length > 0 && (
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryHeaderEmoji}>
              {CATEGORIES.find(c => c.id === selectedCategory)?.emoji}
            </Text>
            <Text style={[styles.categoryHeaderTitle, { color: scheme.text }]}>
              {CATEGORIES.find(c => c.id === selectedCategory)?.label}
            </Text>
            <Text style={[styles.categoryHeaderCount, { color: scheme.textSecondary }]}>
              ({filteredMenu.length})
            </Text>
          </View>
        )}

        {/* Menu items */}
        {filteredMenu.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>{getCategoryIcon(selectedCategory)}</Text>
            <Text style={[styles.emptyTitle, { color: scheme.textSecondary }]}>
              No {selectedCategory !== 'all' ? CATEGORIES.find(c => c.id === selectedCategory)?.label : ''} items available
            </Text>
            <Text style={[styles.emptyDesc, { color: scheme.textMuted }]}>
              Try a different day
            </Text>
          </View>
        ) : (
          filteredMenu.map(item => (
            <MenuCard key={item.id} item={item} onVote={handleVote} />
          ))
        )}

        {/* Summary */}
        {filteredMenu.length > 0 && (
          <View style={[styles.summaryCard, { backgroundColor: isDark ? 'rgba(42,42,42,0.85)' : 'rgba(255,255,255,0.85)' }]}>
            <Text style={[styles.summaryTitle, { color: scheme.text }]}>📊 {DAYS[selectedDay]} Stats</Text>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryValue, { color: Colors.success }]}>{filteredMenu.length} items</Text>
              <Text style={[styles.summaryLabel, { color: scheme.textMuted }]}>available</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={[styles.summaryValue, { color: Colors.info }]}>
                {filteredMenu.reduce((sum, item) => sum + item.upvotes, 0)} votes
              </Text>
              <Text style={[styles.summaryLabel, { color: scheme.textMuted }]}>total</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 24 },
  title: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginTop: 4, marginBottom: 16 },
  dayScroll: { marginBottom: 12 },
  dayScrollContent: { gap: 8, paddingRight: 20 },
  dayChip: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
    minWidth: 52,
    position: 'relative',
  },
  dayText: { fontSize: 14, fontWeight: '600' },
  todayDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: Colors.secondary, marginTop: 4 },
  itemCount: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  catScroll: { marginBottom: 16 },
  catScrollContent: { gap: 8, paddingRight: 20 },
  catChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    position: 'relative',
  },
  catEmoji: { fontSize: 14 },
  catText: { fontSize: 13, fontWeight: '600' },
  countBadge: {
    marginLeft: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 20,
    alignItems: 'center',
  },
  countText: {
    fontSize: 10,
    fontWeight: '700',
  },
  emptyState: { alignItems: 'center', paddingVertical: 48 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '600' },
  emptyDesc: { fontSize: 13, marginTop: 4 },
  summaryCard: { borderRadius: 20, padding: 16, marginTop: 16, gap: 8 },
  summaryTitle: { fontSize: 15, fontWeight: '700', marginBottom: 4 },
  summaryRow: { flexDirection: 'row', gap: 6, alignItems: 'baseline' },
  summaryValue: { fontSize: 16, fontWeight: '700' },
  summaryLabel: { fontSize: 13 },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 8,
    paddingHorizontal: 4,
  },
  categoryHeaderEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  categoryHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    flex: 1,
  },
  categoryHeaderCount: {
    fontSize: 14,
    fontWeight: '500',
  },

  // Priority unlock
  priorityCard: { borderRadius: 20, padding: 18, marginBottom: 16 },
  priorityHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 },
  priorityEmoji: { fontSize: 32 },
  priorityTitle: { fontSize: 16, fontWeight: '700' },
  prioritySub: { fontSize: 12, marginTop: 2 },
  priorityOptions: { flexDirection: 'row', gap: 10 },
  priorityOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    gap: 4,
  },
  priorityOptEmoji: { fontSize: 24 },
  priorityOptText: { fontSize: 12, fontWeight: '600' },
});