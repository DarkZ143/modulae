/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";

// Components
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import TopOfferBar from "@/app/components/TopOfferBar";

// List of all nodes in your Firebase
const ALL_CATEGORIES = [
    "products",
    "chairs",
    "dining",
    "furniture",
    "kitchen",
    "lamps",
    "shoe-racks",
    "sofa-sets",
    "tv-units",
    "wardrobes"
];

export default function AllProductsPage() {
    const [allItems, setAllItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEverything = async () => {
            try {
                setLoading(true);
                const promises = ALL_CATEGORIES.map((category) => {
                    return get(ref(rtdb, `${category}/`));
                });

                // Wait for ALL categories to fetch
                const snapshots = await Promise.all(promises);

                let combinedData: any[] = [];

                snapshots.forEach((snap) => {
                    if (snap.exists()) {
                        const data = snap.val();
                        // Convert object to array and push to master list
                        const categoryItems = Object.keys(data).map((slug) => ({
                            slug,
                            ...data[slug],
                        }));
                        combinedData = [...combinedData, ...categoryItems];
                    }
                });

                // Optional: Shuffle items so they don't look grouped by category
                setAllItems(combinedData.sort(() => Math.random() - 0.5));
                
            } catch (error) {
                console.error("Error fetching all products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEverything();
    }, []);

    return (
        <>
            <TopOfferBar />
            <Navbar />

            <div className="bg-gray-50 min-h-screen py-10">
                <div className="max-w-7xl mx-auto px-6">
                    
                    {/* Header */}
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">All Collections</h1>
                        <p className="text-gray-500">Browsing {allItems.length} premium items</p>
                        <div className="w-24 h-1 bg-orange-500 mx-auto mt-4 rounded-full"></div>
                    </div>

                    {/* Loading State */}
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="h-80 bg-gray-200 rounded-xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : (
                        /* Products Grid */
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {allItems.map((item, idx) => {
                                const offer = Math.round(((item.mrp - item.price) / item.mrp) * 100) || 0;

                                return (
                                    <Link 
                                        key={`${item.slug}-${idx}`} 
                                        href={`/products/${item.slug}`}
                                        className="group block bg-white   rounded-xl overflow-hidden hover:shadow-xl hover:shadow-orange-200 transition-all duration-300"
                                    >
                                        {/* Image Container */}
                                        <div className="relative w-full h-64 bg-gray-100 overflow-hidden">
                                            <Image
                                                src={item.images?.[0] || "/placeholder.png"}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition duration-500"
                                            />
                                            
                                            {/* Offer Badge */}
                                            {offer > 0 && (
                                                <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                                                    {offer}% OFF
                                                </span>
                                            )}

                                            {/* Quick View Overlay (Optional Aesthetic) */}
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <span className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-semibold shadow-lg transform translate-y-4 group-hover:translate-y-0 transition duration-300">
                                                    View Details
                                                </span>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-4">
                                            <h3 className="font-bold text-gray-800 truncate mb-1" title={item.title}>
                                                {item.title}
                                            </h3>
                                            
                                            {/* Rating */}
                                            <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
                                                <span className="text-yellow-500">★</span>
                                                <span>{item.rating || 4.5}</span>
                                                <span>({item.reviews || 0})</span>
                                            </div>

                                            {/* Price */}
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <span className="text-lg font-bold text-gray-900">₹{item.price}</span>
                                                    <span className="text-sm text-gray-400 line-through ml-2">₹{item.mrp}</span>
                                                </div>
                                                <button className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center hover:bg-orange-500 hover:text-white transition">
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
}