/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";

// Fallback data
const DEFAULT_CLIENTS = [
  { id: 1, name: "Furni Style", imageUrl: "/client/client1.png", alt: "Furni Style Logo" },
  { id: 2, name: "Alpha House", imageUrl: "/client/client2.webp", alt: "Alpha House Logo" },
  { id: 3, name: "Tempark", imageUrl: "/client/client4.webp", alt: "Tempark Communities Logo" },
  { id: 4, name: "Home Company", imageUrl: "/client/client6.webp", alt: "Home Company Logo" },
];

const Clients = () => {
  const [clients, setClients] = useState<any[]>(DEFAULT_CLIENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const snap = await get(ref(rtdb, "settings/clients"));
        if (snap.exists()) {
          const data = snap.val();
          if (Array.isArray(data) && data.length > 0) {
            setClients(data);
          }
        }
      } catch (error) {
        console.error("Error loading clients:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return (
    <section className="w-full bg-gray-50 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Horizontal Line Above */}
        <div className="border-t border-gray-200"></div>

        {/* Client Grid */}
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-8 md:justify-around py-12 md:py-16">
          {/* Loading State Skeleton */}
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="w-32 h-12 bg-gray-100 rounded animate-pulse"></div>
            ))
          ) : (
            clients.map((logo) => (
              <div
                key={logo.id}
                className="flex items-center justify-center h-12 md:h-16 relative w-32 md:w-40"
              >
                <Image
                  src={logo.imageUrl || "/placeholder.png"}
                  alt={logo.alt || logo.name}
                  width={150}
                  height={60}
                  className="
                        max-h-full w-auto object-contain transition-all duration-300
                        /* Mobile: Always colorful and visible */
                        opacity-100 grayscale-0
                        /* Desktop: Gray/Faded by default, Color on Hover */
                        md:opacity-70 md:grayscale md:hover:opacity-100 md:hover:grayscale-0
                    "
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "https://placehold.co/150x60/F9F9F9/333?text=Logo";
                  }}
                  unoptimized
                />
              </div>
            ))
          )}
        </div>

        {/* Horizontal Line Below */}
        <div className="border-t border-gray-200"></div>
      </div>
    </section>
  );
};

export default Clients;