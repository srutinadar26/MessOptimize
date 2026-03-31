import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { router, Link } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Colors } from '../../constants/Colors';
import { Button } from '../../components/Button';
import { UserRole } from '../../constants/types';

const ROLES: { id: UserRole; label: string; emoji: string; desc: string }[] = [
  { id: 'student', label: 'Student', emoji: '🎓', desc: 'Mark meals & track savings' },
  { id: 'staff', label: 'Mess Staff', emoji: '👨‍🍳', desc: 'Manage quantities & reports' },
  { id: 'ngo', label: 'NGO Partner', emoji: '🤝', desc: 'Claim surplus food' },
];

export default function LoginScreen() {
  const { login, loginWithGoogle } = useAuth();
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Please enter email and password');
      return;
    }
    setLoading(true);
    try {
      const result = await login(email, password, role);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', result.error || 'Please check your credentials');
      }
    } catch (e: any) {
      Alert.alert('Login Failed', e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    try {
      const result = await loginWithGoogle(role);
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Google Sign-In Failed', result.error || 'Please try again');
      }
    } catch (error: any) {
      Alert.alert('Google Sign-In Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: scheme.background }]}>
      {/* Header gradient */}
      <LinearGradient
        colors={[Colors.primary, Colors.info]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>♻️</Text>
          <Text style={styles.logoTitle}>MessOptimize</Text>
          <Text style={styles.logoSub}>Feed more. Waste less.</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionTitle, { color: scheme.text }]}>Welcome back 👋</Text>
          <Text style={[styles.sectionSub, { color: scheme.textSecondary }]}>Sign in to your account</Text>

          {/* Role selector */}
          <View style={styles.rolesRow}>
            {ROLES.map(r => (
              <TouchableOpacity
                key={r.id}
                onPress={() => setRole(r.id)}
                style={[
                  styles.roleCard,
                  { backgroundColor: scheme.card, borderColor: role === r.id ? Colors.primary : scheme.border },
                  role === r.id && styles.roleCardActive,
                ]}
              >
                <Text style={styles.roleEmoji}>{r.emoji}</Text>
                <Text style={[styles.roleLabel, { color: role === r.id ? Colors.primary : scheme.text }]}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={[styles.roleDesc, { color: scheme.textSecondary }]}>
            {ROLES.find(r => r.id === role)?.desc}
          </Text>

          {/* Email */}
          <Text style={[styles.inputLabel, { color: scheme.textSecondary }]}>Email</Text>
          <View style={[styles.inputWrap, { backgroundColor: scheme.inputBg, borderColor: scheme.border }]}>
            <Text style={styles.inputIcon}>✉️</Text>
            <TextInput
              style={[styles.input, { color: scheme.text }]}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              placeholder="you@example.com"
              placeholderTextColor={scheme.textMuted}
            />
          </View>

          {/* Password */}
          <Text style={[styles.inputLabel, { color: scheme.textSecondary }]}>Password</Text>
          <View style={[styles.inputWrap, { backgroundColor: scheme.inputBg, borderColor: scheme.border }]}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={[styles.input, { color: scheme.text }]}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              placeholder="••••••••"
              placeholderTextColor={scheme.textMuted}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View><br></br>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            size="lg"
            style={styles.loginBtn}
          />

          <View style={styles.dividerRow}>
            <View style={[styles.divider, { backgroundColor: scheme.border }]} />
            <Text style={[styles.dividerText, { color: scheme.textMuted }]}>or</Text>
            <View style={[styles.divider, { backgroundColor: scheme.border }]} />
          </View>

          <View style={styles.signupRow}>
            <Text style={[styles.signupText, { color: scheme.textSecondary }]}>Don't have an account? </Text>
            <Link href="/(auth)/signup" asChild>
              <TouchableOpacity>
                <Text style={styles.signupLink}>Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoContainer: { alignItems: 'center' },
  logoEmoji: { fontSize: 48, marginBottom: 8 },
  logoTitle: { fontSize: 28, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 },
  logoSub: { fontSize: 15, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
  scrollContent: { padding: 24, paddingBottom: 48 },
  sectionTitle: { fontSize: 24, fontWeight: '800', marginTop: 8, marginBottom: 4 },
  sectionSub: { fontSize: 15, marginBottom: 20 },
  rolesRow: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  roleCard: {
    flex: 1,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1.5,
  },
  roleCardActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + '10' },
  roleEmoji: { fontSize: 24, marginBottom: 4 },
  roleLabel: { fontSize: 12, fontWeight: '700' },
  roleDesc: { fontSize: 12, marginBottom: 20, textAlign: 'center' },
  inputLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 10 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
    marginBottom: 4,
  },
  inputIcon: { fontSize: 16 },
  input: { flex: 1, fontSize: 15, fontWeight: '500' },
  eyeIcon: { fontSize: 16 },
  demoHint: {
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    marginBottom: 20,
  },
  hintText: { fontSize: 11, lineHeight: 15 },
  loginBtn: { width: '100%', marginBottom: 20 },
  dividerRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  divider: { flex: 1, height: 1 },
  dividerText: { fontSize: 13 },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 24,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primary + '10',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: { fontSize: 16, fontWeight: '800', color: Colors.secondary },
  googleText: { fontSize: 15, fontWeight: '600' },
  signupRow: { flexDirection: 'row', justifyContent: 'center' },
  signupText: { fontSize: 14 },
  signupLink: { fontSize: 14, fontWeight: '700', color: Colors.secondary },
});