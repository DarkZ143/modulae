"use client";

import React, { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import TopOfferBar from "@/app/components/TopOfferBar";
import Navbar from "@/app/components/Navbar";
import CategoryHeader from "@/app/components/CategoryHeader";
import Footer from "@/app/components/Footer";
import CollectionLayout from "@/app/components/CollectionLayout";

// Dummy product data — replace later
const TABLE_PRODUCTS = Array.from({ length: 25 }).map((_, i) => ({
  id: i + 1,
  title: `Table Product ${i + 1}`,
  price: Math.floor(Math.random() * 300 + 100),
  oldPrice: Math.floor(Math.random() * 200 + 200),
  image: "/sample/dining-table.jpg",
  inStock: true,
  brand: "Modulae",
  tags: ["wood", "brown"],
}));

const ITEMS_PER_PAGE = 12;

export default function TablePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get current page
  let page = parseInt(searchParams.get("page") || "1", 10);

  const totalPages = Math.ceil(TABLE_PRODUCTS.length / ITEMS_PER_PAGE);

  // Redirect to page=1 if no page is present
  useEffect(() => {
    if (!searchParams.get("page")) {
      router.replace("/collections/table?page=1");
    }
  }, [searchParams, router]);

  // Clamp invalid pages
  if (page < 1) page = 1;
  if (page > totalPages) page = totalPages;

  const start = (page - 1) * ITEMS_PER_PAGE;
  const end = start + ITEMS_PER_PAGE;
  const paginatedProducts = TABLE_PRODUCTS.slice(start, end);

  const gotoPage = (p: number) => {
    if (p < 1 || p > totalPages) return;
    router.push(`/collections/table?page=${p}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <TopOfferBar />
      <Navbar />
      <CategoryHeader title="Table" />

      {/* Main Content */}
      <CollectionLayout products={paginatedProducts} />

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 my-10">
        <button
          onClick={() => gotoPage(page - 1)}
          disabled={page <= 1}
          className={`px-4 py-2 rounded ${
            page <= 1 ? "bg-gray-300" : "bg-orange-500 text-white"
          }`}
        >
          Prev
        </button>

        <span className="text-sm">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => gotoPage(page + 1)}
          disabled={page >= totalPages}
          className={`px-4 py-2 rounded ${
            page >= totalPages ? "bg-gray-300" : "bg-orange-500 text-white"
          }`}
        >
          Next
        </button>
      </div>

      <Footer />
    </>
  );
}
