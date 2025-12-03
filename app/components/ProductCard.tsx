/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Plus, Minus, Loader2 } from "lucide-react";
import { calculateDistance, getDeliveryEstimation } from "@/lib/deliveryLogic";
import { useLocation } from "../context/LocationContext";
import { auth, rtdb } from "@/lib/firebase";
import { ref, onValue, set, remove, update } from "firebase/database";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: any }) {
    const router = useRouter();
    const { location } = useLocation();

    const [user, setUser] = useState<any>(null);
    const [quantity, setQuantity] = useState(0);
    const [isUpdating, setIsUpdating] = useState(false);

    // --- 1. LISTEN TO CART STATE ---
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                // Listen to this specific product in the cart
                const itemRef = ref(rtdb, `carts/${currentUser.uid}/${product.slug}`);
                return onValue(itemRef, (snapshot) => {
                    if (snapshot.exists()) {
                        setQuantity(snapshot.val().qty);
                    } else {
                        setQuantity(0);
                    }
                });
            } else {
                setQuantity(0);
            }
        });
        return () => unsubscribeAuth();
    }, [product.slug]);

    // --- 2. CART ACTIONS ---
    const updateCart = async (newQty: number) => {
        if (!user) {
            router.push("/auth/login");
            return;
        }

        setIsUpdating(true);
        const itemRef = ref(rtdb, `carts/${user.uid}/${product.slug}`);

        try {
            if (newQty <= 0) {
                // Remove item if quantity goes to 0
                await remove(itemRef);
            } else {
                // Update or Add item
                await set(itemRef, {
                    title: product.title,
                    price: product.price,
                    mrp: product.mrp,
                    image: Array.isArray(product.images) ? product.images[0] : product.image || "",
                    qty: newQty,
                    addedAt: Date.now(),
                });
            }
        } catch (error) {
            console.error("Cart update failed", error);
        } finally {
            setIsUpdating(false);
        }
    };

    // Formatting
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

    const discountPercentage = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    const imageUrl = Array.isArray(product.images) ? product.images[0] : product.image || "/placeholder.png";

    return (
        <div className="bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-lg transition-all flex flex-col h-full relative group">

            {/* IMAGE SECTION */}
            <Link href={`/products/${product.slug}`} className="block relative w-full h-64 bg-[#F7F7F7] p-6 items-center justify-center">
                <Image
                    src={imageUrl}
                    alt={product.title}
                    fill
                    className="object-contain mix-blend-multiply"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </Link>

            {/* CONTENT SECTION */}
            <div className="p-3 flex flex-col flex-1 gap-1">

                <Link href={`/products/${product.slug}`}>
                    <h3 className="text-gray-900 font-medium text-[15px] leading-snug line-clamp-2 hover:text-[#C7511F] transition-colors">
                        {product.title}
                    </h3>
                </Link>

                {/* Ratings */}
                <div className="flex items-center gap-1 text-xs mb-1">
                    <div className="flex items-center text-[#DE7921]">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 4) ? "fill-current" : "text-gray-300 stroke-gray-400"}`}
                            />
                        ))}
                    </div>
                    <span className="text-[#007185] hover:underline cursor-pointer ml-1">
                        {product.reviews || 50}
                    </span>
                </div>

                <p className="text-[11px] text-gray-500 mb-1">200+ bought in past month</p>

                {/* Price Block */}
                <div className="flex items-baseline gap-2">
                    <span className="text-[21px] font-medium text-gray-900">₹{Number(product.price).toLocaleString('en-IN')}</span>
                    <span className="text-[11px] text-gray-500">M.R.P: <span className="line-through">₹{Number(product.mrp).toLocaleString('en-IN')}</span></span>
                    <span className="text-[11px] text-gray-900 font-bold">({discountPercentage}% off)</span>
                </div>

                {/* Delivery Logic */}
                <div className="mt-1 text-[11px]">
                    {location.deliveryDateString ? (
                        <p className="text-gray-900 leading-tight">
                            FREE delivery <span className="font-bold">{location.deliveryDateString}</span>
                        </p>
                    ) : (
                        <p className="text-gray-500 italic">Set location to see delivery date</p>
                    )}
                </div>

                {/* ✅ ADD TO CART / QUANTITY CONTROL */}
                <div className="mt-auto pt-3">
                    {quantity === 0 ? (
                        <button
                            onClick={() => updateCart(1)}
                            disabled={isUpdating}
                            className="w-full bg-[#ff8614] hover:bg-[#f74e00] text-black text-[13px] py-2 rounded-full shadow-sm border border-[#FCD200] transition-colors flex justify-center items-center font-medium"
                        >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to Cart"}
                        </button>
                    ) : (
                        <div className="flex items-center justify-between bg-white border border-gray-300 rounded-full shadow-sm overflow-hidden">
                            <button
                                onClick={() => updateCart(quantity - 1)}
                                disabled={isUpdating}
                                className="px-4 py-2 hover:bg-gray-100 text-red-600 border-r"
                            >
                                <Minus className="w-3 h-3" />
                            </button>

                            <span className="text-sm font-bold text-orange-500 px-2">
                                {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : quantity}
                            </span>

                            <button
                                onClick={() => updateCart(quantity + 1)}
                                disabled={isUpdating}
                                className="px-4 py-2 hover:bg-gray-100 text-green-600 border-l"
                            >
                                <Plus className="w-3 h-3" />
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}