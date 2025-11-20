/* eslint-disable react/no-unescaped-entities */
"use client";
import { FaBolt, FaThumbtack } from "react-icons/fa";
import { useRouter } from "next/navigation";

const TopOfferBar = () => {
  const router = useRouter();
  return (
    <div className="hidden md:flex justify-between items-center px-8 py-4 text-sm bg-linear-to-r from-[#0d0d0d] via-[#1a1a1a] to-[#0f243d] text-gray-300">
      {/* Left side */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-2">
          <FaBolt className="text-yellow-400" />
          First Five Order on <span className="text-white font-medium">30% Discount</span>
        </span>
        <span className="text-gray-500">|</span>
        <span className="flex items-center gap-2 cursor-pointer" onClick={() => router.push("/store-locations")}>
          <FaThumbtack className="text-blue-400" />
          Our Store Location
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <span>
          Mid-season Sale up to{" "}
          <span className="text-orange-400 font-medium">70% Off</span>. Shop Now!
        </span>
        <span className="text-gray-500">|</span>
        <span className="hover:text-white transition-colors">Today's Deal</span>
        <span className="text-gray-500">|</span>
        <span className="hover:text-white transition-colors cursor-pointer" onClick={() => router.push('/pages/faq')}>FAQ</span>
        <span className="text-gray-500">|</span>
        <span className="hover:text-white transition-colors">Get Certification</span>
      </div>
    </div>
  );
};

export default TopOfferBar;
