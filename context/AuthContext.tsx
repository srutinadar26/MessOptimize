import app from '../app/firebase/config';
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';

const auth = getAuth(app);

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

async function logout() {
  await signOut(auth);
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
