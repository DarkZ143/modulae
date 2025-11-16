/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/firebase.ts
"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// [THE FIX] Make SURE you import from "firebase/firestore"
import { getFirestore } from "firebase/firestore";

// --- Your Firebase Config ---
const firebaseConfig = {
    apiKey: "AIzaSyA01gjB07YA6UvJ1LbKapdexCcXoLXXEF4",
    authDomain: "modulae-users.firebaseapp.com",
    projectId: "modulae-users",
    storageBucket: "modulae-users.firebasestorage.app",
    messagingSenderId: "239086330356",
    appId: "1:239086330356:web:de156be2c962ba93ee59a1",
    measurementId: "G-M60EJDNFF7",
};

// --- Prevent double initialization ---
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// --- Auth ---
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// [THE FIX] Make SURE you use getFirestore(app)
// and that you EXPORT it.
export const db = getFirestore(app);

// --- Analytics (Client Only) ---
export let analytics: any = null;

if (typeof window !== "undefined") {
    isSupported().then((yes) => {
        if (yes) analytics = getAnalytics(app);
    });
}

export default app;