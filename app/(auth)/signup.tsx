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
import type { UserRole } from '../../constants/types';

const ROLES: { id: UserRole; label: string; emoji: string; desc: string }[] = [
  { id: 'student', label: 'Student', emoji: '🎓', desc: 'Mark meals & track savings' },
  { id: 'staff', label: 'Mess Staff', emoji: '👨‍🍳', desc: 'Manage quantities & reports' },
  { id: 'ngo', label: 'NGO Partner', emoji: '🤝', desc: 'Claim surplus food' },
];

export default function SignupScreen() {
  const { signup } = useAuth();
  const { isDark } = useTheme();
  const scheme = isDark ? Colors.dark : Colors.light;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('student');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSignup() {
    // Validation
    if (!name.trim()) {
      Alert.alert('Missing Field', 'Please enter your full name');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Missing Field', 'Please enter your email');
      return;
    }
    if (!password) {
      Alert.alert('Missing Field', 'Please enter a password');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Weak Password', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      const result = await signup(name.trim(), email.trim(), password, role);
      
      if (result.success) {
        router.replace('/(tabs)');
      } else {
        Alert.alert('Signup Failed', result.error || 'Unable to create account');
      }
    } catch (error: any) {
      Alert.alert('Signup Failed', error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.root, { backgroundColor: scheme.background }]}>
      <LinearGradient
        colors={[Colors.primary, Colors.info]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.logoContainer}>
          <Text style={styles.logoEmoji}>♻️</Text>
          <Text style={styles.logoTitle}>Join MessOptimize</Text>
          <Text style={styles.logoSub}>Start reducing food waste today</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Text style={[styles.sectionTitle, { color: scheme.text }]}>Create Account ✨</Text>
          <Text style={[styles.sectionSub, { color: scheme.textSecondary }]}>Choose your role to get started</Text>

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

          {/* Name */}
          <Text style={[styles.inputLabel, { color: scheme.textSecondary }]}>Full Name</Text>
          <View style={[styles.inputWrap, { backgroundColor: scheme.inputBg, borderColor: scheme.border }]}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={[styles.input, { color: scheme.text }]}
              value={name}
              onChangeText={setName}
              placeholder="Your full name"
              placeholderTextColor={scheme.textMuted}
              autoCapitalize="words"
            />
          </View>

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
              placeholder="Min. 6 characters"
              placeholderTextColor={scheme.textMuted}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          {/* Confirm Password */}
          <Text style={[styles.inputLabel, { color: scheme.textSecondary }]}>Confirm Password</Text>
          <View style={[styles.inputWrap, { backgroundColor: scheme.inputBg, borderColor: scheme.border }]}>
            <Text style={styles.inputIcon}>🔐</Text>
            <TextInput
              style={[styles.input, { color: scheme.text }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry={!showConfirmPassword}
              placeholder="Re-enter password"
              placeholderTextColor={scheme.textMuted}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Text style={styles.eyeIcon}>{showConfirmPassword ? '🙈' : '👁'}</Text>
            </TouchableOpacity>
          </View>

          {/* Demo Hint */}
          <View style={[styles.demoHint, { backgroundColor: Colors.accent + '20' }]}>
            <Text style={[styles.hintText, { color: scheme.textSecondary }]}>
              Demo: Use any email and password (min 6 chars)
            </Text>
          </View>

          <Button
            title="Create Account"
            onPress={handleSignup}
            loading={loading}
            size="lg"
            style={styles.signupBtn}
          />

          <View style={styles.loginRow}>
            <Text style={[styles.loginText, { color: scheme.textSecondary }]}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Sign in</Text>
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
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  logoContainer: { alignItems: 'center' },
  logoEmoji: { fontSize: 44, marginBottom: 6 },
  logoTitle: { fontSize: 26, fontWeight: '800', color: '#FFF', letterSpacing: -0.5 },
  logoSub: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 4 },
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
  roleDesc: { fontSize: 12, marginBottom: 16, textAlign: 'center' },
  inputLabel: { fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 8 },
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
  signupBtn: { width: '100%', marginTop: 20, marginBottom: 20 },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { fontSize: 14 },
  loginLink: { fontSize: 14, fontWeight: '700', color: Colors.secondary },
});