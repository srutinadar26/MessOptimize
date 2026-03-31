import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserRole } from '../constants/types';
import { Platform } from 'react-native';

// Firebase
import { auth } from '../app/firebase/config';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithCredential,
  User as FirebaseUser,
  AuthErrorCodes,
} from 'firebase/auth';

// Google Auth
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri } from 'expo-auth-session';

WebBrowser.maybeCompleteAuthSession();

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  loginWithGoogle: (role: UserRole) => Promise<{ success: boolean; error?: string }>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Helper function to get Firebase error message
const getFirebaseErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case AuthErrorCodes.INVALID_EMAIL:
      return 'Invalid email address format';
    case AuthErrorCodes.USER_DELETED:
      return 'Email not registered. Please sign up first.';
    case AuthErrorCodes.INVALID_PASSWORD:
      return 'Incorrect password. Please try again.';
    case AuthErrorCodes.EMAIL_EXISTS:
      return 'Email already registered. Please login instead.';
    case AuthErrorCodes.WEAK_PASSWORD:
      return 'Password should be at least 6 characters.';
    case 'auth/invalid-credential':
      return 'Invalid email or password.';
    default:
      return 'An error occurred. Please try again.';
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Google config
  const redirectUri = makeRedirectUri({
    scheme: 'messoptimize',
    path: 'oauth2redirect',
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '351126499260-vjhf437ca2mv5rpn6fpvgipvs2f4lhm1.apps.googleusercontent.com',
    iosClientId: '351126499260-vjhf437ca2mv5rpn6fpvgipvs2f4lhm1.apps.googleusercontent.com',
    androidClientId: '351126499260-vjhf437ca2mv5rpn6fpvgipvs2f4lhm1.apps.googleusercontent.com',
    webClientId: '351126499260-vjhf437ca2mv5rpn6fpvgipvs2f4lhm1.apps.googleusercontent.com',
    redirectUri: redirectUri,
  });

  useEffect(() => {
    loadUser();
    
    // Listen to Firebase auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const storedUser = await AsyncStorage.getItem('@mess_user');
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
        } else {
          // Create new user from Firebase data
          const userName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
          
          const newUser: User = {
            id: firebaseUser.uid,
            name: userName,
            email: firebaseUser.email || '',
            role: 'student',
            streak: 0,
            totalMealsSaved: 0,
            moneySaved: 0,
            co2Reduced: 0,
          };
          await AsyncStorage.setItem('@mess_user', JSON.stringify(newUser));
          setUser(newUser);
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

  async function login(email: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
    
    if (!userCredential.user) {
      return { success: false, error: 'Email not registered. Please sign up first.' };
    }

    // ✅ CRITICAL: First try to get the name from AsyncStorage (where signup stored it)
    let userName = '';
    const storedUser = await AsyncStorage.getItem('@mess_user');
    
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      userName = parsed.name;
      console.log('✅ Retrieved name from storage:', userName);
    }
    
    // If no stored name, check if Firebase has displayName
    if (!userName && userCredential.user.displayName) {
      userName = userCredential.user.displayName;
      console.log('✅ Using Firebase displayName:', userName);
    }
    
    // If still no name, use email prefix (last resort)
    if (!userName) {
      userName = email.split('@')[0];
      console.log('⚠️ Using email prefix as name:', userName);
    }

    const u: User = {
      id: userCredential.user.uid,
      name: userName,  // ✅ This will be the name from signup
      email: email.trim(),
      role,
      streak: 0,
      totalMealsSaved: 0,
      moneySaved: 0,
      co2Reduced: 0,
    };

    // ✅ Save the user with the correct name back to storage
    await AsyncStorage.setItem('@mess_user', JSON.stringify(u));
    setUser(u);
    
    console.log('✅ Login successful - User name set to:', u.name);
    return { success: true };
  } catch (error: any) {
    console.error('Login error:', error);
    const errorMessage = getFirebaseErrorMessage(error.code);
    return { success: false, error: errorMessage };
  }
}

  async function signup(name: string, email: string, password: string, role: UserRole): Promise<{ success: boolean; error?: string }> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);

      const u: User = {
        id: userCredential.user.uid,
        name: name.trim(),
        email: email.trim(),
        role,
        streak: 0,
        totalMealsSaved: 0,
        moneySaved: 0,
        co2Reduced: 0,
      };

      await AsyncStorage.setItem('@mess_user', JSON.stringify(u));
      setUser(u);
      return { success: true };
    } catch (error: any) {
      console.error('Signup error:', error);
      const errorMessage = getFirebaseErrorMessage(error.code);
      return { success: false, error: errorMessage };
    }
  }

  async function loginWithGoogle(role: UserRole): Promise<{ success: boolean; error?: string }> {
    try {
      const result = await promptAsync();

      if (result?.type === 'success') {
        const { id_token } = result.params;
        const credential = GoogleAuthProvider.credential(id_token);
        const userCredential = await signInWithCredential(auth, credential);

        const userName = userCredential.user.displayName || 
                         userCredential.user.email?.split('@')[0] || 
                         'Google User';

        const u: User = {
          id: userCredential.user.uid,
          name: userName,
          email: userCredential.user.email || '',
          role,
          streak: 0,
          totalMealsSaved: 0,
          moneySaved: 0,
          co2Reduced: 0,
        };

        await AsyncStorage.setItem('@mess_user', JSON.stringify(u));
        setUser(u);
        return { success: true };
      } else if (result?.type === 'cancel') {
        return { success: false, error: 'Google sign-in was cancelled' };
      } else {
        return { success: false, error: 'Google sign-in failed. Please try again.' };
      }
    } catch (error: any) {
      console.error('Google login error:', error);
      
      if (error.message?.includes('redirect_uri_mismatch')) {
        return { success: false, error: 'Configuration error. Please contact support.' };
      }
      
      return { success: false, error: error.message || 'Google sign-in failed. Please try again.' };
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