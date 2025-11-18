/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopOfferBar from "../components/TopOfferBar";
import AccountSidebar from "../components/AccountSidebar";

import { db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Image from "next/image";

export default function WishlistPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [wishlist, setWishlist] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) router.push("/auth/login");
    }, [loading, user]);

    // ========================= Fetch Wishlist =========================
    useEffect(() => {
        if (!user) return;

        const fetchWishlist = async () => {
            try {
                const userRef = doc(db, "users", user.uid);
                const snap = await getDoc(userRef);

                if (snap.exists()) {
                    const data = snap.data();
                    setWishlist(data.wishlist || []);
                }
            } catch (err) {
                console.error("Error loading wishlist:", err);
            } finally {
                setFetching(false);
            }
        };

        fetchWishlist();
    }, [user]);

    // ========================= Remove Item =========================
    const removeItem = async (slug: string) => {
        if (!user) return; // <-- Required for build

        try {
            const updatedList = wishlist.filter((w) => w.slug !== slug);

            await updateDoc(doc(db, "users", user.uid), {
                wishlist: updatedList,
            });

            setWishlist(updatedList);
        } catch (err) {
            console.error("Error removing item:", err);
        }
    };


    // ========================= Add to Cart =========================
    const addToCart = async (item: any) => {
        try {
            if (!user) return;
            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);

            if (!snap.exists()) return;

            const data = snap.data();
            const cart = data.cart || [];

            const existing = cart.find((c: any) => c.slug === item.slug);

            const newCart = existing
                ? cart.map((c: any) =>
                    c.slug === item.slug ? { ...c, qty: c.qty + 1 } : c
                )
                : [...cart, { ...item, qty: 1 }];

            await updateDoc(userRef, { cart: newCart });

            alert("✔ Added to Cart");

        } catch (err) {
            console.error("Error adding to cart:", err);
        }
    };

    // ========================= Loading =========================
    if (loading || fetching) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            <TopOfferBar />
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8">
                <AccountSidebar />

                <div className="flex-1 bg-white rounded-xl shadow-sm p-6 border">
                    <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>

                    {/* ==================== Empty Wishlist ==================== */}
                    {wishlist.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-lg border">
                            <h3 className="text-xl font-semibold text-gray-700">
                                Your wishlist is empty
                            </h3>
                            <a
                                href="/"
                                className="mt-4 inline-block px-6 py-3 bg-orange-500 text-white rounded-lg"
                            >
                                Browse Products
                            </a>
                        </div>
                    )}

                    {/* ==================== Wishlist Items ==================== */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {wishlist.map((item, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 p-4 rounded-xl border shadow-sm"
                            >
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    width={200}
                                    height={150}
                                    className="rounded-lg object-cover w-full h-40"
                                />

                                <h3 className="font-semibold text-lg mt-3">{item.title}</h3>

                                <p className="text-orange-600 font-bold text-xl mt-1">
                                    ₹{item.price}
                                </p>

                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={() => addToCart(item)}
                                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                                    >
                                        Add to Cart
                                    </button>

                                    <button
                                        onClick={() => removeItem(item.slug)}
                                        className="text-red-500 font-semibold underline"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            <Footer />
        </>
    );
}
