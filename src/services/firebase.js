import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, push, get, remove, update } from 'firebase/database';
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);

// Helper refs
export const doorsRef = (doorId = 'door_main') => ref(db, `doors/${doorId}`);
export const doorStatusRef = (doorId = 'door_main') => ref(db, `doors/${doorId}/status`);
export const doorCommandRef = (doorId = 'door_main') => ref(db, `doors/${doorId}/command`);
export const usersRef = () => ref(db, 'users');
export const userRef = (userId) => ref(db, `users/${userId}`);
export const cardIndexRef = () => ref(db, 'cardIndex');
export const accessLogsRef = () => ref(db, 'accessLogs');
export const systemConfigRef = () => ref(db, 'systemConfig');

// Export Firebase functions for use in hooks
export { ref, onValue, set, push, get, remove, update };

// Export Auth functions
export { signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword };
