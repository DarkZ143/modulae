/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ref, get, query, limitToFirst } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import { ArrowRight } from "lucide-react";

// Fallback if DB is completely empty
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
        setLoading(true);
        // 1. Get list of active categories from Admin Settings
        const settingsRef = ref(rtdb, 'settings/categories');
        const settingsSnap = await get(settingsRef);
        const categorySlugs: string[] = settingsSnap.exists()
          ? settingsSnap.val()
          : DEFAULT_CATEGORIES;

        // 2. Get Admin Config
        const configRef = ref(rtdb, 'settings/explore_config');
        const configSnap = await get(configRef);
        const config = configSnap.exists() ? configSnap.val() : {};

        // 3. Build Data
        const categoryPromises = categorySlugs.map(async (slug) => {
          if (config[slug] && config[slug].visible === false) return null;

          let displayImage = "/placeholder.png";
          let count = 0;

          if (config[slug] && config[slug].customImage) {
            displayImage = config[slug].customImage;
            const catRef = ref(rtdb, `${slug}`);
            const catSnap = await get(catRef);
            if (catSnap.exists()) count = Object.keys(catSnap.val()).length;
          } else {
            const q = query(ref(rtdb, `${slug}`), limitToFirst(1));
            const catSnap = await get(q);

            const fullSnap = await get(ref(rtdb, `${slug}`));
            if (fullSnap.exists()) {
              const data = fullSnap.val();
              count = Object.keys(data).length;
              const firstProduct = data[Object.keys(data)[0]];
              if (firstProduct?.images && firstProduct.images.length > 0) {
                displayImage = firstProduct.images[0];
              } else if (firstProduct?.image) {
                displayImage = firstProduct.image;
              }
            }
          }

          return {
            name: slug.replace(/-/g, " "),
            items: count,
            imageUrl: displayImage,
            altText: slug,
            href: `/${slug}`
          };
        });

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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-[300px] bg-gray-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-gray-50 py-12 md:py-16">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700">
            Explore <span className="text-orange-600 border-b-4 border-orange-500 pb-1">Categories</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {categories.map((category) => (
            <Link
              key={category.name}
              href={category.href}
              className="
                group relative block 
                bg-orange-100 border border-gray-200 
                rounded-2xl overflow-hidden 
                h-80 
                hover:shadow-xl hover:shadow-orange-100 
                transition-all duration-300
              "
            >
              {/* --- TOP SECTION: TEXT (Fixed) --- */}
              <div className="absolute top-0 left-0 w-full p-6 text-center z-10 bg-linear-to-b from-white/80 to-transparent">
                <h3 className="font-bold text-xl text-gray-700 capitalize mb-1">
                  {category.name}
                </h3>

                <div className="flex items-center justify-center gap-1 text-sm font-semibold text-orange-600 transition-colors">
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>

                <p className="text-xs text-gray-400 mt-1 font-medium">{category.items} Items</p>
              </div>

              {/* --- BOTTOM SECTION: IMAGE (Animates Up) --- */}
              <div className="absolute bottom-0 left-0 w-full h-[220px] flex items-end justify-center">
                <div className="
                    relative w-[80%] h-[90%] 
                    transition-transform duration-500 ease-out transform 
                    
                    /* MOBILE/TABLET: Fully visible by default, no push down */
                    translate-y-0 scale-100

                    /* DESKTOP: Push down initially, pop up on hover */
                    lg:translate-y-4 
                    lg:group-hover:-translate-y-2.5 
                    lg:group-hover:scale-110
                ">
                  <Image
                    src={category.imageUrl}
                    alt={category.altText}
                    fill
                    className="object-contain object-bottom drop-shadow-md rounded-3xl"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://placehold.co/200x200/F9F9F9/333?text=Image';
                    }}
                  />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Explore;