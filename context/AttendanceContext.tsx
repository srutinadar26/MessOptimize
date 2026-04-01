import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import * as Location from 'expo-location';
import { Buffer } from 'buffer';
import { useAuth } from './AuthContext';

// Define types locally
type MealStatus = {
  status: boolean;
  markedAt: string | null;
  verifiedBy: 'self' | 'staff' | 'qr' | 'gps' | 'otp';
  location?: {
    latitude: number;
    longitude: number;
  };
};

export interface MealAttendance {
  date: string;
  breakfast: MealStatus;
  lunch: MealStatus;
  dinner: MealStatus;
}

interface AttendanceContextType {
  attendance: MealAttendance[];
  markMeal: (
    meal: 'breakfast' | 'lunch' | 'dinner',
    verificationMethod: 'self' | 'qr' | 'otp',
    code?: string
  ) => Promise<{ success: boolean; error?: string }>;
  getTodayAttendance: () => MealAttendance | null;
  getWeeklyAttendance: () => MealAttendance[];
  getStreak: () => number;
  getMealsMarkedThisWeek: () => number;
  isLoading: boolean;
  generateQRCode: (meal: string) => string;
  generateOTP: () => string;
}

const AttendanceContext = createContext<AttendanceContextType | null>(null);

// ✅ UPDATE THESE COORDINATES TO YOUR ACTUAL MESS LOCATION
// Get coordinates from Google Maps by right-clicking on your mess location
const MESS_LOCATION = {
  latitude: 19.0760,  // Replace with your mess latitude
  longitude: 72.8777, // Replace with your mess longitude
  radius: 100, // meters - students must be within 100m to mark attendance
};

// Time windows for meals
const MEAL_WINDOWS = {
  breakfast: { start: 7, end: 10 },
  lunch: { start: 12, end: 15 },
  dinner: { start: 19, end: 22 },
};

const getTodayDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

