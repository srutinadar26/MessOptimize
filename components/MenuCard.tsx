import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { useTheme } from '../context/ThemeContext';
import { MenuItem } from '../constants/types';

interface MenuCardProps {
  item: MenuItem;
  onVote: (id: string, direction: 'up' | 'down') => void;
}

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  veg: { bg: Colors.success + '25', text: Colors.success },
  vegan: { bg: Colors.info + '25', text: Colors.info },
  'non-veg': { bg: '#FF6B6B25', text: '#E55' },
  jain: { bg: Colors.accent + '30', text: '#B8860B' },
  'gluten-free': { bg: Colors.secondary + '25', text: Colors.secondary },
};

const SPICE: Record<number, string> = { 0: '🌿 Mild', 1: '🌶 Low', 2: '🌶🌶 Medium', 3: '🌶🌶🌶 Hot' };

export function MenuCard({ item, onVote }: MenuCardProps) {
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;
  const net = item.upvotes - item.downvotes;

  return (
    <View style={[styles.card, { backgroundColor: scheme.card }, isDark ? styles.shadowDark : styles.shadowLight]}>
      <View style={styles.header}>
        <Text style={styles.emoji}>{item.imageEmoji}</Text>
        <View style={styles.titleArea}>
          <Text style={[styles.name, { color: scheme.text }]} numberOfLines={1}>{item.name}</Text>
          <Text style={[styles.desc, { color: scheme.textSecondary }]} numberOfLines={2}>{item.description}</Text>
        </View>
      </View>

      <View style={styles.tagsRow}>
        {item.tags.map(tag => (
          <View key={tag} style={[styles.tag, { backgroundColor: TAG_COLORS[tag]?.bg || '#EEE' }]}>
            <Text style={[styles.tagText, { color: TAG_COLORS[tag]?.text || '#666' }]}>{tag}</Text>
          </View>
        ))}
        <View style={styles.spiceTag}>
          <Text style={[styles.tagText, { color: scheme.textSecondary }]}>{SPICE[item.spiceLevel]}</Text>
        </View>
      </View>

      <View style={styles.voteRow}>
        <TouchableOpacity
          onPress={() => onVote(item.id, 'up')}
          style={[styles.voteBtn, item.userVote === 'up' && styles.voteBtnActive]}
        >
          <Text style={styles.voteIcon}>👍</Text>
          <Text style={[styles.voteCount, item.userVote === 'up' && { color: Colors.success }]}>{item.upvotes}</Text>
        </TouchableOpacity>

        <View style={[styles.netBadge, { backgroundColor: net >= 0 ? Colors.success + '20' : '#FF6B6B20' }]}>
          <Text style={[styles.netText, { color: net >= 0 ? Colors.success : '#E55' }]}>
            {net >= 0 ? '+' : ''}{net}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => onVote(item.id, 'down')}
          style={[styles.voteBtn, item.userVote === 'down' && styles.voteBtnActiveDown]}
        >
          <Text style={styles.voteCount}>{item.downvotes}</Text>
          <Text style={styles.voteIcon}>👎</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 16,
    marginHorizontal: 2,
    marginVertical: 6,
  },
  shadowLight: {
    shadowColor: '#233D4D',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  shadowDark: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  header: { flexDirection: 'row', gap: 12, marginBottom: 10 },
  emoji: { fontSize: 40 },
  titleArea: { flex: 1 },
  name: { fontSize: 16, fontWeight: '700', marginBottom: 3 },
  desc: { fontSize: 13, lineHeight: 18 },
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  tag: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  spiceTag: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: '#F5F5F5' },
  tagText: { fontSize: 11, fontWeight: '600' },
  voteRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  voteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#F5F7FA',
  },
  voteBtnActive: { backgroundColor: Colors.success + '20' },
  voteBtnActiveDown: { backgroundColor: '#FF6B6B20' },
  voteIcon: { fontSize: 16 },
  voteCount: { fontSize: 14, fontWeight: '600', color: '#6B7C93' },
  netBadge: { borderRadius: 10, paddingHorizontal: 12, paddingVertical: 4 },
  netText: { fontSize: 13, fontWeight: '700' },
});
