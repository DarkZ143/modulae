/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LatestProducts from "../../components/LatestProduct";
import BlogSection from "../../components/blog";

import Link from "next/link";
import Image from "next/image";

// Firestore (You will enable this once your JSON is ready)
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function FRCollectionsPage() {
    const [collections, setCollections] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // -------------------------
    // Fetch Collections From Firestore
    // -------------------------
    useEffect(() => {
        const fetchData = async () => {
            try {
                // (You will later create "frCollections" folder in Firestore)
                const snap = await getDocs(collection(db, "frCollections"));

                const data: any[] = [];
                snap.forEach((doc) => data.push({ id: doc.id, ...doc.data() }));

                setCollections(data);
            } catch (error) {
                console.error("Error loading collections:", error);

                // -------------------------
                // TEMP DATA (Placeholder UI)
                // -------------------------
                setCollections([
                    {
                        id: "1",
                        title: "Luxury Sofa Collection",
                        slug: "luxury-sofas",
                        image: "/heroProduct/luxury-sofa.jpg",
                        description:
                            "Explore premium handcrafted sofa sets made with hardwood frames, plush cushioning and Italian fabrics."
                    },
                    {
                        id: "2",
                        title: "Premium Bedroom Collection",
                        slug: "premium-bedroom",
                        image: "/heroProduct/bedroom.jpg",
                        description:
                            "Designer beds, hydraulic storage, soft-close wardrobes & modular bedside units for modern homes."
                    },
                    {
                        id: "3",
                        title: "Royal Dining Collection",
                        slug: "royal-dining",
                        image: "/heroProduct/dining.jpg",
                        description:
                            "Imported marble tops, solid wood chairs and premium table designs for every family."
                    },
                    {
                        id: "4",
                        title: "Office Furniture Collection",
                        slug: "office-furniture",
                        image: "/heroProduct/office.jpg",
                        description:
                            "Ergonomic chairs, meeting tables, workstations, reception counters & premium workspace furniture."
                    },
                    {
                        id: "5",
                        title: "Kids Furniture Collection",
                        slug: "kids-furniture",
                        image: "/heroProduct/kids.jpg",
                        description:
                            "Colorful study tables, bunk beds, wardrobes and playful storage units designed for safety and comfort."
                    },
                    {
                        id: "6",
                        title: "Outdoor Furniture",
                        slug: "outdoor-furniture",
                        image: "/heroProduct/outdoor.jpg",
                        description:
                            "Weatherproof patio sets, loungers, garden chairs and coffee tables designed for outdoor durability."
                    },
                ]);
            }

            setLoading(false);
        };

        fetchData();
    }, []);

    return (
        <>
            
            <Navbar />

            {/* Page Header */}
            <div className="bg-gray-50 border-b">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                        FR Furniture Collections
                    </h1>
                    <p className="text-sm md:text-base text-gray-600 mt-1">
                        Explore exclusive furniture collections curated for style, comfort, and durability.
                    </p>
                </div>
            </div>

            {/* Main Container */}
            <div className="max-w-7xl mx-auto px-6 py-10">

                {/* Loading Skeletons */}
                {loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="bg-gray-200 h-64 rounded-xl animate-pulse" />
                        ))}
                    </div>
                )}

                {/* Collection Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        {collections.map((item) => (
                            <Link
                                href={`/collections/fr/${item.slug}`}
                                key={item.id}
                                className="group block bg-white rounded-2xl shadow-sm border hover:shadow-lg transition overflow-hidden"
                            >
                                {/* Image */}
                                <div className="relative w-full h-64">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition group-hover:scale-105"
                                    />
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-gray-900 group-hover:text-orange-600">
                                        {item.title}
                                    </h3>
                                    <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                                        {item.description}
                                    </p>

                                    <button className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg text-sm font-semibold group-hover:bg-orange-600">
                                        View Collection
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Existing Global Sections */}
            <LatestProducts />
            <BlogSection />
            <Footer />
        </>
    );
}
