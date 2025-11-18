"use client";

import React from "react";
import Image from "next/image";

const products = [
  {
    id: 1,
    slug: "woolen-chair",
    name: "Woolen Chair",
    price: 450,
    originalPrice: 799,
    imageUrl: "/latest/woolen.png",
    altText: "Woolen Chair",
  },
  {
    id: 2,
    slug: "white-lounge-chair",
    name: "White Lounge Chair",
    price: 350,
    originalPrice: 699,
    imageUrl: "/latest/lounge.png",
    altText: "White Lounge Chair",
  },
  {
    id: 3,
    slug: "swoon-petit-lounge-chair",
    name: "Swoon Petit Lounge Chair",
    price: 450,
    originalPrice: 849,
    imageUrl: "/latest/petit.png",
    altText: "Swoon Petit Lounge Chair",
  },
  {
    id: 4,
    slug: "modern-woolen-chair",
    name: "Modern Woolen Chair",
    price: 500,
    originalPrice: 999,
    imageUrl: "/latest/modern.png",
    altText: "Modern Woolen Chair",
  },
  {
    id: 5,
    slug: "classic-wooden-chair",
    name: "Classic Wooden Chair",
    price: 620,
    originalPrice: 1299,
    imageUrl: "/latest/wood.png",
    altText: "Classic Wooden Chair",
  },
  {
    id: 6,
    slug: "minimalist-stool",
    name: "Minimalist Stool",
    price: 280,
    originalPrice: 499,
    imageUrl: "/latest/stool.png",
    altText: "Minimalist Stool",
  },
  {
    id: 7,
    slug: "velvet-armchair",
    name: "Velvet Armchair",
    price: 890,
    originalPrice: 1599,
    imageUrl: "/latest/velvet.png",
    altText: "Velvet Armchair",
  },
  {
    id: 8,
    slug: "office-swivel-chair",
    name: "Office Swivel Chair",
    price: 750,
    originalPrice: 1299,
    imageUrl: "/latest/office.png",
    altText: "Office Swivel Chair",
  },
];

const LatestProducts = () => {
  const formatCurrency = (amount: number) => `Rs. ${amount.toFixed(2)}`;

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* Section Title */}
        <div className="mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Latest <span className="border-b-4 border-orange-500 pb-1">Prod</span>uct
          </h2>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product) => (
            <a
              key={product.slug}
              href={`/products/${product.slug}`}   
              className="group block overflow-hidden"
            >
              <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden group-hover:shadow-lg transition">
                <Image
                  src={product.imageUrl}
                  alt={product.altText}
                  width={300}
                  height={300}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>

              <div className="mt-4 text-center md:text-left">
                <h3 className="text-base md:text-lg font-medium group-hover:text-orange-500 transition">
                  {product.name}
                </h3>

                <p className="mt-1 text-sm md:text-base font-semibold">
                  {formatCurrency(product.price)}

                  {product.originalPrice && (
                    <span className="ml-2 text-gray-500 line-through">
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

export default LatestProducts;
