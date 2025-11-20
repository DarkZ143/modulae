"use client";

import Image from "next/image";
import TopOfferBar from "../../components/TopOfferBar";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import LatestProducts from "../../components/LatestProduct";
import BlogSection from "../../components/blog";
import CategoryHeader from "@/app/components/CategoryHeader";

const brands = [
    {
        name: "UrbanWood",
        image: "/brands/urbanwoods.png",
        description:
            "UrbanWood specializes in handcrafted wooden furniture designed for modern Indian homes. Every piece goes through precision cutting, kiln drying, and hand-polishing to ensure long-lasting durability. With a strong focus on sustainable materials and timeless aesthetics, UrbanWood blends traditional carpentry with advanced finishing techniques for a premium lifestyle experience.",
    },
    {
        name: "ComfortNest",
        image: "/brands/comfortnest.png",
        description:
            "ComfortNest is known for designing ergonomic sofas, recliners, and lounge seating that prioritize comfort above everything else. Each product is engineered using high-density foam, certified fabrics, and human-body testing to support long sitting hours. Their range is ideal for homes, offices, and entertainment zones, offering a blend of luxury, posture support, and modern design.",
    },
    {
        name: "RoyalOak Studio",
        image: "/brands/royaloak.png",
        description:
            "RoyalOak Studio brings luxury furniture crafted from premium oak wood sourced globally. Their collections feature contemporary beds, dining sets, cabinets, and designer living room furniture — all built with precision engineering. The brand is known for elegant textures, strong durability, and a refined international aesthetic suited for upscale homes and modern studio spaces.",
    },
    {
        name: "SteelForm",
        image: "/brands/steelform.png",
        description:
            "SteelForm manufactures industrial-grade metal furniture engineered for exceptional strength and performance. Their catalog includes office chairs, metal beds, storage units, tables, and modular shelving systems. Every product undergoes strict load-bearing tests, rust-proof coating, and modern fabrication techniques, making SteelForm ideal for commercial workspaces and high-usage environments.",
    },
    {
        name: "CushioCraft",
        image: "/brands/cushiocrafts.png",
        description:
            "CushioCraft specializes in premium upholstered furniture with a focus on comfort, fabric innovation, and handcrafted detailing. From customized sofas to plush accent chairs, every piece is built using high-quality cushioning, durable stitching, and stylish fabric choices. Their collection is perfect for creating cozy interiors with a unique artistic and modern appeal.",
    },
    {
        name: "Modulae Originals",
        image: "/brands/modulae.png",
        description:
            "Modulae Originals is our signature in-house furniture brand known for designer craftsmanship, intelligent space-saving concepts, and long-lasting materials. Each product is engineered using premium woods, hybrid metals, and modern laminates. With custom manufacturing, precision joinery, and performance-focused builds, Modulae Originals represents top-tier quality and timeless modern design.",
    },
];

export default function BrandsPage() {
    return (
        <>
            <TopOfferBar />
            <Navbar />
            <CategoryHeader title="Brands" />

            {/* PAGE HEADER */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center">
                    Our Premium <span className="text-orange-600 underline decoration-orange-400">Brands</span>
                </h1>
                <p className="text-center text-gray-600 mt-3 text-lg max-w-2xl mx-auto">
                    Discover our trusted brands offering high-quality, durable and modern furniture
                    solutions crafted to elevate your lifestyle.
                </p>
            </div>

            {/* BRAND SECTIONS */}
            <div className="max-w-7xl mx-auto px-6 space-y-20 pb-20">
                {brands.map((brand, index) => (
                    <div
                        key={index}
                        className={`flex flex-col md:flex-row items-center gap-10 ${index % 2 === 1 ? "md:flex-row-reverse" : ""
                            }`}
                    >
                        {/* IMAGE */}
                        <div className="w-full md:w-1/2">
                            <div className="rounded-2xl shadow-lg overflow-hidden border  bg-amber-50 border-orange-200">
                                <Image
                                    src={brand.image}
                                    alt={brand.name}
                                    width={600}
                                    height={400}
                                    className="object-contain w-full h-[280px] md:h-[340px] p-6"
                                />
                            </div>
                        </div>

                        {/* CONTENT */}
                        <div className="w-full md:w-1/2">
                            <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <span className="text-orange-500">●</span> {brand.name}
                            </h2>

                            <p className="text-gray-700 leading-relaxed mt-4 text-lg">
                                {brand.description}
                            </p>

                            <button className="mt-6 px-6 py-3 bg-orange-600 text-white rounded-xl font-semibold shadow hover:bg-orange-700 transition">
                                Explore {brand.name}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Existing Components */}
            <LatestProducts />
            <BlogSection />
            <Footer />
        </>
    );
}
