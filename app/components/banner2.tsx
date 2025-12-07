/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";

// Fallback in case DB is empty
const DEFAULT_AD = {
  imageUrl: "/ad/ad4.png",
  alt: "Promotional banner",
  subtitle: "25% OFF store by Modulae",
  title: "Great Deals On",
  highlight: "Bathrooms",
  buttonText: "Explore Collection",
  link: "/shop",
};

const Ad2 = () => {
  const [adDetails, setAdDetails] = useState(DEFAULT_AD);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAd = async () => {
      try {
        const snap = await get(ref(rtdb, "settings/ad2"));
        if (snap.exists()) {
          setAdDetails(snap.val());
        }
      } catch (error) {
        console.error("Error loading Ad2:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAd();
  }, []);

  return (
    <section className="w-full bg-white">
      <div className="w-full">
        <a
          href={adDetails.link || "/shop"}
          className="group relative block w-full aspect-2/1 sm:aspect-3/1 md:aspect-4/1 lg:aspect-5/1 overflow-hidden cursor-pointer"
        >
          {/* Loading Skeleton */}
          {loading && <div className="absolute inset-0 bg-gray-200 animate-pulse z-20"></div>}

          {/* Background Image */}
          <Image
            src={adDetails.imageUrl || "/placeholder.png"}
            alt={adDetails.alt || "Banner"}
            fill
            sizes="100vw"
            className={`absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105 ${loading ? 'opacity-0' : 'opacity-100'}`}
            priority
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "https://placehold.co/1200x400/F9F9F9/333?text=Banner+Image";
            }}
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors z-10">
            {/* Text Content Box */}
            <div className="bg-black/80 text-white p-4 md:p-8 lg:p-10 rounded-lg text-center w-10/12 max-w-xs sm:w-auto sm:max-w-md shadow-2xl backdrop-blur-sm animate-fade-in-up">
              <p className="text-xs md:text-sm font-light text-gray-300 tracking-wider uppercase">
                {adDetails.subtitle}
              </p>
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mt-1 md:mt-2">
                {adDetails.title}
              </h2>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-orange-500 mt-1">
                {adDetails.highlight}
              </h2>
              <span className="inline-block border border-white text-white text-xs md:text-sm font-semibold py-2 px-6 mt-4 md:mt-6 transition-all duration-300 group-hover:bg-white group-hover:text-black">
                {adDetails.buttonText}
              </span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};

export default Ad2;