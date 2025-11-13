"use client";

import React from "react";
import Image from "next/image";

// Mock data for client logos. You can replace these.
const clientLogos = [
  {
    id: 1,
    name: "Furni Style",
    imageUrl: "/client/client1.png",
    alt: "Furni Style Logo",
  },
  {
    id: 2,
    name: "Alpha House",
    imageUrl: "/client/client2.webp",
    alt: "Alpha House Logo",
  },
  {
    id: 3,
    name: "Tempark",
    imageUrl: "/client/client4.webp",
    alt: "Tempark Communities Logo",
  },
  {
    id: 4,
    name: "Home Company",
    imageUrl: "/client/client6.webp",
    alt: "Home Company Logo",
  },
  {
    id: 5,
    name: "Furniture Premium",
    imageUrl: "/client/client7.avif",
    alt: "Furniture Premium Logo",
  },
  {
    id: 6,
    name: "Tempark 2",
    imageUrl: "/client/client8.avif",
    alt: "Tempark Communities Logo",
  },
];

const Clients = () => {
  return (
    <section className="w-full bg-white">
      {/* Removed the <style jsx> block for marquee */}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal Line Added Above */}
        <div className="border-t border-gray-200"></div>

        {/* Replaced marquee with a responsive flex grid */}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8 md:justify-around py-12 md:py-16">
          {/* Mapped over clientLogos only once */}
          {clientLogos.map((logo) => (
            <div
              key={logo.id}
              className="flex items-center justify-center h-12 md:h-16"
            >
              <Image
                src={logo.imageUrl}
                alt={logo.alt}
                width={150}
                height={60}
                className="max-h-full w-auto object-contain opacity-70 transition-opacity duration-300 hover:opacity-100"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://placehold.co/150x60/F9F9F9/333?text=Logo";
                }}
                unoptimized
              />
            </div>
          ))}
        </div>

        {/* Horizontal Line Added Below */}
        <div className="border-t border-gray-200"></div>
      </div>
    </section>
  );
};

export default Clients;