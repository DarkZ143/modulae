/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @next/next/no-html-link-for-pages */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // ✅ Added useRouter
import Image from "next/image";
import { ref, get, set } from "firebase/database";
import { rtdb, auth } from "@/lib/firebase";
import type { Product } from "@/types/product";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import HurryUp from "@/app/components/hurryup";
import TopOfferBar from "@/app/components/TopOfferBar";

// List of all categories to search through
const CATEGORIES = [
    "products", "chairs", "dining", "furniture", "kitchen", 
    "lamps", "shoe-racks", "sofa-sets", "tv-units", "wardrobes"
];

export default function ProductPage() {
    const { slug } = useParams() as { slug: string };
    const router = useRouter(); // ✅ Router hook

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedImg, setSelectedImg] = useState<string | null>(null);
    const [isAdded, setIsAdded] = useState(false);
    const [showToast, setShowToast] = useState(false);

    // --- Helper: Add to Firebase Cart ---
    const addToFirebaseCart = async () => {
        const user = auth.currentUser;
        if (!user) return false;

        const cartRef = ref(rtdb, `carts/${user.uid}/${slug}`);
        await set(cartRef, {
            title: product?.title,
            price: product?.price,
            mrp: product?.mrp,
            image: product?.images?.[0] || "",
            qty: 1,
            addedAt: Date.now(),
        });
        return true;
    };

    // --- Action: Add to Cart (Stays on Page) ---
    const handleAddToCart = async () => {
        const user = auth.currentUser;
        if (!user) {
            router.push("/auth/login");
            return;
        }

        await addToFirebaseCart();
        setIsAdded(true);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 2000);
    };

    // --- Action: Buy Now (Redirects to Checkout) ---
    const handleBuyNow = async () => {
        const user = auth.currentUser;
        if (!user) {
            router.push("/auth/login");
            return;
        }

        // 1. Add to cart first
        await addToFirebaseCart();
        // 2. Redirect immediately
        router.push("/checkout");
    };

    // --- Fetch Logic ---
    useEffect(() => {
        if (!slug) return;
        const fetchProduct = async () => {
            try {
                setLoading(true);
                let foundData: Product | null = null;

                for (const category of CATEGORIES) {
                    const productRef = ref(rtdb, `${category}/${slug}`);
                    const snapshot = await get(productRef);
                    if (snapshot.exists()) {
                        foundData = snapshot.val() as Product;
                        break;
                    }
                }

                if (foundData) {
                    setProduct(foundData);
                    setSelectedImg(foundData.images?.[0] ?? null);
                } else {
                    setError("Product not found.");
                }
            } catch (err) {
                setError("Error loading product.");
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [slug]);

    if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    if (error || !product) return <div className="min-h-screen flex justify-center items-center text-red-500">{error}</div>;

    return (
        <>
            <TopOfferBar />
            <Navbar />

            <div className="bg-gray-100 py-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-4">
                    {/* Left: Images */}
                    <div>
                        <div className="bg-white p-4 rounded-xl border border-gray-300 shadow-sm h-[430px] flex justify-center items-center relative">
                            <Image src={selectedImg || "/placeholder.png"} alt={product.title} fill className="object-contain p-4" />
                        </div>
                        {product.images && product.images.length > 1 && (
                            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                                {product.images.map((img) => (
                                    <button key={img} onClick={() => setSelectedImg(img)} className={`relative w-24 h-24 border rounded-lg overflow-hidden shrink-0 ${img === selectedImg ? "border-orange-500" : "border-gray-300"}`}>
                                        <Image src={img} alt="thumb" fill className="object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="space-y-6">
                        <h1 className="text-3xl font-bold leading-snug text-gray-900">{product.title}</h1>
                        
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm w-fit">
                            <div className="flex items-end gap-3">
                                <p className="text-4xl font-extrabold text-orange-600">₹{product.price}</p>
                                <p className="text-gray-400 line-through text-lg pb-1">₹{product.mrp}</p>
                            </div>
                            <p className="text-green-600 font-bold text-sm mt-2 bg-green-50 inline-block px-2 py-1 rounded">
                                You save ₹{product.mrp - product.price}
                            </p>
                        </div>

                        <div className="text-lg font-semibold">
                            {Number(product.stock) > 5 ? (
                                <span className="text-green-600">In Stock ({product.stock})</span>
                            ) : (
                                <span className="text-red-600">Hurry! Only {product.stock} left</span>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 mt-3">
                            {!isAdded ? (
                                <button onClick={handleAddToCart} className="flex-1 px-8 py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-lg">
                                    Add to Cart
                                </button>
                            ) : (
                                <a href="/cart" className="flex-1 px-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg text-center">
                                    Go to Cart
                                </a>
                            )}
                            <button onClick={handleBuyNow} className="flex-1 px-8 py-4 border-2 border-gray-800 text-gray-800 rounded-xl font-bold hover:bg-gray-50 transition-colors">
                                Buy Now
                            </button>
                        </div>

                        <hr className="my-5 border-gray-200" />
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                            <p className="text-gray-600 leading-relaxed">{product.description}</p>
                        </div>
                        
                        {/* Specifications Table */}
                        {product.specifications && (
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Specifications</h3>
                                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                    <ul className="divide-y divide-gray-100">
                                        {Object.entries(product.specifications).map(([key, value]) => (
                                            <li key={key} className="flex justify-between p-4 hover:bg-gray-50">
                                                <span className="font-medium text-gray-500">{key}</span>
                                                <span className="font-semibold text-gray-900">{String(value)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showToast && (
                <div className="fixed top-24 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-bounce z-50">
                    <span>✓</span> Successfully added to cart!
                </div>
            )}

            <HurryUp />
            <Footer />
        </>
    );
}