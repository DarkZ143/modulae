/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/firebase.ts
"use client";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

// Firestore → for USERS
import { getFirestore } from "firebase/firestore";

// Realtime DB → for PRODUCTS, ORDERS, CART
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA01gjB07YA6UvJ1LbKapdexCcXoLXXEF4",
    authDomain: "modulae-users.firebaseapp.com",
    projectId: "modulae-users",
    storageBucket: "modulae-users.firebasestorage.app",
    messagingSenderId: "239086330356",
    appId: "1:239086330356:web:de156be2c962ba93ee59a1",
    measurementId: "G-M60EJDNFF7",

    // REQUIRED FOR REALTIME DB
    databaseURL: "https://modulae-users-default-rtdb.asia-southeast1.firebasedatabase.app",

};

// Prevent re-initialization
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore (keep name "db")
export const db = getFirestore(app);

// Realtime DB (renamed)
export const rtdb = getDatabase(app);

// Analytics
export let analytics: any = null;

if (typeof window !== "undefined") {
    isSupported().then((ok) => {
        if (ok) analytics = getAnalytics(app);
    });
}

export default app;
