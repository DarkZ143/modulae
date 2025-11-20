/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation"; // Import useParams
import TopOfferBar from "@/app/components/TopOfferBar"; // Fixed imports
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import LatestProducts from "@/app/components/LatestProduct";
import BlogSection from "@/app/components/blog";
import CategoryHeader from "@/app/components/CategoryHeader";

import { rtdb } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import Image from "next/image";
import Link from "next/link";

export default function DynamicCategoryPage() {
    // 1. Get the category from the URL (e.g., "chairs", "lamps", "dining")
    const params = useParams();
    const category = params?.category as string; 

    const [products, setProducts] = useState<any[]>([]);
    const [filtered, setFiltered] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Filters
    const [budget, setBudget] = useState("all");
    const [material, setMaterial] = useState("all");
    const [stock, setStock] = useState("all");

    // 2. Fetch data dynamically based on the URL category
    useEffect(() => {
        if (!category) return;

        // Dynamically point to "chairs/", "lamps/", "dining/", etc.
        const dbRef = ref(rtdb, `${category}/`); 
        
        const unsubscribe = onValue(dbRef, 
            (snap) => {
                if (!snap.exists()) {
                    console.warn(`No data found at '${category}/' path.`);
                    setProducts([]);
                    setFiltered([]);
                    setLoading(false);
                    return;
                }
                
                const data = snap.val();
                const formatted = Object.keys(data).map((slug) => ({
                    slug,
                    ...data[slug],
                }));

                setProducts(formatted);
                setFiltered(formatted);
                setLoading(false);
            }, 
            (err) => {
                console.error("Firebase Error:", err);
                setError(err.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [category]); // Re-run if category changes

    // Filter Logic (Same as before)
    useEffect(() => {
        let updated = [...products];

        if (budget !== "all") {
            updated = updated.filter((p) => Number(p.price) <= Number(budget));
        }

        if (material !== "all") {
            updated = updated.filter((p) => {
                const mat = p.specifications?.Material || p.specifications?.material || "";
                return mat.toLowerCase().includes(material.toLowerCase());
            });
        }

        if (stock === "in") updated = updated.filter((p) => Number(p.stock) > 0);
        if (stock === "out") updated = updated.filter((p) => Number(p.stock) <= 0);

        setFiltered(updated);
    }, [budget, material, stock, products]);

    // Helper to capitalize title (e.g., "sofa-sets" -> "Sofa Sets")
    const formatTitle = (slug: string) => {
        return slug ? slug.replace(/-/g, " ").toUpperCase() + " COLLECTION" : "COLLECTION";
    };

    return (
        <>
            <TopOfferBar />
            <Navbar />
            
            {/* Dynamic Header Title */}
            <CategoryHeader title={formatTitle(category)} />

            <div className="max-w-7xl mx-auto px-6 py-10">
                
                {/* FILTERS UI */}
                <div className="bg-white shadow-sm border rounded-xl p-6 mb-10">
                    <h2 className="text-xl font-bold mb-4">Filter {category}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Budget */}
                        <div>
                            <label className="font-medium text-gray-700">Budget</label>
                            <select className="w-full border p-3 rounded-lg mt-1" value={budget} onChange={(e) => setBudget(e.target.value)}>
                                <option value="all">All</option>
                                <option value="1000">Under ₹1000</option>
                                <option value="2000">Under ₹2000</option>
                                <option value="5000">Under ₹5000</option>
                                <option value="10000">Under ₹10000</option>
                            </select>
                        </div>
                        {/* Material */}
                        <div>
                            <label className="font-medium text-gray-700">Material</label>
                            <select className="w-full border p-3 rounded-lg mt-1" value={material} onChange={(e) => setMaterial(e.target.value)}>
                                <option value="all">All</option>
                                <option value="wood">Wood</option>
                                <option value="metal">Metal</option>
                                <option value="plastic">Plastic</option>
                                <option value="mesh">Mesh</option>
                                <option value="fabric">Fabric</option>
                                <option value="leather">Leather</option>
                            </select>
                        </div>
                        {/* Stock */}
                        <div>
                            <label className="font-medium text-gray-700">Stock Status</label>
                            <select className="w-full border p-3 rounded-lg mt-1" value={stock} onChange={(e) => setStock(e.target.value)}>
                                <option value="all">All</option>
                                <option value="in">In Stock</option>
                                <option value="out">Out of Stock</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* PRODUCT GRID */}
                <h2 className="text-2xl font-bold mb-4 capitalize">Available {category?.replace(/-/g, " ")}</h2>

                {loading ? (
                    <div className="min-h-[200px] flex justify-center items-center">
                         <p className="text-blue-600 font-medium animate-pulse">Loading {category}...</p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
                        Error loading data: {error}
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No products found in this category yet.</p>
                        <Link href="/" className="text-orange-500 font-bold hover:underline mt-2 block">Go Back Home</Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        {filtered.map((item, idx) => {
                            const offer = Math.round(((item.mrp - item.price) / item.mrp) * 100) || 0;
                            
                            return (
                                <Link key={idx} href={`/products/${item.slug}`} className="block bg-white rounded-xl shadow-sm hover:shadow-lg hover:shadow-orange-200 transition p-4 group">
                                    {/* Image */}
                                    <div className="relative w-full h-64 mb-4 overflow-hidden rounded-lg bg-gray-100">
                                        <Image
                                            src={item.images?.[0] || "/placeholder.png"}
                                            alt={item.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition duration-300"
                                        />
                                        {offer > 0 && (
                                            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                                                {offer}% OFF
                                            </span>
                                        )}
                                    </div>

                                    {/* Details */}
                                    <h3 className="font-bold text-lg text-gray-800 truncate mb-2">
                                        {item.title}
                                    </h3>
                                    <div className="flex items-center gap-3">
                                        <p className="text-xl font-bold text-gray-900">₹{item.price}</p>
                                        <p className="text-sm text-gray-400 line-through">₹{item.mrp}</p>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </div>

            <LatestProducts />
            <BlogSection />
            <Footer />
        </>
    );
}