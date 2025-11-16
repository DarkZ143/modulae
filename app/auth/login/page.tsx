/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
// app/auth/login/page.tsx
"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
    signInWithEmailAndPassword,
    signInWithPopup,
    sendPasswordResetEmail
} from "firebase/auth";
import { auth, googleProvider } from "@/lib/firebase";
// Note: You don't need to import useAuth here,
// because this page *sets* the auth state, it doesn't *read* it.

const DEMO_OTP = "123456";

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [otpStep, setOtpStep] = useState(false);
    const [otpInput, setOtpInput] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [info, setInfo] = useState<string | null>(null);

    const [forgotOpen, setForgotOpen] = useState(false);
    const [forgotEmail, setForgotEmail] = useState("");
    const [forgotMessage, setForgotMessage] = useState<string | null>(null);

    useEffect(() => {
        if (searchParams.get("registered") === "1") {
            setInfo("Account created successfully! Please log in.");
        }
    }, [searchParams]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setError(null);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            await signInWithEmailAndPassword(auth, form.email, form.password);

            // Firebase sets the session async → small delay makes it stable
            setTimeout(() => router.replace("/dashboard"), 50);
        } catch (err) {
            console.error(err);
            setError("Incorrect Email or Password.");
        } finally {
            setLoading(false);
        }
    };

    // --- [FIX 1] ---
    // Swapped window.location.href for router.push()
    const handleOtpVerify = (e: React.FormEvent) => {
        e.preventDefault();

        if (otpInput === DEMO_OTP) {
            setTimeout(() => router.replace("/dashboard"), 50);
        } else {
            setError("Invalid OTP.");
        }
    };


    // --- [FIX 2] ---
    // Swapped window.location.href for router.push()
    const handleGoogleLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
            // Now using the fast Next.js router
            router.push("/dashboard");
        } catch (err) {
            console.error(err);
            setError("Google sign in failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setForgotMessage(null);

        try {
            await sendPasswordResetEmail(auth, forgotEmail);
            setForgotMessage("✔ Reset email sent! Check your inbox.");
        } catch (err) {
            console.error(err);
            setForgotMessage("✘ Failed to send reset email.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-50 via-white to-orange-50 px-4">
            <div className="w-full max-w-lg bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-blue-100">
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
                    Welcome back
                </h1>
                <p className="text-center text-gray-500 mb-6">
                    Login to access your Modulae dashboard.
                </p>

                {info && (
                    <div className="mb-4 text-sm text-green-700 bg-green-50 border p-2 rounded-md">
                        {info}
                    </div>
                )}

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 border p-2 rounded-md">
                        {error}
                    </div>
                )}

                {/* LOGIN FORM */}
                {!otpStep && (
                    <>
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    required
                                    value={form.email}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-3 py-2 border rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-3 py-2 border rounded-md"
                                />

                                <p
                                    onClick={() => setForgotOpen(true)}
                                    className="mt-1 text-xs text-right text-orange-400 hover:underline cursor-pointer"
                                >
                                    Forgot Password?
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 mt-2 bg-orange-400 hover:bg-orange-500 text-white rounded-lg"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        <div className="flex items-center my-4">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="px-3 text-xs text-gray-400">OR</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full py-3 border rounded-lg flex items-center justify-center gap-2"
                        >
                            <p className="text-xl font-semibold text-orange-500">Login</p>
                            <p className="text-xl font-semibold">with</p>
                            <Image src="/google.png" alt="Google" width={100} height={20} />
                        </button>

                        <p className="mt-4 text-center text-sm text-gray-500">
                            Don't have an account?{" "}
                            <a href="/auth/register" className="text-orange-400 font-semibold">
                                Sign up
                            </a>
                        </p>
                    </>
                )}

                {/* OTP STEP */}
                {otpStep && (
                    <form onSubmit={handleOtpVerify} className="space-y-4 mt-4">
                        <h3 className="text-lg font-semibold text-center">Enter Demo OTP</h3>

                        <input
                            type="text"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            maxLength={6}
                            className="mt-2 w-full px-3 py-2 text-center border rounded-md tracking-widest"
                        />

                        <button
                            type="submit"
                            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                        >
                            Verify & Go to Dashboard
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setOtpStep(false);
                                setOtpInput("");
                            }}
                            className="w-full text-xs text-gray-500"
                        >
                            ← Back to login
                        </button>
                    </form>
                )}

                {/* FORGOT PASSWORD MODAL */}
                {forgotOpen && (
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center">
                        <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm w-full">
                            <h3 className="text-lg font-semibold mb-2">
                                Reset your password
                            </h3>

                            <form onSubmit={handleForgotPassword} className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="Enter your registered email"
                                    required
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md"
                                />

                                {forgotMessage && (
                                    <p className="text-sm text-center text-green-600">
                                        {forgotMessage}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md"
                                >
                                    Send Reset Email
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setForgotOpen(false);
                                        setForgotEmail("");
                                        setForgotMessage(null);
                                    }}
                                    className="w-full py-1 text-xs text-gray-500"
                                >
                                    Cancel
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}