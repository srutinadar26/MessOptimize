import React, { useEffect, useCallback, createContext, useContext, useState, ReactNode } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withDelay,
  runOnJS,
} from 'react-native-reanimated';
import { Colors } from '../constants/Colors';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: number;
  message: string;
  type: ToastType;
  emoji?: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType, emoji?: string) => void;
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

const TOAST_CONFIG: Record<ToastType, { bg: string; accent: string; defaultEmoji: string }> = {
  success: { bg: Colors.success + '20', accent: Colors.success, defaultEmoji: '✅' },
  error: { bg: '#FF6B6B20', accent: '#E55', defaultEmoji: '❌' },
  info: { bg: Colors.info + '20', accent: Colors.info, defaultEmoji: 'ℹ️' },
  warning: { bg: Colors.accent + '25', accent: '#B8860B', defaultEmoji: '⚠️' },
};

function ToastView({ toast, onDone }: { toast: ToastItem; onDone: (id: number) => void }) {
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);
  const config = TOAST_CONFIG[toast.type];

  useEffect(() => {
    translateY.value = withSpring(0, { damping: 14, stiffness: 200 });
    opacity.value = withTiming(1, { duration: 200 });

    const timeout = setTimeout(() => {
      translateY.value = withTiming(-100, { duration: 300 });
      opacity.value = withDelay(100, withTiming(0, { duration: 200 }, () => {
        runOnJS(onDone)(toast.id);
      }));
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[styles.toast, { backgroundColor: config.bg, borderLeftColor: config.accent }, animStyle]}>
      <Text style={styles.toastEmoji}>{toast.emoji || config.defaultEmoji}</Text>
      <Text style={[styles.toastText, { color: config.accent }]}>{toast.message}</Text>
    </Animated.View>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  let counter = 0;

  const showToast = useCallback((message: string, type: ToastType = 'success', emoji?: string) => {
    const id = Date.now() + (counter++);
    setToasts(prev => [...prev, { id, message, type, emoji }]);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <View style={styles.container} pointerEvents="box-none">
        {toasts.map(toast => (
          <ToastView key={toast.id} toast={toast} onDone={removeToast} />
        ))}
      </View>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    pointerEvents: 'box-none',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 8,
    maxWidth: width - 40,
    minWidth: 200,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  toastEmoji: { fontSize: 18, marginRight: 10 },
  toastText: { fontSize: 14, fontWeight: '600', flex: 1 },
});
