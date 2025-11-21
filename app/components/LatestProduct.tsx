/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";

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

const LatestProducts = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount: number) => `Rs. ${amount.toFixed(2)}`;

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        // 1. Create an array of promises to fetch all categories in parallel
        const promises = CATEGORIES.map((category) =>
          get(ref(rtdb, `${category}/`))
        );

        // 2. Wait for all to finish
        const snapshots = await Promise.all(promises);

        let allItems: any[] = [];

        // 3. Process the data
        snapshots.forEach((snap) => {
          if (snap.exists()) {
            const data = snap.val();
            const items = Object.keys(data).map((key) => ({
              slug: key, // Use the key as the slug
              ...data[key],
            }));
            allItems = [...allItems, ...items];
          }
        });

        // 4. Shuffle and pick 8 random items to show as "Latest"
        // (Since we don't have a 'createdAt' timestamp on all items, random is a good proxy for discovery)
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
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Section Title */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Latest <span className="border-b-4 border-orange-500 pb-1">Prod</span>ucts
          </h2>
        </div>

        {/* Loading Skeleton */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => {
              // Handle Image: Support array, single string, or placeholder
              const imageUrl = Array.isArray(product.images) 
                ? product.images[0] 
                : product.image || "/placeholder.png";

              return (
                <Link
                  key={product.slug}
                  href={`/products/${product.slug}`}
                  className="group block overflow-hidden"
                >
                  <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden group-hover:shadow-lg transition border border-gray-100">
                    <Image
                      src={imageUrl}
                      alt={product.title || "Product Image"}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {/* Optional Discount Badge */}
                    {product.mrp > product.price && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded">
                        SALE
                      </span>
                    )}
                  </div>

                  <div className="mt-4 text-center md:text-left">
                    <h3 className="text-base md:text-lg font-medium group-hover:text-orange-500 transition truncate">
                      {product.title}
                    </h3>

                    <p className="mt-1 text-sm md:text-base font-semibold text-gray-900">
                      {formatCurrency(product.price)}

                      {product.mrp && product.mrp > product.price && (
                        <span className="ml-2 text-gray-400 line-through text-xs md:text-sm">
                          {formatCurrency(product.mrp)}
                        </span>
                      )}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default LatestProducts;