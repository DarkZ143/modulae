/* eslint-disable @typescript-eslint/no-explicit-any */
// app/auth/register/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
    createUserWithEmailAndPassword,
    updateProfile,
    signInWithPopup,
    User,
} from "firebase/auth";

// [FIX 1] Changed imports from "firebase/database" to "firebase/firestore"
import { doc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider } from "@/lib/firebase";

const DEV_OTP = "143143";           // ⭐ YOUR OTP
const OTP_EXPIRY_MS = 2 * 60 * 1000; // 2 min

function validatePassword(password: string) {
    return {
        minLength: password.length >= 8,
        hasUpper: /[A-Z]/.test(password),
        hasLower: /[a-z]/.test(password),
        hasDigit: /[0-9]/.test(password),
        hasSpecial: /[^A-Za-z0-9]/.test(password),
    };
}

export default function RegisterPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // OTP STATES
    const [otpSent, setOtpSent] = useState(false);
    const [otpEntered, setOtpEntered] = useState("");
    const [otpVerified, setOtpVerified] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);

    const pwdChecks = validatePassword(form.password);
    const isPasswordValid =
        pwdChecks.minLength &&
        pwdChecks.hasUpper &&
        pwdChecks.hasLower &&
        pwdChecks.hasDigit &&
        pwdChecks.hasSpecial;

    useEffect(() => {
        let timer: any;
        if (otpSent && otpTimer > 0) {
            timer = setInterval(() => setOtpTimer((t) => t - 1), 1000);
        }
        return () => clearInterval(timer);
    }, [otpSent, otpTimer]);

    const handleChange = (e: any) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors(null);
    };

    // [FIX 2] Rewritten to use Firestore functions (doc, setDoc)
    // This is the CORRECT code for Realtime Database
    const saveUserToDB = async (user: User) => {
        // This is the correct Firestore syntax
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, {
            uid: user.uid,
            name: user.displayName,
            email: user.email,
            createdAt: new Date().toISOString(),
            provider: user.providerData[0]?.providerId || "password",
        });
    };

    // -------------------------- OTP SEND --------------------------
    const handleSendOTP = () => {
        if (!form.email.includes("@") || !form.email.includes(".")) {
            setErrors("Please enter a valid email address.");
            return;
        }

        setErrors(null);
        setOtpSent(true);
        setOtpVerified(false);
        setOtpTimer(120); // 2 minutes
    };

    // -------------------------- OTP VERIFY --------------------------
    const handleVerifyOTP = () => {
        if (otpTimer <= 0) {
            setErrors("OTP expired. Please resend.");
            return;
        }

        if (otpEntered === DEV_OTP) {
            setOtpVerified(true);
            setErrors(null);
        } else {
            setErrors("Invalid OTP. Try again.");
        }
    };

    // -------------------------- FINAL SUBMIT --------------------------
    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setErrors(null);

        if (!otpVerified) {
            setErrors("Please verify OTP before continuing.");
            return;
        }

        if (!isPasswordValid) {
            setErrors("Please use a strong password.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setErrors("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const cred = await createUserWithEmailAndPassword(
                auth,
                form.email,
                form.password
            );

            await updateProfile(cred.user, { displayName: form.fullName });
            await cred.user.reload();
            await saveUserToDB(cred.user); // This will now work correctly

            // [FIX 3] Reverted to router.push (better than full page refresh)
            router.push("/auth/login?registered=1");

        } catch (err: any) {
            console.error(err);
            setErrors(err.message);
        } finally {
            // This will now be reached, stopping the infinite loading
            setLoading(false);
        }
    };


    // -------------------------- GOOGLE SIGNUP --------------------------
    const handleGoogleSignUp = async () => {
        setLoading(true);

        try {
            const result = await signInWithPopup(auth, googleProvider);
            await saveUserToDB(result.user); // This function now works
            router.push("/dashboard");
        } catch (err: any) {
            console.error(err);
            setErrors(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ======================================================================
    // ========================== JSX UI CODE ===============================
    // ======================================================================

    return (
        <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-orange-50 via-white to-blue-50 px-4">
            <div className="w-full max-w-lg bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-orange-100">

                <h1 className="text-3xl font-bold text-gray-900 text-center mb-2">
                    Create your account
                </h1>

                <p className="text-center text-gray-500 mb-6">
                    Join Modulae to explore premium modular furniture.
                </p>

                {errors && (
                    <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                        {errors}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-medium">Full Name</label>
                        <input
                            name="fullName"
                            required
                            value={form.fullName}
                            onChange={handleChange}
                            className="mt-1 w-full px-3 py-2 border rounded-md outline-none"
                        />
                    </div>

                    {/* Email + Send OTP */}
                    <div>
                        <label className="block text-sm font-medium">Email Address</label>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                name="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                disabled={otpVerified}
                                className="mt-1 w-full px-3 py-2 border rounded-md outline-none"
                            />
                            {!otpVerified && (
                                <button
                                    type="button"
                                    onClick={handleSendOTP}
                                    className="mt-1 px-4 py-2 bg-orange-500 text-white rounded-md"
                                >
                                    Send OTP
                                </button>
                            )}
                        </div>

                        {/* OTP Input */}
                        {otpSent && !otpVerified && (
                            <div className="mt-3">
                                <label className="text-sm font-medium">
                                    Enter OTP (expires in: {otpTimer}s)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        maxLength={6}
                                        value={otpEntered}
                                        onChange={(e) => setOtpEntered(e.target.value)}
                                        className="mt-1 w-full px-3 py-2 border rounded-md outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={handleVerifyOTP}
                                        className="mt-1 px-4 py-2 bg-green-500 text-white rounded-md"
                                    >
                                        Verify
                                    </button>
                                </div>
                            </div>
                        )}

                        {otpVerified && (
                            <p className="mt-2 text-green-600 text-sm font-medium">
                                ✔ OTP Verified Successfully
                            </p>
                        )}
                    </div>

                    {/* Password Fields Only After OTP */}
                    {otpVerified && (
                        <>
                            {/* Password */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Create Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    required
                                    value={form.password}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-3 py-2 border rounded-md outline-none"
                                />

                                <div className="mt-2 grid grid-cols-2 gap-1 text-xs">
                                    <p className={pwdChecks.minLength ? "text-green-600" : "text-gray-400"}>
                                        • Min 8 characters
                                    </p>
                                    <p className={pwdChecks.hasUpper ? "text-green-600" : "text-gray-400"}>
                                        • Uppercase letter
                                    </p>
                                    <p className={pwdChecks.hasLower ? "text-green-600" : "text-gray-400"}>
                                        • Lowercase letter
                                    </p>
                                    <p className={pwdChecks.hasDigit ? "text-green-600" : "text-gray-400"}>
                                        • One number
                                    </p>
                                    <p className={pwdChecks.hasSpecial ? "text-green-600" : "text-gray-400"}>
                                        • Special character
                                    </p>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    required
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    className="mt-1 w-full px-3 py-2 border rounded-md outline-none"
                                />
                            </div>
                        </>
                    )}

                    {/* Submit */}
                    {otpVerified && (
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 mt-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    )}
                </form>

                {/* Divider */}
                <div className="flex items-center my-4">
                    <div className="flex-1 h-px bg-gray-200" />
                    <span className="px-3 text-xs text-gray-400">OR</span>
                    <div className="flex-1 h-px bg-gray-200" />
                </div>

                {/* Google Signup */}
                <button
                    onClick={handleGoogleSignUp}
                    disabled={loading}
                    className="w-full py-3 border border-gray-300 rounded-lg flex items-center justify-center gap-2 bg-white hover:bg-gray-50 transition"
                >
                    <p className="text-xl font-bold text-orange-500">Signup</p>
                    <p className="text-xl font-semibold">with</p>
                    <Image src="/google.png" alt="Google" width={100} height={20} />
                </button>

                <p className="mt-4 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <a href="/auth/login" className="text-orange-500 font-semibold hover:underline">
                        Login
                    </a>
                </p>
            </div>
        </div>
    );
}