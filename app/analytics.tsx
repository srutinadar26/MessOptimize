import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Colors } from '../constants/Colors';
import { Card } from '../components/Card';
import { StatCard } from '../components/StatCard';
import { Button } from '../components/Button';
import { BarChart, LineChart, DonutChart } from '../components/SimpleCharts';
import { ANALYTICS_DATA } from '../constants/analyticsData';
import { generateAndDownloadPDF } from '../utils/pdfGenerator';

export default function AnalyticsScreen() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;
  const data = ANALYTICS_DATA;
  const [downloading, setDownloading] = useState(false);

  const [monthlyFee, setMonthlyFee] = useState('3500');
  const savings = user?.moneySaved || data.moneySaved;
  const yearlyProjection = savings * 12;

  // ✅ REAL PDF DOWNLOAD FUNCTION
  async function handleDownloadPDF() {
    setDownloading(true);
    try {
      const result = await generateAndDownloadPDF({
        wasteReduced: data.wasteReduced,
        moneySaved: data.moneySaved,
        co2Reduced: data.co2Reduced,
        peopleFed: data.peopleFed,
        weeklyWaste: data.weeklyWaste,
        userName: user?.name || 'Student',
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        }),
      });
      
      if (result.success) {
        Alert.alert('Success', 'Report downloaded successfully!');
      } else {
        Alert.alert('Error', result.error || 'Failed to generate report');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setDownloading(false);
    }
  }

  function handleShareWhatsApp() {
    const msg = `📊 MessOptimize Weekly Report\n\n🗑 Waste Reduced: ${data.wasteReduced}kg\n💰 Money Saved: ₹${data.moneySaved.toLocaleString()}\n🌱 CO₂ Reduced: ${data.co2Reduced}kg\n👨‍👩‍👧‍👦 People Fed: ${data.peopleFed}\n\n🌍 Environmental Impact:\n🌳 Trees Saved: ${data.environmentalImpact.treesSaved}\n💧 Water Saved: ${data.environmentalImpact.waterSaved}L\n\nGenerated via MessOptimize ♻️`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    Linking.openURL(url).catch(() => Alert.alert('Cannot open WhatsApp'));
  }

  return (
    <View style={[styles.root, { backgroundColor: scheme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={[styles.title, { color: scheme.text }]}>📊 Analytics</Text>
          <View style={{ width: 60 }} />
        </View>
        <Text style={[styles.subtitle, { color: scheme.textSecondary }]}>
          Your campus food waste impact dashboard
        </Text>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <StatCard emoji="🗑" label="Waste Reduced" value={`${data.wasteReduced}kg`} color={Colors.secondary} sublabel="this month" />
          <StatCard emoji="💰" label="Money Saved" value={`₹${data.moneySaved.toLocaleString()}`} color={Colors.accent} sublabel="campus-wide" />
        </View>
        <View style={styles.metricsGrid}>
          <StatCard emoji="🌱" label="CO₂ Reduced" value={`${data.co2Reduced}kg`} color={Colors.info} sublabel="emissions cut" />
          <StatCard emoji="👨‍👩‍👧‍👦" label="People Fed" value={`${data.peopleFed}`} color={Colors.success} sublabel="via surplus food" />
        </View>

        {/* Weekly Waste Line Chart */}
        <Text style={[styles.sectionTitle, { color: scheme.text }]}>📈 Weekly Waste Reduction</Text>
        <Card glass>
          <LineChart data={data.weeklyWaste} color={Colors.info} height={130} />
          <Text style={[styles.chartNote, { color: scheme.textMuted }]}>
            Waste in kg per day · Lower is better
          </Text>
        </Card>

        {/* Meal Type Bar Chart */}
        <Text style={[styles.sectionTitle, { color: scheme.text }]}>🍽 Waste by Meal Type</Text>
        <Card glass>
          <BarChart data={data.mealTypeWaste} height={150} />
          <Text style={[styles.chartNote, { color: scheme.textMuted }]}>
            Lunch generates the most waste — consider portion control
          </Text>
        </Card>

        {/* Category Donut */}
        <Text style={[styles.sectionTitle, { color: scheme.text }]}>🥧 Waste by Category</Text>
        <Card glass>
          <DonutChart data={data.categoryData} size={140} />
        </Card>

        {/* Environmental Impact */}
        <Text style={[styles.sectionTitle, { color: scheme.text }]}>🌍 Environmental Impact</Text>
        <LinearGradient
          colors={[Colors.info + '20', Colors.success + '15']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.envCard}
        >
          <View style={styles.envGrid}>
            <View style={styles.envItem}>
              <Text style={styles.envEmoji}>🌳</Text>
              <Text style={[styles.envVal, { color: Colors.success }]}>{data.environmentalImpact.treesSaved}</Text>
              <Text style={[styles.envLabel, { color: scheme.textSecondary }]}>Trees Saved</Text>
            </View>
            <View style={styles.envItem}>
              <Text style={styles.envEmoji}>💧</Text>
              <Text style={[styles.envVal, { color: Colors.info }]}>{data.environmentalImpact.waterSaved.toLocaleString()}L</Text>
              <Text style={[styles.envLabel, { color: scheme.textSecondary }]}>Water Saved</Text>
            </View>
            <View style={styles.envItem}>
              <Text style={styles.envEmoji}>☁️</Text>
              <Text style={[styles.envVal, { color: Colors.primary }]}>{data.environmentalImpact.carbonOffset}kg</Text>
              <Text style={[styles.envLabel, { color: scheme.textSecondary }]}>Carbon Offset</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Mess Bill Calculator */}
        <Text style={[styles.sectionTitle, { color: scheme.text }]}>🧮 Mess Bill Calculator</Text>
        <Card glass>
          <Text style={[styles.calcLabel, { color: scheme.textSecondary }]}>Monthly Mess Fee</Text>
          <View style={[styles.calcInput, { backgroundColor: scheme.inputBg, borderColor: scheme.border }]}>
            <Text style={styles.calcPrefix}>₹</Text>
            <TextInput
              style={[styles.calcField, { color: scheme.text }]}
              value={monthlyFee}
              onChangeText={setMonthlyFee}
              keyboardType="numeric"
              placeholder="3500"
              placeholderTextColor={scheme.textMuted}
            />
          </View>
          <View style={styles.calcResults}>
            <View style={[styles.calcRow, { borderBottomColor: scheme.border }]}>
              <Text style={[styles.calcRowLabel, { color: scheme.textSecondary }]}>Monthly Savings</Text>
              <Text style={[styles.calcRowVal, { color: Colors.success }]}>₹{savings.toLocaleString()}</Text>
            </View>
            <View style={[styles.calcRow, { borderBottomColor: scheme.border }]}>
              <Text style={[styles.calcRowLabel, { color: scheme.textSecondary }]}>Effective Bill</Text>
              <Text style={[styles.calcRowVal, { color: scheme.text }]}>₹{Math.max(0, Number(monthlyFee) - savings).toLocaleString()}</Text>
            </View>
            <View style={styles.calcRow}>
              <Text style={[styles.calcRowLabel, { color: scheme.textSecondary }]}>Yearly Projection</Text>
              <Text style={[styles.calcRowVal, { color: Colors.accent }]}>₹{yearlyProjection.toLocaleString()} saved</Text>
            </View>
          </View>
        </Card>

        {/* Export Buttons */}
        <Text style={[styles.sectionTitle, { color: scheme.text }]}>📤 Export & Share</Text>
        <View style={styles.exportRow}>
          <Button
            title={downloading ? "Generating..." : "📄 Download PDF"}
            variant="primary"
            size="md"
            onPress={handleDownloadPDF}
            disabled={downloading}
            style={{ flex: 1 }}
          />
          <Button
            title="📱 WhatsApp"
            variant="secondary"
            size="md"
            onPress={handleShareWhatsApp}
            style={{ flex: 1 }}
          />
        </View>
        
        {/* Loading indicator if needed */}
        {downloading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={[styles.loadingText, { color: scheme.text }]}>Generating PDF...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 56, paddingBottom: 32 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  backBtn: { paddingVertical: 8, paddingRight: 16 },
  backText: { fontSize: 16, fontWeight: '600', color: Colors.primary },
  title: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, marginBottom: 20, textAlign: 'center' },

  metricsGrid: { flexDirection: 'row', gap: 12, marginBottom: 10 },

  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 24, marginBottom: 12 },
  chartNote: { fontSize: 11, marginTop: 10, fontStyle: 'italic' },

  envCard: { borderRadius: 20, padding: 20 },
  envGrid: { flexDirection: 'row', justifyContent: 'space-around' },
  envItem: { alignItems: 'center', gap: 4 },
  envEmoji: { fontSize: 28 },
  envVal: { fontSize: 20, fontWeight: '800' },
  envLabel: { fontSize: 11 },

  calcLabel: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  calcInput: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 10, gap: 4, marginBottom: 16 },
  calcPrefix: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  calcField: { flex: 1, fontSize: 18, fontWeight: '600' },
  calcResults: { gap: 0 },
  calcRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1 },
  calcRowLabel: { fontSize: 14, fontWeight: '500' },
  calcRowVal: { fontSize: 16, fontWeight: '700' },

  exportRow: { flexDirection: 'row', gap: 12 },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  loadingText: { marginTop: 12, fontSize: 14 },
});