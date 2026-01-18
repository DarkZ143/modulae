/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ref, get, set } from "firebase/database";
import { rtdb, auth } from "@/lib/firebase";
import type { Product } from "@/types/product";

import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import HurryUp from "@/app/components/hurryup";

import FlipkartProductPage from "@/app/components/FlipkartProductPage";

// ✅ SAME FALLBACK CATEGORIES
const DEFAULT_CATEGORIES = [
    "products",
    "chairs",
    "dining",
    "furniture",
    "kitchen",
    "lamps",
    "shoe-racks",
    "sofa-sets",
    "tv-units",
    "wardrobes",
];

export default function ProductPage() {
    const { slug } = useParams() as { slug: string };
    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // ✅ CART STATE
    const [qty, setQty] = useState(0);
    const [showToast, setShowToast] = useState(false);

    // ✅ ADD / UPDATE CART IN RTDB
    const addToFirebaseCart = async (newQty: number) => {
        const user = auth.currentUser;
        if (!user || !product) return false;

        const cartRef = ref(rtdb, `carts/${user.uid}/${slug}`);
        await set(cartRef, {
            title: product.title,
            price: product.price,
            mrp: product.mrp,
            image: product.images?.[0] || "",
            qty: newQty,
            addedAt: Date.now(),
        });

        return true;
    };

    // ✅ ADD TO CART
    const handleAddToCart = async () => {
        const user = auth.currentUser;
        if (!user) return router.push("/auth/login");

        await addToFirebaseCart(1);
        setQty(1);

        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    // ✅ BUY NOW
    const handleBuyNow = async () => {
        const user = auth.currentUser;
        if (!user) return router.push("/auth/login");

        await addToFirebaseCart(qty === 0 ? 1 : qty);
        router.push("/checkout");
    };

    // ✅ PRODUCT FETCH (UNCHANGED – SAFE)
    useEffect(() => {
        if (!slug) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                let foundData: any = null;

                const settingsRef = ref(rtdb, "settings/categories");
                const settingsSnap = await get(settingsRef);

                const categoriesToSearch = settingsSnap.exists()
                    ? ["products", ...settingsSnap.val()]
                    : DEFAULT_CATEGORIES;

                for (const category of categoriesToSearch) {
                    const productRef = ref(rtdb, `${category}/${slug}`);
                    const snapshot = await get(productRef);

                    if (snapshot.exists()) {
                        foundData = snapshot.val();
                        break;
                    }
                }

                if (foundData) {
                    setProduct(foundData);

                    // ✅ REVIEWS (FIREBASE)
                    if (foundData.user_reviews) {
                        const reviewsArray = Object.values(foundData.user_reviews).sort(
                            (a: any, b: any) =>
                                new Date(b.date).getTime() - new Date(a.date).getTime()
                        );
                        setReviews(reviewsArray);
                    }
                } else {
                    setError("Product not found.");
                }
            } catch (err) {
                console.error(err);
                setError("Error loading product.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    // ✅ LOADING UI
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center text-xl font-semibold">
                Loading Product...
            </div>
        );
    }

    // ✅ ERROR UI
    if (error || !product) {
        return (
            <div className="min-h-screen flex flex-col justify-center items-center gap-4">
                <h1 className="text-2xl font-bold text-gray-400">Product Not Found</h1>
                <button
                    onClick={() => router.back()}
                    className="text-orange-600 underline"
                >
                    Go Back
                </button>
            </div>
        );
    }

    // ✅ FINAL RENDER
    return (
        <>
            <Navbar />

            <FlipkartProductPage
                product={{
                    ...product,
                    onAddToCart: handleAddToCart,
                    onBuyNow: handleBuyNow,
                }}
                reviews={reviews}
            />

            {/* ✅ TOAST */}
            {showToast && (
                <div className="fixed top-24 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl z-50">
                    ✅ Added to Cart
                </div>
            )}

            <HurryUp />
            <Footer />
        </>
    );
}
