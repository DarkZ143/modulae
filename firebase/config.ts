// firebase/config.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyA01gjB07YA6UvJ1LbKapdexCcXoLXXEF4",
    authDomain: "modulae-users.firebaseapp.com",
    projectId: "modulae-users",
    storageBucket: "modulae-users.firebasestorage.app",
    messagingSenderId: "239086330356",
    appId: "1:239086330356:web:de156be2c962ba93ee59a1",
    measurementId: "G-M60EJDNFF7",
    databaseURL: "https://modulae-users-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Prevent re-initializing
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getDatabase(app);
export default app;
