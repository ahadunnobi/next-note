"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  onAuthStateChanged, 
  User, 
  signOut as firebaseSignOut,
  signInWithPopup,
  signInAnonymously as firebaseSignInAnonymously,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  AuthProvider as FirebaseAuthProvider,
  ConfirmationResult
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  signInWithProvider: (provider: FirebaseAuthProvider) => Promise<void>;
  signInAnonymously: () => Promise<void>;
  setupRecaptcha: (containerId: string) => RecaptchaVerifier;
  signInPhone: (phone: string, recaptcha: RecaptchaVerifier) => Promise<ConfirmationResult>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  logout: async () => {},
  signInWithProvider: async () => {},
  signInAnonymously: async () => {},
  setupRecaptcha: () => ({} as RecaptchaVerifier),
  signInPhone: async () => ({} as ConfirmationResult),
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  const signInWithProvider = async (provider: FirebaseAuthProvider) => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Error signing in with provider", error);
    }
  };

  const signInAnonymously = async () => {
    try {
      await firebaseSignInAnonymously(auth);
    } catch (error) {
      console.error("Error signing in anonymously", error);
    }
  };

  const setupRecaptcha = (containerId: string) => {
    const recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: "invisible",
    });
    return recaptchaVerifier;
  };

  const signInPhone = async (phone: string, recaptcha: RecaptchaVerifier) => {
    return await signInWithPhoneNumber(auth, phone, recaptcha);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      logout, 
      signInWithProvider, 
      signInAnonymously,
      setupRecaptcha,
      signInPhone
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
