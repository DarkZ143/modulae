/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
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

            // ✅ REDIRECT TO /shop instead of /dashboard
            setTimeout(() => router.replace("/shop"), 50);
        } catch (err) {
            console.error(err);
            setError("Incorrect Email or Password.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpVerify = (e: React.FormEvent) => {
        e.preventDefault();

        if (otpInput === DEMO_OTP) {
            // ✅ REDIRECT TO /shop
            setTimeout(() => router.replace("/shop"), 50);
        } else {
            setError("Invalid OTP.");
        }
    };

    const handleGoogleLogin = async () => {
        setError(null);
        setLoading(true);
        try {
            await signInWithPopup(auth, googleProvider);
            // ✅ REDIRECT TO /shop
            router.push("/shop");
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
            <div className="w-full max-w-lg bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border-gray-400border-blue-100">
                <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
                    Welcome back
                </h1>
                <p className="text-center text-gray-500 mb-6">
                    Login to access your Modulae account.
                </p>

                {info && (
                    <div className="mb-4 text-sm text-green-700 bg-green-50 border-gray-400p-2 rounded-md">
                        {info}
                    </div>
                )}

                {error && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 border-gray-400p-2 rounded-md">
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
                                    className="mt-1 w-full px-3 py-2 border border-orange-300 rounded-md focus:ring-2 focus:ring-orange-200 outline-none"
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
                                    className="mt-1 w-full px-3 py-2 border border-orange-300 rounded-md focus:ring-2 focus:ring-orange-200 outline-none"
                                />

                                <p
                                    onClick={() => setForgotOpen(true)}
                                    className="mt-1 text-xs text-right text-orange-500 hover:underline cursor-pointer font-medium"
                                >
                                    Forgot Password?
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 mt-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition disabled:opacity-70"
                            >
                                {loading ? "Logging in..." : "Login"}
                            </button>
                        </form>

                        <div className="flex items-center my-6">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="px-3 text-xs text-gray-400 font-semibold">OR LOGIN WITH</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            className="w-full py-3 border border-gray-200 rounded-lg flex items-center justify-center gap-3 hover:bg-orange-50 transition"
                        ><span className="text-orange-600 font-semibold text-2xl">Login </span><span className="text-gray-700 font-medium text-xl">with</span>
                            <Image src="/google.png" alt="Google" width={100} height={20} />

                        </button>

                        <p className="mt-6 text-center text-sm text-gray-500">
                            Don't have an account?{" "}
                            <a href="/auth/register" className="text-orange-500 font-bold hover:underline">
                                Sign up
                            </a>
                        </p>
                    </>
                )}

                {/* OTP STEP (Placeholder Logic from your snippet) */}
                {otpStep && (
                    <form onSubmit={handleOtpVerify} className="space-y-4 mt-4">
                        <h3 className="text-lg font-semibold text-center">Enter Demo OTP</h3>

                        <input
                            type="text"
                            value={otpInput}
                            onChange={(e) => setOtpInput(e.target.value)}
                            maxLength={6}
                            className="mt-2 w-full px-3 py-2 text-center border-gray-400rounded-md tracking-widest text-xl font-mono"
                            placeholder="••••••"
                        />

                        <button
                            type="submit"
                            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition"
                        >
                            Verify & Continue
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setOtpStep(false);
                                setOtpInput("");
                            }}
                            className="w-full text-xs text-gray-500 hover:text-gray-800 mt-2 underline"
                        >
                            ← Back to login options
                        </button>
                    </form>
                )}

                {/* FORGOT PASSWORD MODAL */}
                {forgotOpen && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-white p-6 rounded-xl shadow-2xl max-w-sm w-full animate-fade-in">
                            <h3 className="text-lg font-bold mb-2 text-gray-900">
                                Reset Password
                            </h3>
                            <p className="text-sm text-gray-500 mb-4">Enter your email to receive a reset link.</p>

                            <form onSubmit={handleForgotPassword} className="space-y-3">
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    required
                                    value={forgotEmail}
                                    onChange={(e) => setForgotEmail(e.target.value)}
                                    className="w-full px-3 py-2 border-gray-400rounded-md focus:ring-2 focus:ring-orange-200 outline-none"
                                />

                                {forgotMessage && (
                                    <p className={`text-sm text-center font-medium ${forgotMessage.includes("✔") ? "text-green-600" : "text-red-600"}`}>
                                        {forgotMessage}
                                    </p>
                                )}

                                <button
                                    type="submit"
                                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md font-bold transition"
                                >
                                    Send Reset Link
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setForgotOpen(false);
                                        setForgotEmail("");
                                        setForgotMessage(null);
                                    }}
                                    className="w-full py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-md transition"
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