import { initializeApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyCQVhuR8B7ZqxyiJxRTkzU4vQJwIJpWBL4',
  authDomain: 'nursery-managment-714e6.firebaseapp.com',
  projectId: 'nursery-managment-714e6',
  storageBucket: 'nursery-managment-714e6.firebasestorage.app',
  messagingSenderId: '142657875722',
  appId: '1:142657875722:web:0c53499ad3bf52049c94f3',
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
