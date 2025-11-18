"use client";

import React from "react";
import Image from "next/image";

// Mock data — now with slug for hero product linking
const products = [
    {
        id: 1,
        slug: "woolen-chair",
        name: "Woolen Chair",
        price: 450.0,
        originalPrice: 500.0,
        imageUrl: "/latest/woolen.png",
        altText: "Woolen Chair",
        onSale: true,
    },
    {
        id: 2,
        slug: "white-lounge-chair",
        name: "White Lounge Chair",
        price: 350.0,
        originalPrice: null,
        imageUrl: "/latest/lounge.png",
        altText: "White Lounge Chair",
        onSale: false,
    },
    {
        id: 3,
        slug: "swoon-petit-lounge-chair",
        name: "Swoon Petit Lounge Chair",
        price: 450.0,
        originalPrice: 500.0,
        imageUrl: "/latest/petit.png",
        altText: "Swoon Petit Lounge Chair",
        onSale: true,
    },
    {
        id: 4,
        slug: "modern-woolen-chair",
        name: "Modern Woolen Chair",
        price: 500.0,
        originalPrice: null,
        imageUrl: "/latest/modern.png",
        altText: "Modern Woolen Chair",
        onSale: false,
    },
];

const HurryUp = () => {
    const formatCurrency = (amount: number) => `Rs. ${amount.toFixed(2)}`;

    return (
        <section className="w-full bg-white py-12 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* Title */}
                <div className="mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 inline-block">
                        <span className="border-b-4 border-orange-500 pb-1">Hurry!</span> Time is running out
                    </h2>
                </div>

                {/* Products */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <a
                            key={product.id}
                            href={`/products/${product.slug}`}   // <-- LINK FIXED
                            className="group block overflow-hidden"
                        >
                            {/* Image Wrapper */}
                            <div className="relative aspect-square w-full bg-gray-50 rounded-lg overflow-hidden transition-all duration-300 group-hover:shadow-lg">

                                {/* Sale Badge */}
                                {product.onSale && (
                                    <div className="absolute top-3 right-3 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full z-10">
                                        Sale
                                    </div>
                                )}

                                <Image
                                    src={product.imageUrl}
                                    alt={product.altText}
                                    width={300}
                                    height={300}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    unoptimized
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src =
                                            "https://placehold.co/300x300/F9F9F9/333?text=Image";
                                    }}
                                />
                            </div>

                            {/* Text */}
                            <div className="mt-4 text-center md:text-left">
                                <h3 className="text-base md:text-lg font-medium text-gray-800 group-hover:text-orange-500 transition-colors">
                                    {product.name}
                                </h3>

                                <p className="mt-1 text-sm md:text-base font-semibold text-gray-900">
                                    {formatCurrency(product.price)}

                                    {product.originalPrice && (
                                        <span className="ml-2 text-sm text-gray-500 line-through">
                                            {formatCurrency(product.originalPrice)}
                                        </span>
                                    )}
                                </p>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HurryUp;
