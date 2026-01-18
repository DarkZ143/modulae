/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link"; // Added Link for tracking
import { ref, onValue } from "firebase/database"; // Use Realtime Database
import { auth, rtdb } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AccountSidebar from "../components/AccountSidebar";
import { Package, ChevronRight } from "lucide-react";
import LatestProducts from "../components/LatestProduct";

// Order Interface for Type Safety
interface Order {
    id: string;
    date: string;
    status: string;
    total: number;
    items: any[];
}

export default function MyOrdersPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Check Auth & Fetch Orders
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (!currentUser) {
                router.push("/auth/login");
                return;
            }
            setUser(currentUser);

            // Fetch from Realtime Database
            const ordersRef = ref(rtdb, `orders/${currentUser.uid}`);
            onValue(ordersRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const ordersList = Object.keys(data).map((key) => ({
                        id: key,
                        ...data[key],
                    }));
                    // Sort by date (newest first)
                    ordersList.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
                    setOrders(ordersList);
                } else {
                    setOrders([]);
                }
                setLoading(false);
            });
        });

        return () => unsubscribe();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>

            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-10 flex flex-col lg:flex-row gap-8 min-h-[60vh]">


                {/* LEFT SIDEBAR */}
                <aside className="bg-white p-6 shadow-lg rounded-xl border-gray-400space-y-6 h-fit lg:sticky lg:top-28">
                    <div>
                        <h2 className="text-xl font-bold text-gray-800">My Account</h2>
                        <p className="text-sm text-gray-500 mt-1 truncate">{user.email}</p>
                    </div>

                    <nav className="space-y-2 text-gray-700">
                        <Link href="/profile" className="block p-3 rounded-lg  hover:bg-gray-100 transition" >Dashboard</Link>
                        <Link href="/my-orders" className="block p-3 rounded-lg bg-orange-100 text-orange-600 font-semibold">My Orders</Link>
                        <Link href="/wishlist" className="block p-3 rounded-lg hover:bg-gray-100 transition">Wishlist</Link>
                        <Link href="/addresses" className="block p-3 rounded-lg hover:bg-gray-100 transition">Saved Addresses</Link>
                        <Link href="/settings" className="block p-3 rounded-lg hover:bg-gray-100 transition">Settings</Link>
                    </nav>
                </aside>

                <div className="flex-1 bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                    <h2 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h2>

                    {/* No orders state */}
                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Package className="w-8 h-8 text-orange-500" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">No orders yet</h3>
                            <p className="text-gray-500 mt-2 mb-6">Looks like you haven&apos;t made your choice yet.</p>
                            <Link
                                href="/"
                                className="inline-block px-8 py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition shadow-lg shadow-orange-200"
                            >
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        /* Orders List */
                        <div className="space-y-6">
                            {orders.map((order) => (
                                <div key={order.id} className="border border-gray-200 rounded-xl p-5 shadow-sm bg-white hover:shadow-md transition-all">

                                    {/* Order Header */}
                                    <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 pb-4 border-b border-gray-100 gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <h3 className="font-bold text-gray-900">Order <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{order.id}</span></h3>
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide ${order.status === "Delivered" ? "bg-green-100 text-green-700" :
                                                    order.status === "Processing" ? "bg-yellow-100 text-yellow-700" :
                                                        order.status === "Cancelled" ? "bg-red-100 text-red-700" :
                                                            "bg-blue-100 text-blue-700"
                                                    }`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-xs">
                                                Placed on {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
                                            </p>
                                        </div>

                                        <Link
                                            href={`/order-tracking?id=${order.id}`}
                                            className="text-sm font-bold text-orange-600 hover:text-orange-700 flex items-center gap-1 group"
                                        >
                                            Track Order <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </div>

                                    {/* Order Items */}
                                    <div className="space-y-4">
                                        {order.items.map((item: any, i: number) => (
                                            <div key={i} className="flex gap-4 items-center">
                                                <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0 border">
                                                    <Image
                                                        src={item.image || "/placeholder.png"}
                                                        alt={item.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-gray-800 truncate">{item.title}</p>
                                                    <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                                                </div>

                                                <p className="font-bold text-gray-900">₹{item.price * item.qty}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Footer */}
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                                        <p className="text-sm text-gray-500">Total Amount</p>
                                        <p className="text-xl font-bold text-gray-900">₹{order.total}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <LatestProducts />

            <Footer />
        </>
    );
}