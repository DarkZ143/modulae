/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ref, get, set } from "firebase/database";
import { rtdb, auth } from "@/lib/firebase";
import type { Product } from "@/types/product";

import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import HurryUp from "@/app/components/hurryup";
import TopOfferBar from "@/app/components/TopOfferBar";
import { Star, CheckCircle, User, Calendar } from "lucide-react";

// Fallback list
const DEFAULT_CATEGORIES = [
    "products", "chairs", "dining", "furniture", "kitchen",
    "lamps", "shoe-racks", "sofa-sets", "tv-units", "wardrobes"
];

export default function ProductPage() {
    const { slug } = useParams() as { slug: string };
    const router = useRouter();

    const [product, setProduct] = useState<Product | null>(null);
    const [reviews, setReviews] = useState<any[]>([]); // Store reviews array
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

    // --- Actions ---
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

    const handleBuyNow = async () => {
        const user = auth.currentUser;
        if (!user) {
            router.push("/auth/login");
            return;
        }
        await addToFirebaseCart();
        router.push("/checkout");
    };

    // --- Smart Fetch Logic ---
    useEffect(() => {
        if (!slug) return;

        const fetchProduct = async () => {
            try {
                setLoading(true);
                let foundData: any = null;

                // 1. Get Categories
                const settingsRef = ref(rtdb, 'settings/categories');
                const settingsSnap = await get(settingsRef);
                const categoriesToSearch = settingsSnap.exists()
                    ? ["products", ...settingsSnap.val()]
                    : DEFAULT_CATEGORIES;

                // 2. Find Product
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
                    setSelectedImg(foundData.images?.[0] ?? null);

                    // 3. Process Reviews into Array
                    if (foundData.user_reviews) {
                        const reviewsArray = Object.values(foundData.user_reviews).sort((a: any, b: any) =>
                            new Date(b.date).getTime() - new Date(a.date).getTime()
                        );
                        setReviews(reviewsArray);
                    }
                } else {
                    setError("Product not found.");
                }
            } catch (err) {
                setError("Error loading product.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    if (loading) return (
        <div className="min-h-screen flex justify-center items-center">
            <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full"></div>
        </div>
    );

    if (error || !product) return (
        <div className="min-h-screen flex flex-col justify-center items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-400">Product Not Found</h1>
            <button onClick={() => router.back()} className="text-orange-600 underline">Go Back</button>
        </div>
    );

    return (
        <>
            <TopOfferBar />
            <Navbar />

            <div className="bg-gray-50 py-10">
                <div className="max-w-7xl mx-auto px-4">

                    {/* --- HERO SECTION --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                        {/* Left: Images */}
                        <div>
                            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm h-[450px] flex justify-center items-center relative overflow-hidden">
                                <Image src={selectedImg || "/placeholder.png"} alt={product.title} fill className="object-contain p-4 hover:scale-105 transition duration-500" />
                            </div>
                            {product.images && product.images.length > 1 && (
                                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                                    {product.images.map((img) => (
                                        <button key={img} onClick={() => setSelectedImg(img)} className={`relative w-20 h-20 border rounded-lg overflow-hidden shrink-0 transition-all ${img === selectedImg ? "border-orange-500 ring-2 ring-orange-100" : "border-gray-300 hover:border-gray-400"}`}>
                                            <Image src={img} alt="thumb" fill className="object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Right: Details */}
                        <div className="space-y-6">
                            <h1 className="text-4xl font-bold text-gray-900 leading-tight">{product.title}</h1>

                            <div className="flex items-center gap-2">
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating || 0) ? "fill-current" : "text-gray-300"}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-500 font-medium">({product.reviews || 0} Reviews)</span>
                            </div>

                            <div className="bg-white p-5 rounded-xl border border-orange-100 shadow-sm w-fit">
                                <div className="flex items-end gap-3">
                                    <p className="text-4xl font-extrabold text-orange-600">₹{product.price}</p>
                                    <p className="text-gray-400 line-through text-xl pb-1">₹{product.mrp}</p>
                                </div>
                                <p className="text-green-600 font-bold text-sm mt-2 bg-green-50 inline-block px-2 py-1 rounded">
                                    Save ₹{product.mrp - product.price}
                                </p>
                            </div>

                            <div className="text-lg font-semibold">
                                {Number(product.stock) > 5 ? (
                                    <span className="text-green-600 flex items-center gap-2"><CheckCircle className="w-5 h-5" /> In Stock ({product.stock})</span>
                                ) : (
                                    <span className="text-red-600">Hurry! Only {product.stock} left</span>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                                {!isAdded ? (
                                    <button onClick={handleAddToCart} className="flex-1 px-8 py-4 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-lg transition transform active:scale-95">
                                        Add to Cart
                                    </button>
                                ) : (
                                    <a href="/cart" className="flex-1 px-8 py-4 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 shadow-lg text-center">
                                        Go to Cart
                                    </a>
                                )}
                                <button onClick={handleBuyNow} className="flex-1 px-8 py-4 border-2 border-gray-900 text-gray-900 rounded-xl font-bold hover:bg-gray-100 transition">
                                    Buy Now
                                </button>
                            </div>

                            <div className="prose prose-sm text-gray-600 mt-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-2">Description</h3>
                                <p>{product.description}</p>
                            </div>

                            {product.specifications && (
                                <div className="mt-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-3">Specifications</h3>
                                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden text-sm">
                                        {Object.entries(product.specifications).map(([key, value], idx) => (
                                            <div key={key} className={`flex justify-between p-3 ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                                                <span className="font-medium text-gray-600">{key}</span>
                                                <span className="font-semibold text-gray-900">{String(value)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* --- REVIEWS SECTION --- */}
                    <div className="border-t border-gray-200 pt-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Summary Card */}
                            <div className="bg-white p-6 rounded-2xl border border-gray-200 h-fit shadow-sm">
                                <div className="text-center">
                                    <p className="text-6xl font-extrabold text-gray-900">{product.rating || 0}</p>
                                    <div className="flex justify-center text-yellow-400 my-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-6 h-6 ${i < Math.floor(product.rating || 0) ? "fill-current" : "text-gray-300"}`} />
                                        ))}
                                    </div>
                                    <p className="text-gray-500">Based on {product.reviews || 0} reviews</p>
                                </div>
                            </div>

                            {/* Reviews List */}
                            <div className="lg:col-span-2 space-y-6">
                                {reviews.length === 0 ? (
                                    <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                                        <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
                                    </div>
                                ) : (
                                    reviews.map((review, idx) => (
                                        <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition">
                                            <div className="flex justify-between items-start mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                                                        {review.user?.charAt(0).toUpperCase() || <User className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold text-gray-900">{review.user || "Anonymous"}</h4>
                                                        <span className="text-xs text-green-600 font-semibold flex items-center gap-1">
                                                            <CheckCircle className="w-3 h-3" /> Verified Purchase
                                                        </span>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" /> {new Date(review.date).toLocaleDateString()}
                                                </span>
                                            </div>

                                            <div className="flex text-yellow-400 mb-3">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-200"}`} />
                                                ))}
                                            </div>

                                            <p className="text-gray-700 leading-relaxed">&quot;{review.comment}&quot;</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {showToast && (
                <div className="fixed top-24 right-5 bg-green-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center gap-3 animate-bounce z-50">
                    <span>✓</span> Item added to cart!
                </div>
            )}

            <HurryUp />
            <Footer />
        </>
    );
}