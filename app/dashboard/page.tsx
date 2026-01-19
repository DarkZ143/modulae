/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, rtdb } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

import LatestProducts from "@/app/components/LatestProduct";
import BlogSection from "@/app/components/blog";
import Link from "next/link";

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);

    /* ================= AUTH CHECK ================= */
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.replace("/auth/login");
            } else {
                setUser(currentUser);
                setLoading(false);
            }
        });
        return () => unsubscribe();
    }, [router]);

    /* ================= CART COUNT ================= */
    useEffect(() => {
        if (!user) return;
        const cartRef = ref(rtdb, `carts/${user.uid}`);
        return onValue(cartRef, (snapshot) => {
            setCartCount(snapshot.exists() ? Object.keys(snapshot.val()).length : 0);
        });
    }, [user]);

    /* ================= WISHLIST COUNT (NEW) ================= */
    useEffect(() => {
        if (!user) return;
        const wishlistRef = ref(rtdb, `wishlists/${user.uid}`);
        return onValue(wishlistRef, (snapshot) => {
            setWishlistCount(snapshot.exists() ? Object.keys(snapshot.val()).length : 0);
        });
    }, [user]);

    /* ================= ORDERS COUNT ================= */
    useEffect(() => {
        if (!user) return;
        const ordersRef = ref(rtdb, `orders/${user.uid}`);
        return onValue(ordersRef, (snapshot) => {
            setOrdersCount(snapshot.exists() ? Object.keys(snapshot.val()).length : 0);
        });
    }, [user]);

    /* ================= LOADING ================= */
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <>
            <Navbar />

            <div className="min-h-screen bg-gray-100 px-6 py-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* LEFT SIDEBAR */}
                    <aside className="bg-white p-6 shadow-lg rounded-xl space-y-6 h-fit lg:sticky lg:top-28">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">My Account</h2>
                            <p className="text-sm text-gray-500 mt-1 truncate">{user.email}</p>
                        </div>

                        <nav className="space-y-2 text-gray-700">
                            <Link href="/profile" className="block p-3 rounded-lg bg-orange-100 text-orange-600 font-semibold">
                                Dashboard
                            </Link>
                            <Link href="/my-orders" className="block p-3 rounded-lg hover:bg-gray-100 transition">
                                My Orders
                            </Link>
                            <Link href="/wishlist" className="block p-3 rounded-lg hover:bg-gray-100 transition">
                                Wishlist
                            </Link>
                            <Link href="/addresses" className="block p-3 rounded-lg hover:bg-gray-100 transition">
                                Saved Addresses
                            </Link>
                            <Link href="/settings" className="block p-3 rounded-lg hover:bg-gray-100 transition">
                                Settings
                            </Link>
                        </nav>
                    </aside>

                    {/* MAIN CONTENT */}
                    <main className="md:col-span-3 space-y-8">
                        <section>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Welcome back, {user.displayName || "User"} 👋
                            </h1>
                            <p className="text-gray-600 mt-1">
                                Here’s what’s happening with your account today.
                            </p>
                        </section>

                        {/* STATS */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div
                                className="bg-white p-6 rounded-xl hover:shadow-md transition cursor-pointer"
                                onClick={() => router.push("/my-orders")}
                            >
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Total Orders
                                </h3>
                                <p className="text-3xl font-bold text-orange-600 mt-3">
                                    {ordersCount}
                                </p>
                            </div>

                            <div
                                className="bg-white p-6 rounded-xl hover:shadow-md transition cursor-pointer"
                                onClick={() => router.push("/wishlist")}
                            >
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Wishlist
                                </h3>
                                <p className="text-3xl font-bold text-orange-600 mt-3">
                                    {wishlistCount}
                                </p>
                            </div>

                            <div
                                className="bg-white p-6 rounded-xl hover:shadow-md transition cursor-pointer"
                                onClick={() => router.push("/cart")}
                            >
                                <h3 className="text-lg font-semibold text-gray-700">
                                    Cart Items
                                </h3>
                                <p className="text-3xl font-bold text-orange-600 mt-3">
                                    {cartCount}
                                </p>
                            </div>
                        </div>

                        {/* ACCOUNT INFO */}
                        <div className="bg-white p-6 rounded-xl">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">
                                Account Details
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">
                                        Email Address
                                    </p>
                                    <p className="font-medium text-lg">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">
                                        Member Since
                                    </p>
                                    <p className="font-medium text-lg">
                                        {new Date(user.metadata.creationTime).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">
                                        Account Status
                                    </p>
                                    <p className="text-green-600 font-bold bg-green-100 inline-block px-2 py-1 rounded text-sm mt-1">
                                        Active
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-400 uppercase font-bold">
                                        Login Method
                                    </p>
                                    <p className="font-medium">
                                        {user.providerData[0]?.providerId === "google.com"
                                            ? "Google Login"
                                            : "Email & Password"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <LatestProducts />
            <BlogSection />
            <Footer />
        </>
    );
}