export function AttendanceProvider({ children }: { children: ReactNode }) {
  const { user, updateUser } = useAuth();
  const [attendance, setAttendance] = useState<MealAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAttendance();
  }, [user]);

  const loadAttendance = async () => {
    if (!user) return;
    try {
      const stored = await AsyncStorage.getItem(`@attendance_${user.id}`);
      if (stored) {
        setAttendance(JSON.parse(stored));
      } else {
        setAttendance([]);
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isWithinMealWindow = (meal: 'breakfast' | 'lunch' | 'dinner'): boolean => {
    const now = new Date();
    const currentHour = now.getHours();
    const window = MEAL_WINDOWS[meal];
    return currentHour >= window.start && currentHour < window.end;
  };

  const getDistanceFromLatLonInMeters = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  // ✅ LOCATION VERIFICATION FUNCTION
  const isWithinMessLocation = async (): Promise<boolean> => {
    try {
      // ✅ TEMPORARY: For web testing, always return true
      // Remove this when testing on actual device
      if (Platform.OS === 'web') {
        console.log('📍 Web mode: Skipping location check for testing');
        return true;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('📱 Location permission status:', status);
      
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required to mark attendance');
        return false;
      }

      const location = await Location.getCurrentPositionAsync({});
      console.log('📍 Current location:', location.coords);
      
      const distance = getDistanceFromLatLonInMeters(
        location.coords.latitude,
        location.coords.longitude,
        MESS_LOCATION.latitude,
        MESS_LOCATION.longitude
      );
      
      console.log(`📏 Distance from mess: ${distance.toFixed(2)} meters (required: within ${MESS_LOCATION.radius}m)`);
      
      const isWithin = distance <= MESS_LOCATION.radius;
      if (!isWithin) {
        console.log('❌ Too far from mess!');
      } else {
        console.log('✅ Within mess range!');
      }
      return isWithin;
    } catch (error) {
      console.error('❌ Location error:', error);
      return false;
    }
  };

  const generateQRCode = (meal: string): string => {
    const data = {
      meal,
      date: getTodayDate(),
      timestamp: Date.now(),
    };
    return Buffer.from(JSON.stringify(data)).toString('base64');
  };

  const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const isMealAlreadyMarked = (meal: 'breakfast' | 'lunch' | 'dinner'): boolean => {
    const today = getTodayDate();
    const todayRecord = attendance.find(a => a.date === today);
    if (!todayRecord) return false;
    return todayRecord[meal]?.status || false;
  };

  // ✅ MAIN MARK MEAL FUNCTION
  const markMeal = async (
    meal: 'breakfast' | 'lunch' | 'dinner',
    verificationMethod: 'self' | 'qr' | 'otp',
    code?: string
  ): Promise<{ success: boolean; error?: string }> => {
    
    console.log(`🎯 Marking ${meal} with method: ${verificationMethod}`);

    // Check 1: Can't mark if already marked
    if (isMealAlreadyMarked(meal)) {
      console.log('❌ Meal already marked today');
      return { success: false, error: 'Meal already marked for today' };
    }

    // Check 2: Time window restriction
    if (!isWithinMealWindow(meal)) {
      const window = MEAL_WINDOWS[meal];
      console.log(`❌ Outside meal window: ${window.start}:00 - ${window.end}:00`);
      return { success: false, error: `Can only mark ${meal} during meal hours (${window.start}:00 - ${window.end}:00)` };
    }

    // Check 3: Location verification for GPS/self marking
    if (verificationMethod === 'self') {
      console.log('📍 Checking location...');
      const isNearMess = await isWithinMessLocation();
      console.log('📍 Location check result:', isNearMess);
      if (!isNearMess) {
        return { success: false, error: 'You must be near the mess to mark attendance' };
      }
    }

    // Check 4: QR Code verification
    if (verificationMethod === 'qr') {
      if (!code) {
        return { success: false, error: 'QR code required' };
      }
      const expectedQR = generateQRCode(meal);
      if (code !== expectedQR) {
        return { success: false, error: 'Invalid QR code' };
      }
    }

    // Check 5: OTP verification
    if (verificationMethod === 'otp') {
      if (!code) {
        return { success: false, error: 'OTP required' };
      }
      const storedOTP = await AsyncStorage.getItem(`@otp_${meal}_${getTodayDate()}`);
      if (code !== storedOTP) {
        return { success: false, error: 'Invalid OTP' };
      }
    }

    // Get location if verified via GPS
    let location;
    if (verificationMethod === 'self') {
      const loc = await Location.getCurrentPositionAsync({});
      location = {
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      };
    }

    const today = getTodayDate();
    const updatedAttendance = [...attendance];
    const existingIndex = updatedAttendance.findIndex(a => a.date === today);

    const mealRecord = {
      status: true,
      markedAt: new Date().toISOString(),
      verifiedBy: verificationMethod === 'self' ? 'gps' : verificationMethod,
      location,
    };

    if (existingIndex >= 0) {
      updatedAttendance[existingIndex] = {
        ...updatedAttendance[existingIndex],
        [meal]: mealRecord,
      };
    } else {
      updatedAttendance.push({
        date: today,
        breakfast: { status: false, markedAt: null, verifiedBy: 'self' },
        lunch: { status: false, markedAt: null, verifiedBy: 'self' },
        dinner: { status: false, markedAt: null, verifiedBy: 'self' },
        [meal]: mealRecord,
      });
    }

    setAttendance(updatedAttendance);
    await AsyncStorage.setItem(`@attendance_${user?.id}`, JSON.stringify(updatedAttendance));

    const newStreak = calculateStreak(updatedAttendance);
    await updateUser({ streak: newStreak });

    console.log(`✅ ${meal} marked successfully!`);
    return { success: true };
  };

  const calculateStreak = (attendanceData: MealAttendance[]): number => {
    let streak = 0;
    const sorted = [...attendanceData].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    for (const day of sorted) {
      const hasAnyMeal = day.breakfast.status || day.lunch.status || day.dinner.status;
      if (hasAnyMeal) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const getTodayAttendance = (): MealAttendance | null => {
    const today = getTodayDate();
    return attendance.find(a => a.date === today) || null;
  };

  const getWeeklyAttendance = (): MealAttendance[] => {
    return attendance.slice(-7);
  };

  const getStreak = (): number => {
    return calculateStreak(attendance);
  };

  const getMealsMarkedThisWeek = (): number => {
    const weekly = getWeeklyAttendance();
    let count = 0;
    weekly.forEach(day => {
      if (day.breakfast.status) count++;
      if (day.lunch.status) count++;
      if (day.dinner.status) count++;
    });
    return count;
  };

  return (
    <AttendanceContext.Provider
      value={{
        attendance,
        markMeal,
        getTodayAttendance,
        getWeeklyAttendance,
        getStreak,
        getMealsMarkedThisWeek,
        isLoading,
        generateQRCode,
        generateOTP,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
}

export function useAttendance() {
  const ctx = useContext(AttendanceContext);
  if (!ctx) throw new Error('useAttendance must be used within AttendanceProvider');
  return ctx;
}