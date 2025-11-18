/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import TopOfferBar from "../components/TopOfferBar";
import AccountSidebar from "../components/AccountSidebar";

import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";

export default function MyOrdersPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [orders, setOrders] = useState<any[]>([]);
    const [fetching, setFetching] = useState(true);

    // Redirect if user not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.push("/auth/login");
        }
    }, [loading, user]);

    // Fetch orders from Firestore
    useEffect(() => {
        if (!user) return;

        const fetchOrders = async () => {
            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);

            if (snap.exists()) {
                setOrders(snap.data().orders || []);
            }

            setFetching(false);
        };

        fetchOrders();
    }, [user]);

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
                    <h2 className="text-2xl font-bold mb-6">My Orders</h2>

                    {/* No orders */}
                    {orders.length === 0 && (
                        <div className="text-center py-20 bg-gray-50 rounded-lg border">
                            <h3 className="text-xl font-semibold text-gray-700">
                                You have no orders yet
                            </h3>
                            <a
                                href="/"
                                className="mt-4 inline-block px-6 py-3 bg-orange-500 text-white rounded-lg"
                            >
                                Start Shopping
                            </a>
                        </div>
                    )}

                    {/* Orders List */}
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <div
                                key={index}
                                className="border rounded-lg p-5 shadow-sm bg-gray-50"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-semibold">
                                        Order #{order.id}
                                    </h3>
                                    <span
                                        className={`text-sm px-3 py-1 rounded-full font-medium
                                            ${order.status === "Delivered" ? "bg-green-100 text-green-700" :
                                            order.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                                            "bg-blue-100 text-blue-700"}`
                                        }
                                    >
                                        {order.status}
                                    </span>
                                </div>

                                <p className="text-gray-600 text-sm mb-4">
                                    Ordered on:{" "}
                                    {new Date(order.orderDate).toLocaleDateString()}
                                </p>

                                {/* Order Items */}
                                <div className="space-y-4">
                                    {order.items.map((item: any, i: number) => (
                                        <div
                                            key={i}
                                            className="flex gap-4 items-center bg-white p-3 rounded-lg border"
                                        >
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                width={70}
                                                height={70}
                                                className="rounded-md object-cover border"
                                            />

                                            <div className="flex-1">
                                                <p className="font-semibold">{item.title}</p>
                                                <p className="text-gray-500 text-sm">
                                                    Qty: {item.qty}
                                                </p>
                                            </div>

                                            <p className="font-semibold text-orange-600">
                                                ₹{item.price * item.qty}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Total */}
                                <div className="text-right mt-4 border-t pt-3">
                                    <p className="text-lg font-bold">
                                        Total: ₹{order.totalAmount}
                                    </p>
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
