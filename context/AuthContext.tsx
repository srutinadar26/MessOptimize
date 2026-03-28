import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../constants/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const MOCK_USERS: Record<string, User> = {
  'student@mess.com': {
    id: 'current',
    name: 'Aanya Kapoor',
    email: 'student@mess.com',
    role: 'student',
    hostelName: 'Tagore Hostel',
    roomNumber: 'B-204',
    streak: 14,
    totalMealsSaved: 42,
    moneySaved: 2100,
    co2Reduced: 8.4,
  },
  'staff@mess.com': {
    id: 'staff1',
    name: 'Ramesh Kumar',
    email: 'staff@mess.com',
    role: 'staff',
    hostelName: 'Tagore Hostel Mess',
    streak: 0,
    totalMealsSaved: 0,
    moneySaved: 0,
    co2Reduced: 0,
  },
  'ngo@care.org': {
    id: 'ngo1',
    name: 'Food For All NGO',
    email: 'ngo@care.org',
    role: 'ngo',
    streak: 0,
    totalMealsSaved: 0,
    moneySaved: 0,
    co2Reduced: 0,
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const stored = await AsyncStorage.getItem('@mess_user');
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {
      console.log('Error loading user', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(email: string, _password: string, role: UserRole) {
    await new Promise(r => setTimeout(r, 800)); // Simulate network
    const found = MOCK_USERS[email.toLowerCase()];
    const u: User = found ?? {
      id: 'demo_' + Date.now(),
      name: 'Demo User',
      email,
      role,
      streak: 7,
      totalMealsSaved: 21,
      moneySaved: 1050,
      co2Reduced: 4.2,
    };
    u.role = role;
    await AsyncStorage.setItem('@mess_user', JSON.stringify(u));
    setUser(u);
  }

  async function signup(name: string, email: string, _password: string, role: UserRole) {
    await new Promise(r => setTimeout(r, 800));
    const u: User = {
      id: 'new_' + Date.now(),
      name,
      email,
      role,
      streak: 0,
      totalMealsSaved: 0,
      moneySaved: 0,
      co2Reduced: 0,
    };
    await AsyncStorage.setItem('@mess_user', JSON.stringify(u));
    setUser(u);
  }

  async function logout() {
    await AsyncStorage.removeItem('@mess_user');
    setUser(null);
  }

  function updateUser(updates: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    AsyncStorage.setItem('@mess_user', JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
