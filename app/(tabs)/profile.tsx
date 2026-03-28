import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Colors } from '../../constants/Colors';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

const DIETARY_OPTIONS = ['Veg', 'Vegan', 'Non-Veg', 'Jain', 'Gluten-Free'];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { isDark, mode, setMode } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;
  const [dietary, setDietary] = useState<string[]>(['Veg']);
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);

  function toggleDietary(pref: string) {
    setDietary(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  }

  async function handleLogout() {
    Alert.alert('Logout', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  }

  const roleLabel = user?.role === 'student' ? '🎓 Student' : user?.role === 'staff' ? '👨‍🍳 Mess Staff' : '🤝 NGO Partner';

  return (
    <View style={[styles.root, { backgroundColor: scheme.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile header */}
        <LinearGradient
          colors={[Colors.primary, Colors.info]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.avatarLg}>
            <Text style={styles.avatarLgText}>
              {user?.role === 'staff' ? '👨‍🍳' : user?.role === 'ngo' ? '🤝' : '🎓'}
            </Text>
          </View>
          <Text style={styles.headerName}>{user?.name || 'User'}</Text>
          <Text style={styles.headerEmail}>{user?.email || ''}</Text>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>{roleLabel}</Text>
          </View>
        </LinearGradient>

        {/* Impact Stats */}
        {user?.role === 'student' && (
          <Card glass style={styles.impactCard}>
            <Text style={[styles.impactTitle, { color: scheme.text }]}>🌍 Your Impact</Text>
            <View style={styles.impactGrid}>
              {[
                { emoji: '🍛', val: `${user?.totalMealsSaved || 0}`, label: 'Meals Saved' },
                { emoji: '💰', val: `₹${user?.moneySaved || 0}`, label: 'Money Saved' },
                { emoji: '🌱', val: `${user?.co2Reduced || 0}kg`, label: 'CO₂ Cut' },
                { emoji: '🔥', val: `${user?.streak || 0}`, label: 'Day Streak' },
              ].map((stat, i) => (
                <View key={i} style={styles.impactItem}>
                  <Text style={styles.impactEmoji}>{stat.emoji}</Text>
                  <Text style={[styles.impactVal, { color: Colors.primary }]}>{stat.val}</Text>
                  <Text style={[styles.impactLabel, { color: scheme.textSecondary }]}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </Card>
        )}

        {/* User Info */}
        <Text style={[styles.sectionTitle, { color: scheme.text }]}>Account Info</Text>
        <Card style={styles.infoCard}>
          {[
            { icon: '👤', label: 'Name', value: user?.name || '-' },
            { icon: '✉️', label: 'Email', value: user?.email || '-' },
            { icon: '🏫', label: 'Hostel', value: user?.hostelName || 'Not set' },
            { icon: '🚪', label: 'Room', value: user?.roomNumber || 'Not set' },
          ].map((item, i) => (
            <View key={i} style={[styles.infoRow, i > 0 && { borderTopWidth: 1, borderTopColor: scheme.border }]}>
              <Text style={styles.infoIcon}>{item.icon}</Text>
              <Text style={[styles.infoLabel, { color: scheme.textSecondary }]}>{item.label}</Text>
              <Text style={[styles.infoValue, { color: scheme.text }]}>{item.value}</Text>
            </View>
          ))}
        </Card>

        {/* Theme */}
        <Text style={[styles.sectionTitle, { color: scheme.text }]}>Appearance</Text>
        <Card style={styles.themeCard}>
          {(['light', 'dark', 'system'] as const).map((m, i) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMode(m)}
              style={[
                styles.themeOption,
                i > 0 && { borderTopWidth: 1, borderTopColor: scheme.border },
              ]}
            >
              <Text style={styles.themeEmoji}>
                {m === 'light' ? '☀️' : m === 'dark' ? '🌙' : '📱'}
              </Text>
              <Text style={[styles.themeLabel, { color: scheme.text }]}>
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </Text>
              <View style={[styles.radio, mode === m && styles.radioActive]}>
                {mode === m && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Dietary Preferences */}
        <Text style={[styles.sectionTitle, { color: scheme.text }]}>Dietary Preferences</Text>
        <Card style={{ marginHorizontal: 20 }}>
          <View style={styles.dietaryGrid}>
            {DIETARY_OPTIONS.map(pref => {
              const selected = dietary.includes(pref);
              return (
                <TouchableOpacity
                  key={pref}
                  onPress={() => toggleDietary(pref)}
                  style={[
                    styles.dietaryChip,
                    {
                      backgroundColor: selected ? Colors.success + '20' : scheme.inputBg,
                      borderColor: selected ? Colors.success : scheme.border,
                    },
                  ]}
                >
                  <Text style={[styles.dietaryText, { color: selected ? Colors.success : scheme.textSecondary }]}>
                    {pref === 'Veg' ? '🥬' : pref === 'Vegan' ? '🌱' : pref === 'Non-Veg' ? '🍗' : pref === 'Jain' ? '🙏' : '🌾'} {pref}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Card>

        {/* Settings */}
        <Text style={[styles.sectionTitle, { color: scheme.text }]}>Settings</Text>
        <Card style={{ marginHorizontal: 20 }}>
          <View style={styles.settingRow}>
            <Text style={styles.settingIcon}>🔔</Text>
            <Text style={[styles.settingLabel, { color: scheme.text }]}>Notifications</Text>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: '#CCC', true: Colors.success + '60' }}
              thumbColor={notifications ? Colors.success : '#F4F4F4'}
            />
          </View>
          <View style={[styles.settingRow, { borderTopWidth: 1, borderTopColor: scheme.border }]}>
            <Text style={styles.settingIcon}>📶</Text>
            <Text style={[styles.settingLabel, { color: scheme.text }]}>Offline Mode</Text>
            <Switch
              value={offlineMode}
              onValueChange={setOfflineMode}
              trackColor={{ false: '#CCC', true: Colors.info + '60' }}
              thumbColor={offlineMode ? Colors.info : '#F4F4F4'}
            />
          </View>
        </Card>

        {/* Analytics Link */}
        <Text style={[styles.sectionTitle, { color: scheme.text }]}>Insights</Text>
        <TouchableOpacity
          onPress={() => router.push('/analytics')}
          style={[styles.analyticsBtn, { backgroundColor: isDark ? Colors.dark.card : Colors.light.card, borderColor: scheme.border }]}
        >
          <View style={[styles.analyticsBtnIcon, { backgroundColor: Colors.info + '20' }]}>
            <Text style={{ fontSize: 22 }}>📊</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.analyticsBtnTitle, { color: scheme.text }]}>Analytics Dashboard</Text>
            <Text style={[styles.analyticsBtnSub, { color: scheme.textSecondary }]}>Charts, impact metrics, bill calculator</Text>
          </View>
          <Text style={[{ color: scheme.textMuted, fontSize: 18 }]}>→</Text>
        </TouchableOpacity>

        {/* About */}
        <Text style={[styles.sectionTitle, { color: scheme.text }]}>About</Text>
        <Card style={styles.aboutCard}>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutIcon}>ℹ️</Text>
            <Text style={[styles.aboutLabel, { color: scheme.text }]}>Version</Text>
            <Text style={[styles.aboutValue, { color: scheme.textMuted }]}>1.0.0</Text>
          </View>
          <View style={[styles.aboutRow, { borderTopWidth: 1, borderTopColor: scheme.border }]}>
            <Text style={styles.aboutIcon}>📄</Text>
            <Text style={[styles.aboutLabel, { color: scheme.text }]}>Privacy Policy</Text>
            <Text style={[styles.aboutValue, { color: scheme.textMuted }]}>→</Text>
          </View>
          <View style={[styles.aboutRow, { borderTopWidth: 1, borderTopColor: scheme.border }]}>
            <Text style={styles.aboutIcon}>📜</Text>
            <Text style={[styles.aboutLabel, { color: scheme.text }]}>Terms of Service</Text>
            <Text style={[styles.aboutValue, { color: scheme.textMuted }]}>→</Text>
          </View>
        </Card>

        {/* Logout */}
        <Button
          title="Sign Out"
          variant="outline"
          icon="👋"
          size="lg"
          onPress={handleLogout}
          style={styles.logoutBtn}
        />

        <Text style={[styles.footer, { color: scheme.textMuted }]}>
          Made with 💚 for a waste-free campus
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scrollContent: { paddingBottom: 32 },

  // Header
  headerGradient: {
    paddingTop: 64,
    paddingBottom: 32,
    alignItems: 'center',
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 16,
  },
  avatarLg: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarLgText: { fontSize: 36 },
  headerName: { fontSize: 22, fontWeight: '800', color: '#FFF', marginBottom: 2 },
  headerEmail: { fontSize: 14, color: 'rgba(255,255,255,0.7)', marginBottom: 10 },
  headerBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },
  headerBadgeText: { fontSize: 12, fontWeight: '600', color: '#FFF' },

  sectionTitle: { fontSize: 17, fontWeight: '700', marginTop: 20, marginBottom: 10, paddingHorizontal: 20 },

  // Impact
  impactCard: { marginHorizontal: 20 },
  impactTitle: { fontSize: 15, fontWeight: '700', marginBottom: 14 },
  impactGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  impactItem: { width: '47%', alignItems: 'center', paddingVertical: 12, borderRadius: 14, backgroundColor: 'rgba(0,0,0,0.03)' },
  impactEmoji: { fontSize: 22, marginBottom: 4 },
  impactVal: { fontSize: 20, fontWeight: '800' },
  impactLabel: { fontSize: 11, marginTop: 2 },

  // Info
  infoCard: { marginHorizontal: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  infoIcon: { fontSize: 18 },
  infoLabel: { fontSize: 13, fontWeight: '500', width: 60 },
  infoValue: { flex: 1, fontSize: 14, fontWeight: '600', textAlign: 'right' },

  // Theme
  themeCard: { marginHorizontal: 20 },
  themeOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  themeEmoji: { fontSize: 18 },
  themeLabel: { flex: 1, fontSize: 15, fontWeight: '500' },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CCC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: Colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },

  // Dietary
  dietaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dietaryChip: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
  },
  dietaryText: { fontSize: 13, fontWeight: '600' },

  // Settings
  settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  settingIcon: { fontSize: 18 },
  settingLabel: { flex: 1, fontSize: 15, fontWeight: '500' },

  // About
  aboutCard: { marginHorizontal: 20 },
  aboutRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, gap: 12 },
  aboutIcon: { fontSize: 18 },
  aboutLabel: { flex: 1, fontSize: 14, fontWeight: '500' },
  aboutValue: { fontSize: 13 },

  logoutBtn: { marginHorizontal: 20, marginTop: 28, width: 'auto' },
  footer: { textAlign: 'center', fontSize: 12, marginTop: 20, marginBottom: 12 },

  // Analytics
  analyticsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    marginHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1,
  },
  analyticsBtnIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  analyticsBtnTitle: { fontSize: 15, fontWeight: '700' },
  analyticsBtnSub: { fontSize: 12, marginTop: 2 },
});
