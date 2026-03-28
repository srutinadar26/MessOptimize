import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../constants/Colors';
import { useTheme } from '../context/ThemeContext';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  glass?: boolean;
  noPadding?: boolean;
}

export function Card({ children, style, glass = false, noPadding = false }: CardProps) {
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: glass ? (isDark ? 'rgba(42,42,42,0.85)' : 'rgba(255,255,255,0.85)') : scheme.card },
        !noPadding && styles.padding,
        isDark ? styles.shadowDark : styles.shadowLight,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  padding: {
    padding: 16,
  },
  shadowLight: {
    shadowColor: '#233D4D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  shadowDark: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 8,
  },
});
