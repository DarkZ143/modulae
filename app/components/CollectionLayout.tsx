/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useMemo, useState, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/* ----------------------------------------
   TYPES
---------------------------------------- */
type Product = {
    id: number | string;
    title: string;
    price: number;
    oldPrice?: number;
    image?: string;
    tags?: string[];
    inStock?: boolean;
    brand?: string;
};

type FilterOption = {
    label: string;
    count?: number;
};

type FiltersShape = {
    availability?: FilterOption[];
    productType?: FilterOption[];
    color?: FilterOption[];
    material?: FilterOption[];
    brand?: FilterOption[];
};

type CollectionLayoutProps = {
    products?: Product[];
    filters?: FiltersShape;
    initialView?: "grid-4" | "grid-3" | "grid-2" | "list";
};

/* ----------------------------------------
   DEFAULT FILTERS (dummy)
---------------------------------------- */
const DEFAULT_FILTERS: FiltersShape = {
    availability: [
        { label: "In stock (21)" },
        { label: "Out of stock (1)" },
    ],
    productType: [
        { label: "Bedroom Furniture Sets (8)" },
        { label: "chair (1)" },
        { label: "latest chair (7)" },
    ],
    color: [
        { label: "Black (7)" },
        { label: "Blue (4)" },
        { label: "Brown (8)" },
        { label: "Cream (2)" },
        { label: "Dark (1)" },
        { label: "deepskyblue (1)" },
        { label: "Green (10)" },
        { label: "Grey (4)" },
        { label: "Light (2)" },
        { label: "Orange (3)" },
    ],
    material: [
        { label: "Metal (7)" },
        { label: "Wood (1)" },
        { label: "Wooden (8)" },
    ],
    brand: [
        { label: "new vendor (6)" },
        { label: "Modulae (8)" },
        { label: "Modulae (1)" },
        { label: "Modulae-Preyantechnosys (9)" },
    ],
};

/* ----------------------------------------
   DEFAULT SAMPLE PRODUCTS (dummy)
---------------------------------------- */
const SAMPLE_PRODUCTS: Product[] = [
    {
        id: 1,
        title: "Arm Chair",
        price: 300,
        oldPrice: 500,
        image: "/latest/velvet.png",
        inStock: true,
        brand: "Modulae",
        tags: ["blue", "wood"],
    },
    {
        id: 2,
        title: "Dining Table",
        price: 250,
        oldPrice: 299,
        image: "/sample/dining-table.jpg",
        inStock: true,
        brand: "new vendor",
        tags: ["brown", "wood"],
    },
    {
        id: 3,
        title: "Fabric Chair",
        price: 500,
        oldPrice: 800,
        image: "/sample/fabric-chair.jpg",
        inStock: true,
        brand: "Modulae",
        tags: ["cream"],
    },
    {
        id: 4,
        title: "Fabric Sofa",
        price: 400,
        oldPrice: 550,
        image: "/sample/fabric-sofa.jpg",
        inStock: false,
        brand: "Modulae",
        tags: ["grey"],
    },
    {
        id: 5,
        title: "Latest Chair",
        price: 45,
        oldPrice: 60,
        image: "/sample/latest-chair.jpg",
        inStock: true,
        brand: "new vendor",
        tags: ["green"],
    },
    {
        id: 6,
        title: "Latest Chair2",
        price: 35,
        oldPrice: 40,
        image: "/sample/latest-chair-2.jpg",
        inStock: true,
        brand: "Modulae",
        tags: ["black"],
    }
];

/* ----------------------------------------
   ANIMATION VARIANTS (Option B — Slide + Stagger)
---------------------------------------- */
const containerVariant = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.08,
            duration: 0.3,
        },
    },
};

