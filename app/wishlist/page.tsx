/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import Image from "next/image";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import {
    User,
    Package,
    Heart,
    MapPin,
    Settings,
    LogOut,
    ShoppingCart,
    Trash2,
} from "lucide-react";

import { db, rtdb } from "@/lib/firebase"; // db kept for future use
import { doc, getDoc, updateDoc } from "firebase/firestore"; // kept intentionally
import { ref, onValue, remove, set } from "firebase/database";

export default function WishlistPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [wishlist, setWishlist] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);

    /* ================= REDIRECT IF NOT LOGGED IN ================= */
    useEffect(() => {
        if (!loading && !user) router.push("/auth/login");
    }, [loading, user, router]);

    /* ================= FETCH WISHLIST (RTDB) ================= */
    useEffect(() => {
        if (!user) return;

        const wishlistRef = ref(rtdb, `wishlists/${user.uid}`);

        const unsubscribe = onValue(wishlistRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();

                const list = Object.keys(data).map((key) => ({
                    _key: key,          // Firebase key
                    ...data[key],       // productId, title, price, image
                }));

                setWishlist(list);
            } else {
                setWishlist([]);
            }
            setFetching(false);
        });

        return () => unsubscribe();
    }, [user]);

    /* ================= REMOVE FROM WISHLIST ================= */
    const removeItem = async (key: string) => {
        if (!user) return;
        await remove(ref(rtdb, `wishlists/${user.uid}/${key}`));
    };

    /* ================= ADD TO CART ================= */
    const addToCart = async (item: any) => {
        if (!user) return;

        await set(ref(rtdb, `carts/${user.uid}/${item.productId}`), {
            title: item.title,
            price: item.price,
            mrp: item.mrp || item.price,
            image: item.image,
            qty: 1,
            addedAt: Date.now(),
        });

        alert("✔ Added to Cart");
    };

    /* ================= SIDEBAR ================= */
    const Sidebar = () => (
        <aside className="bg-white p-6 shadow-sm rounded-xl border border-gray-100 h-fit lg:sticky lg:top-24 w-full lg:w-72 shrink-0">
            <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold text-xl">
                    {user?.displayName?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm text-gray-500">Hello,</p>
                    <h2 className="text-lg font-bold text-gray-800 truncate">
                        {user?.displayName || "User"}
                    </h2>
                </div>
            </div>

            <nav className="space-y-1">
                <Link href="/profile" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-orange-600 rounded-lg">
                    <User className="w-5 h-5" /> Dashboard
                </Link>
                <Link href="/my-orders" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-orange-600 rounded-lg">
                    <Package className="w-5 h-5" /> My Orders
                </Link>
                <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 bg-orange-50 text-orange-600 font-semibold rounded-lg">
                    <Heart className="w-5 h-5" /> My Wishlist
                </Link>
                <Link href="/addresses" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-orange-600 rounded-lg">
                    <MapPin className="w-5 h-5" /> Saved Addresses
                </Link>
                <Link href="/settings" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 hover:text-orange-600 rounded-lg">
                    <Settings className="w-5 h-5" /> Settings
                </Link>
                
            </nav>
        </aside>
    );

    /* ================= LOADING ================= */
    if (loading || fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            <Navbar />

            <div className="bg-gray-50 min-h-screen py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-8">

                    {/* LEFT SIDEBAR */}
                    <Sidebar />

                    {/* MAIN CONTENT */}
                    <div className="flex-1">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
                            <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Heart className="w-6 h-6 text-orange-500 fill-orange-500" />
                                My Wishlist ({wishlist.length})
                            </h1>

                            {wishlist.length === 0 ? (
                                <div className="flex flex-col items-center justify-center h-[300px] text-center">
                                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <Heart className="w-10 h-10 text-gray-300" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800">
                                        Your wishlist is empty
                                    </h3>
                                    <p className="text-gray-500 mb-6">
                                        Save items you love to buy later.
                                    </p>
                                    <Link
                                        href="/shop"
                                        className="px-6 py-2 bg-orange-600 text-white rounded-full font-semibold hover:bg-orange-700"
                                    >
                                        Start Shopping
                                    </Link>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {wishlist.map((item) => (
                                        <div
                                            key={item._key}
                                            className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition bg-white flex flex-col"
                                        >
                                            {/* Image */}
                                            <div className="relative w-full h-48 bg-gray-100 p-4 flex items-center justify-center">
                                                <Image
                                                    src={item.image || "/placeholder.png"}
                                                    alt={item.title}
                                                    fill
                                                    className="object-contain mix-blend-multiply group-hover:scale-105 transition"
                                                />
                                                <button
                                                    onClick={() => removeItem(item._key)}
                                                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Details */}
                                            <div className="p-4 flex flex-col flex-1">
                                                <h3 className="font-semibold text-gray-800 line-clamp-1 mb-1">
                                                    {item.title}
                                                </h3>

                                                <div className="flex items-end gap-2 mb-4">
                                                    <span className="text-lg font-bold text-gray-900">
                                                        ₹{item.price}
                                                    </span>
                                                </div>

                                                <button
                                                    onClick={() => addToCart(item)}
                                                    className="mt-auto w-full flex items-center justify-center gap-2 bg-orange-100 text-orange-700 py-2 rounded-lg font-semibold hover:bg-orange-200"
                                                >
                                                    <ShoppingCart className="w-4 h-4" /> Add to Cart
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </>
    );
}
