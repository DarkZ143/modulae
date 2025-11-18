"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopOfferBar from "../components/TopOfferBar";
import LatestProducts from "../components/LatestProduct";
import BlogSection from "../components/blog";

import { rtdb, db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { doc, getDoc } from "firebase/firestore";

export default function DashboardPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    const [cartCount, setCartCount] = useState(0);
    const [wishlistCount, setWishlistCount] = useState(0);
    const [ordersCount, setOrdersCount] = useState(0);

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.replace("/auth/login");
        }
    }, [loading, user]);

    // ==================== FETCH CART COUNT ====================
    useEffect(() => {
        if (!user) return;

        const cartRef = ref(rtdb, `carts/${user.uid}`);
        const unsubscribe = onValue(cartRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const count = Object.keys(data).length;
                setCartCount(count);
            } else {
                setCartCount(0);
            }
        });

        return () => unsubscribe();
    }, [user]);

    // ==================== FETCH WISHLIST COUNT ====================
    useEffect(() => {
        if (!user) return;

        const userRef = doc(db, "users", user.uid);

        const fetchWishlist = async () => {
            const snap = await getDoc(userRef);
            if (snap.exists()) {
                const data = snap.data();
                const wishlist = data.wishlist || [];
                setWishlistCount(wishlist.length);
            }
        };

        fetchWishlist();
    }, [user]);

    // ==================== FETCH ORDERS COUNT ====================
    useEffect(() => {
        if (!user) return;

        const userRef = doc(db, "users", user.uid);

        const fetchOrders = async () => {
            const snap = await getDoc(userRef);
            if (snap.exists()) {
                const data = snap.data();
                const orders = data.orders || [];
                setOrdersCount(orders.length);
            }
        };

        fetchOrders();
    }, [user]);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <>
            <TopOfferBar />
            <Navbar />

            {/* ===================== DASHBOARD ===================== */}
            <div className="min-h-screen bg-gray-100 px-6 py-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

                    {/* ===================== LEFT SIDEBAR ===================== */}
                    <aside className="bg-white p-6 shadow-lg rounded-xl border space-y-6 
    h-fit lg:sticky lg:top-28">
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">My Account</h2>
                            <p className="text-sm text-gray-500 mt-1">
                                {user.email}
                            </p>
                        </div>

                        <nav className="space-y-3 text-gray-700">
                            <a href="/dashboard" className="block p-3 rounded-lg bg-orange-100 text-orange-600 font-semibold">
                                Dashboard
                            </a>

                            <a href="/my-orders" className="block p-3 rounded-lg hover:bg-gray-100">
                                My Orders
                            </a>

                            <a href="/wishlist" className="block p-3 rounded-lg hover:bg-gray-100">
                                Wishlist
                            </a>

                            <a href="/addresses" className="block p-3 rounded-lg hover:bg-gray-100">
                                Saved Addresses
                            </a>

                            <a href="/edit-profile" className="block p-3 rounded-lg hover:bg-gray-100">
                                Edit Profile
                            </a>

                            <a href="/settings" className="block p-3 rounded-lg hover:bg-gray-100">
                                Settings
                            </a>
                        </nav>
                    </aside>

                    {/* ===================== MAIN ===================== */}
                    <main className="md:col-span-3 space-y-8">

                        <section>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Welcome back 👋
                            </h1>
                            <p className="text-gray-600">
                                Here’s your account summary at a glance.
                            </p>
                        </section>

                        {/* ===================== DASHBOARD CARDS ===================== */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            <div className="bg-white border shadow-sm p-6 rounded-xl hover:shadow-md transition">
                                <h3 className="text-lg font-semibold text-gray-700">Total Orders</h3>
                                <p className="text-3xl font-bold text-orange-600 mt-3">{ordersCount}</p>
                            </div>

                            <div className="bg-white border shadow-sm p-6 rounded-xl hover:shadow-md transition">
                                <h3 className="text-lg font-semibold text-gray-700">Wishlist</h3>
                                <p className="text-3xl font-bold text-orange-600 mt-3">{wishlistCount}</p>
                            </div>

                            <div className="bg-white border shadow-sm p-6 rounded-xl hover:shadow-md transition">
                                <h3 className="text-lg font-semibold text-gray-700">Cart Items</h3>
                                <p className="text-3xl font-bold text-orange-600 mt-3">{cartCount}</p>
                            </div>

                        </div>

                        {/* ===================== PROFILE BOX ===================== */}
                        <div className="bg-white border shadow-sm p-6 rounded-xl">
                            <h2 className="text-xl font-bold text-gray-800">Account Info</h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 text-gray-700">

                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="font-semibold">{user.email}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Member Since</p>
                                    <p className="font-semibold">{user.metadata.creationTime}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Account Status</p>
                                    <p className="text-green-600 font-semibold">Active</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">Authentication</p>
                                    <p className="font-semibold">
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

            {/* Product suggestions & blog */}
            <LatestProducts />
            <BlogSection />
            <Footer />
        </>
    );
}