const itemVariant = {
    hidden: { opacity: 0, y: 25 },
    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const fadeSlide = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

/* ----------------------------------------
   MAIN COMPONENT
---------------------------------------- */
export default function CollectionLayout({
    products = SAMPLE_PRODUCTS,
    filters = DEFAULT_FILTERS,
    initialView = "grid-3",
}: CollectionLayoutProps) {
    // UI states
    const [view, setView] = useState(initialView);
    const [sort, setSort] = useState("featured");
    const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

    // Selected filters
    const [selectedFilters, setSelectedFilters] = useState<
        Record<string, Set<string>>
    >({});

    // Show-more toggle for each filter section
    const [expandedGroups, setExpandedGroups] = useState<
        Record<string, boolean>
    >({});

    /* ----------------------------------------
       FILTER HANDLING
    ---------------------------------------- */
    const toggleFilter = (groupKey: string, optionLabel: string) => {
        setSelectedFilters((prev) => {
            const updated = { ...prev };
            if (!updated[groupKey]) updated[groupKey] = new Set();

            if (updated[groupKey].has(optionLabel)) {
                updated[groupKey].delete(optionLabel);
            } else {
                updated[groupKey].add(optionLabel);
            }

            return updated;
        });
    };

    const clearFilters = () => {
        setSelectedFilters({});
    };

    const toggleGroupExpand = (key: string) => {
        setExpandedGroups((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    /* ----------------------------------------
       SORT HANDLING
    ---------------------------------------- */
    const sortProducts = useCallback((list: Product[]) => {
        const out = [...list];
        switch (sort) {
            case "price-low-high":
                return out.sort((a, b) => a.price - b.price);
            case "price-high-low":
                return out.sort((a, b) => b.price - a.price);
            case "alpha-asc":
                return out.sort((a, b) => a.title.localeCompare(b.title));
            case "alpha-desc":
                return out.sort((a, b) => b.title.localeCompare(a.title));
            default:
                return out;
        }
    }, [sort]);

    /* ----------------------------------------
       APPLY FILTERS
    ---------------------------------------- */
    const filteredProducts = useMemo(() => {
        const groups = Object.keys(selectedFilters);
        if (groups.length === 0) return sortProducts(products);

        const result = products.filter((p) => {
            return groups.every((groupKey) => {
                const set = selectedFilters[groupKey];
                if (!set || set.size === 0) return true;

                if (groupKey === "availability") {
                    for (const s of set) {
                        if (s.includes("In stock") && p.inStock) return true;
                        if (s.includes("Out of stock") && !p.inStock) return true;
                    }
                    return false;
                }

                if (groupKey === "brand") {
                    for (const s of set) {
                        if (p.brand?.toLowerCase().includes(s.toLowerCase())) return true;
                    }
                    return false;
                }

                // generic tag/title matching
                for (const s of set) {
                    if (p.title.toLowerCase().includes(s.toLowerCase())) return true;
                    if (
                        p.tags?.some(
                            (t) =>
                                t.toLowerCase().includes(s.toLowerCase()) ||
                                s.toLowerCase().includes(t.toLowerCase())
                        )
                    )
                        return true;
                }

                return false;
            });
        });

        return sortProducts(result);
    }, [products, selectedFilters, sortProducts]);

    /* ----------------------------------------
       GRID VIEW CLASSES
    ---------------------------------------- */
    const gridClass = useMemo(() => {
        switch (view) {
            case "grid-4":
                return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4";
            case "grid-3":
                return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
            case "grid-2":
                return "grid-cols-1 sm:grid-cols-2";
            case "list":
                return "grid-cols-1";
            default:
                return "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
        }
    }, [view]);

    /* ----------------------------------------
       SORT OPTIONS
    ---------------------------------------- */
    const SORT_OPTIONS = [
        { value: "featured", label: "Featured" },
        { value: "alpha-asc", label: "Alphabetically, A - Z" },
        { value: "alpha-desc", label: "Alphabetically, Z - A" },
        { value: "price-low-high", label: "Price, low to high" },
        { value: "price-high-low", label: "Price, high to low" },
    ];

    /* ----------------------------------------
       UI START (Sidebar + Toolbar)
    ---------------------------------------- */
    return (
        <div
            className="max-w-7xl mx-auto px-4 py-6"
            key={view + sort + filteredProducts.length}
        >
            <div className="flex gap-6">
                {/* ----------------------------------------
            SIDEBAR (Desktop)
        ---------------------------------------- */}
                <motion.aside
                    initial={{ opacity: 0, x: -15 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="hidden lg:block w-64"
                >
                    <div className="bg-white border rounded p-4 shadow-sm">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="text-sm font-semibold">Filter By</h3>
                            <button
                                onClick={clearFilters}
                                className="text-xs text-orange-500 underline"
                            >
                                Clear
                            </button>
                        </div>

                        {/* Render filters */}
                        {Object.entries(filters).map(([key, options]) => {
                            const shortKey = key;
                            const showMore = options && options.length > 6;
                            const expanded = expandedGroups[shortKey];
                            const visible = showMore && !expanded ? options.slice(0, 6) : options;

                            return (
                                <div key={key} className="mb-4">
                                    <details open>
                                        <summary className="cursor-pointer flex justify-between items-center font-medium text-sm">
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                            <span className="text-xs text-gray-400">▾</span>
                                        </summary>

                                        <div className="mt-3 space-y-2">
                                            {visible?.map((opt) => {
                                                const isChecked =
                                                    selectedFilters[shortKey]?.has(opt.label) ?? false;

                                                return (
                                                    <label
                                                        key={opt.label}
                                                        className="flex items-center gap-2 text-sm text-gray-700"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4"
                                                            checked={isChecked}
                                                            onChange={() => toggleFilter(shortKey, opt.label)}
                                                        />
                                                        <span className="truncate">{opt.label}</span>
                                                    </label>
                                                );
                                            })}

                                            {showMore && (
                                                <button
                                                    onClick={() => toggleGroupExpand(shortKey)}
                                                    className="text-xs text-orange-500 mt-2"
                                                >
                                                    {expanded ? "- Show less" : "+ Show more"}
                                                </button>
                                            )}
                                        </div>
                                    </details>
                                </div>
                            );
                        })}
                    </div>
                </motion.aside>

                {/* ----------------------------------------
            MAIN CONTENT
        ---------------------------------------- */}
                <div className="flex-1 min-w-0">
                    {/* ----------------------------------------
              Toolbar (view switcher + sort)
          ---------------------------------------- */}
                    <motion.div
                        variants={fadeSlide}
                        initial="hidden"
                        animate="show"
                        className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6"
                    >
                        {/* View buttons */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 bg-white border rounded p-2">
                                {["grid-2", "grid-3", "grid-4", "list"].map((v) => (
                                    <button
                                        key={v}
                                        onClick={() => setView(v as any)}
                                        className={`p-1 rounded ${view === v ? "bg-orange-500 text-white" : "text-gray-600"
                                            }`}
                                    >
                                        <span className="text-xs uppercase">{v}</span>
                                    </button>
                                ))}
                            </div>

                            {/* Mobile filter button */}
                            <button
                                onClick={() => setMobileFilterOpen(true)}
                                className="md:hidden ml-2 text-sm px-3 py-1 border rounded bg-white"
                            >
                                Filter
                            </button>
                        </div>

                        {/* Sort dropdown */}
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <select
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="border rounded px-3 py-2 bg-white text-sm"
                            >
                                {SORT_OPTIONS.map((o) => (
                                    <option key={o.value} value={o.value}>
                                        {o.label}
                                    </option>
                                ))}
                            </select>

                            <span className="hidden md:block text-sm text-gray-600">
                                {filteredProducts.length} items
                            </span>
                        </div>
                    </motion.div>
                    {/* ----------------------------------------
    PRODUCT GRID (Animated Stagger)
---------------------------------------- */}
                    <motion.div
                        key={view + sort + filteredProducts.length}
                        variants={containerVariant}
                        initial="hidden"
                        animate="show"
                        className={`grid gap-6 ${gridClass}`}
                    >
                        <AnimatePresence>
                            {filteredProducts.length === 0 ? (
                                <motion.div
                                    key="empty"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="col-span-full text-center py-10 text-gray-500"
                                >
                                    No products found
                                </motion.div>
                            ) : (
                                filteredProducts.map((p) => (
                                    <motion.div
                                        key={p.id}
                                        variants={itemVariant}
                                        exit={{ opacity: 0, y: -15 }}
                                        layout
                                        className={`border rounded p-4 bg-white shadow-sm ${view === "list"
                                            ? "flex gap-4 items-center"
                                            : "flex flex-col items-center text-center"
                                            }`}
                                    >
                                        {/* Image */}
                                        <div
                                            className={`${view === "list" ? "w-1/3" : "w-full"
                                                } relative flex justify-center`}
                                        >
                                            {p.image ? (
                                                <div className="relative w-full h-44 md:h-48">
                                                    <Image
                                                        src={p.image}
                                                        alt={p.title}
                                                        fill
                                                        className="object-contain"
                                                        unoptimized
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-full h-44 bg-gray-100 flex items-center justify-center">
                                                    <span className="text-sm text-gray-500">No image</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Details */}
                                        <div className={`${view === "list" ? "w-2/3 text-left" : "mt-4"}`}>
                                            <h3 className="font-medium text-sm">{p.title}</h3>

                                            {/* price */}
                                            <div className="mt-2">
                                                <span className="text-base font-semibold">Rs. {p.price}</span>
                                                {p.oldPrice && (
                                                    <span className="text-xs line-through text-gray-400 ml-2">
                                                        Rs. {p.oldPrice}
                                                    </span>
                                                )}
                                            </div>

                                            {/* brand */}
                                            <div className="mt-2 text-xs text-gray-600">{p.brand}</div>

                                            <div className="mt-4">
                                                <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm">
                                                    Add to cart
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>

            {/* ----------------------------------------
    MOBILE FILTER DRAWER (Slide-in)
---------------------------------------- */}
            <AnimatePresence>
                {mobileFilterOpen && (
                    <motion.div
                        className="fixed inset-0 z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {/* Overlay */}
                        <motion.div
                            className="absolute inset-0 bg-black/40"
                            onClick={() => setMobileFilterOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.4 }}
                            exit={{ opacity: 0 }}
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 80, damping: 15 }}
                            className="absolute right-0 top-0 bottom-0 w-80 bg-white p-4 shadow-lg overflow-auto"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-semibold">Filters</h3>
                                <button onClick={() => setMobileFilterOpen(false)}>Close</button>
                            </div>

                            {/* Filter groups */}
                            {Object.entries(filters).map(([key, options]) => {
                                const shortKey = key;
                                const expanded = expandedGroups[shortKey];
                                const showMore = options && options.length > 6;
                                const visible = showMore && !expanded ? options.slice(0, 6) : options;

                                return (
                                    <div key={key} className="mb-4">
                                        <h4 className="font-medium text-sm mb-2">
                                            {key.charAt(0).toUpperCase() + key.slice(1)}
                                        </h4>

                                        <div className="space-y-2">
                                            {visible?.map((opt) => {
                                                const isChecked =
                                                    selectedFilters[shortKey]?.has(opt.label) ?? false;

                                                return (
                                                    <label
                                                        key={opt.label}
                                                        className="flex items-center gap-2 text-sm"
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            className="w-4 h-4"
                                                            checked={isChecked}
                                                            onChange={() => toggleFilter(shortKey, opt.label)}
                                                        />
                                                        <span>{opt.label}</span>
                                                    </label>
                                                );
                                            })}

                                            {showMore && (
                                                <button
                                                    onClick={() => toggleGroupExpand(shortKey)}
                                                    className="text-xs text-orange-500 mt-2"
                                                >
                                                    {expanded ? "- Show less" : "+ Show more"}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}

                            <div className="mt-4 flex gap-2">
                                <button
                                    onClick={() => {
                                        clearFilters();
                                        setMobileFilterOpen(false);
                                    }}
                                    className="flex-1 py-2 bg-orange-500 text-white rounded"
                                >
                                    Apply
                                </button>

                                <button
                                    onClick={() => clearFilters()}
                                    className="flex-1 py-2 border rounded"
                                >
                                    Clear
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
