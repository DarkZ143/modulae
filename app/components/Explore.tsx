"use client";

import React from "react";
import Image from "next/image";

// Data for the category cards. You can replace these with your own data.
const categories = [
  {
    name: "chair",
    items: 1,
    imageUrl: "/explore/chair.png",
    altText: "A modern chair",
  },
  {
    name: "Dining",
    items: 9,
    imageUrl: "/explore/dinning.png",
    altText: "A dining table and chairs",
  },
  {
    name: "Furniture",
    items: 24,
    imageUrl: "/explore/furniture.png",
    altText: "A bed with a headboard",
  },
  {
    name: "lamp",
    items: 16,
    imageUrl: "/explore/lamp.png",
    altText: "A floor lamp",
  },
  {
    name: "Shoe Racks",
    items: 24,
    imageUrl: "/explore/shoerack.png",
    altText: "A wooden shoe rack",
  },
  {
    name: "Sofa Set",
    items: 24,
    imageUrl: "/explore/sofaset.png",
    altText: "A grey sofa",
  },
  {
    name: "Table",
    items: 24,
    imageUrl: "/explore/table.png",
    altText: "A wooden table",
  },
  {
    name: "TV Unit",
    items: 11,
    imageUrl: "/explore/tvunit.png",
    altText: "A TV entertainment unit",
  },
  {
    name: "Wardrobes",
    items: 24,
    imageUrl: "/explore/wardrobes.png",
    altText: "A modern wardrobe",
  },
];

const Explore = () => {
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
            <a
              key={category.name}
              href="#"
              className="group relative block bg-orange-50 rounded-lg shadow-sm overflow-hidden transition-all duration-1000 ease-in-out hover:shadow-lg"
            >
              {/* Card content */}
              <div className="relative h-36 md:h-40 p-5">
                {/* Text Content */}
                <div className="relative z-10">
                  <h3 className="font-bold text-lg md:text-xl text-gray-900 capitalize">
                    {category.name}
                  </h3>

                  {/* This container will hold either the item count or "Shop Now" */}
                  <div className="relative h-6 mt-1">
                    {/* Item count - visible by default, fades out */}
                    <p className="absolute top-0 left-0 text-sm text-gray-600 transition-opacity duration-300 ease-in-out group-hover:opacity-0">
                      ({category.items} Items)
                    </p>

                    {/* Shop Now - hidden by default, fades in */}
                    <span className="absolute top-0 left-0 text-sm font-semibold text-orange-500 flex items-center gap-1 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100">
                      Shop Now
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
                  className="absolute right-0 bottom-0 w-24 h-24 md:w-32 md:h-32 object-contain object-bottom-right transition-transform duration-500 ease-in-out translate-x-1/2 group-hover:translate-x-0"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://placehold.co/200x200/F9F9F9/333?text=Image";
                  }}
                  unoptimized
                />
                
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Explore;