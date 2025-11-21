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

const HurryUp = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount: number) => `Rs. ${amount.toFixed(2)}`;

  useEffect(() => {
    const fetchLowStockProducts = async () => {
      try {
        const promises = CATEGORIES.map((category) =>
          get(ref(rtdb, `${category}/`))
        );

        const snapshots = await Promise.all(promises);
        let lowStockItems: any[] = [];

        snapshots.forEach((snap) => {
          if (snap.exists()) {
            const data = snap.val();
            const items = Object.keys(data).map((key) => ({
              slug: key,
              ...data[key],
            }));
            
            // FILTER: Only items with stock < 15
            const filtered = items.filter((item) => Number(item.stock) < 15 && Number(item.stock) > 0);
            lowStockItems = [...lowStockItems, ...filtered];
          }
        });

        // Shuffle and pick 4 random items
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
    <section className="w-full bg-white py-12 md:py-16 border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Title */}
        <div className="mb-10 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 inline-block">
            <span className="border-b-4 border-red-500 pb-1 text-red-600">Hurry!</span> Time is running out
          </h2>
          <p className="text-gray-500 mt-2">Grab these items before they are gone forever.</p>
        </div>

        {/* Loading State */}
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
                const imageUrl = Array.isArray(product.images) ? product.images[0] : product.image || "/placeholder.png";
                const offer = product.mrp > product.price;

                return (
                <Link
                    key={product.slug}
                    href={`/products/${product.slug}`}
                    className="group block overflow-hidden bg-white rounded-lg border border-transparent hover:border-gray-200 transition-all duration-300 hover:shadow-lg"
                >
                    {/* Image Wrapper */}
                    <div className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden">
                    
                    {/* Stock Badge */}
                    <div className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-bold px-2 py-1 rounded z-10 uppercase tracking-wide shadow-sm animate-pulse">
                        Only {product.stock} Left!
                    </div>

                    <Image
                        src={imageUrl}
                        alt={product.title}
                        width={300}
                        height={300}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    </div>

                    {/* Text */}
                    <div className="mt-4 p-2">
                    <h3 className="text-base md:text-lg font-medium text-gray-800 group-hover:text-orange-600 transition-colors truncate">
                        {product.title}
                    </h3>

                    <p className="mt-1 text-sm md:text-base font-semibold text-gray-900 flex items-center gap-2">
                        {formatCurrency(product.price)}

                        {offer && (
                        <span className="text-gray-400 line-through text-xs font-normal">
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

export default HurryUp;