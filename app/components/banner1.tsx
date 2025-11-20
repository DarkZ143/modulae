"use client";

import React from "react";
import Image from "next/image";

// You can replace these with your actual ad data
const adData = [
  {
    id: 1,
    imageUrl: "/ad/ad1.png",
    alt: "Wide promotional ad",
    gridSpan: "lg:col-span-2", // This ad will span 2 columns on large screens
    aspectClass: "aspect-[2/1]", // Enforces a 2:1 aspect ratio
    Href: "/shop",
  },
  {
    id: 2,
    imageUrl: "/ad/ad2.png",
    alt: "Square promotional ad",
    gridSpan: "lg:col-span-1", // This ad will span 1 column
    aspectClass: "aspect-square", // Enforces a 1:1 aspect ratio
     Href: "/shop",
  },
  {
    id: 3,
    imageUrl: "/ad/ad3.png",
    alt: "Another square promotional ad",
    gridSpan: "lg:col-span-1", // This ad will span 1 column
    aspectClass: "aspect-square", // Enforces a 1:1 aspect ratio
     Href: "/shop",
  },
];

const Ad1 = () => {
  return (
    <section className="w-full bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid layout:
          - On mobile (default): 1 column (grid-cols-1)
          - On large screens (lg): 4 columns (lg:grid-cols-4)
        */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {adData.map((ad) => (
            <a
              key={ad.id}
              href={ad.Href}
              className={`group relative block ${ad.gridSpan} ${ad.aspectClass} overflow-hidden rounded-lg shadow-sm transition-shadow duration-300 ease-in-out hover:shadow-lg cursor-pointer`}
            >
              <Image
                src={ad.imageUrl}
                alt={ad.alt}
                fill
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://placehold.co/600x400/F9F9F9/333?text=Image+Error";
                }}
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              
              {/* You can add text overlays here if needed */}
              {/* Example: <div className="absolute bottom-4 left-4 z-10 text-white">Ad Content</div> */}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ad1;