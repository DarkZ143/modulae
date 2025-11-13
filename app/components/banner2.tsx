"use client";

import React from "react";
import Image from "next/image";

// You can replace these details with your own
const adDetails = {
  imageUrl: "/ad/ad4.png",
  alt: "Promotional banner for bathrooms",
  subtitle: "25% OFF store by Modulae",
  title: "Great Deals On",
  highlight: "Bathrooms",
  buttonText: "Explore Collection",
  link: "#",
};

const Ad2 = () => {
  return (
    <section className="w-full bg-white">
      {/* Removed max-width and padding from this div */}
      <div className="w-full">
        <a
          href={adDetails.link}
          className="group relative block w-full aspect-2/1 sm:aspect-3/1 md:aspect-4/1 lg:aspect-5/1 overflow-hidden cursor-pointer"
        >
          {/* Background Image - Use Next.js <Image> for optimization */}
          <Image
            src={adDetails.imageUrl}
            alt={adDetails.alt}
            fill
            sizes="100vw"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            priority
            onError={() => {}}
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            {/* Text Content Box */}
            <div className="bg-black/80 text-white p-4 md:p-8 lg:p-10 rounded-lg text-center w-10/12 max-w-xs sm:w-auto sm:max-w-md">
              <p className="text-xs md:text-sm font-light text-gray-300">
                {adDetails.subtitle}
              </p>
              <h2 className="text-xl sm:text-2xl md:text-4xl font-bold mt-1 md:mt-2">
                {adDetails.title}
              </h2>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-orange-500 mt-1">
                {adDetails.highlight}
              </h2>
              <span className="inline-block border border-white text-white text-xs md:text-sm font-semibold py-2 px-4 mt-4 md:mt-6 transition-colors duration-300 group-hover:bg-white group-hover:text-black">
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