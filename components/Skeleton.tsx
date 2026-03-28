import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { useTheme } from '../context/ThemeContext';

interface SkeletonCardProps {
  height?: number;
  style?: object;
}

export function SkeletonCard({ height = 100, style }: SkeletonCardProps) {
  const { isDark } = useTheme();
  return (
    <View
      style={[
        styles.card,
        { height, backgroundColor: isDark ? '#2F2F2F' : '#E8ECF0' },
        style,
      ]}
    />
  );
}

export function SkeletonRow() {
  const { isDark } = useTheme();
  const bg = isDark ? '#2F2F2F' : '#E8ECF0';
  return (
    <View style={styles.row}>
      <View style={[styles.circle, { backgroundColor: bg }]} />
      <View style={{ flex: 1, gap: 6 }}>
        <View style={[styles.line, { backgroundColor: bg, width: '70%' }]} />
        <View style={[styles.line, { backgroundColor: bg, width: '45%' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: 20, marginBottom: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, marginBottom: 8 },
  circle: { width: 44, height: 44, borderRadius: 22 },
  line: { height: 12, borderRadius: 6 },
});
