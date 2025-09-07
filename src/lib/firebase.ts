
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "educloud-kenya.firebaseapp.com",
  projectId: "educloud-kenya",
  storageBucket: "educloud-kenya.appspot.com",
  messagingSenderId: "1083742475824",
  appId: "1:1083742475824:web:a69902b69297ad4dea3ff5",
  measurementId: ""
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage };
