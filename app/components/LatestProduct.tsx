/* eslint-disable @next/next/no-html-link-for-pages */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import ProductCard from "./ProductCard"; // ✅ Using the new Amazon-style Card

// Fallback categories if Admin settings are empty
const DEFAULT_CATEGORIES = [
  "products", "chairs", "dining", "furniture", "kitchen",
  "lamps", "shoe-racks", "sofa-sets", "tv-units", "wardrobes"
];

const LatestProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        setLoading(true);

        // 1. Get Dynamic Categories from Admin Settings
        const settingsRef = ref(rtdb, 'settings/categories');
        const settingsSnap = await get(settingsRef);
        const activeCategories = settingsSnap.exists() ? settingsSnap.val() : DEFAULT_CATEGORIES;

        // 2. Fetch Products from ALL active categories
        const promises = activeCategories.map((category: string) =>
          get(ref(rtdb, `${category}/`))
        );

        const snapshots = await Promise.all(promises);

        let allItems: any[] = [];

        // 3. Flatten Data
        snapshots.forEach((snap, index) => {
          if (snap.exists()) {
            const data = snap.val();
            const items = Object.keys(data).map((key) => ({
              slug: key,
              category: activeCategories[index],
              ...data[key],
            }));
            allItems = [...allItems, ...items];
          }
        });

        // 4. Shuffle and pick 8 items to simulate "Latest"
        const shuffled = allItems.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 8));

      } catch (error) {
        console.error("Error fetching latest products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, []);

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-[1500px] mx-auto px-4">

        {/* Section Title */}
        <div className="mb-8 flex items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Latest <span className="border-b-4 border-orange-500 pb-1">Arrivals</span>
          </h2>
          <a href="/shop" className="text-sm text-[#007185] hover:underline hover:text-[#C7511F] mt-2">
            See more
          </a>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[420px] bg-gray-100 rounded-md animate-pulse"></div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10 text-gray-500 border rounded-lg bg-gray-50">
            No products found in the catalog.
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              // ✅ Render the new Amazon-Style Card
              <ProductCard key={product.slug + product.category} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestProducts;