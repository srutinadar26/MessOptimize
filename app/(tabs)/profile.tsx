import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Switch,
  Modal,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useAttendance } from '../../context/AttendanceContext';
import { useTheme } from '../../context/ThemeContext';
import { Colors } from '../../constants/Colors';
import { Card } from '../../components/Card';
import * as Location from 'expo-location';
import { Buffer } from 'buffer';

const DIETARY_OPTIONS = ['Veg', 'Vegan', 'Non-Veg', 'Jain', 'Gluten-Free'];

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { markMeal, getTodayAttendance, getStreak, getMealsMarkedThisWeek } = useAttendance();
  const { isDark, mode, setMode } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;
  const [dietary, setDietary] = useState<string[]>(['Veg']);
  const [notifications, setNotifications] = useState(true);
  const [offlineMode, setOfflineMode] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Attendance state
  const [showQRModal, setShowQRModal] = useState(false);
  const [generatedQR, setGeneratedQR] = useState('');
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const [todayMeals, setTodayMeals] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

  // Load today's attendance
  const loadTodayAttendance = () => {
    const todayAttendance = getTodayAttendance();
    if (todayAttendance) {
      setTodayMeals({
        breakfast: todayAttendance.breakfast?.status || false,
        lunch: todayAttendance.lunch?.status || false,
        dinner: todayAttendance.dinner?.status || false,
      });
    }
  };

  useEffect(() => {
    loadTodayAttendance();
  }, []);

  const generateQRForMeal = (meal: string) => {
    const data = {
      meal,
      date: new Date().toISOString().split('T')[0],
      userId: user?.id,
      timestamp: Date.now(),
    };
    return Buffer.from(JSON.stringify(data)).toString('base64');
  };

  // ✅ HANDLE MARK ATTENDANCE WITH DEBUG LOGS
  const handleMarkAttendance = async (method: 'gps' | 'qr' | 'otp', code?: string) => {
    console.log(`🎯 handleMarkAttendance called - Method: ${method}, Meal: ${selectedMeal}`);
    setAttendanceLoading(true);
    try {
      let result;
      if (method === 'gps') {
        console.log('📍 Requesting location permission...');
        const { status } = await Location.requestForegroundPermissionsAsync();
        console.log('📍 Location permission status:', status);
        if (status !== 'granted') {
          Alert.alert('Permission Denied', 'Location permission is required to mark attendance');
          setAttendanceLoading(false);
          return;
        }
        console.log('📍 Calling markMeal with "self" method...');
        result = await markMeal(selectedMeal, 'self');
      } else if (method === 'qr') {
        result = await markMeal(selectedMeal, 'qr', code);
      } else {
        result = await markMeal(selectedMeal, 'otp', code);
      }

      console.log('📝 Mark meal result:', result);

      if (result.success) {
        loadTodayAttendance();
        Alert.alert('Success', `${selectedMeal.charAt(0).toUpperCase() + selectedMeal.slice(1)} marked successfully!`);
        setShowQRModal(false);
      } else {
        Alert.alert('Failed', result.error || 'Could not mark attendance');
      }
    } catch (error: any) {
      console.error('❌ Error in handleMarkAttendance:', error);
      Alert.alert('Error', error.message || 'Something went wrong');
    } finally {
      setAttendanceLoading(false);
    }
  };

  const showVerificationOptions = () => {
    Alert.alert(
      'Verify Attendance',
      `How would you like to mark ${selectedMeal}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: '📍 GPS Location',
          onPress: () => handleMarkAttendance('gps'),
        },
        {
          text: '📱 QR Code',
          onPress: () => {
            const qr = generateQRForMeal(selectedMeal);
            setGeneratedQR(qr);
            setShowQRModal(true);
          },
        },
      
      ]
    );
  };

  const showMealSelection = () => {
    console.log('🍽️ Showing meal selection');
    Alert.alert(
      'Select Meal',
      'Which meal would you like to mark?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: `Breakfast ${todayMeals.breakfast ? '✓' : ''}`,
          onPress: () => {
            if (todayMeals.breakfast) {
              Alert.alert('Already Marked', 'Breakfast has already been marked today');
              return;
            }
            setSelectedMeal('breakfast');
            showVerificationOptions();
          },
        },
        {
          text: `Lunch ${todayMeals.lunch ? '✓' : ''}`,
          onPress: () => {
            if (todayMeals.lunch) {
              Alert.alert('Already Marked', 'Lunch has already been marked today');
              return;
            }
            setSelectedMeal('lunch');
            showVerificationOptions();
          },
        },
        {
          text: `Dinner ${todayMeals.dinner ? '✓' : ''}`,
          onPress: () => {
            if (todayMeals.dinner) {
              Alert.alert('Already Marked', 'Dinner has already been marked today');
              return;
            }
            setSelectedMeal('dinner');
            showVerificationOptions();
          },
        },
      ]
    );
  };

  function toggleDietary(pref: string) {
    setDietary(prev =>
      prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      setShowLogoutModal(false);
      router.replace('/(auth)/login');
    } catch (error) {
      Alert.alert('Logout Failed', 'Please try again');
    }
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const currentStreak = getStreak();
  const mealsThisWeek = getMealsMarkedThisWeek();
  const roleLabel = user?.role === 'student' ? '🎓 Student' : user?.role === 'staff' ? '👨‍🍳 Mess Staff' : '🤝 NGO Partner';

  if (!user) {
    return (
      <View style={[styles.root, { backgroundColor: scheme.background }]}>
        <Text style={[styles.text, { color: scheme.text }]}>Please log in</Text>
        <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/(auth)/login')}>
          <Text style={styles.loginButtonText}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

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

        {/* ✅ MARK ATTENDANCE BUTTON */}
        <View style={styles.attendanceButtonContainer}>
          <TouchableOpacity
            style={styles.markAttendanceButton}
            onPress={showMealSelection}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={[Colors.primary, Colors.info]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.markAttendanceGradient}
            >
              <Text style={styles.markAttendanceIcon}>📍</Text>
              <Text style={styles.markAttendanceText}>Mark Attendance</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Streak Preview */}
        <Card style={styles.streakPreviewCard}>
          <View style={styles.streakPreviewRow}>
            <View style={styles.streakPreviewItem}>
              <Text style={styles.streakPreviewEmoji}>🔥</Text>
              <Text style={[styles.streakPreviewNumber, { color: Colors.primary }]}>{currentStreak}</Text>
              <Text style={[styles.streakPreviewLabel, { color: scheme.textMuted }]}>Day Streak</Text>
            </View>
            <View style={styles.streakPreviewDivider} />
            <View style={styles.streakPreviewItem}>
              <Text style={styles.streakPreviewEmoji}>🍽️</Text>
              <Text style={[styles.streakPreviewNumber, { color: Colors.success }]}>{mealsThisWeek}</Text>
              <Text style={[styles.streakPreviewLabel, { color: scheme.textMuted }]}>Meals This Week</Text>
            </View>
          </View>
        </Card>

        {/* Theme */}
        <Text style={[styles.sectionTitle, { color: scheme.text }]}>Appearance</Text>
        <Card style={styles.themeCard}>
          {(['light', 'dark', 'system'] as const).map((m, i) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMode(m)}
              style={[styles.themeOption, i > 0 && { borderTopWidth: 1, borderTopColor: scheme.border }]}
            >
              <Text style={styles.themeEmoji}>{m === 'light' ? '☀️' : m === 'dark' ? '🌙' : '📱'}</Text>
              <Text style={[styles.themeLabel, { color: scheme.text }]}>{m.charAt(0).toUpperCase() + m.slice(1)}</Text>
              <View style={[styles.radio, mode === m && styles.radioActive]}>{mode === m && <View style={styles.radioDot} />}</View>
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

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout} activeOpacity={0.85}>
          <LinearGradient colors={['#FEF2F2', '#FEE2E2']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.logoutGradient}>
            <View style={styles.logoutContent}>
              <View style={styles.logoutIconContainer}><Text style={styles.logoutIcon}>👋</Text></View>
              <View style={styles.logoutTextContainer}>
                <Text style={styles.logoutTitle}>Sign Out</Text>
                <Text style={styles.logoutSubtitle}>Log out of your account</Text>
              </View>
              <Text style={styles.logoutArrow}>→</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <Text style={[styles.footer, { color: scheme.textMuted }]}>Made with 💚 for a waste-free campus</Text>
      </ScrollView>

      {/* QR Code Modal */}
      <Modal visible={showQRModal} transparent animationType="slide" onRequestClose={() => setShowQRModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: scheme.card }]}>
            <Text style={[styles.modalTitle, { color: scheme.text }]}>Scan QR Code</Text>
            <Text style={[styles.modalText, { color: scheme.textSecondary }]}>Show this QR code to the mess staff to verify your attendance</Text>
            <View style={styles.qrCodeContainer}>
              <Text style={styles.qrCodeText}>{generatedQR}</Text>
            </View>
            <Text style={[styles.qrHint, { color: scheme.textMuted }]}>QR Code for {selectedMeal}</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowQRModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.submitButton]}
                onPress={() => {
                  setShowQRModal(false);
                  handleMarkAttendance('qr', generatedQR);
                }}
              >
                <Text style={styles.submitButtonText}>Mark with QR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Loading Modal */}
      <Modal visible={attendanceLoading} transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.loadingContent, { backgroundColor: scheme.card }]}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={[styles.loadingText, { color: scheme.text }]}>Verifying attendance...</Text>
          </View>
        </View>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal visible={showLogoutModal} transparent animationType="fade" onRequestClose={() => setShowLogoutModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: scheme.card }]}>
            <View style={styles.modalIconContainer}><Text style={styles.modalIcon}>👋</Text></View>
            <Text style={[styles.modalTitle, { color: scheme.text }]}>Sign Out?</Text>
            <Text style={[styles.modalText, { color: scheme.textSecondary }]}>Are you sure you want to sign out?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalButton, styles.cancelButton]} onPress={() => setShowLogoutModal(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalButton, styles.confirmButton]} onPress={handleLogout}>
                <Text style={styles.confirmButtonText}>Sign Out</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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

  // Attendance Button
  attendanceButtonContainer: { paddingHorizontal: 20, marginTop: 16, marginBottom: 8 },
  markAttendanceButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  markAttendanceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  markAttendanceIcon: { fontSize: 24 },
  markAttendanceText: { fontSize: 18, fontWeight: '700', color: '#FFF' },

  // Streak Preview
  streakPreviewCard: { marginHorizontal: 20, marginBottom: 16, padding: 16 },
  streakPreviewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  streakPreviewItem: { flex: 1, alignItems: 'center' },
  streakPreviewDivider: { width: 1, height: 40, backgroundColor: '#E5E7EB' },
  streakPreviewEmoji: { fontSize: 28 },
  streakPreviewNumber: { fontSize: 24, fontWeight: '800', marginVertical: 4 },
  streakPreviewLabel: { fontSize: 12 },

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
  radio: { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: '#CCC', alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: Colors.primary },
  radioDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },

  // Dietary
  dietaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  dietaryChip: { borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1 },
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

  // Analytics
  analyticsBtn: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, marginHorizontal: 20, borderRadius: 18, borderWidth: 1 },
  analyticsBtnIcon: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  analyticsBtnTitle: { fontSize: 15, fontWeight: '700' },
  analyticsBtnSub: { fontSize: 12, marginTop: 2 },

  // Logout Button
  logoutButton: { marginHorizontal: 20, marginTop: 28, marginBottom: 12, borderRadius: 16, overflow: 'hidden', shadowColor: '#DC2626', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4 },
  logoutGradient: { borderRadius: 16, padding: 16 },
  logoutContent: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  logoutIconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#DC2626', alignItems: 'center', justifyContent: 'center' },
  logoutIcon: { fontSize: 24 },
  logoutTextContainer: { flex: 1 },
  logoutTitle: { fontSize: 16, fontWeight: '700', color: '#DC2626', marginBottom: 2 },
  logoutSubtitle: { fontSize: 12, color: '#9CA3AF' },
  logoutArrow: { fontSize: 20, color: '#DC2626', fontWeight: '600' },
  footer: { textAlign: 'center', fontSize: 12, marginTop: 20, marginBottom: 12 },

  // QR Code Modal
  qrCodeContainer: { backgroundColor: '#FFF', padding: 20, borderRadius: 12, marginVertical: 16, alignItems: 'center' },
  qrCodeText: { fontSize: 12, fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', textAlign: 'center' },
  qrHint: { fontSize: 12, marginBottom: 16 },

  // Loading Modal
  loadingContent: { width: '70%', borderRadius: 24, padding: 32, alignItems: 'center', gap: 16 },
  loadingText: { fontSize: 16, fontWeight: '500' },

  // General Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', borderRadius: 24, padding: 24, alignItems: 'center' },
  modalIconContainer: { width: 64, height: 64, borderRadius: 32, backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  modalIcon: { fontSize: 32 },
  modalTitle: { fontSize: 22, fontWeight: '700', marginBottom: 8 },
  modalText: { fontSize: 14, textAlign: 'center', marginBottom: 24, lineHeight: 20 },
  modalButtons: { flexDirection: 'row', gap: 12, width: '100%' },
  modalButton: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  cancelButton: { backgroundColor: '#F3F4F6' },
  cancelButtonText: { color: '#6B7280', fontWeight: '600', fontSize: 15 },
  confirmButton: { backgroundColor: '#DC2626' },
  confirmButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },
  submitButton: { backgroundColor: Colors.primary },
  submitButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 15 },

  // Login fallback
  text: { fontSize: 16, textAlign: 'center', marginTop: 40 },
  loginButton: { backgroundColor: Colors.primary, marginHorizontal: 20, marginTop: 20, padding: 14, borderRadius: 12, alignItems: 'center' },
  loginButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
});