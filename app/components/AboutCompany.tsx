"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutCompany() {
    return (
        <section className="w-full bg-linear-to-br from-orange-50 via-white to-orange-100 py-16">
            <div className="max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-2 gap-10 items-center">

                {/* LEFT IMAGE */}
                <motion.div
                    initial={{ opacity: 0, x: -40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6 }}
                    className="relative w-full h-80 md:h-[420px]"
                >
                    <Image
                        src="/company.png" // CHANGE THIS TO YOUR IMAGE
                        alt="Company Image"
                        fill
                        className="object-cover rounded-2xl shadow-xl"
                        unoptimized
                    />
                </motion.div>

                {/* RIGHT CONTENT */}
                <motion.div
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="space-y-6"
                >
                    <h2 className="text-4xl font-extrabold text-gray-900 leading-tight">
                        About <span className="text-orange-600">Modulae</span>
                    </h2>

                    <p className="text-gray-700 text-lg leading-relaxed">
                        Modulae is a premium furniture & lifestyle brand committed to
                        transforming the way people experience their living spaces.
                        Our mission is to bring modern design, excellent craftsmanship,
                        and long-lasting comfort to every home.
                    </p>

                    <p className="text-gray-700 text-lg leading-relaxed">
                        With a wide range of furniture collections — from luxurious
                        sofas, elegant dining sets, durable tables, to curated décor —
                        Modulae blends aesthetics with functionality to make your
                        dream home a reality.
                    </p>

                    <div className="mt-6">
                        <a
                            href="/collections/furniture?page=1"
                            className="inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition"
                        >
                            Explore Our Collection
                        </a>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
