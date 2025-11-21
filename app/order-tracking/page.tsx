/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ref, get, update, push, set } from "firebase/database";
import { auth, rtdb } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { 
    CheckCircle, Truck, Package, Clock, MapPin, 
    XCircle, AlertTriangle, ChevronLeft, Star 
} from "lucide-react";

const STEPS = [
    { label: "Order Confirmed", key: "Confirmed", icon: CheckCircle },
    { label: "In Processing", key: "Processing", icon: Clock },
    { label: "Shipped", key: "Shipped", icon: Package },
    { label: "Out For Delivery", key: "OutForDelivery", icon: Truck },
    { label: "Delivered", key: "Delivered", icon: MapPin },
];

const CATEGORIES = [
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
                    setOrder(snapshot.val());
                }
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, [orderId, router]);

    const getCurrentStepIndex = (status: string) => {
        if (status === "Processing") return 1; 
        if (status === "Shipped") return 2;
        if (status === "OutForDelivery") return 3;
        if (status === "Delivered") return 4;
        return 0;
    };

    const handleCancelOrder = async () => {
        if (!confirm("Are you sure you want to cancel this order?")) return;
        try {
            const orderRef = ref(rtdb, `orders/${user.uid}/${orderId}`);
            await update(orderRef, { status: "Cancelled" });
            setOrder({ ...order, status: "Cancelled" });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            alert("Failed to cancel order. Please try again.");
        }
    };

    const handleSubmitReview = async () => {
        if (rating === 0) return alert("Please select a star rating.");
        if (!selectedProductSlug) return;

        try {
            let foundCategory = "";
            let currentProductData: any = null;

            for (const cat of CATEGORIES) {
                const snap = await get(ref(rtdb, `${cat}/${selectedProductSlug}`));
                if (snap.exists()) {
                    foundCategory = cat;
                    currentProductData = snap.val();
                    break;
                }
            }

            if (!foundCategory || !currentProductData) return alert("Product not found in database.");

            const reviewRef = ref(rtdb, `${foundCategory}/${selectedProductSlug}/user_reviews`);
            const newReviewRef = push(reviewRef);
            await set(newReviewRef, {
                user: user.displayName || user.email,
                rating,
                comment: reviewText,
                date: new Date().toISOString()
            });

            const currentRating = currentProductData.rating || 0;
            const currentReviews = currentProductData.reviews || 0;
            const newTotalReviews = currentReviews + 1;
            const newAverageRating = ((currentRating * currentReviews) + rating) / newTotalReviews;

            await update(ref(rtdb, `${foundCategory}/${selectedProductSlug}`), {
                rating: Number(newAverageRating.toFixed(1)),
                reviews: newTotalReviews
            });

            setReviewSubmitted(true);
            alert("Thank you for your feedback!");
            setRating(0);
            setReviewText("");
            setSelectedProductSlug(null);

        } catch (error) {
            console.error("Review Error:", error);
            alert("Failed to submit review.");
        }
    };

    if (loading) return <div className="min-h-screen flex justify-center items-center">Loading Tracking Info...</div>;

    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center">
            <p className="text-xl font-bold text-gray-500">Order not found.</p>
            <button onClick={() => router.push('/profile')} className="mt-4 text-orange-600 hover:underline">Back to Orders</button>
        </div>
    );

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

                    {/* --- STATUS TRACKER --- */}
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 mb-6 relative overflow-hidden">
                        {isCancelled ? (
                            <div className="flex flex-col items-center justify-center text-center py-10">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4"><XCircle className="w-10 h-10 text-red-500" /></div>
                                <h2 className="text-2xl font-bold text-red-600">Order Cancelled</h2>
                                <p className="text-gray-500 mt-2">This order was cancelled.</p>
                            </div>
                        ) : isFailed ? (
                            <div className="flex flex-col items-center justify-center text-center py-10">
                                <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4"><AlertTriangle className="w-10 h-10 text-red-500" /></div>
                                <h2 className="text-2xl font-bold text-red-600">Transaction Failed</h2>
                            </div>
                        ) : (
                            <div className="relative">
                                {/* DESKTOP HORIZONTAL STEPPER */}
                                <div className="hidden md:block relative">
                                    <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 z-0"></div>
                                    <div className="absolute top-5 left-0 h-1 bg-green-500 transition-all duration-1000 z-0" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
                                    <div className="flex justify-between relative z-10">
                                        {STEPS.map((step, idx) => {
                                            const isCompleted = idx <= currentStep;
                                            const isCurrent = idx === currentStep;
                                            return (
                                                <div key={step.key} className="flex flex-col items-center">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isCompleted ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-200 text-gray-400'} ${isCurrent ? 'ring-4 ring-green-100 scale-110' : ''}`}>
                                                        <step.icon className="w-5 h-5" />
                                                    </div>
                                                    <p className={`text-sm font-bold mt-2 ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>{step.label}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* ⭐ MOBILE VERTICAL STEPPER */}
                                <div className="md:hidden relative pl-4 border-l-2 border-gray-200 space-y-8">
                                    {STEPS.map((step, idx) => {
                                        const isCompleted = idx <= currentStep;
                                        const isCurrent = idx === currentStep;
                                        return (
                                            <div key={step.key} className="relative flex items-center gap-4">
                                                {/* Dot on the line */}
                                                <div className={`absolute -left-[21px] w-10 h-10 rounded-full flex items-center justify-center border-4 bg-white z-10 transition-all duration-300
                                                    ${isCompleted ? 'border-green-500 text-green-600' : 'border-gray-200 text-gray-300'}
                                                    ${isCurrent ? 'bg-green-50 ring-4 ring-green-100' : ''}
                                                `}>
                                                    <step.icon className="w-5 h-5" />
                                                </div>
                                                
                                                <div className="ml-6">
                                                    <p className={`text-base font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {step.label}
                                                    </p>
                                                    {isCurrent && <p className="text-xs text-orange-500 font-medium animate-pulse">Current Status</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        
                        {/* Items List + Review Button */}
                        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                            <h3 className="font-bold text-lg mb-4">Items in Order</h3>
                            <div className="space-y-6">
                                {order.items && order.items.map((item: any, idx: number) => (
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

                                        {/* ⭐ RATE PRODUCT BUTTON (Only if Delivered) */}
                                        {isDelivered && !reviewSubmitted && selectedProductSlug !== item.slug && (
                                            <button 
                                                onClick={() => setSelectedProductSlug(item.slug)}
                                                className="mt-3 text-sm text-orange-600 font-semibold hover:underline flex items-center gap-1"
                                            >
                                                <Star className="w-4 h-4" /> Rate & Review Product
                                            </button>
                                        )}

                                        {/* ⭐ REVIEW FORM */}
                                        {selectedProductSlug === item.slug && (
                                            <div className="mt-4 bg-gray-50 p-4 rounded-lg animate-fade-in border border-gray-200">
                                                <h4 className="font-bold text-gray-800 mb-2">Write a Review</h4>
                                                
                                                {/* Stars */}
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
                                                    placeholder="How was the product? Delivery experience?"
                                                    value={reviewText}
                                                    onChange={(e) => setReviewText(e.target.value)}
                                                />

                                                <div className="flex gap-3">
                                                    <button onClick={handleSubmitReview} className="bg-orange-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-orange-700 shadow-md">Submit Review</button>
                                                    <button onClick={() => setSelectedProductSlug(null)} className="text-gray-500 px-4 py-2 rounded text-sm hover:bg-gray-200">Cancel</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Side Panel: Address & Total */}
                        <div className="space-y-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                                <div className="flex justify-between mb-2 text-sm"><span>Subtotal</span><span>₹{order.total}</span></div>
                                <div className="flex justify-between mb-4 text-sm text-green-600"><span>Delivery</span><span>FREE</span></div>
                                <div className="border-t pt-3 flex justify-between font-bold text-lg"><span>Total</span><span>₹{order.total}</span></div>
                            </div>

                            {/* Cancel Button */}
                            {!isCancelled && !isFailed && !isDelivered && (
                                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                                    <h3 className="font-bold text-lg mb-2">Actions</h3>
                                    <button onClick={handleCancelOrder} className="w-full border border-red-500 text-red-500 font-bold py-3 rounded-lg hover:bg-red-50 transition">
                                        Cancel Order
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}