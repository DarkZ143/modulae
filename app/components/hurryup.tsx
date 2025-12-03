/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import ProductCard from "./ProductCard"; // ✅ Use the Amazon-style card

// List of all categories to fetch from
const CATEGORIES = [
  "products",
  "chairs",
  "dining",
  "furniture",
  "kitchen",
  "lamps",
  "shoe-racks",
  "sofa-sets",
  "tv-units",
  "wardrobes",
];

const HurryUp = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        setLoading(true);

        // 1. Fetch all categories in parallel
        const promises = CATEGORIES.map((category) =>
          get(ref(rtdb, `${category}/`))
        );

        const snapshots = await Promise.all(promises);
        let lowStockItems: any[] = [];

        // 2. Flatten and Filter
        snapshots.forEach((snap, index) => {
          if (snap.exists()) {
            const data = snap.val();
            const items = Object.keys(data).map((key) => ({
              slug: key,
              category: CATEGORIES[index], // Keep track of category
              ...data[key],
            }));

            // FILTER: Only items with stock < 15 AND > 0
            const filtered = items.filter((item) => {
              const stock = Number(item.stock);
              return stock > 0 && stock < 15;
            });

            lowStockItems = [...lowStockItems, ...filtered];
          }
        });

        // 3. Shuffle and pick 4 random items
        const shuffled = lowStockItems.sort(() => 0.5 - Math.random());
        setProducts(shuffled.slice(0, 4));

      } catch (error) {
        console.error("Error fetching hurry up products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockProducts();
  }, []);

  // Don't show section if no products match
  if (!loading && products.length === 0) return null;

  return (
    <section className="w-full bg-white py-12 md:py-16 border-t border-gray-200">
      <div className="max-w-[1500px] mx-auto px-4">

        {/* Title */}
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 inline-block">
            <span className="border-b-4 border-red-600 pb-1 text-red-600">Hurry!</span> Time is running out
          </h2>
          <p className="text-sm text-gray-500 mt-2">Limited stock available. Grab these before they are gone.</p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[420px] bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          /* Products Grid using ProductCard */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <ProductCard
                key={product.slug + product.category}
                product={product}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};

export default HurryUp;