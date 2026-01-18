/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Plus, Minus, Loader2 } from "lucide-react";
import { useLocation } from "../context/LocationContext";
import { auth, rtdb } from "@/lib/firebase";
import { ref, onValue, set, remove } from "firebase/database";
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
                await remove(itemRef);
            } else {
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
    const discountPercentage = Math.round(((product.mrp - product.price) / product.mrp) * 100);
    const imageUrl = Array.isArray(product.images) ? product.images[0] : product.image || "/placeholder.png";

    return (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col h-full hover:shadow-lg transition-shadow duration-300 relative group">

            {/* IMAGE SECTION - Removed Top/Bottom Padding (py-0) */}
            <Link
                href={`/products/${product.slug}`}
                className="relative block w-full aspect-5/5 bg-[#F7F7F7] px-4 py-0 items-center justify-center"
            >
                <Image
                    src={imageUrl}
                    alt={product.title}
                    fill
                    className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105 p-2 "
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
            </Link>

            {/* CONTENT SECTION */}
            <div className="p-3 flex flex-col flex-1">

                {/* Title */}
                <Link href={`/products/${product.slug}`}>
                    <h3 className="text-[#0F1111] font-medium text-[15px] leading-snug line-clamp-2 hover:text-[#C7511F] mb-1">
                        {product.title}
                    </h3>
                </Link>

                {/* Ratings */}
                <div className="flex items-center gap-1 mb-1">
                    <div className="flex text-[#DE7921]">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 4) ? "fill-current" : "text-gray-300 stroke-gray-400"}`}
                            />
                        ))}
                    </div>
                    <span className="text-[#007185] text-xs hover:underline cursor-pointer">
                        {product.reviews || Math.floor(Math.random() * 200)}
                    </span>
                </div>

                {/* Price Block */}
                <div className="mt-1">
                    <div className="flex items-baseline gap-0.5">
                        <span className="text-xs relative -top-1.5">₹</span>
                        <span className="text-[21px] font-medium text-gray-700">{Number(product.price).toLocaleString('en-IN')}</span>
                        <span className="text-[11px] text-[#565959] ml-1.5 line-through">
                            M.R.P: ₹{Number(product.mrp).toLocaleString('en-IN')}
                        </span>
                        <span className="text-[11px] text-[#565959] ml-1">({discountPercentage}% off)</span>
                    </div>
                </div>

                {/* Delivery Info */}
                <div className="mt-1 text-[12px] text-[#565959] leading-tight">
                    {location.deliveryDateString ? (
                        <>
                            Get it by <span className="font-bold text-[#0F1111]">{location.deliveryDateString}</span>
                            <br />
                            <span className="text-[#565959]">FREE Delivery by Modulae</span>
                        </>
                    ) : (
                        <span className="italic">Set location to see delivery</span>
                    )}
                </div>

                {/* SPACER to push button to bottom */}
                <div className="flex-1 min-h-2"></div>

                {/* ✅ ADD TO CART / QUANTITY CONTROL */}
                <div className="mt-2">
                    {quantity === 0 ? (
                        <button
                            onClick={() => updateCart(1)}
                            disabled={isUpdating}
                            className="w-[140px] bg-orange-400 hover:bg-orange-500 text-white text-[13px] py-1.5 rounded-full shadow-sm border border-[#FCD200] transition-colors flex justify-center items-center font-normal"
                        >
                            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add to cart"}
                        </button>
                    ) : (
                        <div className="flex items-center bg-white border border-gray-300 rounded-md shadow-sm w-fit h-8">
                            {/* Minus Button */}
                            <button
                                onClick={() => updateCart(quantity - 1)}
                                disabled={isUpdating}
                                className="w-9 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-l-md border-r border-gray-300 transition-colors"
                            >
                                <Minus className="w-3.5 h-3.5 text-red-500" />
                            </button>

                            {/* Quantity Display */}
                            <div className="w-10 h-full flex items-center justify-center text-[13px] font-bold text-[#0F1111] bg-white">
                                {isUpdating ? <Loader2 className="w-3 h-3 animate-spin" /> : quantity}
                            </div>

                            {/* Plus Button */}
                            <button
                                onClick={() => updateCart(quantity + 1)}
                                disabled={isUpdating}
                                className="w-9 h-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-r-md border-l border-gray-300 transition-colors"
                            >
                                <Plus className="w-3.5 h-3.5 text-green-500" />
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}