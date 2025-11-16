"use client";

import { useEffect } from "react";
import { auth } from "@/firebase/config";
import { onAuthStateChanged } from "firebase/auth";

export default function ProfileRedirect() {
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (!user) {
                window.location.href = "/auth/login";
            } else {
                window.location.href = "/dashboard";
            }
        });

        return () => unsub();
    }, []);

    return (
        <div className="min-h-[60vh] flex items-center justify-center">
            <div className="animate-pulse text-gray-500">
                Checking your account...
            </div>
        </div>
    );
}
