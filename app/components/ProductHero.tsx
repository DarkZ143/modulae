"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import type { Product } from "@/types/product";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";

export default function ProductHero({ product }: { product: Product }) {
    const [activeImage, setActiveImage] = useState(product.images[0]);

    const router = useRouter();
    const user = auth.currentUser;

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishLoading, setWishLoading] = useState(true);

    // ---------------- Fetch Wishlist Status ----------------
    useEffect(() => {
        const fetchWishlist = async () => {
            if (!user) return;

            const userRef = doc(db, "users", user.uid);
            const snap = await getDoc(userRef);

            if (snap.exists()) {
                const wishlist = snap.data().wishlist || [];
                setIsWishlisted(wishlist.includes(product.slug));
            }
            setWishLoading(false);
        };

        fetchWishlist();
    }, [user, product.slug]);

    // ---------------- Toggle Wishlist ----------------
    const toggleWishlist = async () => {
        if (!user) {
            router.push("/auth/login");
            return;
        }

        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);
        const data = snap.data();

        let wishlist = data?.wishlist || [];

        if (wishlist.includes(product.slug)) {
            // Remove from wishlist
            wishlist = wishlist.filter((id: string) => id !== product.slug);
            setIsWishlisted(false);
        } else {
            // Add to wishlist
            wishlist.push(product.slug);
            setIsWishlisted(true);
        }

        await updateDoc(userRef, { wishlist });
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* LEFT IMAGES */}
            <div className="relative">
                
                {/* ❤️ Wishlist heart */}
                <button
                    onClick={toggleWishlist}
                    disabled={wishLoading}
                    className="absolute top-4 right-4 bg-white shadow-md rounded-full p-3 z-20 hover:scale-110 transition"
                >
                    {isWishlisted ? (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="red"
                            viewBox="0 0 24 24"
                            className="w-6 h-6"
                        >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 6 4 4 6.5 4c1.74 0 3.41 1 4.13 2.44h1c.72-1.44 2.39-2.44 4.13-2.44C20 4 22 6 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                    ) : (
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            stroke="red"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                            className="w-6 h-6"
                        >
                            <path d="M12.1 21.55l-1.1-1.01C5.1 15.14 2 12.28 2 8.5 2 5.41 4.4 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.6 3 22 5.41 22 8.5c0 3.78-3.1 6.64-8.9 12.04l-1 1.01z" />
                        </svg>
                    )}
                </button>

                {/* Main Image */}
                <div className="w-full border rounded-xl overflow-hidden">
                    <Image
                        src={activeImage}
                        alt={product.title}
                        width={800}
                        height={800}
                        className="w-full object-cover"
                    />
                </div>

                {/* Thumbnail Row */}
                <div className="flex gap-3 mt-4 overflow-x-auto">
                    {product.images.map((img) => (
                        <Image
                            key={img}
                            src={img}
                            alt="Thumbnail"
                            width={90}
                            height={90}
                            className={`border rounded-md cursor-pointer ${
                                activeImage === img ? "ring-2 ring-orange-500" : ""
                            }`}
                            onClick={() => setActiveImage(img)}
                        />
                    ))}
                </div>
            </div>

            {/* RIGHT DETAILS */}
            <div className="space-y-4">

                <h1 className="text-3xl font-bold">{product.title}</h1>

                {/* Ratings */}
                <div className="flex items-center gap-2 text-yellow-500">
                    ⭐ {product.rating}
                    <span className="text-gray-600 text-sm">({product.reviews} reviews)</span>
                </div>

                {/* Pricing */}
                <div>
                    <p className="text-4xl font-bold text-orange-600">₹{product.price}</p>
                    <p className="line-through text-gray-400 text-sm">₹{product.mrp}</p>
                </div>

                {/* Stock */}
                <p
                    className={`text-sm ${
                        product.stock > 0 ? "text-green-600" : "text-red-600"
                    }`}
                >
                    {product.stock > 0 ? "In Stock" : "Out of Stock"}
                </p>

                {/* Buttons */}
                <div className="flex gap-4 mt-4">
                    <button className="px-6 py-3 bg-orange-500 text-white rounded-lg font-semibold">
                        Add To Cart
                    </button>

                    <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold">
                        Buy Now
                    </button>
                </div>

                {/* Description */}
                <div className="mt-6">
                    <h3 className="font-semibold text-lg">Description</h3>
                    <p className="text-gray-600 mt-2">{product.description}</p>
                </div>

                {/* Specifications */}
                <div className="mt-6">
                    <h3 className="font-semibold text-lg">Specifications</h3>

                    <ul className="mt-2 space-y-1">
                        {Object.entries(product.specifications).map(([key, value]) => (
                            <li key={key} className="text-gray-700 text-sm">
                                <span className="font-semibold">{key}: </span>
                                {value}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

        </div>
    );
}
