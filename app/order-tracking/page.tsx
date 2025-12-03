/* eslint-disable react-hooks/immutability */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ref, get, update, push, set, remove } from "firebase/database";
import { auth, rtdb } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import {
    CheckCircle, Truck, Package, Clock, MapPin,
    XCircle, AlertTriangle, ChevronLeft, Star, Camera, X
} from "lucide-react";

const STEPS = [
    { label: "Order Confirmed", key: "Confirmed", icon: CheckCircle },
    { label: "In Processing", key: "Processing", icon: Clock },
    { label: "Shipped", key: "Shipped", icon: Package },
    { label: "Out For Delivery", key: "OutForDelivery", icon: Truck },
    { label: "Delivered", key: "Delivered", icon: MapPin },
];

// Fallback only if DB is unreachable
const DEFAULT_CATEGORIES = [
    "products", "chairs", "dining", "furniture", "kitchen",
    "lamps", "shoe-racks", "sofa-sets", "tv-units", "wardrobes"
];

export default function OrderTrackingPage() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");
    const router = useRouter();

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);

    // Review State
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [reviewSubmitted, setReviewSubmitted] = useState(false);
    const [selectedProductSlug, setSelectedProductSlug] = useState<string | null>(null);

    // Image Upload State
    const [reviewImages, setReviewImages] = useState<string[]>([]);

    // Reviews Map: Stores existing reviews for this order
    const [myReviews, setMyReviews] = useState<Record<string, any>>({});

    // 1. Auth & Order Fetch
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (!currentUser) {
                router.push("/auth/login");
                return;
            }
            setUser(currentUser);

            if (orderId) {
                const orderRef = ref(rtdb, `orders/${currentUser.uid}/${orderId}`);
                const snapshot = await get(orderRef);
                if (snapshot.exists()) {
                    const orderData = snapshot.val();
                    setOrder(orderData);
                    // Fetch reviews after getting order data
                    fetchExistingReviews(orderData.items, currentUser);
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [orderId, router]);

    // 2. Fetch Existing Reviews Logic (Dynamic Categories)
    const fetchExistingReviews = async (items: any[], currentUser: any) => {
        try {
            // A. Get Dynamic Categories List
            const settingsRef = ref(rtdb, 'settings/categories');
            const settingsSnap = await get(settingsRef);
            const categoriesToSearch = settingsSnap.exists() ? settingsSnap.val() : DEFAULT_CATEGORIES;

            const reviewsMap: Record<string, any> = {};

            // B. Search for reviews in these categories
            for (const item of items) {
                for (const cat of categoriesToSearch) {
                    const productRef = ref(rtdb, `${cat}/${item.slug}`);
                    const snapshot = await get(productRef);

                    if (snapshot.exists()) {
                        const productData = snapshot.val();
                        if (productData.user_reviews) {
                            const reviews = Object.values(productData.user_reviews);
                            const userReview = reviews.find((r: any) =>
                                r.user === (currentUser.displayName || currentUser.email)
                            );
                            if (userReview) {
                                reviewsMap[item.slug] = userReview;
                            }
                        }
                        break; // Stop searching categories if product found
                    }
                }
            }
            setMyReviews(reviewsMap);
        } catch (error) {
            console.error("Error fetching reviews:", error);
        }
    };

    const getCurrentStepIndex = (status: string) => {
        if (status === "Processing") return 1;
        if (status === "Shipped") return 2;
        if (status === "OutForDelivery") return 3;
        if (status === "Delivered") return 4;
        return 0;
    };

    const handleCancelOrder = async () => {
        if (!confirm("Are you sure you want to cancel this order? It will be removed permanently.")) return;
        try {
            const orderRef = ref(rtdb, `orders/${user.uid}/${orderId}`);
            await remove(orderRef);
            alert("Order cancelled and removed.");
            router.push("/my-orders");
        } catch (error) {
            alert("Failed to cancel order.");
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        Array.from(files).forEach((file) => {
            if (!["image/jpeg", "image/png", "image/heic"].includes(file.type)) {
                alert("Only JPG, PNG, and HEIC images are allowed.");
                return;
            }
            if (file.size > 2 * 1024 * 1024) {
                alert("Image size must be less than 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                if (typeof reader.result === "string") {
                    setReviewImages((prev) => [...prev, reader.result as string]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setReviewImages(reviewImages.filter((_, i) => i !== index));
    };

    // --- SUBMIT REVIEW (Dynamic Categories) ---
    const handleSubmitReview = async () => {
        if (rating === 0) return alert("Please select a star rating.");
        if (!selectedProductSlug) return;

        try {
            // 1. Fetch Dynamic Category List
            const settingsRef = ref(rtdb, 'settings/categories');
            const settingsSnap = await get(settingsRef);
            const categoriesToSearch = settingsSnap.exists() ? settingsSnap.val() : DEFAULT_CATEGORIES;

            let foundCategory = "";
            let currentProductData: any = null;

            // 2. Search through categories to find the product
            for (const cat of categoriesToSearch) {
                const snap = await get(ref(rtdb, `${cat}/${selectedProductSlug}`));
                if (snap.exists()) {
                    foundCategory = cat;
                    currentProductData = snap.val();
                    break;
                }
            }

            if (!foundCategory) return alert("Product not found in database.");

            // 3. Save Review
            const reviewRef = ref(rtdb, `${foundCategory}/${selectedProductSlug}/user_reviews`);
            const newReviewRef = push(reviewRef);

            const newReviewData = {
                user: user.displayName || user.email,
                rating,
                comment: reviewText,
                images: reviewImages,
                date: new Date().toISOString()
            };

            await set(newReviewRef, newReviewData);

            // 4. Update Product Average Rating
            const currentRating = currentProductData.rating || 0;
            const currentReviews = currentProductData.reviews || 0;
            const newTotalReviews = currentReviews + 1;
            const newAverageRating = ((currentRating * currentReviews) + rating) / newTotalReviews;

            await update(ref(rtdb, `${foundCategory}/${selectedProductSlug}`), {
                rating: Number(newAverageRating.toFixed(1)),
                reviews: newTotalReviews
            });

            setReviewSubmitted(true);
            alert("Review Submitted Successfully!");

            // Update local state so UI reflects change immediately
            setMyReviews(prev => ({ ...prev, [selectedProductSlug]: newReviewData }));

            // Reset form
            setRating(0);
            setReviewText("");
            setReviewImages([]);
            setSelectedProductSlug(null);

        } catch (error) {
            console.error("Review Error:", error);
            alert("Failed to submit review.");
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center">Loading...</div>;
    if (!order) return <div>Order not found</div>;

    const isCancelled = order.status === "Cancelled";
    const isFailed = order.status === "Failed Transaction";
    const isDelivered = order.status === "Delivered";
    const currentStep = getCurrentStepIndex(order.status);

    return (
        <>
            <Navbar />
            <div className="bg-gray-50 min-h-screen py-10 px-4">
                <div className="max-w-4xl mx-auto">

                    <button onClick={() => router.back()} className="flex items-center text-gray-500 hover:text-orange-600 mb-6 transition">
                        <ChevronLeft className="w-5 h-5" /> Back to My Orders
                    </button>

                    {/* STATUS TRACKER */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-6 relative overflow-hidden">
                        {isCancelled ? (
                            <div className="flex flex-col items-center justify-center text-center py-10">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4"><XCircle className="w-10 h-10 text-red-500" /></div>
                                <h2 className="text-2xl font-bold text-red-600">Order Cancelled</h2>
                            </div>
                        ) : isFailed ? (
                            <div className="flex flex-col items-center justify-center text-center py-10">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4"><AlertTriangle className="w-10 h-10 text-red-500" /></div>
                                <h2 className="text-2xl font-bold text-red-600">Transaction Failed</h2>
                            </div>
                        ) : (
                            <div className="relative">
                                <div className="hidden md:block absolute top-5 left-0 w-full h-1 bg-gray-200 z-0"></div>
                                <div className="hidden md:block absolute top-5 left-0 h-1 bg-green-500 transition-all duration-1000 z-0" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
                                <div className="flex flex-col md:flex-row justify-between relative z-10">
                                    {STEPS.map((step, idx) => {
                                        const isCompleted = idx <= currentStep;
                                        return (
                                            <div key={step.key} className="flex md:flex-col items-center gap-4 md:gap-2 mb-6 md:mb-0 w-full md:w-auto">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                                    <step.icon className="w-5 h-5" />
                                                </div>
                                                <p className="md:text-center text-sm font-bold text-gray-900">{step.label}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-lg mb-4">Items in Order</h3>
                            <div className="space-y-6">
                                {order.items && order.items.map((item: any, idx: number) => {
                                    const existingReview = myReviews[item.slug];

                                    return (
                                        <div key={idx} className="border-b border-gray-100 pb-6 last:border-0">
                                            <div className="flex gap-4">
                                                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                                    <Image src={item.image || "/placeholder.png"} alt={item.title} fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-800 line-clamp-1">{item.title}</h4>
                                                    <p className="text-sm text-gray-500">Qty: {item.qty}</p>
                                                    <p className="font-bold text-orange-600 mt-1">₹{item.price}</p>
                                                </div>
                                            </div>

                                            {/* EXISTING REVIEW DISPLAY */}
                                            {existingReview ? (
                                                <div className="mt-4 bg-green-50 p-4 rounded-lg border border-green-100">
                                                    <p className="text-xs font-bold text-green-700 mb-2 flex items-center gap-1">
                                                        <CheckCircle className="w-3 h-3" /> Your Review
                                                    </p>
                                                    <div className="flex gap-1 mb-1">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-4 h-4 ${i < existingReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
                                                        ))}
                                                    </div>
                                                    <p className="text-sm text-gray-700 italic">&quot;{existingReview.comment}&quot;</p>

                                                    {/* Show Images */}
                                                    {existingReview.images && (
                                                        <div className="flex gap-2 mt-2">
                                                            {existingReview.images.map((img: string, i: number) => (
                                                                <div key={i} className="relative w-12 h-12 rounded border overflow-hidden">
                                                                    <Image src={img} alt="Review" fill className="object-cover" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}

                                                    {/* Show Admin Reply */}
                                                    {existingReview.admin_reply && (
                                                        <div className="mt-3 pl-3 border-l-2 border-orange-400">
                                                            <p className="text-xs font-bold text-orange-600">Modulae Response:</p>
                                                            <p className="text-sm text-gray-600">{existingReview.admin_reply}</p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                /* RATE BUTTON (If Delivered & Not Reviewed) */
                                                isDelivered && selectedProductSlug !== item.slug && (
                                                    <button
                                                        onClick={() => setSelectedProductSlug(item.slug)}
                                                        className="mt-3 text-sm text-orange-600 font-semibold hover:underline flex items-center gap-1"
                                                    >
                                                        <Star className="w-4 h-4" /> Rate & Review Product
                                                    </button>
                                                )
                                            )}

                                            {/* REVIEW FORM */}
                                            {selectedProductSlug === item.slug && (
                                                <div className="mt-4 bg-gray-50 p-4 rounded-lg animate-fade-in border border-gray-200">
                                                    <h4 className="font-bold text-gray-800 mb-2">Write a Review</h4>

                                                    <div className="flex gap-1 mb-3">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                                                                <Star className={`w-6 h-6 ${rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                                            </button>
                                                        ))}
                                                    </div>

                                                    <textarea
                                                        className="w-full p-3 border rounded-lg text-sm mb-3 focus:ring-2 focus:ring-orange-200 outline-none bg-white"
                                                        rows={3}
                                                        placeholder="Share your experience..."
                                                        value={reviewText}
                                                        onChange={(e) => setReviewText(e.target.value)}
                                                    />

                                                    {/* Image Upload */}
                                                    <div className="mb-4">
                                                        <label className="flex items-center gap-2 text-sm text-blue-600 cursor-pointer w-fit hover:bg-blue-50 px-3 py-2 rounded-md transition">
                                                            <Camera className="w-4 h-4" /> Add Photos
                                                            <input type="file" accept="image/png, image/jpeg, image/heic" multiple onChange={handleImageUpload} className="hidden" />
                                                        </label>
                                                        {reviewImages.length > 0 && (
                                                            <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
                                                                {reviewImages.map((img, i) => (
                                                                    <div key={i} className="relative w-16 h-16 border rounded-lg overflow-hidden shrink-0 group">
                                                                        <Image src={img} alt="Review" fill className="object-cover" />
                                                                        <button onClick={() => removeImage(i)} className="absolute top-0 right-0 bg-black/50 text-white p-1 rounded-bl-md opacity-0 group-hover:opacity-100 transition">
                                                                            <X className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-3">
                                                        <button onClick={handleSubmitReview} className="bg-orange-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-orange-700 shadow-md">Submit</button>
                                                        <button onClick={() => { setSelectedProductSlug(null); setReviewImages([]); }} className="text-gray-500 px-4 py-2 rounded text-sm hover:bg-gray-200">Cancel</button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Side Panel */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                                <div className="flex justify-between font-bold text-lg"><span>Total</span><span>₹{order.total}</span></div>
                            </div>
                            {!isCancelled && !isFailed && !isDelivered && (
                                <button onClick={handleCancelOrder} className="w-full border border-red-500 text-red-500 font-bold py-3 rounded-lg hover:bg-red-50 transition">
                                    Cancel Order
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}