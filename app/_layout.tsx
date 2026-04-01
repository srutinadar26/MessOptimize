import { Stack, router } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../components/Toast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '../constants/Colors';
import { AttendanceProvider } from '../context/AttendanceContext';

// Debug flag - set to true to show debug screen, false for normal app
const SHOW_DEBUG_SCREEN = __DEV__ && false;

function RootNavigator() {
  const { user, isLoading } = useAuth();
  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    if (!SHOW_DEBUG_SCREEN && !showDebug) {
      if (isLoading) return;

      if (!user) {
        console.log('No user, redirecting to login');
        router.replace('/(auth)/login');
      } else {
        console.log('User found, redirecting to tabs');
        router.replace('/(tabs)');
      }
    }
  }, [user, isLoading, showDebug]);

  // If in debug mode, show debug screen
  if (SHOW_DEBUG_SCREEN || showDebug) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="debug-redirect" 
          options={{ 
            headerShown: true, 
            title: 'Debug Google Sign-In',
            headerStyle: { backgroundColor: Colors.primary },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' }
          }} 
        />
      </Stack>
    );
  }

  // ✅ FIXED: Normal app navigation - Return the Stack here
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      <Stack.Screen 
        name="analytics" 
        options={{ 
          animation: 'slide_from_right', 
          presentation: 'modal' 
        }} 
      />
      <Stack.Screen 
        name="debug-redirect" 
        options={{ 
          headerShown: true, 
          title: 'Debug',
          presentation: 'modal'
        }} 
      />
    </Stack>
  );
}

// Debug button to show in development mode
function DebugButton() {
  if (!__DEV__) return null;
  
  return (
    <TouchableOpacity 
      style={styles.debugButton}
      onPress={() => router.push('/debug-redirect')}
    >
      <Text style={styles.debugButtonText}>🔧</Text>
    </TouchableOpacity>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <AttendanceProvider>
            <ToastProvider>
              <RootNavigator />
              <DebugButton />
            </ToastProvider>
          </AttendanceProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  debugButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: Colors.primary,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 999,
  },
  debugButtonText: {
    fontSize: 24,
    color: '#fff',
  },
});