import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { ROLES } from "../utils/roles";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null);
        setRole(null);
        setLoading(false);
        return;
      }
      setUser(u);
      try {
        const ref = doc(db, "users", u.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          // If no role defined, treat as SUPERADMIN
          setRole(data.role || ROLES.SUPERADMIN);
        } else {
          // Don't create user document during login
          // Users without Firestore document are treated as SUPERADMIN
          setRole(ROLES.SUPERADMIN);
        }
      } catch (e) {
        setRole(ROLES.SUPERADMIN);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const login = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);
  const register = async (email, password, profile = {}) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const ref = doc(db, "users", cred.user.uid);
    await setDoc(
      ref,
      {
        uid: cred.user.uid,
        email,
        role: ROLES.USER,
        createdAt: serverTimestamp(),
        ...profile,
      },
      { merge: true }
    );
    return cred;
  };
  const logout = () => signOut(auth);

  const value = useMemo(
    () => ({
      user,
      role,
      loading,
      login,
      register,
      logout,
      isAdmin: role === ROLES.ADMIN,
      isSuperAdmin: role === ROLES.SUPERADMIN,
    }),
    [user, role, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
