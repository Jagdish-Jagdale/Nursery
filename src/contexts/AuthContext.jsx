import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { auth, db } from '../lib/firebase'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'
import { ROLES } from '../utils/roles'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) {
        setUser(null)
        setRole(null)
        setLoading(false)
        return
      }
      setUser(u)
      try {
        const ref = doc(db, 'users', u.uid)
        const snap = await getDoc(ref)
        if (snap.exists()) {
          const data = snap.data()
          setRole(data.role || ROLES.USER)
        } else {
          await setDoc(ref, { uid: u.uid, email: u.email || '', role: ROLES.USER, createdAt: serverTimestamp() }, { merge: true })
          setRole(ROLES.USER)
        }
      } catch (e) {
        setRole(ROLES.USER)
      } finally {
        setLoading(false)
      }
    })
    return () => unsub()
  }, [])

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password)
  const register = async (email, password, profile = {}) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    const ref = doc(db, 'users', cred.user.uid)
    await setDoc(
      ref,
      { uid: cred.user.uid, email, role: ROLES.USER, createdAt: serverTimestamp(), ...profile },
      { merge: true }
    )
    return cred
  }
  const logout = () => signOut(auth)

  const value = useMemo(
    () => ({ user, role, loading, login, register, logout, isAdmin: role === ROLES.ADMIN, isSuperAdmin: role === ROLES.SUPERADMIN }),
    [user, role, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
