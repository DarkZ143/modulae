/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get, remove, update } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { Star, Trash2, User, Calendar, MessageSquare, ExternalLink } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
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
}

export default function AdminReviews() {
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch All Reviews from All Products
    const fetchReviews = async () => {
        setLoading(true);
        const collectedReviews: ReviewItem[] = [];

        for (const cat of CATEGORIES) {
            const snap = await get(ref(rtdb, `${cat}/`));
            if (snap.exists()) {
                const data = snap.val();
                // Loop through products
                Object.keys(data).forEach((productSlug) => {
                    const product = data[productSlug];
                    if (product.user_reviews) {
                        // Loop through reviews within product
                        Object.keys(product.user_reviews).forEach((reviewId) => {
                            const r = product.user_reviews[reviewId];
                            collectedReviews.push({
                                reviewId,
                                productSlug,
                                productTitle: product.title,
                                category: cat,
                                user: r.user,
                                rating: r.rating,
                                comment: r.comment,
                                date: r.date
                            });
                        });
                    }
                });
            }
        }

        // Sort by date (newest first)
        collectedReviews.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setReviews(collectedReviews);
        setLoading(false);
    };

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { fetchReviews(); }, []);

    // 2. Delete Review & Recalculate Rating
    const handleDelete = async (item: ReviewItem) => {
        if (!confirm("Are you sure? This will delete the review and recalculate the product rating.")) return;

        try {
            // A. Remove the review node
            await remove(ref(rtdb, `${item.category}/${item.productSlug}/user_reviews/${item.reviewId}`));

            // B. Recalculate Statistics
            const productRef = ref(rtdb, `${item.category}/${item.productSlug}`);
            const snap = await get(productRef);

            if (snap.exists()) {
                const product = snap.val();
                const reviewsObj = product.user_reviews || {};
                const reviewValues: any[] = Object.values(reviewsObj);

                const newTotalReviews = reviewValues.length;

                // Calculate new average
                let newRating = 0;
                if (newTotalReviews > 0) {
                    const sum = reviewValues.reduce((acc, curr) => acc + curr.rating, 0);
                    newRating = Number((sum / newTotalReviews).toFixed(1));
                } else {
                    newRating = 4.5; // Default back to 4.5 or 0 if no reviews left
                }

                // C. Update Product Stats
                await update(productRef, {
                    rating: newRating,
                    reviews: newTotalReviews
                });
            }

            alert("Review deleted and stats updated.");
            fetchReviews(); // Refresh UI

        } catch (error) {
            console.error(error);
            alert("Failed to delete review.");
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Customer Reviews ({reviews.length})</h2>
                <button onClick={fetchReviews} className="text-sm text-orange-600 font-semibold hover:underline">Refresh</button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-40 bg-gray-100 rounded-xl animate-pulse"></div>)}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border">
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">No reviews submitted yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {reviews.map((review) => (
                        <div key={review.reviewId} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-6">

                            {/* Left: User & Rating */}
                            <div className="md:w-1/4 shrink-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-xs">
                                        {review.user.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-semibold text-gray-800 text-sm">{review.user}</span>
                                </div>
                                <div className="flex items-center gap-1 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"}`} />
                                    ))}
                                    <span className="text-sm font-bold text-gray-600 ml-1">{review.rating}.0</span>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(review.date).toLocaleDateString()}
                                </div>
                            </div>

                            {/* Middle: Comment & Product Link */}
                            <div className="flex-1">
                                <p className="text-gray-700 text-sm leading-relaxed mb-4">&quot;{review.comment}&quot;</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-bold text-gray-400 uppercase">Product:</span>
                                    <Link href={`/products/${review.productSlug}`} target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                                        {review.productTitle} <ExternalLink className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-start justify-end">
                                <button
                                    onClick={() => handleDelete(review)}
                                    className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
                                >
                                    <Trash2 className="w-4 h-4" /> Delete
                                </button>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}