"use client";

import { useState, useEffect } from "react";

// Define the structure for each slide's data
interface Slide {
  id: number;
  backgroundImage: string; // URL or path to the image
  category: string;
  mainHighlight: string;
  discountPercentage: string;
  shopNowLink: string;
}

const slides: Slide[] = [
  {
    id: 1,
    backgroundImage: "/slider/img1.jpg", // Replace with your image URL
    category: "Drawing Room",
    mainHighlight: "Inoterior",
    discountPercentage: "70%",
    shopNowLink: "#",
  },
  {
    id: 2,
    backgroundImage: "/slider/img2.jpg", // Replace with your image URL
    category: "Simple & Modern",
    mainHighlight: "Furniture",
    discountPercentage: "60%",
    shopNowLink: "#",
  },
  {
    id: 3,
    backgroundImage: "/slider/img3.jpg", // Example third slide
    category: "Stylish Comfort",
    mainHighlight: "Living Space",
    discountPercentage: "50%",
    shopNowLink: "#",
  },
];

const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Automatic slide change
  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change slide every 5 seconds (5000ms)

    return () => clearInterval(slideInterval); // Clean up on unmount
  }, [slides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative w-full h-[350px] sm:h-[450px] lg:h-[550px] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 -z-0"
          }`}
          style={{
            backgroundImage: `url(${slide.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay content */}
          <div className="absolute inset-0 flex items-center justify-start p-6 sm:p-12 md:p-16 lg:p-24 bg-gradient-to-r from-black/20 via-transparent to-transparent">
            <div className="text-white">
              {/* Category Text */}
              <h3 className="text-lg sm:text-xl md:text-3xl font-normal drop-shadow-md">
                {slide.category}
              </h3>

              {/* Main Highlight Text */}
              <h2 className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold my-3 sm:my-4 md:my-6 inline-block bg-orange-500 py-1 px-3 sm:py-2 sm:px-4 leading-tight drop-shadow-lg">
                {slide.mainHighlight}
              </h2>

              {/* Discount Section */}
              <div className="flex items-end mt-4">
                <span className="text-xs sm:text-sm font-bold uppercase block -rotate-90 origin-bottom-left whitespace-nowrap bg-black text-white px-2 py-1 mb-1 sm:mb-2 -ml-1 sm:ml-0">
                  Up To
                </span>
                <span className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-none drop-shadow-lg ml-2">
                  {slide.discountPercentage}
                </span>
                <span className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-semibold ml-2 sm:ml-4 mb-1 sm:mb-2 drop-shadow-md leading-tight">
                  Off
                  <br />
                  Everything
                </span>
              </div>

              {/* Button Container */}
              <div className="flex gap-4 mt-6 sm:mt-8 md:mt-12">
                <a
                  href={slide.shopNowLink}
                  className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 text-xs sm:py-3 sm:px-6 sm:text-sm md:text-base rounded-md transition-colors border border-gray-300"
                >
                  SHOP NOW
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              index === currentSlide
                ? "bg-orange-500"
                : "bg-gray-400 hover:bg-gray-300"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;