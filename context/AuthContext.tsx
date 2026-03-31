import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../constants/types';

// Firebase - IMPORT FROM YOUR CONFIG.JS
import { auth } from '../app/firebase/config'; // Change this line
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithCredential,
  GoogleAuthProvider,
  User as FirebaseUser,
} from 'firebase/auth';

// Google Auth
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<void>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Google config
  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId: '351126499260-vjhf437ca2mv5rpn6fpvgipvs2f4lhm1.apps.googleusercontent.com',
  });

  useEffect(() => {
    loadUser();
    
    // Listen to auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const storedUser = await AsyncStorage.getItem('@mess_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
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
    try {
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
    } catch (error: any) {
      console.error('Login error:', error);
      throw new Error(error.message);
    }
  }

  async function signup(name: string, email: string, password: string, role: UserRole) {
    try {
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
    } catch (error: any) {
      console.error('Signup error:', error);
      throw new Error(error.message);
    }
  }

  async function loginWithGoogle(role: UserRole) {
    try {
      const result = await promptAsync();

      if (result?.type === 'success') {
        const { id_token } = result.params;

        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);

        const u: User = {
          id: userCredential.user.uid,
          name: userCredential.user.displayName || 'Google User',
          email: userCredential.user.email || '',
          role,
          streak: 0,
          totalMealsSaved: 0,
          moneySaved: 0,
          co2Reduced: 0,
        };

        await AsyncStorage.setItem('@mess_user', JSON.stringify(u));
        setUser(u);
      } else {
        throw new Error('Google sign-in was cancelled');
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error(error.message);
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      await AsyncStorage.removeItem('@mess_user');
      setUser(null);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error(error.message);
    }
  }

  function updateUser(updates: Partial<User>) {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    AsyncStorage.setItem('@mess_user', JSON.stringify(updated));
  }

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, logout, loginWithGoogle, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}