/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";

// Default hardcoded fallback (Prevents empty page on first load)
const DEFAULT_ADS = [
  {
    id: 1,
    imageUrl: "/ad/ad1.png",
    alt: "Wide promotional ad",
    gridSpan: "lg:col-span-2",
    aspectClass: "aspect-[2/1]",
    href: "/shop",
  },
  {
    id: 2,
    imageUrl: "/ad/ad2.png",
    alt: "Square promotional ad",
    gridSpan: "lg:col-span-1",
    aspectClass: "aspect-square",
    href: "/shop",
  },
  {
    id: 3,
    imageUrl: "/ad/ad3.png",
    alt: "Another square promotional ad",
    gridSpan: "lg:col-span-1",
    aspectClass: "aspect-square",
    href: "/shop",
  },
];

const Ad1 = () => {
  const [ads, setAds] = useState(DEFAULT_ADS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const snap = await get(ref(rtdb, "settings/ads"));
        if (snap.exists()) {
          const data = snap.val();
          // Ensure we map valid data and fallback if specific fields are missing
          if (Array.isArray(data) && data.length >= 3) {
            // Merge DB data with Structural defaults to ensure layout doesn't break
            const merged = DEFAULT_ADS.map((def, idx) => ({
              ...def,
              imageUrl: data[idx]?.imageUrl || def.imageUrl,
              href: data[idx]?.href || def.href,
              alt: data[idx]?.alt || def.alt
            }));
            setAds(merged);
          }
        }
      } catch (error) {
        console.error("Error fetching ads:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAds();
  }, []);

  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6">

        {/* Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {ads.map((ad, index) => (
            <a
              key={ad.id || index}
              href={ad.href || "/shop"}
              className={`group relative block ${ad.gridSpan} ${ad.aspectClass} overflow-hidden rounded-lg shadow-sm transition-all duration-300 ease-in-out hover:shadow-xl cursor-pointer border border-gray-100`}
            >
              {/* Loading Skeleton Layer */}
              {loading && <div className="absolute inset-0 bg-gray-200 animate-pulse z-20"></div>}

              <Image
                src={ad.imageUrl}
                alt={ad.alt || "Promotional Ad"}
                fill
                className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 ${loading ? 'opacity-0' : 'opacity-100'}`}
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://placehold.co/600x400/F9F9F9/333?text=Ad+Image";
                }}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />

              {/* Optional Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10"></div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ad1;