import app from '../app/firebase/config';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../constants/types';

const auth = getAuth(app);

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔥 THE MAIN FIX: Firebase controls auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const stored = await AsyncStorage.getItem('@mess_user');

        if (stored) {
          setUser(JSON.parse(stored));
        } else {
          // fallback if no stored user
          const u: User = {
            id: firebaseUser.uid,
            name: firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email || '',
            role: 'student',
            streak: 0,
            totalMealsSaved: 0,
            moneySaved: 0,
            co2Reduced: 0,
          };
          setUser(u);
          await AsyncStorage.setItem('@mess_user', JSON.stringify(u));
        }
      } else {
        setUser(null);
        await AsyncStorage.removeItem('@mess_user');
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  async function login(email: string, password: string, role: UserRole) {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    const u: User = {
      id: userCredential.user.uid,
      name: email.split('@')[0],
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

  async function signup(name: string, email: string, password: string, role: UserRole) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const u: User = {
      id: userCredential.user.uid,
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

  // 🔥 CLEAN LOGOUT (Firebase handles everything)
  async function logout() {
    await signOut(auth);
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