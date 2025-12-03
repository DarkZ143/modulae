/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Star, ChevronDown, ChevronUp, Filter } from "lucide-react";

interface CategoryOption {
    slug: string;
    count: number;
}

interface SidebarProps {
    categories: CategoryOption[]; // ✅ Updated to include counts
    filters: any;
    setFilters: (f: any) => void;
    clearFilters: () => void;
}

export default function ShopSidebar({ categories, filters, setFilters, clearFilters }: SidebarProps) {
    const [isOpen, setIsOpen] = useState(false); // For mobile toggle

    const handleCategoryChange = (catSlug: string) => {
        // Toggle: If clicking the same category, clear it. Otherwise, set it.
        setFilters((prev: any) => ({
            ...prev,
            category: prev.category === catSlug ? "" : catSlug
        }));
    };

    const handleRatingChange = (rating: number) => {
        setFilters((prev: any) => ({ ...prev, rating: prev.rating === rating ? 0 : rating }));
    };

    const handlePriceChange = (e: any, type: "min" | "max") => {
        setFilters((prev: any) => ({ ...prev, [type]: e.target.value }));
    };

    return (
        <div className="w-full lg:w-64 shrink-0">
            {/* Mobile Filter Toggle */}
            <button
                className="lg:hidden w-full flex items-center justify-between p-3 bg-white border rounded-lg mb-4 shadow-sm"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="font-bold flex items-center gap-2 text-gray-800"><Filter className="w-4 h-4" /> Filters</span>
                {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {/* Sidebar Content */}
            <div className={`${isOpen ? "block" : "hidden"} lg:block space-y-6`}>

                {/* 1. Categories */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wider">Category</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                        {/* 'All' Option */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={filters.category === ""}
                                onChange={() => handleCategoryChange("")}
                                className="accent-orange-600 w-4 h-4 cursor-pointer"
                            />
                            <span className={`text-sm group-hover:text-orange-600 transition ${filters.category === "" ? "font-bold text-gray-900" : "text-gray-600"}`}>
                                All Categories
                            </span>
                        </label>

                        {/* Dynamic Categories */}
                        {categories.map((cat) => (
                            <label key={cat.slug} className="flex items-center gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={filters.category === cat.slug}
                                    onChange={() => handleCategoryChange(cat.slug)}
                                    className="accent-orange-600 w-4 h-4 cursor-pointer"
                                />
                                <span className={`text-sm flex-1 group-hover:text-orange-600 transition ${filters.category === cat.slug ? "font-bold text-gray-900" : "text-gray-600"}`}>
                                    <span className="capitalize">{cat.slug.replace(/-/g, ' ')}</span>
                                    <span className="text-gray-400 text-xs ml-1">({cat.count})</span>
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* 2. Price Range */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wider">Price Range</h3>
                    <div className="flex items-center gap-2">
                        <div className="relative w-full">
                            <span className="absolute left-2 top-2 text-gray-400 text-xs">₹</span>
                            <input
                                type="number"
                                placeholder="Min"
                                value={filters.min}
                                onChange={(e) => handlePriceChange(e, "min")}
                                className="w-full pl-5 p-2 border rounded-lg text-sm outline-none focus:border-orange-500 bg-gray-50"
                            />
                        </div>
                        <span className="text-gray-400">-</span>
                        <div className="relative w-full">
                            <span className="absolute left-2 top-2 text-gray-400 text-xs">₹</span>
                            <input
                                type="number"
                                placeholder="Max"
                                value={filters.max}
                                onChange={(e) => handlePriceChange(e, "max")}
                                className="w-full pl-5 p-2 border rounded-lg text-sm outline-none focus:border-orange-500 bg-gray-50"
                            />
                        </div>
                    </div>
                </div>

                {/* 3. Customer Ratings */}
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4 text-xs uppercase tracking-wider">Avg. Review</h3>
                    <div className="space-y-2">
                        {[4, 3, 2, 1].map((star) => (
                            <div
                                key={star}
                                onClick={() => handleRatingChange(star)}
                                className={`flex items-center gap-2 cursor-pointer px-2 py-1.5 rounded-lg transition ${filters.rating === star ? "bg-orange-50 ring-1 ring-orange-200" : "hover:bg-gray-50"}`}
                            >
                                <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < star ? "fill-current" : "text-gray-300"}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-gray-600">& Up</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Clear Filters */}
                <button
                    onClick={clearFilters}
                    className="w-full py-2 text-sm text-red-500 font-semibold border border-red-100 rounded-lg hover:bg-red-50 transition text-center"
                >
                    Clear All Filters
                </button>
            </div>
        </div>
    );
}