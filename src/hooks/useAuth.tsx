import React, { createContext, useContext, useEffect, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signOut as fbSignOut,
  sendPasswordResetEmail as fbResetEmail,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  registerWithEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state change
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const userRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setRole(docSnap.data().role || "customer");
          } else {
            setRole("customer");
          }
        } catch (e) {
          console.error("Error fetching user role on state change:", e);
          setRole("customer");
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getRoleFromEmail = (email: string | null) => {
    if (!email) return "customer";
    const emailLower = email.toLowerCase();
    const isEmailAdmin = emailLower === "admin@auraevents.in" || 
                         emailLower.startsWith("admin@") || 
                         emailLower.includes("admin");
    return isEmailAdmin ? "admin" : "customer";
  };

  const loginWithEmail = async (email: string, password: string) => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    if (res.user) {
      const userRef = doc(db, "users", res.user.uid);
      const docSnap = await getDoc(userRef);
      const derivedRole = getRoleFromEmail(res.user.email);
      
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName || null,
          photoURL: res.user.photoURL || null,
          role: derivedRole,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
      } else {
        const existingRole = docSnap.data().role || "customer";
        const finalRole = (derivedRole === "admin" && existingRole !== "admin" && existingRole !== "staff") ? "admin" : existingRole;
        await setDoc(
          userRef,
          {
            role: finalRole,
            lastLoginAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    }
  };

  const registerWithEmail = async (email: string, password: string, displayName?: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName && res.user) {
      await updateProfile(res.user, { displayName });
    }
    
    if (res.user) {
      const userRef = doc(db, "users", res.user.uid);
      const derivedRole = getRoleFromEmail(res.user.email);
      await setDoc(userRef, {
        uid: res.user.uid,
        email: res.user.email,
        displayName: displayName || null,
        photoURL: null,
        role: derivedRole,
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      });
      
      setUser({ ...res.user, displayName });
      setRole(derivedRole);
    }
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const res = await signInWithPopup(auth, provider);
    
    if (res.user) {
      const userRef = doc(db, "users", res.user.uid);
      const docSnap = await getDoc(userRef);
      const derivedRole = getRoleFromEmail(res.user.email);
      
      if (!docSnap.exists()) {
        await setDoc(userRef, {
          uid: res.user.uid,
          email: res.user.email,
          displayName: res.user.displayName || null,
          photoURL: res.user.photoURL || null,
          role: derivedRole,
          createdAt: serverTimestamp(),
          lastLoginAt: serverTimestamp(),
        });
        setRole(derivedRole);
      } else {
        const existingRole = docSnap.data().role || "customer";
        const finalRole = (derivedRole === "admin" && existingRole !== "admin" && existingRole !== "staff") ? "admin" : existingRole;
        await setDoc(
          userRef,
          {
            displayName: res.user.displayName || null,
            photoURL: res.user.photoURL || null,
            role: finalRole,
            lastLoginAt: serverTimestamp(),
          },
          { merge: true }
        );
        setRole(finalRole);
      }
    }
  };

  const logout = async () => {
    await fbSignOut(auth);
    setRole(null);
  };

  const resetPassword = async (email: string) => {
    await fbResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
