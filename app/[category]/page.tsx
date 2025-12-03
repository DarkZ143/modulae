/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";

// Components
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";

import ProductCard from "@/app/components/ProductCard";
import ShopSidebar from "@/app/components/ShopSidebar";
import { ChevronLeft, ChevronRight, AlertCircle } from "lucide-react";

const ITEMS_PER_PAGE = 20;
const DEFAULT_CATEGORIES = ["products", "chairs", "dining", "furniture", "kitchen", "lamps", "shoe-racks", "sofa-sets", "tv-units", "wardrobes"];

export default function DynamicCategoryPage() {
    const params = useParams();
    const categoryParam = params?.category as string;

    // --- DATA STATES ---
    const [allItems, setAllItems] = useState<any[]>([]);
    const [filteredItems, setFilteredItems] = useState<any[]>([]);
    const [paginatedItems, setPaginatedItems] = useState<any[]>([]);

    // Sidebar Data
    const [categoryOptions, setCategoryOptions] = useState<{ slug: string, count: number }[]>([]);

    // --- UI STATES ---
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    // --- FILTER STATE ---
    const [filters, setFilters] = useState({
        category: categoryParam || "", // Initialize with URL category
        min: "",
        max: "",
        rating: 0
    });

    // 1. FETCH EVERYTHING (To populate Sidebar Counts + Allow switching)
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                // A. Get Categories
                const settingsRef = ref(rtdb, 'settings/categories');
                const settingsSnap = await get(settingsRef);
                const activeCategories = settingsSnap.exists() ? settingsSnap.val() : DEFAULT_CATEGORIES;

                // B. Get Products
                const promises = activeCategories.map((cat: string) => get(ref(rtdb, `${cat}/`)));
                const snapshots = await Promise.all(promises);

                let combinedData: any[] = [];
                const counts: Record<string, number> = {};
                activeCategories.forEach((c: string) => counts[c] = 0);

                snapshots.forEach((snap, index) => {
                    if (snap.exists()) {
                        const data = snap.val();
                        const catSlug = activeCategories[index];

                        const items = Object.keys(data).map((slug) => ({
                            slug,
                            category: catSlug,
                            ...data[slug],
                        }));

                        counts[catSlug] = items.length;
                        combinedData = [...combinedData, ...items];
                    }
                });

                // C. Update State
                const sidebarOptions = activeCategories.map((slug: string) => ({
                    slug,
                    count: counts[slug] || 0
                }));
                setCategoryOptions(sidebarOptions);

                // Shuffle
                const shuffled = combinedData.sort(() => Math.random() - 0.5);
                setAllItems(shuffled);

                // Trigger initial filter
                setLoading(false);

            } catch (err) {
                console.error("Firebase Error:", err);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // 2. FILTER LOGIC (Runs when filters or data changes)
    useEffect(() => {
        if (allItems.length === 0) return;

        let result = [...allItems];

        // Category Filter
        if (filters.category) {
            result = result.filter(item => item.category === filters.category);
        }

        // Price Filter
        if (filters.min) {
            result = result.filter(item => Number(item.price) >= Number(filters.min));
        }
        if (filters.max) {
            result = result.filter(item => Number(item.price) <= Number(filters.max));
        }

        // Rating Filter
        if (filters.rating > 0) {
            result = result.filter(item => (item.rating || 0) >= filters.rating);
        }

        setFilteredItems(result);
        setCurrentPage(1);
    }, [filters, allItems]);

    // 3. PAGINATION LOGIC
    useEffect(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        setPaginatedItems(filteredItems.slice(start, end));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [currentPage, filteredItems]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);

    // Helper Title
    const getTitle = () => {
        if (filters.category) return filters.category.replace(/-/g, ' ').toUpperCase();
        return "ALL PRODUCTS";
    };

    return (
        <>

            <Navbar />

            <div className="bg-gray-50 min-h-screen py-8">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-8">

                    {/* --- SIDEBAR --- */}
                    <ShopSidebar
                        categories={categoryOptions}
                        filters={filters}
                        setFilters={setFilters}
                        clearFilters={() => setFilters({ category: "", min: "", max: "", rating: 0 })}
                    />

                    {/* --- MAIN CONTENT --- */}
                    <div className="flex-1">

                        {/* Header */}
                        <div className="mb-6 border-b border-gray-200 pb-4">
                            <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Showing {paginatedItems.length} of {filteredItems.length} results
                            </p>
                        </div>

                        {/* Loading State */}
                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {[...Array(8)].map((_, i) => (
                                    <div key={i} className="h-[420px] bg-white rounded-md border border-gray-200 animate-pulse"></div>
                                ))}
                            </div>
                        ) : filteredItems.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-lg border border-gray-200 shadow-sm">
                                <AlertCircle className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-lg">No products match your selected filters.</p>
                                <button
                                    onClick={() => setFilters({ category: "", min: "", max: "", rating: 0 })}
                                    className="mt-3 text-orange-600 hover:underline font-semibold"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            /* ✅ PRODUCT GRID */
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {paginatedItems.map((item, idx) => (
                                    <ProductCard
                                        key={`${item.slug}-${idx}`}
                                        product={item}
                                    />
                                ))}
                            </div>
                        )}

                        {/* --- PAGINATION CONTROLS --- */}
                        {filteredItems.length > ITEMS_PER_PAGE && (
                            <div className="flex justify-center items-center gap-2 mt-12">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 border rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>

                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    if (pageNum === 1 || pageNum === totalPages || (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)) {
                                        return (
                                            <button
                                                key={pageNum}
                                                onClick={() => setCurrentPage(pageNum)}
                                                className={`w-10 h-10 rounded-md font-bold text-sm transition-all border ${currentPage === pageNum
                                                    ? "bg-gray-800 text-white border-gray-800"
                                                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                                                    }`}
                                            >
                                                {pageNum}
                                            </button>
                                        );
                                    } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                                        return <span key={pageNum} className="text-gray-400">...</span>;
                                    }
                                    return null;
                                })}

                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 border rounded-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed bg-white shadow-sm"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}

                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}