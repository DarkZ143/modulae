/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";
import Link from "next/link";
import Image from "next/image";

// Fallback placeholders so the site isn't empty on first load
const DEFAULT_SLIDES = [
  { id: 1, image: "/slider/img1.jpg", link: "/shop" },
  { id: 2, image: "/slider/img2.jpg", link: "/collections/furniture" },
  { id: 3, image: "/slider/img3.jpg", link: "/collections/chairs" },
];

const HeroSlider = () => {
  const [slides, setSlides] = useState<any[]>(DEFAULT_SLIDES);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const fetchSlides = async () => {
      try {
        const snap = await get(ref(rtdb, "settings/hero_slider"));
        if (snap.exists()) {
          const data = snap.val();
          if (Array.isArray(data) && data.length > 0) {
            setSlides(data);
          }
        }
      } catch (error) {
        console.error("Error loading slider:", error);
      }
    };
    fetchSlides();
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(slideInterval);
  }, [slides.length]);

  if (!isClient) return null;

  return (
    <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] overflow-hidden bg-gray-900 group">

      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
        >
          {/* Background Image */}
          {slide.image && (
            <Image
              src={slide.image}
              alt="Hero Banner"
              fill
              className="object-cover"
              priority={index === 0} // Prioritize first image
            />
          )}

          {/* Overlay (Darkens slightly to make button pop) */}
          <div className="absolute inset-0 bg-black/10"></div>

          {/* ✅ ONLY SHOP NOW BUTTON (Centered) */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            <Link
              href={slide.link || "/shop"}
              className="
                    bg-white text-gray-900 
                    font-bold py-3 px-8 rounded-full 
                    shadow-xl border-2 border-white
                    transform transition-all duration-300
                    hover:scale-110 hover:bg-gray-100 hover:shadow-2xl
                    flex items-center gap-2
                    animate-fade-in-up
                  "
            >
              SHOP NOW
            </Link>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-30">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 shadow-sm ${index === currentSlide
                ? "bg-orange-500 w-8"
                : "bg-white/60 hover:bg-white w-2"
              }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>

    </div>
  );
};

export default HeroSlider;