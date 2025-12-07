/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LatestProducts from "../../components/LatestProduct";
import BlogSection from "../../components/blog";
import CategoryHeader from "@/app/components/CategoryHeader";

// Fallback Data
const DEFAULT_BRANDS = [
    {
        id: "1",
        name: "UrbanWood",
        image: "/brands/urbanwoods.png",
        description: "UrbanWood specializes in handcrafted wooden furniture designed for modern Indian homes..."
    },
    // ... (keep your other default items here if you want)
];

export default function BrandsPage() {
    const [brands, setBrands] = useState<any[]>(DEFAULT_BRANDS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const snap = await get(ref(rtdb, "settings/brands"));
                if (snap.exists()) {
                    const data = snap.val();
                    const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                    setBrands(list);
                }
            } catch (error) {
                console.error("Error loading brands:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBrands();
    }, []);

    return (
        <>
            <Navbar />
            <CategoryHeader title="Brands" />

            {/* PAGE HEADER */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">
                    Our Premium <span className="text-orange-600 underline decoration-orange-400">Brands</span>
                </h1>
                <p className="text-center text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
                    Discover our trusted brands offering high-quality, durable and modern furniture solutions crafted to elevate your lifestyle.
                </p>
            </div>

            {/* BRAND SECTIONS */}
            <div className="max-w-7xl mx-auto px-6 space-y-20 pb-20 min-h-[50vh]">
                {loading ? (
                    // Skeleton Loader
                    [1, 2].map((i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-10 items-center animate-pulse">
                            <div className="w-full md:w-1/2 h-64 bg-gray-200 rounded-2xl"></div>
                            <div className="w-full md:w-1/2 space-y-4">
                                <div className="h-8 bg-gray-200 w-1/3 rounded"></div>
                                <div className="h-24 bg-gray-200 w-full rounded"></div>
                            </div>
                        </div>
                    ))
                ) : (
                    brands.map((brand, index) => (
                        <div
                            key={brand.id || index}
                            className={`flex flex-col md:flex-row items-center gap-10 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
                        >
                            {/* IMAGE */}
                            <div className="w-full md:w-1/2">
                                <div className="rounded-2xl shadow-lg overflow-hidden border bg-amber-50 border-orange-200 relative h-[280px] md:h-[340px] flex items-center justify-center p-6">
                                    <Image
                                        src={brand.image || "/placeholder.png"}
                                        alt={brand.name}
                                        fill
                                        className="object-contain p-6 hover:scale-105 transition duration-500"
                                    />
                                </div>
                            </div>

                            {/* CONTENT */}
                            <div className="w-full md:w-1/2">
                                <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                    <span className="text-orange-500">●</span> {brand.name}
                                </h2>

                                <p className="text-gray-700 leading-relaxed mt-4 text-lg">
                                    {brand.description}
                                </p>

                                <button className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold shadow hover:bg-orange-700 transition transform active:scale-95">
                                    Explore {brand.name}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Existing Components */}
            <LatestProducts />
            <BlogSection />
            <Footer />
        </>
    );
}