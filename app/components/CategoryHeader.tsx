"use client";

import Image from "next/image";

export default function CategoryHeader({ title }: { title: string }) {
  return (
    <section className="w-full relative">
      <div className="relative w-full h-[180px] md:h-[220px] flex items-center justify-center overflow-hidden">

        {/* FULL BACKGROUND IMAGE */}
        <Image
          src="/bg.jpg"   // your background image
          alt="Category background"
          fill
          priority
          className="object-cover object-center "
        />

        {/* OVERLAY (optional subtle tint, remove if not needed) */}
        <div className="absolute inset-0 bg-[#e7dfd7]/60"></div>

        {/* CENTER TEXT */}
        <p className="relative z-10 text-lg md:text-xl font-semibold text-gray-800">
          Home <span className="mx-2 ">›</span> {title}
        </p>

      </div>
    </section>
  );
}
