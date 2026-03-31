import { Stack, router } from 'expo-router';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../components/Toast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useEffect } from 'react';

function RootNavigator() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace('/(auth)/login');   // 🔥 send to login
    } else {
      router.replace('/(tabs)');         // 🔥 send to app
    }
  }, [user, isLoading]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
      <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
      <Stack.Screen name="analytics" options={{ animation: 'slide_from_right', presentation: 'modal' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider>
            <RootNavigator />  {/* 🔥 THIS IS THE MAGIC */}
          </ToastProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}