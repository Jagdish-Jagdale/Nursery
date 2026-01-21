import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { auth, db } from "../lib/firebase";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc, collection, query, where, getDocs } from "firebase/firestore";
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
        // First check users collection
        const userRef = doc(db, "users", u.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          if (data.status === "inactive") {
            await signOut(auth);
            setUser(null);
            setRole(null);
            setLoading(false);
            return;
          }
          setRole(data.role || ROLES.ADMIN);
        } else {
          // If not in users collection, check owners collection
          const ownersQuery = query(collection(db, "owners"), where("uid", "==", u.uid));
          const ownersSnap = await getDocs(ownersQuery);

          if (!ownersSnap.empty) {
            const ownerData = ownersSnap.docs[0].data();
            if (ownerData.status === "inactive") {
              await signOut(auth);
              setUser(null);
              setRole(null);
              setLoading(false);
              return;
            }
            // User is an owner - set role directly without creating user doc
            // (Creating user doc here would trigger infinite loop)
            setRole(ROLES.OWNER);
          } else {
            // Default to ADMIN for users without documents
            setRole(ROLES.ADMIN);
          }
        }
      } catch (e) {
        console.error("Error fetching user role:", e);
        setRole(ROLES.ADMIN);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, []);

  const login = async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Check users collection
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      if (userSnap.data().status === "inactive") {
        await signOut(auth);
        throw new Error("Account Inactive: Access is currently restricted. Please contact support.");
      }
      return userCredential;
    }

    // Check owners collection
    const ownersQuery = query(collection(db, "owners"), where("uid", "==", user.uid));
    const ownersSnap = await getDocs(ownersQuery);

    if (!ownersSnap.empty) {
      if (ownersSnap.docs[0].data().status === "inactive") {
        await signOut(auth);
        throw new Error("Account Inactive: Access is currently restricted. Please contact support.");
      }
    }

    return userCredential;
  };
  const register = async (email, password, profile = {}) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const ref = doc(db, "users", cred.user.uid);
    await setDoc(
      ref,
      {
        uid: cred.user.uid,
        email,
        password,
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
      isOwner: role === ROLES.OWNER,
      isSuperAdmin: role === ROLES.ADMIN, // Alias for backward compatibility
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
