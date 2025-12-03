/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect, useState } from "react";
import { ref, onValue, remove, update } from "firebase/database";
import { rtdb, auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import TopOfferBar from "@/app/components/TopOfferBar";
import Image from "next/image";
import LatestProducts from "../components/LatestProduct";
import { Ticket, CheckCircle, X } from "lucide-react";

type CartItem = {
    title: string;
    price: number;
    mrp: number;
    image: string;
    qty: number;
};

export default function CartPage() {
    const [user, setUser] = useState<any>(null);
    const [cart, setCart] = useState<Record<string, CartItem>>({});
    const [loading, setLoading] = useState(true);

    // Voucher State
    const [activeVoucher, setActiveVoucher] = useState<any>(null);
    const [voucherError, setVoucherError] = useState("");

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (loggedUser) => {
            setUser(loggedUser);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        // Load Voucher from LocalStorage
        const savedVoucher = localStorage.getItem("activeVoucher");
        if (savedVoucher) {
            setActiveVoucher(JSON.parse(savedVoucher));
        }

        if (!user) {
            setLoading(false);
            return;
        }

        const cartRef = ref(rtdb, `carts/${user.uid}`);
        const unsub = onValue(cartRef, (snapshot) => {
            if (snapshot.exists()) {
                setCart(snapshot.val());
            } else {
                setCart({});
            }
            setLoading(false);
        });

        return () => unsub();
    }, [user]);

    const updateQty = async (slug: string, qty: number) => {
        if (qty < 1) return;
        await update(ref(rtdb, `carts/${user.uid}/${slug}`), { qty });
    };

    const removeItem = async (slug: string) => {
        await remove(ref(rtdb, `carts/${user.uid}/${slug}`));
    };

    const removeVoucher = () => {
        localStorage.removeItem("activeVoucher");
        setActiveVoucher(null);
        setVoucherError("");
    };

    // Calculations
    const totalPrice = Object.values(cart).reduce((acc, item) => acc + item.price * item.qty, 0);
    const totalMrp = Object.values(cart).reduce((acc, item) => acc + item.mrp * item.qty, 0);
    const productDiscount = totalMrp - totalPrice;

    // Voucher Logic
    let voucherDiscount = 0;
    let isVoucherValid = false;

    if (activeVoucher) {
        if (totalPrice >= (activeVoucher.minSpend || 0)) {
            // Assuming flat discount logic based on your description "₹500 Cashback"
            // You might need parsing logic if your voucher description varies (e.g. "% off")
            // For this demo, we'll assume a flat ₹500 if the title contains "500"

            // Simple parsing logic: Extract number from title if possible, or default
            const match = activeVoucher.title.match(/₹(\d+)/);
            voucherDiscount = match ? parseInt(match[1]) : 0;

            // If it's just a generic voucher without amount in title, maybe 10%?
            if (voucherDiscount === 0) voucherDiscount = Math.round(totalPrice * 0.05); // 5% fallback

            isVoucherValid = true;
        } else {
            isVoucherValid = false;
        }
    }

    const finalAmount = totalPrice - voucherDiscount;

    if (loading) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <>
                
                <Navbar />
                <div className="min-h-[60vh] flex flex-col items-center justify-center">
                    <h2 className="text-xl font-semibold">Please login to view your cart</h2>
                    <a href="/auth/login" className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600">Login</a>
                </div>
                <Footer />
            </>
        );
    }

    if (!Object.keys(cart).length) {
        return (
            <>
               
                <Navbar />
                <div className="min-h-[70vh] flex flex-col items-center justify-center">
                    <h2 className="text-2xl font-semibold text-gray-700">Your cart is empty</h2>
                    <a href="/" className="mt-4 bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-orange-600">Shop Now</a>
                </div>
                <LatestProducts />
                <Footer />
            </>
        );
    }

    return (
        <>
            
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

                {/* LEFT SECTION (CART ITEMS) */}
                <div className="lg:col-span-2 space-y-6">
                    {Object.entries(cart).map(([slug, item]) => (
                        <div key={slug} className="bg-white shadow-sm hover:shadow-md transition rounded-xl border border-gray-200 p-4 flex gap-6">
                            <Image src={item.image} alt={item.title} width={130} height={130} className="rounded-lg object-cover border" />
                            <div className="flex-1 space-y-2">
                                <h3 className="text-lg font-bold text-gray-800">{item.title}</h3>
                                <div className="text-sm text-gray-500">
                                    <p>Price: ₹{item.price}</p>
                                    <p className="line-through">MRP: ₹{item.mrp}</p>
                                </div>
                                <p className="text-orange-600 font-bold text-xl">₹{item.price * item.qty}</p>
                                <div className="flex items-center gap-4 mt-3">
                                    <button onClick={() => updateQty(slug, item.qty - 1)} className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-md text-lg">-</button>
                                    <span className="text-lg font-semibold">{item.qty}</span>
                                    <button onClick={() => updateQty(slug, item.qty + 1)} className="w-8 h-8 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-md text-lg">+</button>
                                </div>
                                <button onClick={() => removeItem(slug)} className="text-red-500 text-sm underline hover:text-red-700 mt-2">Remove Item</button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT SECTION (PRICE CARD) */}
                <div className="bg-white shadow-md rounded-xl border border-gray-200 p-6 h-fit sticky top-28">
                    <h3 className="text-xl font-bold mb-4 border-b pb-2">Price Details</h3>

                    <div className="space-y-3 text-gray-700">
                        <div className="flex justify-between"><span>Total MRP</span><span>₹{totalMrp}</span></div>
                        <div className="flex justify-between"><span>Product Discount</span><span className="text-green-600">- ₹{productDiscount}</span></div>

                        {/* VOUCHER SECTION */}
                        {activeVoucher && (
                            <div className={`p-3 rounded-lg border ${isVoucherValid ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} transition-all`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-2">
                                        <Ticket className={`w-5 h-5 ${isVoucherValid ? 'text-green-600' : 'text-red-500'}`} />
                                        <div>
                                            <p className={`text-sm font-bold ${isVoucherValid ? 'text-green-800' : 'text-red-700'}`}>
                                                {activeVoucher.title}
                                            </p>
                                            {isVoucherValid ? (
                                                <p className="text-xs text-green-600">Voucher Applied Successfully!</p>
                                            ) : (
                                                <p className="text-xs text-red-600">Add items worth ₹{activeVoucher.minSpend - totalPrice} more</p>
                                            )}
                                        </div>
                                    </div>
                                    <button onClick={removeVoucher}><X className="w-4 h-4 text-gray-400 hover:text-red-500" /></button>
                                </div>
                                {isVoucherValid && (
                                    <div className="flex justify-between mt-2 text-sm font-bold text-green-700 border-t border-green-200 pt-2">
                                        <span>Voucher Savings</span>
                                        <span>- ₹{voucherDiscount}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-between border-t pt-3 font-bold text-lg">
                            <span>Total Amount</span>
                            <span>₹{finalAmount}</span>
                        </div>
                    </div>

                    <a href="/checkout" className="block mt-6 bg-orange-500 hover:bg-orange-600 text-white text-center py-3 rounded-lg font-semibold shadow">
                        Proceed to Checkout
                    </a>
                </div>
            </div>

            <Footer />
        </>
    );
}