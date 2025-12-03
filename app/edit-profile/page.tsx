/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AccountSidebar from "../components/AccountSidebar";

import { useAuth } from "../context/AuthContext";
import { db, auth } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { updatePassword, updateEmail } from "firebase/auth";

// --------------------------------------
// Country List (with flags)
// --------------------------------------
const countryList = [
    { name: "India", flag: "🇮🇳" },
    { name: "United States", flag: "🇺🇸" },
    { name: "United Kingdom", flag: "🇬🇧" },
    { name: "Australia", flag: "🇦🇺" },
    { name: "Canada", flag: "🇨🇦" },
    { name: "Germany", flag: "🇩🇪" },
    { name: "France", flag: "🇫🇷" },
    { name: "China", flag: "🇨🇳" },
    { name: "Japan", flag: "🇯🇵" },
    { name: "Brazil", flag: "🇧🇷" },
    { name: "Russia", flag: "🇷🇺" },
    { name: "Italy", flag: "🇮🇹" },
    { name: "Spain", flag: "🇪🇸" },
    { name: "Mexico", flag: "🇲🇽" },
    { name: "Netherlands", flag: "🇳🇱" },
    { name: "Switzerland", flag: "🇨🇭" },
    { name: "Sweden", flag: "🇸🇪" },
    { name: "Norway", flag: "🇳🇴" },
    { name: "South Korea", flag: "🇰🇷" },
    { name: "South Africa", flag: "🇿🇦" },
    { name: "New Zealand", flag: "🇳🇿" },
    { name: "Argentina", flag: "🇦🇷" },
    { name: "Saudi Arabia", flag: "🇸🇦" },
    { name: "UAE", flag: "🇦🇪" },
    { name: "Nepal", flag: "🇳🇵" },
    { name: "Bhutan", flag: "🇧🇹" },
    { name: "Sri Lanka", flag: "🇱🇰" },
    { name: "Bangladesh", flag: "🇧🇩" },
    { name: "Pakistan", flag: "🇵🇰" },
    { name: "Indonesia", flag: "🇮🇩" },
    { name: "Malaysia", flag: "🇲🇾" },
    { name: "Singapore", flag: "🇸🇬" }
];

export default function EditProfilePage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [altPhone, setAltPhone] = useState("");
    const [nationality, setNationality] = useState("");
    const [countrySuggestions, setCountrySuggestions] = useState<any[]>([]);

    const [newPassword, setNewPassword] = useState("");
    const [otpEntered, setOtpEntered] = useState("");

    // ---------------------- Fetch User Data ----------------------
    useEffect(() => {
        if (!loading && !user) router.push("/auth/login");
    }, [loading, user]);

    useEffect(() => {
        if (!user) return;

        const loadUser = async () => {
            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);

            if (snap.exists()) {
                const data = snap.data();
                setFullName(data.fullName ?? "");
                setEmail(data.email ?? "");
                setPhone(data.phone ?? "");
                setAltPhone(data.altPhone ?? "");
                setNationality(data.nationality ?? "");
            }
        };

        loadUser();
    }, [user]);

    // ---------------------- Save Profile ----------------------
    const handleSave = async () => {
        if (!user) return;

        // Mock OTP System (code = 143143)
        if (otpEntered !== "143143") {
            alert("Invalid OTP. Enter 143143");
            return;
        }

        const userRef = doc(db, "users", user.uid);

        await updateDoc(userRef, {
            fullName,
            phone,
            altPhone,
            nationality,
        });

        // Update Email (Firebase Auth)
        if (email !== user.email) {
            try {
                await updateEmail(auth.currentUser!, email);
            } catch (err) {
                console.error(err);
            }
        }

        // Password Update
        if (newPassword.length >= 6) {
            try {
                await updatePassword(auth.currentUser!, newPassword);
            } catch (err) {
                console.error(err);
            }
        }

        alert("Profile updated successfully!");
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">Loading...</div>
        );
    }

    return (
        <>
            
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
                <AccountSidebar />

                <div className="flex-1 bg-white rounded-xl shadow-sm p-6 border">
                    <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

                    <div className="space-y-5">

                        {/* Full Name */}
                        <div>
                            <label className="font-semibold">Full Name</label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full border p-2 rounded mt-1"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="font-semibold">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full border p-2 rounded mt-1"
                            />

                            <input
                                type="text"
                                placeholder="Enter OTP (143143)"
                                className="w-full border p-2 rounded mt-2"
                                value={otpEntered}
                                onChange={(e) => setOtpEntered(e.target.value)}
                            />
                        </div>

                        {/* Phone Number */}
                        <div>
                            <label className="font-semibold">Phone Number</label>
                            <input
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={10}
                                value={phone}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    // Allow only digits
                                    if (/^\d*$/.test(v)) setPhone(v);
                                }}
                                className="w-full border p-2 rounded mt-1"
                                placeholder="Enter phone number"
                            />
                        </div>

                        {/* Alternate Phone Number */}
                        <div>
                            <label className="font-semibold">Alternate Phone Number</label>
                            <input
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                maxLength={10}
                                value={altPhone}
                                onChange={(e) => {
                                    const v = e.target.value;
                                    // Allow only digits
                                    if (/^\d*$/.test(v)) setAltPhone(v);
                                }}
                                className="w-full border p-2 rounded mt-1"
                                placeholder="Enter alternate phone"
                            />
                        </div>
                        

                        {/* Nationality with Flag Suggestions */}
                        <div className="relative">
                            <label className="font-semibold">Nationality</label>

                            <input
                                type="text"
                                className="w-full border p-2 rounded mt-1"
                                value={nationality}
                                placeholder="Search country..."
                                onChange={(e) => {
                                    const value = e.target.value;
                                    setNationality(value);

                                    if (!value.trim()) {
                                        setCountrySuggestions([]);
                                        return;
                                    }

                                    const filtered = countryList.filter((c) =>
                                        c.name.toLowerCase().includes(value.toLowerCase())
                                    );

                                    setCountrySuggestions(filtered);
                                }}
                            />

                            {/* Suggestions */}
                            {countrySuggestions.length > 0 && (
                                <ul className="absolute z-50 left-0 right-0 bg-white border rounded-lg mt-1 shadow-lg max-h-48 overflow-y-auto">
                                    {countrySuggestions.map((c) => (
                                        <li
                                            key={c.name}
                                            onClick={() => {
                                                setNationality(c.name);
                                                setCountrySuggestions([]);
                                            }}
                                            className="px-4 py-2 cursor-pointer flex items-center gap-2 hover:bg-gray-100"
                                        >
                                            <span className="text-xl">{c.flag}</span>
                                            <span>{c.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="font-semibold">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full border p-2 rounded mt-1"
                                placeholder="Enter new password (optional)"
                            />
                        </div>

                        {/* Save Button */}
                        <button
                            onClick={handleSave}
                            className="mt-6 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold"
                        >
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
