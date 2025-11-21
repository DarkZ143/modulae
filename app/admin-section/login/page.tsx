"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Lock, AlertCircle } from "lucide-react";

// ✅ ADDED: List of allowed Admin Emails
const ALLOWED_ADMINS = [
    "themodulae@gmail.com",
    "therbsound@gmail.com"
];

export default function AdminLoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // 🔒 SECURITY: Check if email is in the allowed list
        if (!ALLOWED_ADMINS.includes(email)) {
            setError("Access Denied: You are not an authorized Admin.");
            setLoading(false);
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Redirect to the new dashboard path
            router.push("/admin-section");
        } catch (err) {
            console.error(err);
            setError("Invalid Credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-orange-600" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Modulae Admin</h1>
                    <p className="text-gray-500 text-sm">Restricted Access Only</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-6 text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="admin@modulae.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-gray-900 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors disabled:bg-gray-500"
                    >
                        {loading ? "Verifying..." : "Login"}
                    </button>
                </form>
            </div>
        </div>
    );
}