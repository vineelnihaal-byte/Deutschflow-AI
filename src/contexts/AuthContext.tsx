import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  User as FirebaseUser,
  getAdditionalUserInfo
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';
import { GermanLevel } from '../types';

interface AuthContextType {
  user: FirebaseUser | null;
  loading: boolean;
  userProfile: any | null;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const profileDoc = await getDoc(doc(db, 'users', user.uid));
        if (profileDoc.exists()) {
          setUserProfile(profileDoc.data());
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const isNewUser = getAdditionalUserInfo(result)?.isNewUser;

      if (isNewUser) {
        // Initialize user profile
        const initialProfile = {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          level: 'A1',
          xp: 0,
          streak: 1,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        await setDoc(doc(db, 'users', result.user.uid), initialProfile);
        setUserProfile(initialProfile);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => signOut(auth);

  return (
    <AuthContext.Provider value={{ user, loading, userProfile, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
