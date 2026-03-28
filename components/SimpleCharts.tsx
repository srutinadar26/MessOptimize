import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { useTheme } from '../context/ThemeContext';

// ── Bar Chart ──
interface BarChartProps {
  data: { label: string; value: number; color?: string }[];
  height?: number;
  showValues?: boolean;
}

export function BarChart({ data, height = 140, showValues = true }: BarChartProps) {
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;
  const maxVal = Math.max(...data.map(d => d.value), 1);

  return (
    <View style={[barStyles.container, { height }]}>
      <View style={barStyles.barsRow}>
        {data.map((item, i) => {
          const barH = (item.value / maxVal) * (height - 40);
          return (
            <View key={i} style={barStyles.barCol}>
              {showValues && (
                <Text style={[barStyles.barValue, { color: scheme.textSecondary }]}>{item.value}</Text>
              )}
              <View style={[barStyles.barTrack, { height: height - 40, backgroundColor: isDark ? '#333' : '#EEF1F5' }]}>
                <View
                  style={[
                    barStyles.barFill,
                    { height: barH, backgroundColor: item.color || Colors.primary },
                  ]}
                />
              </View>
              <Text style={[barStyles.barLabel, { color: scheme.textMuted }]} numberOfLines={1}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const barStyles = StyleSheet.create({
  container: { width: '100%' },
  barsRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-end', flex: 1 },
  barCol: { alignItems: 'center', flex: 1, gap: 4 },
  barValue: { fontSize: 11, fontWeight: '600' },
  barTrack: { width: 28, borderRadius: 8, justifyContent: 'flex-end', overflow: 'hidden' },
  barFill: { width: '100%', borderRadius: 8 },
  barLabel: { fontSize: 10, fontWeight: '500', textAlign: 'center' },
});

// ── Line Chart ──
interface LineChartProps {
  data: { label: string; value: number }[];
  height?: number;
  color?: string;
}

export function LineChart({ data, height = 120, color = Colors.info }: LineChartProps) {
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;
  const maxVal = Math.max(...data.map(d => d.value), 1);
  const minVal = Math.min(...data.map(d => d.value));
  const range = maxVal - minVal || 1;

  return (
    <View style={{ height, width: '100%' }}>
      {/* Grid lines */}
      <View style={lineStyles.gridContainer}>
        {[0, 1, 2, 3].map(i => (
          <View key={i} style={[lineStyles.gridLine, { backgroundColor: isDark ? '#333' : '#EEF1F5' }]} />
        ))}
      </View>

      {/* Data points and connections */}
      <View style={lineStyles.pointsRow}>
        {data.map((item, i) => {
          const normalizedY = ((item.value - minVal) / range) * (height - 50);
          return (
            <View key={i} style={lineStyles.pointCol}>
              <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                <Text style={[lineStyles.pointVal, { color: scheme.textSecondary }]}>{item.value}</Text>
                <View style={{ height: normalizedY, alignItems: 'center', justifyContent: 'flex-end' }}>
                  <View style={[lineStyles.point, { backgroundColor: color }]} />
                  <View style={[lineStyles.pointLine, { height: normalizedY - 8, backgroundColor: color + '30' }]} />
                </View>
              </View>
              <Text style={[lineStyles.pointLabel, { color: scheme.textMuted }]}>{item.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const lineStyles = StyleSheet.create({
  gridContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 20, justifyContent: 'space-between' },
  gridLine: { height: 1, width: '100%' },
  pointsRow: { flexDirection: 'row', flex: 1 },
  pointCol: { flex: 1, alignItems: 'center' },
  pointVal: { fontSize: 10, fontWeight: '600', marginBottom: 4 },
  point: { width: 10, height: 10, borderRadius: 5 },
  pointLine: { width: 3, borderRadius: 2 },
  pointLabel: { fontSize: 10, fontWeight: '500', marginTop: 4 },
});

// ── Donut / Pie Chart ──
interface PieChartProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export function DonutChart({ data, size = 160 }: PieChartProps) {
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;

  return (
    <View style={donutStyles.container}>
      {/* Ring segments using view-based approach */}
      <View style={[donutStyles.ring, { width: size, height: size }]}>
        {(() => {
          let currentAngle = 0;
          return data.map((item, i) => {
            const sweep = (item.value / total) * 360;
            const midAngle = currentAngle + sweep / 2;
            const startAngle = currentAngle;
            currentAngle += sweep;
            const pct = Math.round((item.value / total) * 100);

            return (
              <View
                key={i}
                style={[
                  donutStyles.segment,
                  {
                    width: size,
                    height: size,
                    transform: [{ rotate: `${startAngle}deg` }],
                  },
                ]}
              >
                <View
                  style={[
                    donutStyles.segmentHalf,
                    {
                      backgroundColor: item.color,
                      width: size / 2,
                      height: size,
                      borderTopLeftRadius: sweep > 180 ? size / 2 : 0,
                      borderBottomLeftRadius: sweep > 180 ? size / 2 : 0,
                      borderTopRightRadius: size / 2,
                      borderBottomRightRadius: size / 2,
                      transform: [{ rotate: `${Math.min(sweep, 180)}deg` }, { translateX: size / 4 }],
                      opacity: 0.85,
                    },
                  ]}
                />
              </View>
            );
          });
        })()}
        {/* Center hole */}
        <View style={[donutStyles.center, { width: size * 0.55, height: size * 0.55, backgroundColor: isDark ? Colors.dark.card : Colors.light.card }]}>
          <Text style={[donutStyles.centerVal, { color: scheme.text }]}>{total}</Text>
          <Text style={[donutStyles.centerLabel, { color: scheme.textMuted }]}>Total</Text>
        </View>
      </View>

      {/* Legend */}
      <View style={donutStyles.legend}>
        {data.map((item, i) => (
          <View key={i} style={donutStyles.legendItem}>
            <View style={[donutStyles.legendDot, { backgroundColor: item.color }]} />
            <Text style={[donutStyles.legendText, { color: scheme.textSecondary }]}>{item.label}</Text>
            <Text style={[donutStyles.legendVal, { color: scheme.text }]}>{Math.round((item.value / total) * 100)}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const donutStyles = StyleSheet.create({
  container: { alignItems: 'center', gap: 16 },
  ring: { position: 'relative', alignItems: 'center', justifyContent: 'center' },
  segment: { position: 'absolute', overflow: 'hidden' },
  segmentHalf: { position: 'absolute', left: 0, top: 0 },
  center: { position: 'absolute', borderRadius: 999, alignItems: 'center', justifyContent: 'center', zIndex: 10 },
  centerVal: { fontSize: 22, fontWeight: '800' },
  centerLabel: { fontSize: 11 },
  legend: { gap: 6, width: '100%' },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { flex: 1, fontSize: 13 },
  legendVal: { fontSize: 13, fontWeight: '700' },
});
