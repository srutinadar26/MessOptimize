import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { useTheme } from '../context/ThemeContext';

interface StatCardProps {
  emoji: string;
  label: string;
  value: string;
  color?: string;
  sublabel?: string;
}

export function StatCard({ emoji, label, value, color = Colors.primary, sublabel }: StatCardProps) {
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.card, { backgroundColor: scheme.card }, isDark ? styles.shadowDark : styles.shadowLight]}>
      <View style={[styles.iconBg, { backgroundColor: color + '18' }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
      <Text style={styles.value} numberOfLines={1}>{value}</Text>
      <Text style={[styles.label, { color: scheme.textSecondary }]} numberOfLines={1}>{label}</Text>
      {sublabel && <Text style={[styles.sublabel, { color: scheme.textMuted }]}>{sublabel}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 18,
    padding: 14,
    alignItems: 'flex-start',
    minWidth: 110,
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
    elevation: 5,
  },
  iconBg: { borderRadius: 12, padding: 8, marginBottom: 10 },
  emoji: { fontSize: 20 },
  value: { fontSize: 22, fontWeight: '800', color: Colors.primary, marginBottom: 2 },
  label: { fontSize: 12, fontWeight: '500', lineHeight: 16 },
  sublabel: { fontSize: 10, marginTop: 2 },
});
