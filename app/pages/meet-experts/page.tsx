/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import Image from "next/image";
import CategoryHeader from "@/app/components/CategoryHeader";
import BlogSection from "@/app/components/blog";
import { ref, get } from "firebase/database";
import { rtdb } from "@/lib/firebase";

// Fallback Data
const DEFAULT_EXPERTS = [
    {
        id: "1",
        name: "Dr. Arvind Khurana",
        title: "Senior Wood Technologist",
        image: "/experts/arvind.png",
        content: "Wood behaves like a living material...",
    }
    // ... (rest of your original hardcoded list if desired)
];

export default function MeetExpertsPage() {
    const [experts, setExperts] = useState<any[]>(DEFAULT_EXPERTS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchExperts = async () => {
            try {
                const snap = await get(ref(rtdb, "settings/experts"));
                if (snap.exists()) {
                    const data = snap.val();
                    const list = Object.keys(data).map(key => ({ id: key, ...data[key] }));
                    setExperts(list);
                }
            } catch (error) {
                console.error("Error loading experts:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchExperts();
    }, []);

    return (
        <>
            <Navbar />
            <CategoryHeader title="Meet Experts" />

            <div className="max-w-6xl mx-auto px-6 py-12 min-h-[60vh]">

                {/* PAGE TITLE */}
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-4">
                    Meet Our <span className="underline decoration-orange-500 underline-offset-4">Experts</span>
                </h1>
                <p className="text-center text-gray-600 max-w-2xl mx-auto mb-16">
                    Insights from industry professionals who specialize in wood, metals, upholstery, comfort science, and finish engineering.
                </p>

                {/* EXPERT CARDS */}
                {loading ? (
                    <div className="space-y-12">
                        {[1, 2].map((i) => (
                            <div key={i} className="h-64 bg-gray-100 rounded-2xl animate-pulse"></div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-20">
                        {experts.map((exp, index) => (
                            <div
                                key={exp.id || index}
                                className={`grid md:grid-cols-2 gap-10 items-center ${index % 2 !== 0 ? "md:flex-row-reverse" : ""}`}
                            >
                                {/* IMAGE */}
                                <div className={`flex justify-center ${index % 2 !== 0 ? "md:order-2" : ""}`}>
                                    <div className="relative w-full max-w-[420px] aspect-square rounded-2xl overflow-hidden shadow-lg border border-gray-100">
                                        <Image
                                            src={exp.image || "/placeholder.png"}
                                            alt={exp.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                </div>

                                {/* TEXT */}
                                <div className={`${index % 2 !== 0 ? "md:order-1" : ""}`}>
                                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">{exp.name}</h2>
                                    <p className="text-orange-600 font-medium mt-1 text-lg">{exp.title}</p>

                                    <p className="text-gray-700 mt-6 leading-relaxed whitespace-pre-line text-lg">
                                        {exp.content}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <BlogSection />
            <Footer />
        </>
    );
}