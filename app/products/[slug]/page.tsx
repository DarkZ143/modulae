/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { ref, get, set } from "firebase/database";
import { rtdb, auth } from "@/lib/firebase";
import type { Product } from "@/types/product";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import HurryUp from "@/app/components/hurryup";
import TopOfferBar from "@/app/components/TopOfferBar";

export default function ProductPage() {
    const { slug } = useParams() as { slug: string };

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);

    // New States
    const [isAdded, setIsAdded] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // ---------------- Add to Cart Function ----------------
    const handleAddToCart = async () => {
        const user = auth.currentUser;

        if (!user) {
            window.location.href = "/auth/login";
            return;
        }

        const cartRef = ref(rtdb, `carts/${user.uid}/${slug}`);

        await set(cartRef, {
            title: product?.title,
            price: product?.price,
            mrp: product?.mrp,
            image: product?.images[0],
            qty: 1,
            addedAt: Date.now(),
        });

        // Update UI
        setIsAdded(true);
        setShowToast(true);

        // Hide after 2 seconds
        setTimeout(() => setShowToast(false), 2000);
    };

    // ---------------- Fetch Product ----------------
    useEffect(() => {
        if (!slug) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);

                const productRef = ref(rtdb, `products/${slug}`);
                const snapshot = await get(productRef);

                if (!snapshot.exists()) {
                    setError("Product not found!");
                    setProduct(null);
                } else {
                    const data = snapshot.val() as Product;
                    setProduct(data);
                    setSelectedImg(data.images?.[0] ?? null);
                }
            } catch (err) {
                setError("Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    // ---------------- Loading UI ----------------
    if (loading) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    // ---------------- Error UI ----------------
    if (error || !product) {
        return (
            <div className="min-h-[60vh] flex justify-center items-center">
                <div className="bg-white p-6 rounded-xl shadow text-center max-w-sm border">
                    <p className="text-lg font-semibold text-red-600">{error}</p>
                    <a
                        href="/"
                        className="mt-4 inline-block bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        );
    }

    // ---------------- UI ----------------
    return (
        <>
            <TopOfferBar />
            <Navbar />

            <div className="bg-gray-100 py-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-4">

                    {/* -------- LEFT : IMAGES -------- */}
                    <div>
                        {/* Big Image */}
                        <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm h-[430px] flex justify-center items-center">
                            <Image
                                src={selectedImg!}
                                alt={product.title}
                                width={600}
                                height={450}
                                className="object-contain w-full h-full"
                            />
                        </div>

                        {/* Thumbnails */}
                        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                            {product.images.map((img) => (
                                <button
                                    key={img}
                                    onClick={() => setSelectedImg(img)}
                                    className={`border rounded-lg p-1 min-w-24 transition-all ${img === selectedImg
                                            ? "border-orange-500 shadow-md"
                                            : "border-gray-300"
                                        }`}
                                >
                                    <Image
                                        src={img}
                                        alt="thumbnail"
                                        width={90}
                                        height={90}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* -------- RIGHT : DETAILS -------- */}
                    <div className="space-y-6">

                        {/* Title */}
                        <h1 className="text-3xl font-bold leading-snug">{product.title}</h1>

                        {/* Rating */}
                        <p className="text-yellow-600 font-medium text-lg">
                            ⭐ {product.rating} • {product.reviews} reviews
                        </p>

                        {/* Price Box */}
                        <div className="bg-white p-5 rounded-xl border border-gray-300 shadow-sm w-fit">
                            <div className="flex items-center gap-3">
                                <p className="text-4xl font-extrabold text-orange-600">
                                    ₹{product.price}
                                </p>
                                <p className="text-gray-500 line-through text-lg">₹{product.mrp}</p>
                            </div>
                            <p className="text-green-600 font-semibold text-sm mt-1">
                                You save ₹{product.mrp - product.price}!
                            </p>
                        </div>

                        {/* Stock */}
                        <div className="text-lg font-semibold">
                            {product.stock > 5 ? (
                                <span className="text-green-600">✔ In Stock ({product.stock})</span>
                            ) : (
                                <span className="text-red-600">⛔ Only {product.stock} left!</span>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-4 mt-3">

                            {!isAdded ? (
                                <button
                                    onClick={handleAddToCart}
                                    className="px-8 py-3 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 shadow"
                                >
                                    Add to Cart
                                </button>
                            ) : (
                                <a
                                    href="/cart"
                                    className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 shadow"
                                >
                                    Go to Cart
                                </a>
                            )}

                            <button className="px-8 py-3 border border-orange-500 text-orange-500 rounded-lg font-semibold hover:bg-orange-50 shadow-sm">
                                Buy Now
                            </button>
                        </div>

                        <hr className="my-5 border-gray-300" />

                        {/* Description */}
                        <div>
                            <h3 className="text-xl font-semibold mb-2">Description</h3>
                            <p className="text-gray-700 leading-relaxed">{product.description}</p>
                        </div>

                        {/* Specs */}
                        <div>
                            <h3 className="text-xl font-semibold mb-3">Specifications</h3>
                            <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm">
                                <ul className="space-y-2 text-gray-700">
                                    {Object.entries(product.specifications).map(([key, value]) => (
                                        <li
                                            key={key}
                                            className="flex justify-between border-b pb-2 last:border-none"
                                        >
                                            <span className="font-semibold">{key}</span>
                                            <span>{value}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>

                </div>
            </div>

            {/* Green Toast Notification */}
            {showToast && (
                <div className="fixed top-20 right-5 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in z-50">
                    ✔ Added to Cart
                </div>
            )}

            <HurryUp />
            <Footer />
        </>
    );
}
