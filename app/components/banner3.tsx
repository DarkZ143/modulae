"use client";

import React from "react";
import Image from "next/image";

// You can replace these details with your own
const adDetails = {
  imageUrl: "/ad/ad5.png",
  alt: "Promotional banner for a fancy sofa set",
  subtitle: "MEGA SALE UPTO 75%",
  title: "Fancy Sofa set",
  description:
    "Upgrade your living room with our luxurious and comfortable sofa sets, now at unbeatable prices during our Mega Sale!",
  buttonText: "SHOP NOW",
  link: "#",
};

// Text for the scrolling marquee
const marqueeText =
  " * Discount code: BLACKFRIDAY2022 * Black Friday SALE * 50% OFF on the entire line of PT products Mid-season Sale up to 70% Off. Shop Now! * ";

const MarqueeAd = () => {
  return (
    <section className="w-full bg-white">
      {/* CSS for the marquee animation */}
      <style jsx>{`
        .marquee-content {
          display: inline-block;
          white-space: nowrap;
          animation: marquee 30s linear infinite;
        }

        .marquee-content:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      {/* Top scrolling text bar */}
      <div className="w-full bg-orange-500 text-white py-2 overflow-hidden">
        <div className="marquee-content">
          {/* We duplicate the text to create a seamless loop */}
          <span>{marqueeText}</span>
          <span>{marqueeText}</span>
        </div>
      </div>

      {/* Panoramic Ad Banner */}
      <div className="w-full">
        <a
          href={adDetails.link}
          className="group relative block w-full aspect-2/1 md:aspect-16/7 overflow-hidden cursor-pointer"
        >
          {/* Background Image */}
          <Image
            src={adDetails.imageUrl}
            alt={adDetails.alt}
            fill
            sizes="(max-width: 768px) 100vw, 1600px"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src =
                "https://placehold.co/1600x700/F9F9F9/333?text=Image+Error";
            }}
            priority
          />

          {/* Dark Overlay - positioned to the left */}
          <div className="absolute inset-0 flex items-center justify-start bg-linear-to-r from-black/50 via-black/20 to-transparent">
            {/* Text Content Box - UPDATED for mobile */}
            <div className="bg-black/70 text-white p-4 sm:p-6 md:p-10 lg:p-14 rounded-r-lg text-left w-11/12 max-w-lg sm:max-w-xl">
              <p className="text-xs sm:text-sm md:text-base font-semibold text-gray-300 uppercase tracking-wider">
                {adDetails.subtitle}
              </p>
              <h2 className="text-2xl sm:text-4xl md:text-6xl font-bold mt-1 sm:mt-2">
                {adDetails.title}
              </h2>
              <p className="text-xs sm:text-sm md:text-base text-gray-200 mt-2 sm:mt-4 max-w-md">
                {adDetails.description}
              </p>
              <span className="inline-block border-2 border-white text-white text-xs sm:text-sm md:text-base font-bold py-2 px-4 sm:px-6 mt-4 sm:mt-6 md:mt-8 transition-colors duration-300 group-hover:bg-white group-hover:text-black">
                {adDetails.buttonText}
              </span>
            </div>
          </div>
        </a>
      </div>
    </section>
  );
};

export default MarqueeAd;