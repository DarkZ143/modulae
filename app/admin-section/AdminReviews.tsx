/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, remove, update } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Star, Trash2, Calendar, MessageSquare, ExternalLink, Reply, Save, X, Image as ImageIcon, Edit, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Fallback only if DB is completely empty
const DEFAULT_CATEGORIES = [
    "products", "chairs", "dining", "furniture", "kitchen",
    "lamps", "shoe-racks", "sofa-sets", "tv-units", "wardrobes"
];

interface ReviewItem {
    reviewId: string;
    productSlug: string;
    productTitle: string;
    category: string;
    user: string;
    rating: number;
    comment: string;
    date: string;
    images?: string[]; // User uploaded images
    admin_reply?: string; // Admin reply
}

export default function AdminReviews() {
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Reply State
    const [replyText, setReplyText] = useState("");
    const [replyingTo, setReplyingTo] = useState<string | null>(null); // ID of review being replied to

    // 1. Dynamic Fetch Logic
    const fetchReviews = async () => {
        setLoading(true);
        const collectedReviews: ReviewItem[] = [];

        try {
            // A. Fetch Dynamic Category List from Firebase Settings
            const settingsRef = ref(rtdb, 'settings/categories');
            const settingsSnap = await get(settingsRef);

            // Use DB categories if available, otherwise fallback
            const categoriesToScan = settingsSnap.exists()
                ? settingsSnap.val()
                : DEFAULT_CATEGORIES;

            // B. Loop through these specific categories
            const promises = categoriesToScan.map(async (cat: string) => {
                const snap = await get(ref(rtdb, `${cat}/`));
                if (snap.exists()) {
                    const data = snap.val();

                    // Loop through products in this category
                    Object.keys(data).forEach((productSlug) => {
                        const product = data[productSlug];

                        // Check if product has reviews
                        if (product.user_reviews) {
                            Object.keys(product.user_reviews).forEach((reviewId) => {
                                const r = product.user_reviews[reviewId];
                                collectedReviews.push({
                                    reviewId,
                                    productSlug,
                                    productTitle: product.title,
                                    category: cat, // Store dynamic category
                                    user: r.user || "Anonymous",
                                    rating: r.rating,
                                    comment: r.comment,
                                    date: r.date,
                                    images: r.images || [],
                                    admin_reply: r.admin_reply || ""
                                });
                            });
                        }
                    });
                }
            });

            await Promise.all(promises);

            // Sort by date (newest first)
            collectedReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setReviews(collectedReviews);

        } catch (error) {
            console.error("Error fetching reviews:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReviews(); }, []);

    // 2. Delete Review
    const handleDelete = async (item: ReviewItem) => {
        if (!confirm("Delete this review? This will update the product's average rating.")) return;

        try {
            // Remove review
            await remove(ref(rtdb, `${item.category}/${item.productSlug}/user_reviews/${item.reviewId}`));

            // Recalculate Product Stats
            const productRef = ref(rtdb, `${item.category}/${item.productSlug}`);
            const snap = await get(productRef);

            if (snap.exists()) {
                const product = snap.val();
                const reviewsObj = product.user_reviews || {};
                const reviewValues: any[] = Object.values(reviewsObj);
                const newTotalReviews = reviewValues.length;

                let newRating = 0;
                if (newTotalReviews > 0) {
                    const sum = reviewValues.reduce((acc, curr) => acc + curr.rating, 0);
                    newRating = Number((sum / newTotalReviews).toFixed(1));
                } else {
                    newRating = 4.5; // Reset default
                }

                await update(productRef, { rating: newRating, reviews: newTotalReviews });
            }
            fetchReviews();
        } catch (error) {
            alert("Failed to delete review.");
        }
    };

    // 3. Submit Reply
    const handleSubmitReply = async (item: ReviewItem) => {
        if (!replyText.trim()) return;

        try {
            const reviewRef = ref(rtdb, `${item.category}/${item.productSlug}/user_reviews/${item.reviewId}`);
            await update(reviewRef, { admin_reply: replyText });

            alert("Reply posted!");
            setReplyingTo(null);
            setReplyText("");
            fetchReviews(); // Refresh to show new reply
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            alert("Failed to post reply.");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Customer Reviews ({reviews.length})</h2>
                <button onClick={fetchReviews} className="text-sm text-orange-600 font-semibold hover:underline flex items-center gap-1">
                    <RefreshCw className="w-4 h-4" /> Refresh
                </button>
            </div>

            {loading ? (
                <div className="grid gap-4">
                    {[1, 2, 3].map(i => <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse"></div>)}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-gray-200 shadow-sm">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No reviews submitted yet.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    {reviews.map((review) => (
                        <div key={review.reviewId} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">

                            <div className="flex flex-col md:flex-row gap-6">

                                {/* Left: User Info */}
                                <div className="md:w-1/5 shrink-0">
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-9 h-9 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs">
                                            {review.user.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-gray-900 text-sm truncate max-w-[120px]">{review.user}</span>
                                    </div>
                                    <div className="flex text-yellow-400 mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-gray-300"}`} />
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                        <Calendar className="w-3 h-3" /> {new Date(review.date).toLocaleDateString()}
                                    </p>
                                </div>

                                {/* Middle: Content */}
                                <div className="flex-1">
                                    {/* Comment Bubble */}
                                    <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700 italic mb-3 border border-gray-100 relative">
                                        <div className="absolute -top-2 left-4 w-3 h-3 bg-gray-50 border-t border-l border-gray-100 transform rotate-45 md:hidden"></div>
                                        &quot;{review.comment}&quot;
                                    </div>

                                    {/* User Images */}
                                    {review.images && review.images.length > 0 && (
                                        <div className="mb-4">
                                            <p className="text-xs font-bold text-gray-400 mb-2 flex items-center gap-1">
                                                <ImageIcon className="w-3 h-3" /> User Photos
                                            </p>
                                            <div className="flex gap-2 overflow-x-auto pb-2">
                                                {review.images.map((img, idx) => (
                                                    <div key={idx} className="relative w-16 h-16 rounded-lg border overflow-hidden shrink-0 group cursor-pointer">
                                                        <Image src={img} alt="User Upload" fill className="object-cover" />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Product Link */}
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-xs font-bold text-gray-400 uppercase">Product:</span>
                                        <Link href={`/products/${review.productSlug}`} target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1 font-medium">
                                            {review.productTitle} <ExternalLink className="w-3 h-3" />
                                        </Link>
                                    </div>

                                    {/* Admin Reply Display */}
                                    {review.admin_reply && (
                                        <div className="mt-4 ml-4 border-l-2 border-orange-500 pl-4 py-1">
                                            <p className="text-xs font-bold text-orange-600 mb-1">Admin Reply:</p>
                                            <p className="text-sm text-gray-600">{review.admin_reply}</p>
                                        </div>
                                    )}

                                    {/* Reply Input Area (Conditional) */}
                                    {replyingTo === review.reviewId && (
                                        <div className="mt-4 bg-orange-50 p-4 rounded-lg animate-fade-in">
                                            <textarea
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Write your reply..."
                                                className="w-full p-2 border border-orange-200 rounded text-sm focus:outline-none focus:border-orange-500 bg-white"
                                                rows={2}
                                            />
                                            <div className="flex gap-2 mt-2 justify-end">
                                                <button onClick={() => setReplyingTo(null)} className="px-3 py-1 text-xs font-semibold text-gray-500 hover:bg-gray-200 rounded">Cancel</button>
                                                <button onClick={() => handleSubmitReply(review)} className="px-3 py-1 text-xs font-semibold bg-orange-600 text-white rounded hover:bg-orange-700 flex items-center gap-1">
                                                    <Save className="w-3 h-3" /> Send
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                                {!review.admin_reply && replyingTo !== review.reviewId && (
                                    <button
                                        onClick={() => { setReplyingTo(review.reviewId); setReplyText(""); }}
                                        className="flex items-center gap-1 text-blue-600 bg-blue-50 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-blue-100 transition"
                                    >
                                        <Reply className="w-3 h-3" /> Reply
                                    </button>
                                )}
                                {review.admin_reply && (
                                    <button
                                        onClick={() => { setReplyingTo(review.reviewId); setReplyText(review.admin_reply || ""); }}
                                        className="flex items-center gap-1 text-gray-500 bg-gray-100 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-gray-200 transition"
                                    >
                                        <Edit className="w-3 h-3" /> Edit Reply
                                    </button>
                                )}
                                <button
                                    onClick={() => handleDelete(review)}
                                    className="flex items-center gap-1 text-red-500 bg-red-50 px-3 py-1.5 rounded-md text-xs font-bold hover:bg-red-100 transition"
                                >
                                    <Trash2 className="w-3 h-3" /> Delete
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}