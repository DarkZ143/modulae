/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Link from "next/link"; // Added Link
import { User, Package, Heart, MapPin, Settings } from "lucide-react"; // Added Icons

import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SettingsPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [settings, setSettings] = useState<any>({
        emailNotifications: true,
        offerNotifications: true,
        smsUpdates: false,
        profileVisibility: true,
        darkMode: false,
        language: "English",
    });

    const [loadingData, setLoadingData] = useState(true);
    const [deleteModal, setDeleteModal] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);

    // Redirect if user not logged in
    useEffect(() => {
        if (!loading && !user) router.push("/auth/login");
    }, [loading, user]);

    // Fetch user settings
    useEffect(() => {
        if (!user) return;

        const fetchSettings = async () => {
            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);

            if (snap.exists()) {
                const data = snap.data();
                setSettings({
                    emailNotifications: data.emailNotifications ?? true,
                    offerNotifications: data.offerNotifications ?? true,
                    smsUpdates: data.smsUpdates ?? false,
                    profileVisibility: data.profileVisibility ?? true,
                    darkMode: data.darkMode ?? false,
                    language: data.language ?? "English",
                });
            }

            setLoadingData(false);
        };

        fetchSettings();
    }, [user]);

    // Update settings
    const updateSetting = async (key: string, value: any) => {
        if (!user) return;

        setSettings((prev: any) => ({ ...prev, [key]: value }));
        await updateDoc(doc(db, "users", user.uid), { [key]: value });
    };

    // Delete account
    const deleteAccount = async () => {
        if (!user) return;

        await deleteDoc(doc(db, "users", user.uid));

        alert("Your account has been deleted.");

        router.replace("/auth/login");
    };

    // Logout user
    const handleLogout = async () => {
        await signOut(auth);
        router.replace("/auth/login");
    };

    // ========================= Sidebar Component =========================
    const Sidebar = () => (
        <aside className="bg-white p-6 shadow-sm rounded-xl border-gray-400border-gray-100 h-fit lg:sticky lg:top-24 w-full lg:w-72 shrink-0">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
                    {user?.displayName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm text-gray-500">Hello,</p>
                    <h2 className="text-lg font-bold text-gray-800 truncate">{user?.displayName || "User"}</h2>
                </div>
            </div>

            <nav className="space-y-1">
                <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-orange-600 rounded-lg transition-colors">
                    <User className="w-5 h-5" /> Dashboard
                </Link>
                <Link href="/my-orders" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-orange-600 rounded-lg transition-colors">
                    <Package className="w-5 h-5" /> My Orders
                </Link>
                <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-orange-600 rounded-lg transition-colors">
                    <Heart className="w-5 h-5" /> My Wishlist
                </Link>
                <Link href="/addresses" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-orange-600 rounded-lg transition-colors">
                    <MapPin className="w-5 h-5" /> Saved Addresses
                </Link>
                {/* Active Link */}
                <Link href="/settings" className="flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 font-semibold rounded-lg transition-colors">
                    <Settings className="w-5 h-5" /> Settings
                </Link>
                
            </nav>
        </aside>
    );

    if (loading || loadingData)
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent animate-spin rounded-full"></div>
            </div>
        );

    return (
        <>

            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
                {/* Use the local Sidebar component */}
                <Sidebar />

                {/* Main Settings */}
                <div className="flex-1 bg-white rounded-xl shadow-sm shadow-orange-200 p-6 border-gray-400">
                    <h2 className="text-2xl font-bold mb-6">Settings</h2>

                    {/* NOTIFICATIONS */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Notifications</h3>

                        <SettingToggle
                            label="Email Notifications"
                            value={settings.emailNotifications}
                            onChange={(val) => updateSetting("emailNotifications", val)}
                        />

                        <SettingToggle
                            label="Offer & Discount Alerts"
                            value={settings.offerNotifications}
                            onChange={(val) => updateSetting("offerNotifications", val)}
                        />

                        <SettingToggle
                            label="SMS Order Updates"
                            value={settings.smsUpdates}
                            onChange={(val) => updateSetting("smsUpdates", val)}
                        />
                    </div>

                    {/* PRIVACY */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Privacy Settings</h3>

                        <SettingToggle
                            label="Profile Visibility"
                            value={settings.profileVisibility}
                            onChange={(val) => updateSetting("profileVisibility", val)}
                        />
                    </div>

                    {/* PREFERENCES */}
                    <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Preferences</h3>

                        

                        <div className="mt-4 flex justify-between items-center py-3 ">
                            <label className="font-semibold">Language</label>
                            <span className="font-medium">English</span>
                        </div>
                    </div>

                    {/* ACTIONS */}
                    <div className="border-t pt-6 flex items-center justify-between">
                        {/* Logout Button */}
                        <button
                            onClick={() => setLogoutModal(true)}
                            className="px-4 py-2 bg-gray-800 text-white rounded-lg"
                        >
                            Logout
                        </button>

                        {/* Delete Account */}
                        <button
                            onClick={() => setDeleteModal(true)}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg"
                        >
                            Delete My Account
                        </button>
                    </div>
                </div>
            </div>

            <Footer />

            {/* ---------------- LOGOUT MODAL ---------------- */}
            {logoutModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Logout Confirmation
                        </h3>
                        <p className="text-gray-600">Are you sure you want to logout?</p>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="px-4 py-2 border-gray-400rounded-lg"
                                onClick={() => setLogoutModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-4 py-2 bg-gray-800 text-white rounded-lg"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ---------------- DELETE MODAL ---------------- */}
            {deleteModal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-xl w-full max-w-md shadow-lg">
                        <h3 className="text-xl font-bold text-red-600 mb-2">Are you sure?</h3>
                        <p className="text-gray-600">
                            This will permanently delete your account and all data.
                        </p>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                className="px-4 py-2 border-gray-400rounded-lg"
                                onClick={() => setDeleteModal(false)}
                            >
                                Cancel
                            </button>

                            <button
                                className="px-4 py-2 bg-red-600 text-white rounded-lg"
                                onClick={deleteAccount}
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}

/* ------------------------ Sub Component ------------------------ */
function SettingToggle({
    label,
    value,
    onChange,
}: {
    label: string;
    value: boolean;
    onChange: (val: boolean) => void;
}) {
    return (
        <div className="flex justify-between items-center py-3 border-b">
            <p className="font-medium">{label}</p>
            <label className="flex items-center cursor-pointer">
                <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    className="hidden"
                />
                <div
                    className={`w-12 h-6 flex items-center bg-gray-300 rounded-full p-1 transition ${value ? "bg-orange-500" : ""
                        }`}
                >
                    <div
                        className={`bg-white w-5 h-5 rounded-full shadow transform transition ${value ? "translate-x-6" : ""
                            }`}
                    ></div>
                </div>
            </label>
        </div>
    );
}