/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ref, get, query, limitToFirst } from "firebase/database";
import { rtdb } from "@/lib/firebase";

// Fallback if DB is completely empty (first run)
const DEFAULT_CATEGORIES = [
  "chairs", "dining", "furniture", "kitchen", 
  "lamps", "shoe-racks", "sofa-sets", "tv-units", "wardrobes"
];

interface CategoryData {
  name: string;
  items: number;
  imageUrl: string;
  altText: string;
  href: string;
}

const Explore = () => {
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // 1. Get list of active categories from Admin Settings
        const settingsRef = ref(rtdb, 'settings/categories');
        const settingsSnap = await get(settingsRef);
        
        const categorySlugs: string[] = settingsSnap.exists() 
            ? settingsSnap.val() 
            : DEFAULT_CATEGORIES;

        // 2. Get Admin Config (Visibility & Custom Images)
        const configRef = ref(rtdb, 'settings/explore_config');
        const configSnap = await get(configRef);
        const config = configSnap.exists() ? configSnap.val() : {};

        // 3. Build Data
        const categoryPromises = categorySlugs.map(async (slug) => {
            // Skip if hidden by admin
            if (config[slug] && config[slug].visible === false) return null;

            let displayImage = "https://placehold.co/200x200/F9F9F9/333?text=No+Image"; 
            let count = 0;

            // A. Check Admin Custom Image FIRST
            if (config[slug] && config[slug].customImage) {
                displayImage = config[slug].customImage;
                
                // Fetch just the count (optimizable)
                const catRef = ref(rtdb, `${slug}`);
                const catSnap = await get(catRef);
                if (catSnap.exists()) count = Object.keys(catSnap.val()).length;

            } else {
                // B. Auto-Fetch from First Product if no custom image
                const q = query(ref(rtdb, `${slug}`), limitToFirst(1));
                const catSnap = await get(q); // Quick fetch for image
                
                // We need full node for accurate count
                const fullSnap = await get(ref(rtdb, `${slug}`)); 
                
                if (fullSnap.exists()) {
                    const data = fullSnap.val();
                    const productKeys = Object.keys(data);
                    count = productKeys.length;
                    
                    const firstProduct = data[productKeys[0]];
                    if (firstProduct?.images && firstProduct.images.length > 0) {
                        displayImage = firstProduct.images[0];
                    } else if (firstProduct?.image) {
                        displayImage = firstProduct.image;
                    }
                }
            }

            return {
                name: slug.replace(/-/g, " "), // "sofa-sets" -> "sofa sets"
                items: count,
                imageUrl: displayImage,
                altText: slug,
                href: `/${slug}`
            };
        });

        // Wait for all fetches and filter out hidden (null) items
        const resolvedCategories = (await Promise.all(categoryPromises)).filter(Boolean) as CategoryData[];
        setCategories(resolvedCategories);

      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12 animate-pulse">
             <div className="h-8 bg-gray-200 w-64 mx-auto rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-40 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white py-4 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Explore Our{" "}
            <span className="border-b-4 border-orange-500 pb-1">
              Furniture
            </span>
          </h2>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="group relative block bg-orange-50 rounded-lg shadow-sm overflow-hidden transition-all duration-1000 ease-in-out hover:shadow-lg"
            >
              {/* Card content */}
              <div className="relative h-36 md:h-40 p-5">
                {/* Text Content */}
                <div className="relative z-10">
                  <h3 className="font-bold text-lg md:text-xl text-gray-900 capitalize">
                    {category.name}
                  </h3>

                  {/* This container will hold either the item count or "Buy now" */}
                  <div className="relative h-6 mt-1">
                    {/* Item count - visible by default, fades out */}
                    <p className="absolute top-0 left-0 text-sm text-gray-600 transition-opacity duration-300 ease-in-out group-hover:opacity-0">
                      ({category.items} Items)
                    </p>

                    {/* Buy now - hidden by default, fades in */}
                    <span className="absolute top-0 left-0 text-sm font-semibold text-orange-500 flex items-center gap-1 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100">
                      Buy now
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        />
                      </svg>
                    </span>
                  </div>
                </div>

                <Image
                  src={category.imageUrl}
                  alt={category.altText}
                  width={128}
                  height={128}
                  className="
                    absolute right-0 bottom-0
                    w-28 h-28
                    object-contain object-bottom-right
                    rounded-xl
                    
                    /* DESKTOP ONLY ANIMATIONS */
                    md:w-32 md:h-32
                    md:transition-transform md:duration-500 md:ease-in-out
                    md:translate-x-1/2 md:group-hover:translate-x-0
                  "
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/200x200/F9F9F9/333?text=No+Image';
                  }}
                  unoptimized
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Explore;